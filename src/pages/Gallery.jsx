import { useState } from "react";
import { motion } from "framer-motion";
import Title from "../components/Title";
import UploadForm from "../components/UploadForm";
import Navbar from "../components/Navbar";
import Modal from "../components/Modal";
import useFirestore from "../hooks/useFirestore";
import useFavorites from "../hooks/useFavorites";
import { useAuth } from "../hooks/useAuth";
import useLikes from "../hooks/useLikes";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { deleteDoc } from "firebase/firestore";
import SignInModal from "../components/SignInModal";

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [localLikes, setLocalLikes] = useState(new Set());
  
  const { docs } = useFirestore("images");
  const { favorites } = useFavorites();
  const { user } = useAuth();
  const { isLiked, toggleLike } = useLikes();
  
  const displayedDocs = showFavorites
    ? favorites.map((f) => ({ url: f.url, id: f.id || f.url }))
    : docs;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50">
      <Navbar />
      
      <div className="mt-20 px-4 py-8 max-w-7xl mx-auto">
        <Title />
        
        {showFavorites && (
          <div className="text-center mt-4 mb-2 text-sm text-gray-700">
            {displayedDocs.length > 0
              ? `Showing ${displayedDocs.length} favorite${displayedDocs.length > 1 ? "s" : ""}`
              : "No favorites yet — favorite some images to see them here."}
          </div>
        )}
        
        <UploadForm
          showFavorites={showFavorites}
          onShowFavorites={() => setShowFavorites((s) => !s)}
        />

        {/* Gallery Grid with Home page styling */}
        {displayedDocs.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="mt-8"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {displayedDocs.map((doc, index) => {
                const likedRemote = isLiked(doc.url);
                const liked = localLikes.has(doc.url) || likedRemote;

                return (
                  <motion.div
                    key={doc.id || doc.url}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="relative group cursor-pointer overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 aspect-square"
                    onClick={() => {
                      setSelectedImage(doc.url);
                      setSelectedIndex(index);
                    }}
                  >
                    <img
                      src={doc.url}
                      alt="gallery"
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                    
                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Action buttons overlay */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {/* Delete button for owner */}
                      {user && doc.userEmail && user.email === doc.userEmail && (
                        <button
                          className="absolute top-3 right-3 bg-red-600 hover:bg-red-700 text-white rounded-lg px-3 py-1.5 text-sm font-medium shadow-lg transition-all duration-200"
                          onClick={async (e) => {
                            e.stopPropagation();
                            if (window.confirm("Are you sure you want to delete this image?")) {
                              try {
                                await deleteDoc(doc.ref);
                              } catch (error) {
                                console.error("Error removing document: ", error);
                              }
                            }
                          }}
                        >
                          Delete
                        </button>
                      )}

                      {/* Like button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!user) {
                            setShowSignIn(true);
                            return;
                          }
                          setLocalLikes((prev) => {
                            const next = new Set(prev);
                            if (next.has(doc.url)) next.delete(doc.url);
                            else next.add(doc.url);
                            return next;
                          });
                          toggleLike(doc.url, doc.userEmail);
                        }}
                        className={`absolute bottom-3 right-3 p-2.5 rounded-full backdrop-blur-sm transition-all duration-200 shadow-lg ${
                          liked 
                            ? "bg-red-500/90 text-white hover:bg-red-600" 
                            : "bg-white/90 text-gray-700 hover:bg-white"
                        }`}
                        aria-pressed={liked}
                        aria-label="Like"
                      >
                        {liked ? <FaHeart size={18} /> : <FaRegHeart size={18} />}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {displayedDocs.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center py-20"
          >
            <div className="text-gray-400 mb-4">
              <svg
                className="w-24 h-24 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              {showFavorites ? "No favorites yet" : "No photos yet"}
            </h3>
            <p className="text-gray-500">
              {showFavorites 
                ? "Like some images to see them here!" 
                : "Be the first to upload and share your moments!"
              }
            </p>
          </motion.div>
        )}
      </div>

      {/* Modal for image preview */}
      {selectedImage && (
        <Modal
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
          docs={displayedDocs}
          selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex}
        />
      )}

      {/* Sign In Modal */}
      <SignInModal open={showSignIn} onClose={() => setShowSignIn(false)} />
    </div>
  );
};

export default Gallery;
