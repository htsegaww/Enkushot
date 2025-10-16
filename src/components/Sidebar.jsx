// import React from "react";
// import { Link } from "react-router-dom";
// import { HiHome, HiPhotograph, HiLogin } from "react-icons/hi";

// const Sidebar = ({ open = false, onClose }) => {
//   return (
//     <>
//       {/* Backdrop */}
//       <div
//         className={`fixed inset-0 bg-black bg-opacity-40 z-40 transition-opacity ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
//         onClick={onClose}
//       />

//       <aside
//         className={`fixed left-0 top-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform ${
//           open ? "translate-x-0" : "-translate-x-full"
//         }`}
//       >
//         <div className="p-6 border-b">
//           <h2 className="text-xl font-bold text-emerald-600">HenoGram</h2>
//         </div>
//         <nav className="p-4">
//           <ul className="space-y-2">
//             <li>
//               <Link to="/" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded" onClick={onClose}>
//                 <HiHome />
//                 Home
//               </Link>
//             </li>
//             <li>
//               <Link to="/" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded" onClick={onClose}>
//                 <HiPhotograph />
//                 Gallery
//               </Link>
//             </li>
//             <li>
//               <Link to="/login" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded" onClick={onClose}>
//                 <HiLogin />
//                 Login / Sign Up
//               </Link>
//             </li>
//           </ul>
//         </nav>
//       </aside>
//     </>
//   );
// };

// export default Sidebar;
