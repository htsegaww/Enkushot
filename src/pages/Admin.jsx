import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { db } from "../firebase/firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
  where,
} from "firebase/firestore";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import {
  MdDashboard,
  MdImage,
  MdPeople,
  MdNotifications,
  MdDelete,
  MdVisibility,
  MdFavorite,
} from "react-icons/md";
import { FaHeart } from "react-icons/fa";

const ADMIN_EMAIL = "henokabay10010@gmail.com";

const Admin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalImages: 0,
    totalUsers: 0,
    totalLikes: 0,
    totalNotifications: 0,
  });
  const [images, setImages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedTab, setSelectedTab] = useState("overview");
  const [selectedImage, setSelectedImage] = useState(null);

  // Check if user is admin
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.email !== ADMIN_EMAIL) {
      toast.error("Access denied. Admin only!");
      navigate("/");
      return;
    }

    fetchDashboardData();
  }, [user, navigate]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch images
      const imagesSnapshot = await getDocs(collection(db, "images"));
      const imagesData = [];
      imagesSnapshot.forEach((doc) => {
        imagesData.push({ id: doc.id, ...doc.data() });
      });
      setImages(imagesData);

      // Fetch likes
      const likesSnapshot = await getDocs(collection(db, "likes"));

      // Fetch notifications
      const notificationsSnapshot = await getDocs(collection(db, "notifications"));

      // Get unique users from images
      const uniqueUsers = [...new Set(imagesData.map((img) => img.userEmail))];
      const usersData = uniqueUsers.map((email) => {
        const userImages = imagesData.filter((img) => img.userEmail === email);
        return {
          email,
          imageCount: userImages.length,
        };
      });
      setUsers(usersData);

      setStats({
        totalImages: imagesSnapshot.size,
        totalUsers: uniqueUsers.length,
        totalLikes: likesSnapshot.size,
        totalNotifications: notificationsSnapshot.size,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = async (imageId, imageUrl) => {
    if (!window.confirm("Are you sure you want to delete this image?")) {
      return;
    }

    try {
      // Delete the image document
      await deleteDoc(doc(db, "images", imageId));

      // Delete associated likes
      const likesQuery = query(collection(db, "likes"), where("imageUrl", "==", imageUrl));
      const likesSnapshot = await getDocs(likesQuery);
      const deletePromises = likesSnapshot.docs.map((doc) => deleteDoc(doc.ref));
      await Promise.all(deletePromises);

      // Delete associated notifications
      const notificationsQuery = query(
        collection(db, "notifications"),
        where("imageUrl", "==", imageUrl)
      );
      const notificationsSnapshot = await getDocs(notificationsQuery);
      const notifDeletePromises = notificationsSnapshot.docs.map((doc) => deleteDoc(doc.ref));
      await Promise.all(notifDeletePromises);

      toast.success("Image deleted successfully!");
      fetchDashboardData();
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Failed to delete image");
    }
  };

  const handleDeleteUserImages = async (userEmail) => {
    const userImages = images.filter((img) => img.userEmail === userEmail);
    
    if (
      !window.confirm(
        `Are you sure you want to delete all ${userImages.length} images from ${userEmail}? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      // Delete all images without individual confirmations
      for (const image of userImages) {
        // Delete the image document
        await deleteDoc(doc(db, "images", image.id));

        // Delete associated likes
        const likesQuery = query(collection(db, "likes"), where("imageUrl", "==", image.url));
        const likesSnapshot = await getDocs(likesQuery);
        const deletePromises = likesSnapshot.docs.map((doc) => deleteDoc(doc.ref));
        await Promise.all(deletePromises);

        // Delete associated notifications
        const notificationsQuery = query(
          collection(db, "notifications"),
          where("imageUrl", "==", image.url)
        );
        const notificationsSnapshot = await getDocs(notificationsQuery);
        const notifDeletePromises = notificationsSnapshot.docs.map((doc) => deleteDoc(doc.ref));
        await Promise.all(notifDeletePromises);
      }

      toast.success(`All ${userImages.length} images from ${userEmail} deleted successfully!`);
      fetchDashboardData();
    } catch (error) {
      console.error("Error deleting user images:", error);
      toast.error("Failed to delete user images");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="mt-20 px-4 py-8 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <MdDashboard className="text-emerald-600 text-4xl" />
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          </div>
          <p className="text-gray-600">Welcome back, Admin! Manage your Enkushot app.</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">Total Images</p>
                <p className="text-3xl font-bold text-emerald-600">{stats.totalImages}</p>
              </div>
              <MdImage className="text-emerald-600 text-4xl opacity-20" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">Total Users</p>
                <p className="text-3xl font-bold text-blue-600">{stats.totalUsers}</p>
              </div>
              <MdPeople className="text-blue-600 text-4xl opacity-20" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">Total Likes</p>
                <p className="text-3xl font-bold text-pink-600">{stats.totalLikes}</p>
              </div>
              <FaHeart className="text-pink-600 text-4xl opacity-20" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">Notifications</p>
                <p className="text-3xl font-bold text-purple-600">{stats.totalNotifications}</p>
              </div>
              <MdNotifications className="text-purple-600 text-4xl opacity-20" />
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-200">
          <button
            onClick={() => setSelectedTab("overview")}
            className={`px-4 py-2 font-medium transition-colors ${
              selectedTab === "overview"
                ? "text-emerald-600 border-b-2 border-emerald-600"
                : "text-gray-600 hover:text-emerald-600"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setSelectedTab("images")}
            className={`px-4 py-2 font-medium transition-colors ${
              selectedTab === "images"
                ? "text-emerald-600 border-b-2 border-emerald-600"
                : "text-gray-600 hover:text-emerald-600"
            }`}
          >
            Images ({stats.totalImages})
          </button>
          <button
            onClick={() => setSelectedTab("users")}
            className={`px-4 py-2 font-medium transition-colors ${
              selectedTab === "users"
                ? "text-emerald-600 border-b-2 border-emerald-600"
                : "text-gray-600 hover:text-emerald-600"
            }`}
          >
            Users ({stats.totalUsers})
          </button>
        </div>

        {/* Tab Content */}
        {selectedTab === "overview" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Platform Status</p>
                  <p className="text-sm text-gray-600">All systems operational</p>
                </div>
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="font-medium text-gray-900 mb-2">Quick Stats</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Average {(stats.totalImages / Math.max(stats.totalUsers, 1)).toFixed(1)} images per user</li>
                  <li>• Average {(stats.totalLikes / Math.max(stats.totalImages, 1)).toFixed(1)} likes per image</li>
                  <li>• {stats.totalNotifications} pending notifications</li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}

        {selectedTab === "images" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">All Images</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {images.map((image) => (
                <div
                  key={image.id}
                  className="group relative aspect-square rounded-lg overflow-hidden bg-gray-100"
                >
                  <img
                    src={image.url}
                    alt="User upload"
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() => setSelectedImage(image)}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-200 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    <button
                      onClick={() => setSelectedImage(image)}
                      className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                      title="View"
                    >
                      <MdVisibility className="text-gray-700" />
                    </button>
                    <button
                      onClick={() => handleDeleteImage(image.id, image.url)}
                      className="p-2 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                      title="Delete"
                    >
                      <MdDelete className="text-white" />
                    </button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                    <p className="text-white text-xs truncate">{image.userEmail}</p>
                  </div>
                </div>
              ))}
            </div>
            {images.length === 0 && (
              <p className="text-center text-gray-500 py-8">No images uploaded yet</p>
            )}
          </motion.div>
        )}

        {selectedTab === "users" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">All Users</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Images</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.email} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">{user.email}</td>
                      <td className="text-center py-3 px-4">{user.imageCount}</td>
                      <td className="text-right py-3 px-4">
                        <button
                          onClick={() => handleDeleteUserImages(user.email)}
                          className="text-red-600 hover:text-red-700 font-medium text-sm"
                        >
                          Delete All Images
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {users.length === 0 && (
              <p className="text-center text-gray-500 py-8">No users found</p>
            )}
          </motion.div>
        )}
      </div>

      {/* Image Preview Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-900">Image Details</h3>
                <p className="text-sm text-gray-600">{selectedImage.userEmail}</p>
              </div>
              <button
                onClick={() => setSelectedImage(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <img
              src={selectedImage.url}
              alt="Preview"
              className="w-full h-auto"
            />
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={() => {
                  handleDeleteImage(selectedImage.id, selectedImage.url);
                  setSelectedImage(null);
                }}
                className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete Image
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
