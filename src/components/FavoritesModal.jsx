import React from "react";
import ImageGrid from "./ImageGrid";
import useFavorites from "../hooks/useFavorites";
import { useAuth } from "../hooks/useAuth";

const FavoritesModal = ({ onClose }) => {
  const { favorites, isFavorited, toggleFavorite } = useFavorites();
  const { user } = useAuth();

  console.log("[FavoritesModal] Rendering with", favorites.length, "favorites:", favorites);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-xl font-semibold mb-4 text-center">Your Favorites</h2>

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
