import { motion } from "framer-motion";
import "../App.css";
import { useAuth } from "../hooks/useAuth";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { deleteDoc } from "firebase/firestore";
import SignInModal from "./SignInModal";
import { useState } from "react";
const DEBUG = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("debug") === "1";

const ImageGrid = ({ docs = [], setSelectedImage, setSelectedIndex, isFavorited, toggleFavorite }) => {
  const { user } = useAuth();

  const [showSignIn, setShowSignIn] = useState(false);
  // local optimistic favorites to ensure immediate UI feedback
  const [localFavs, setLocalFavs] = useState(new Set());

  return (
    <div className="img-grid relative">
      {docs.map((doc, idx) => {
  const favoritedRemote = isFavorited ? isFavorited(doc.url) : false;
  // combine local optimistic state with remote state
  const favorited = localFavs.has(doc.url) || favoritedRemote;

        return (
          <motion.div
            key={doc.url}
            layout
            className="img-wrap group"
            onClick={() => {
              setSelectedImage(doc.url);
              setSelectedIndex(idx);
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

              {/* Heart button only visible on hover */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (!user) {
                    setShowSignIn(true);
                    return;
                  }
                  // optimistic toggle locally for immediate UI
                  setLocalFavs((prev) => {
                    const next = new Set(prev);
                    if (next.has(doc.url)) next.delete(doc.url);
                    else next.add(doc.url);
                    console.log('[ImageGrid] local toggle favs ->', Array.from(next));
                    return next;
                  });
                  console.log('[ImageGrid] click favorite (remote)', doc.url, 'currentlyFavorited=', favoritedRemote);
                  toggleFavorite && toggleFavorite(doc.url);
                }}
                className={`img-heart absolute bottom-2 right-2 ${favorited ? "favorited" : ""}`}
                aria-pressed={favorited}
                aria-label="Favorite"
              >
                {favorited ? <FaHeart size={18} /> : <FaRegHeart size={18} />}
              </button>
            </motion.div>

            {/* when favorited, the large heart (inside the hover overlay) will be visible even off-hover via the .favorited class */}
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
