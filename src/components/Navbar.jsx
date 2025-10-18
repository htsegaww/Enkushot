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
      <header className="w-full bg-white shadow-sm fixed top-0 left-0 right-0 z-50" style={{ height: '64px' }}>
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between" style={{ height: '64px' }}>
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Logo size={40} />
            <h1 className="text-2xl text-[#069668] font-semibold">Enkushot</h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:block">
            <ul className="flex items-center gap-4">
              <li>
                <Link to="/" className="text-gray-700 hover:text-emerald-600 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/gallery" className="text-gray-700 hover:text-emerald-600 transition-colors">Gallery</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-700 hover:text-emerald-600 transition-colors">Contact</Link>
              </li>
              <li>
                <button onClick={triggerFileSelect} className="flex items-center gap-2 bg-emerald-600 text-white px-3 py-1 rounded hover:bg-emerald-700 transition-colors">
                  <FaUpload />
                  <span>Upload</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setShowFavoritesModal(true)}
                  className="flex items-center gap-2 bg-pink-100 text-pink-600 px-3 py-1 rounded hover:bg-pink-200 transition-colors"
                  aria-label="View Favorites"
                >
                  <FaHeart />
                  <span>Favorites</span>
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
                    <span>Login / Sign Up</span>
                  </Link>
                )}
              </li>
            </ul>
          </nav>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden relative z-50 p-2 text-gray-700 hover:text-emerald-600 transition-colors"
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

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-80 bg-white shadow-2xl z-40 lg:hidden overflow-y-auto"
            >
              <div className="pt-20 pb-8 px-6">
                {/* User Section */}
                {user && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-8 pb-6 border-b border-gray-200"
                  >
                    <button
                      onClick={() => {
                        setShowProfileModal(true);
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-4 w-full hover:bg-emerald-50 p-3 rounded-lg transition-colors"
                    >
                      {user.photoURL ? (
                        <img
                          src={user.photoURL}
                          alt="Profile"
                          className="w-12 h-12 rounded-full border-2 border-emerald-500 object-cover"
                        />
                      ) : (
                        <FaUserCircle className="text-emerald-600 text-5xl" />
                      )}
                      <div className="text-left">
                        <p className="font-semibold text-gray-900">{user.displayName || 'User'}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        {unreadCount > 0 && (
                          <span className="inline-block mt-1 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                            {unreadCount} new notification{unreadCount > 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                    </button>
                  </motion.div>
                )}

                {/* Navigation Links */}
                <nav>
                  <ul className="space-y-2">
                    <motion.li
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 }}
                    >
                      <Link
                        to="/"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 px-4 py-3 rounded-lg transition-colors text-lg font-medium"
                      >
                        🏠 Home
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
                        className="flex items-center gap-3 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 px-4 py-3 rounded-lg transition-colors text-lg font-medium"
                      >
                        🖼️ Gallery
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
                        className="flex items-center gap-3 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 px-4 py-3 rounded-lg transition-colors text-lg font-medium"
                      >
                        📧 Contact
                      </Link>
                    </motion.li>

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
                        className="flex items-center gap-3 bg-emerald-600 text-white px-4 py-3 rounded-lg hover:bg-emerald-700 transition-colors text-lg font-medium w-full"
                      >
                        <FaUpload />
                        Upload Photo
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
                        className="flex items-center gap-3 bg-pink-100 text-pink-600 px-4 py-3 rounded-lg hover:bg-pink-200 transition-colors text-lg font-medium w-full"
                      >
                        <FaHeart />
                        Favorites
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
                          className="flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white px-4 py-3 rounded-lg hover:from-emerald-700 hover:to-emerald-600 transition-all text-lg font-medium w-full"
                        >
                          <MdPersonAddAlt1 />
                          Login / Sign Up
                        </Link>
                      </motion.li>
                    )}
                  </ul>
                </nav>

                {/* App Info */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-8 pt-6 border-t border-gray-200 text-center"
                >
                  <Logo size={60} className="mx-auto mb-3" />
                  <p className="text-emerald-600 font-semibold text-lg">Enkushot</p>
                  <p className="text-gray-500 text-sm">Capture Your Moments ✨</p>
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
