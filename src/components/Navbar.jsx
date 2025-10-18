import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useAuth } from "../hooks/useAuth";
import useNotifications from "../hooks/useNotifications";
import { useRef, useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import { MdPersonAddAlt1 } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";

import { FaUpload, FaHeart } from "react-icons/fa";
import ProgressBar from "./ProgressBar";
import UploadModal from "./UploadModal";
import FavoritesModal from "./FavoritesModal";
import ProfileModal from "./ProfileModal";
import Logo from "./Logo";

const Navbar = () => {
  const { user } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();

  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showFavoritesModal, setShowFavoritesModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const types = ["image/jpeg", "image/png", "image/jpg", "image/avif"];

  const triggerFileSelect = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setError(null);
    setShowUploadModal(true);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <>
      <header className="w-full bg-white shadow-sm fixed top-0 left-0 right-0 z-50" style={{ height: '64px' }}>
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between" style={{ height: '64px' }}>
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Logo size={40} />
            <h1 className="text-2xl text-[#069668] font-semibold">Enkushot</h1>
          </Link>

          <nav>
            <ul className="flex items-center gap-4">
              <li>
                <Link to="/" className="text-gray-700 hover:text-emerald-600">Home</Link>
              </li>
              <li>
                <Link to="/gallery" className="text-gray-700 hover:text-emerald-600">Gallery</Link>
              </li>
              <li>
                <button onClick={triggerFileSelect} className="flex items-center gap-2 bg-emerald-600 text-white px-3 py-1 rounded">
                  <FaUpload />
                  <span className="hidden sm:inline">Upload</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setShowFavoritesModal(true)}
                  className="flex items-center gap-2 bg-pink-100 text-pink-600 px-3 py-1 rounded hover:bg-pink-200"
                  aria-label="View Favorites"
                >
                  <FaHeart />
                  <span className="hidden sm:inline">Favorites</span>
                </button>
              </li>
              <li>
                {user ? (
                  <button 
                    onClick={() => setShowProfileModal(true)} 
                    className="relative flex items-center gap-2 hover:opacity-80 transition-opacity"
                    aria-label="Profile"
                  >
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt="Profile"
                        className="w-8 h-8 rounded-full border-2 border-emerald-500 object-cover"
                      />
                    ) : (
                      <FaUserCircle className="text-emerald-600 text-3xl" />
                    )}
                    {/* Notification badge */}
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </button>
                ) : (
                  <Link to="/login" className="flex items-center gap-2 text-gray-700 hover:text-emerald-600">
                    <MdPersonAddAlt1 />
                    <span className="hidden sm:inline">Login / Sign Up</span>
                  </Link>
                )}
              </li>
            </ul>
          </nav>
        </div>
      </header>
      {/* spacer to prevent content being hidden under fixed navbar */}
      <div className="top-navbar-space" aria-hidden="true" />
      {/* show progress bar when uploading from navbar (kept for compatibility) */}
      {file && (
        <div className="fixed right-4 top-16 z-60 w-72 bg-white rounded shadow px-3 py-2">
          <div className="text-sm mb-1">Uploading: {file.name}</div>
          <ProgressBar file={file} setFile={setFile} metadata={{}} />
          {error && <div className="text-xs text-red-600 mt-1">{error}</div>}
        </div>
      )}

  {showUploadModal && <UploadModal onClose={() => setShowUploadModal(false)} />}
  {showFavoritesModal && <FavoritesModal onClose={() => setShowFavoritesModal(false)} />}
  {showProfileModal && <ProfileModal onClose={() => setShowProfileModal(false)} user={user} />}
    </>
  );
};

export default Navbar;
