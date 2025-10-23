import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useAuth } from "../hooks/useAuth";
import useNotifications from "../hooks/useNotifications";
import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { Link, useNavigate } from "react-router-dom";
import { MdPersonAddAlt1 } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import { HiMenuAlt3, HiX } from "react-icons/hi";

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
      {/* Glassmorphism Navbar with gradient backdrop */}
      <header className="w-full backdrop-blur-xl bg-white/80 border-b border-emerald-100/50 fixed top-0 left-0 right-0 z-50 shadow-lg shadow-emerald-100/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo with animated glow effect */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full blur-md opacity-0 group-hover:opacity-75 transition-opacity duration-300"></div>
              <Logo size={44} />
            </div>
            <h1 className="text-2xl md:text-3xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 bg-clip-text text-transparent font-bold tracking-tight">
              Enkushot
            </h1>
          </Link>

          {/* Desktop Navigation - Enhanced Design */}
          <nav className="hidden lg:block">
            <ul className="flex items-center gap-2">
              <li>
                <Link to="/" className="px-4 py-2 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all duration-200 font-medium">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="px-4 py-2 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all duration-200 font-medium">
                  Gallery
                </Link>
              </li>
              <li>
                <Link to="/contact" className="px-4 py-2 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all duration-200 font-medium">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/converter" className="px-4 py-2 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all duration-200 font-medium">
                  Converter
                </Link>
              </li>
              {user && user.email === "henokabay10010@gmail.com" && (
                <li>
                  <Link to="/admin" className="px-4 py-2 text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-all duration-200 font-bold border border-emerald-200">
                    Admin
                  </Link>
                </li>
              )}
              
              {/* Action Buttons with Enhanced Styling */}
              <li className="ml-2">
                <button 
                  onClick={triggerFileSelect} 
                  className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white px-5 py-2.5 rounded-xl transition-all duration-200 shadow-lg shadow-emerald-200 hover:shadow-xl hover:shadow-emerald-300 hover:scale-105 font-medium"
                >
                  <FaUpload className="text-sm" />
                  <span>Upload</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setShowFavoritesModal(true)}
                  className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white px-5 py-2.5 rounded-xl transition-all duration-200 shadow-lg shadow-pink-200 hover:shadow-xl hover:shadow-pink-300 hover:scale-105 font-medium"
                  aria-label="View Favorites"
                >
                  <FaHeart className="text-sm" />
                  <span>Favorites</span>
                </button>
              </li>
              <li className="ml-2">
                {user ? (
                  <button 
                    onClick={() => setShowProfileModal(true)} 
                    className="relative flex items-center gap-3 hover:bg-emerald-50 px-3 py-2 rounded-xl transition-all duration-200 group"
                    aria-label="Profile"
                  >
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt="Profile"
                        className="w-10 h-10 rounded-full border-2 border-emerald-400 object-cover shadow-md group-hover:border-emerald-500 transition-all duration-200"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full border-2 border-emerald-400 bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-base shadow-md group-hover:border-emerald-500 group-hover:shadow-lg transition-all duration-200">
                        {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                      </div>
                    )}
                    {/* Enhanced Notification Badge */}
                    {unreadCount > 0 && (
                      <motion.span 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-rose-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-lg"
                      >
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </motion.span>
                    )}
                  </button>
                ) : (
                  <Link to="/login" className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white px-5 py-2.5 rounded-xl transition-all duration-200 shadow-lg shadow-emerald-200 hover:shadow-xl hover:shadow-emerald-300 font-medium">
                    <MdPersonAddAlt1 className="text-lg" />
                    <span>Login</span>
                  </Link>
                )}
              </li>
            </ul>
          </nav>

          {/* Enhanced Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden relative z-50 p-2.5 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all duration-200"
            aria-label="Toggle menu"
          >
            <motion.div
              initial={false}
              animate={mobileMenuOpen ? "open" : "closed"}
            >
              {mobileMenuOpen ? (
                <HiX className="text-3xl" />
              ) : (
                <HiMenuAlt3 className="text-3xl" />
              )}
            </motion.div>
          </button>
        </div>
      </header>

      {/* Enhanced Mobile Menu with Glassmorphism */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Enhanced Backdrop with blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-gradient-to-br from-black/60 via-black/50 to-emerald-900/30 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Menu Panel with gradient background */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-80 bg-gradient-to-br from-white via-emerald-50/30 to-white shadow-2xl z-40 lg:hidden overflow-y-auto border-l border-emerald-100"
            >
              <div className="pt-20 pb-8 px-6">
                {/* Enhanced User Section */}
                {user && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-8 pb-6 border-b border-emerald-200/50"
                  >
                    <button
                      onClick={() => {
                        setShowProfileModal(true);
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-4 w-full hover:bg-white/80 p-4 rounded-2xl transition-all duration-200 backdrop-blur-sm shadow-sm hover:shadow-md"
                    >
                      {user.photoURL ? (
                        <img
                          src={user.photoURL}
                          alt="Profile"
                          className="w-14 h-14 rounded-full border-3 border-emerald-400 object-cover shadow-lg"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-full border-3 border-emerald-400 bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                          {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="text-left flex-1">
                        <p className="font-bold text-gray-900 text-lg">{user.displayName || 'User'}</p>
                        <p className="text-sm text-gray-600 truncate">{user.email}</p>
                        {unreadCount > 0 && (
                          <span className="inline-block mt-1.5 bg-gradient-to-r from-red-500 to-rose-500 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-md">
                            {unreadCount} new 🔔
                          </span>
                        )}
                      </div>
                    </button>
                  </motion.div>
                )}

                {/* Enhanced Navigation Links */}
                <nav>
                  <ul className="space-y-3">
                    <motion.li
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 }}
                    >
                      <Link
                        to="/"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-4 text-gray-700 hover:text-emerald-600 hover:bg-white/60 backdrop-blur-sm px-5 py-3.5 rounded-2xl transition-all duration-200 text-lg font-semibold shadow-sm hover:shadow-md"
                      >
                        🏠 <span>Home</span>
                      </Link>
                    </motion.li>

                    <motion.li
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Link
                        to="/gallery"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-4 text-gray-700 hover:text-emerald-600 hover:bg-white/60 backdrop-blur-sm px-5 py-3.5 rounded-2xl transition-all duration-200 text-lg font-semibold shadow-sm hover:shadow-md"
                      >
                        🖼️ <span>Gallery</span>
                      </Link>
                    </motion.li>

                    <motion.li
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.25 }}
                    >
                      <Link
                        to="/contact"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-4 text-gray-700 hover:text-emerald-600 hover:bg-white/60 backdrop-blur-sm px-5 py-3.5 rounded-2xl transition-all duration-200 text-lg font-semibold shadow-sm hover:shadow-md"
                      >
                        📧 <span>Contact</span>
                      </Link>
                    </motion.li>

                    <motion.li
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.27 }}
                    >
                      <Link
                        to="/converter"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-4 text-gray-700 hover:text-emerald-600 hover:bg-white/60 backdrop-blur-sm px-5 py-3.5 rounded-2xl transition-all duration-200 text-lg font-semibold shadow-sm hover:shadow-md"
                      >
                        🔄 <span>Converter</span>
                      </Link>
                    </motion.li>

                    {user && user.email === "henokabay10010@gmail.com" && (
                      <motion.li
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.28 }}
                      >
                        <Link
                          to="/admin"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-4 text-emerald-700 hover:text-emerald-800 bg-gradient-to-r from-emerald-50 to-emerald-100 hover:from-emerald-100 hover:to-emerald-200 px-5 py-3.5 rounded-2xl transition-all duration-200 text-lg font-bold border-2 border-emerald-300 shadow-md"
                        >
                          🔐 <span>Admin Dashboard</span>
                        </Link>
                      </motion.li>
                    )}

                    <motion.li
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="pt-4"
                    >
                      <button
                        onClick={() => {
                          triggerFileSelect();
                          setMobileMenuOpen(false);
                        }}
                        className="flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white px-5 py-4 rounded-2xl transition-all duration-200 text-lg font-bold w-full shadow-lg shadow-emerald-200 hover:shadow-xl hover:scale-[1.02]"
                      >
                        <FaUpload className="text-base" />
                        <span>Upload Photo</span>
                      </button>
                    </motion.li>

                    <motion.li
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.35 }}
                    >
                      <button
                        onClick={() => {
                          setShowFavoritesModal(true);
                          setMobileMenuOpen(false);
                        }}
                        className="flex items-center justify-center gap-3 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white px-5 py-4 rounded-2xl transition-all duration-200 text-lg font-bold w-full shadow-lg shadow-pink-200 hover:shadow-xl hover:scale-[1.02]"
                      >
                        <FaHeart className="text-base" />
                        <span>Favorites</span>
                      </button>
                    </motion.li>

                    {!user && (
                      <motion.li
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="pt-4"
                      >
                        <Link
                          to="/login"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white px-5 py-4 rounded-2xl transition-all duration-200 text-lg font-bold w-full shadow-lg shadow-emerald-200 hover:shadow-xl"
                        >
                          <MdPersonAddAlt1 className="text-xl" />
                          <span>Login / Sign Up</span>
                        </Link>
                      </motion.li>
                    )}
                  </ul>
                </nav>

                {/* Enhanced App Info */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-8 pt-6 border-t border-emerald-200/50 text-center"
                >
                  <div className="relative inline-block mb-3">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full blur-xl opacity-30"></div>
                    <Logo size={64} className="relative" />
                  </div>
                  <p className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 bg-clip-text text-transparent font-bold text-xl mb-1">Enkushot</p>
                  <p className="text-gray-600 text-sm font-medium">Capture Your Moments ✨</p>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
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
