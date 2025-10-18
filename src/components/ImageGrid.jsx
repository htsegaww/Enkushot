import { motion } from "framer-motion";
import "../App.css";
import { useAuth } from "../hooks/useAuth";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { deleteDoc } from "firebase/firestore";
import SignInModal from "./SignInModal";
import { useState } from "react";
import useLikes from "../hooks/useLikes";
const DEBUG = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("debug") === "1";

const ImageGrid = ({ docs = [], images, setSelectedImage, setSelectedIndex, isFavorited, toggleFavorite, isFavoritesView }) => {
  const { user } = useAuth();
  const { isLiked, toggleLike } = useLikes();

  const [showSignIn, setShowSignIn] = useState(false);
  // local optimistic likes to ensure immediate UI feedback
  const [localLikes, setLocalLikes] = useState(new Set());

  // Support both 'docs' (main gallery) and 'images' (favorites modal)
  const items = images || docs;
  return (
    <div className="img-grid relative">
      {items.map((doc, idx) => {
        // Check if image is liked (heart icon now represents likes)
        const likedRemote = isLiked(doc.url);
        const liked = localLikes.has(doc.url) || likedRemote;

        return (
          <motion.div
            key={doc.url}
            layout
            className="img-wrap group"
            onClick={() => {
              setSelectedImage && setSelectedImage(doc.url);
              setSelectedIndex && setSelectedIndex(idx);
            }}
          >
            <motion.img src={doc.url} alt="images" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} />

            <motion.div className="opacity-0 group-hover:opacity-100 text-white">
              {user && doc.userEmail && user.email === doc.userEmail && (
                <button
                  className="absolute top-1 right-1 bg-red-800 rounded-lg px-2 py-1 text-sm"
                  onClick={async (e) => {
                    e.stopPropagation();
                    try {
                      await deleteDoc(doc.ref);
                    } catch (error) {
                      console.error("Error removing document: ", error);
                    }
                  }}
                >
                  Delete
                </button>
              )}

              {/* Heart button (like button that creates notifications) */}
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
                  console.log("[ImageGrid] heart clicked for", doc.url);
                  toggleLike(doc.url, doc.userEmail);
                }}
                className={`img-heart absolute bottom-2 right-2 ${liked ? "favorited" : ""}`}
                aria-pressed={liked}
                aria-label="Like"
              >
                {liked ? <FaHeart size={18} /> : <FaRegHeart size={18} />}
              </button>
            </motion.div>

            {DEBUG && (
              <div className="debug-fav" aria-hidden>
                fav: {String(favorited)}
              </div>
            )}
          </motion.div>
        );
      })}
      <SignInModal open={showSignIn} onClose={() => setShowSignIn(false)} />
    </div>
  );
};

export default ImageGrid;
