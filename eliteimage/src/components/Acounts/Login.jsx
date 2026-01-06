"use client";
import { useState, useContext } from "react";
import { AppContext } from "@/context/AppContext";
import Image from "next/image";
import toast from "react-hot-toast";

// import { useRouter } from "next/navigation";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  // const router = useRouter();

  const { loginUser, signupUser } = useContext(AppContext);

  const handleSubmit = async () => {
    setError("");

    const toastId = toast.loading(
      isSignup ? "Creating account..." : "Logging in..."
    );

    if (isSignup) {
      const res = await signupUser(username, email, password);

      toast.dismiss(toastId);

      if (res.status === "error") {
        setError(res.message || "Signup failed");
        toast.error(res.message || "Signup failed ❌");
      } else {
        toast.success("Account created successfully 🎉");
        setIsSignup(false);
      }
    } else {
      const res = await loginUser(email, password);

      toast.dismiss(toastId);

      if (res.status === "error") {
        setError(res.error || "Login failed");
        toast.error(res.error || "Login failed ❌");
      } else {
        toast.success("Login successful ✅");
        window.location.href = "/";
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-10 ">
      <div className="w-full max-w-6xl bg-white rounded-2xl flex min-h-[650px]">
        <div className="w-full md:w-1/2 p-10 flex items-center">
          <div className="w-full">
            {error && <p className="text-red-600 mb-4 text-sm">{error}</p>}
            <h2 className="text-[40px] font-bold mb-2">
              {isSignup ? "Create an account" : "Welcome back!"}
            </h2>

            <p className="text-black mb-6 text-[16px]">
              {isSignup ? "" : "Login to continue enhancing your images."}
            </p>

            {isSignup && (
              <div className="mb-4">
                <label className="text-[16px] font-bold">User name</label>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your user name"
                  className="w-full mt-1 px-4 py-2 border border-gray-700 rounded-md"
                />
              </div>
            )}

            <div className="mb-4">
              <label className="text-[16px] font-bold">Email Address</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Enter your email address"
                className="w-full mt-1 px-4 py-2 border border-gray-700 rounded-md "
              />
            </div>

            <div className="mb-4">
              <label className="text-[16px] font-bold">Password</label>

              <div className="relative mt-1">
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full px-4 py-2 border border-gray-700 rounded-md pr-10"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-gray-600"
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 12s3.75-6.75 9.75-6.75S21.75 12 21.75 12s-3.75 6.75-9.75 6.75S2.25 12 2.25 12z"
                      />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223C2.994 9.356 2.25 10.71 2.25 12c0 0 3.75 6.75 9.75 6.75 1.61 0 3.09-.42 4.35-1.05M6.53 6.53C8.01 5.73 9.9 5.25 12 5.25c6 0 9.75 6.75 9.75 6.75a17.77 17.77 0 01-2.22 3.36M6.53 6.53l10.94 10.94"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-[#034F75] text-white py-2 rounded-md cursor-pointer"
            >
              {isSignup ? "Create Account" : "Login"}
            </button>

            <div className="flex items-center my-6">
              <div className="flex-1 h-px bg-[#00000080]" />
              <span className="px-3 text-sm text-[#00000080]">
                Continue with
              </span>
              <div className="flex-1 h-px bg-[#00000080]" />
            </div>

            <button className="w-full border cursor-pointer py-2 rounded-md flex items-center justify-center gap-3 hover:bg-gray-50">
              {isSignup ? "Sign up with Google" : "Login with Google"}
              <Image
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                width={20}
                height={20}
              />
            </button>

            <p className="text-sm text-center mt-6">
              {isSignup ? (
                <>
                  Already have an account?{" "}
                  <span
                    onClick={() => setIsSignup(false)}
                    className="font-medium cursor-pointer"
                  >
                    Login
                  </span>
                </>
              ) : (
                <>
                  Don’t have an account?{" "}
                  <span
                    onClick={() => setIsSignup(true)}
                    className="font-medium cursor-pointer"
                  >
                    Register
                  </span>
                </>
              )}
            </p>
          </div>
        </div>

        <div className="hidden md:block w-1/2 relative">
          <Image
            src="/projects/Login.png"
            alt="Login"
            fill
            className="object-cover rounded-3xl"
            priority
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
