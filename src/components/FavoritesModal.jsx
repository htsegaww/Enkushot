import React from "react";
import ImageGrid from "./ImageGrid";
import { useFavorites } from "../hooks/useFavorites";

const FavoritesModal = ({ onClose }) => {
  const { favorites } = useFavorites();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-xl font-semibold mb-4 text-center">Your Favorites</h2>
        {favorites.length === 0 ? (
          <div className="text-center text-gray-500">No favorite images yet.</div>
        ) : (
          <ImageGrid images={favorites} isFavoritesView />
        )}
      </div>
    </div>
  );
};

export default FavoritesModal;
