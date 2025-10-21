import React, { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import { MdEmail, MdNotifications, MdLogout } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useNotifications from "../hooks/useNotifications";
import useLikes from "../hooks/useLikes";
import NotificationsModal from "./NotificationsModal";

const ProfileModal = ({ onClose, user }) => {
  const navigate = useNavigate();
  const { unreadCount, notifications } = useNotifications();
  const { likes } = useLikes();
  const [showNotifications, setShowNotifications] = useState(false);
  const [photosCount, setPhotosCount] = useState(0);

  // Fetch user's uploaded photos count
  useEffect(() => {
    const fetchPhotosCount = async () => {
      if (!user?.email) return;
      
      try {
        const imagesRef = collection(db, "images");
        const q = query(imagesRef, where("userEmail", "==", user.email));
        const snapshot = await getDocs(q);
        setPhotosCount(snapshot.size);
      } catch (error) {
        console.error("Error fetching photos count:", error);
      }
    };

    fetchPhotosCount();
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      onClose();
      navigate("/");
      toast.success("Logged out successfully!");
    } catch (error) {
      console.error(error.message);
      toast.error("Failed to log out");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full mx-4 relative overflow-hidden">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-6 pb-20">
          <button
            className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition-all duration-200"
            onClick={onClose}
            aria-label="Close"
          >
            <IoMdClose size={24} />
          </button>
        </div>

        {/* Profile Picture */}
        <div className="flex flex-col items-center -mt-16 px-6">
          <div className="relative">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt="Profile"
                className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                <span className="text-white text-4xl font-bold">
                  {user?.displayName ? user.displayName.charAt(0).toUpperCase() : user?.email ? user.email.charAt(0).toUpperCase() : 'U'}
                </span>
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="text-center mt-4 mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {user?.displayName || "User"}
            </h2>
            <div className="flex items-center justify-center gap-2 text-gray-600 mt-2">
              <MdEmail size={18} />
              <p className="text-sm">{user?.email || "No email"}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="w-full grid grid-cols-3 gap-4 mb-6 bg-gray-50 rounded-lg p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-emerald-600">{photosCount}</p>
              <p className="text-xs text-gray-500">Photos</p>
            </div>
            <div className="text-center border-x border-gray-200">
              <p className="text-2xl font-bold text-pink-600">{likes.length}</p>
              <p className="text-xs text-gray-500">Liked</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{notifications.length}</p>
              <p className="text-xs text-gray-500">Notifications</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="w-full space-y-3 mb-6">
            <button
              className="w-full flex items-center justify-center gap-3 bg-emerald-50 text-emerald-700 py-3 rounded-lg hover:bg-emerald-100 transition-all duration-200 font-medium"
              onClick={() => {
                setShowNotifications(true);
              }}
            >
              <MdNotifications size={20} />
              <span>Notifications</span>
              {unreadCount > 0 && (
                <span className="ml-auto bg-emerald-600 text-white text-xs px-2 py-1 rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-3 bg-red-50 text-red-600 py-3 rounded-lg hover:bg-red-100 transition-all duration-200 font-medium"
            >
              <MdLogout size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Notifications Modal */}
      {showNotifications && (
        <NotificationsModal onClose={() => setShowNotifications(false)} />
      )}
    </div>
  );
};

export default ProfileModal;
