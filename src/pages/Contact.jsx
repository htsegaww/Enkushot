import React from "react";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import { FaInstagram, FaTiktok } from "react-icons/fa";

const Contact = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50">
      <Navbar />

      <div className="mt-20 px-4 py-16 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Let's <span className="bg-gradient-to-r from-emerald-600 to-emerald-400 bg-clip-text text-transparent">Connect</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Follow us on social media to stay updated with the latest moments and join our community! 📸✨
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Cool Visual/Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            {/* Decorative Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-3xl transform rotate-3"></div>
            
            {/* Main Card */}
            <div className="relative bg-white rounded-3xl shadow-2xl p-12 transform -rotate-1">
              <div className="space-y-6">
                {/* Camera Icon SVG */}
                <div className="flex justify-center">
                  <svg
                    className="w-48 h-48"
                    viewBox="0 0 200 200"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="100" cy="100" r="90" fill="#10B981" opacity="0.1" />
                    <circle cx="100" cy="100" r="70" fill="#10B981" opacity="0.2" />
                    <path
                      d="M140 60H130L120 50H80L70 60H60C54.48 60 50 64.48 50 70V130C50 135.52 54.48 140 60 140H140C145.52 140 150 135.52 150 130V70C150 64.48 145.52 60 140 60Z"
                      fill="#059669"
                    />
                    <circle cx="100" cy="100" r="25" fill="#047857" />
                    <circle cx="100" cy="100" r="20" fill="white" opacity="0.3" />
                    <circle cx="130" cy="75" r="5" fill="#34D399" />
                    {/* Sparkles */}
                    <circle cx="160" cy="40" r="3" fill="#FCD34D" />
                    <circle cx="40" cy="160" r="3" fill="#FCD34D" />
                    <circle cx="165" cy="140" r="2" fill="#F59E0B" />
                    <circle cx="35" cy="60" r="2" fill="#F59E0B" />
                  </svg>
                </div>
                
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Enkushot</h2>
                  <p className="text-emerald-600 font-semibold">Capture Your Moments</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Social Media Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Follow Us</h2>
              <p className="text-gray-600 mb-8">
                Join our growing community and get inspired by amazing photos every day!
              </p>
            </div>

            {/* Instagram */}
            <motion.a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-6 bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 group"
            >
              <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 p-4 rounded-2xl">
                <FaInstagram className="text-white text-4xl" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-1">Instagram</h3>
                <p className="text-gray-600">Follow us for daily inspiration</p>
              </div>
              <svg
                className="w-6 h-6 text-gray-400 group-hover:text-emerald-600 group-hover:translate-x-2 transition-all"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </motion.a>

            {/* TikTok */}
            <motion.a
              href="https://tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-6 bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 group"
            >
              <div className="bg-gradient-to-br from-black to-gray-800 p-4 rounded-2xl">
                <FaTiktok className="text-white text-4xl" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-1">TikTok</h3>
                <p className="text-gray-600">Watch our creative moments</p>
              </div>
              <svg
                className="w-6 h-6 text-gray-400 group-hover:text-emerald-600 group-hover:translate-x-2 transition-all"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </motion.a>

            {/* Stats Card */}
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl shadow-xl p-8 text-white">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-3xl font-bold mb-1">10K+</p>
                  <p className="text-emerald-100 text-sm">Followers</p>
                </div>
                <div>
                  <p className="text-3xl font-bold mb-1">500+</p>
                  <p className="text-emerald-100 text-sm">Posts</p>
                </div>
                <div>
                  <p className="text-3xl font-bold mb-1">50K+</p>
                  <p className="text-emerald-100 text-sm">Likes</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
