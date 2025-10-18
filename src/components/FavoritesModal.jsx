import React from "react";
import ImageGrid from "./ImageGrid";
import useFavorites from "../hooks/useFavorites";
import { useAuth } from "../hooks/useAuth";
import { IoMdClose } from "react-icons/io";

const FavoritesModal = ({ onClose }) => {
  const { favorites, isFavorited, toggleFavorite } = useFavorites();
  const { user } = useAuth();

  console.log("[FavoritesModal] Rendering with", favorites.length, "favorites:", favorites);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 hover:bg-gray-100 rounded-full p-2 transition-all duration-200 z-10"
          onClick={onClose}
          aria-label="Close"
        >
          <IoMdClose size={24} />
        </button>
        <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">Your Favorites ❤️</h2>

        <div className="mb-3 text-sm text-gray-600 text-center">
          {favorites.length === 0
            ? "No favorite images yet."
            : `Showing ${favorites.length} favorite${favorites.length > 1 ? "s" : ""}`}
        </div>

        

        {favorites.length > 0 && (
          <ImageGrid
            images={favorites.map((f) => ({ url: f.url, id: f.id, ref: f.ref, userEmail: f.userEmail, createdAt: f.createdAt }))}
            isFavoritesView
            isFavorited={isFavorited}
            toggleFavorite={toggleFavorite}
          />
        )}
      </div>
    </div>
  );
};

export default FavoritesModal;
