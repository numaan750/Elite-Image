import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        const res = await fetch("https://elite-image.vercel.app/api/loginUser/google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: user.email,
            username: user.name,
            googleId: account.providerAccountId,
          }),
        });

        const data = await res.json();

        if (data.status === "success") {
          user.token = data.token;
          user._id = data.user._id;
          user.credits = data.user.credits;
          user.username = data.user.username;
          user.isNewUser = data.isNewUser;
          return true;
        }

        return false;
      } catch (error) {
        return false;
      }
    },
    async jwt({ token, user, account }) {
      console.log("🔵 JWT Callback:", { token, user });

      if (user) {
        token.accessToken = user.token;
        token._id = user._id;
        token.credits = user.credits;
        token.username = user.username;
        token.email = user.email;
        token.isNewUser = user.isNewUser;
      }
      return token;
    },
    async session({ session, token }) {
      console.log("🔵 Session Callback:", { session, token });

      session.user.token = token.accessToken;
      session.user._id = token._id;
      session.user.credits = token.credits;
      session.user.username = token.username;
      session.user.isNewUser = token.isNewUser;
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
