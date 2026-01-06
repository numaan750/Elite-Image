// "use client";

// import { useState } from "react";
// import Sidebar from "@/components/admincomponents/Sidebar";

// import Dashboard from "@/components/adminComponents/Dashboard";
// import Upload from "@/components/adminComponents/UploadImage";
// import Projects from "@/components/adminComponents/Projects";
// import Pricing from "@/components/adminComponents/Pricing";
// import Support from "@/components/adminComponents/Suport";
// import Profile from "@/components/adminComponents/Profile";

// export default function AdminLayout() {
//   const [activeView, setActiveView] = useState("Dashboard");

//   return (
//     <div className="flex h-screen">
//       <Sidebar activeView={activeView} setActiveView={setActiveView} />

//       <div className="flex-1 p-6 overflow-y-auto bg-white">
//         {activeView === "Dashboard" && <Dashboard />}
//         {activeView === "Upload Image" && <Upload />}
//         {activeView === "Project" && <Projects />}
//         {activeView === "Pricing" && <Pricing />}
//         {activeView === "Support" && <Support />}
//         {activeView === "Profile" && <Profile />}
//       </div>
//     </div>
//   );
// }
