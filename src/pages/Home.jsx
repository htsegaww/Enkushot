import React, { useState } from "react";
import Title from "../components/Title";
import UploadForm from "../components/UploadForm";
import ImageGrid from "../components/ImageGrid";
import Navbar from "../components/Navbar";
import Modal from "../components/Modal";
import "../App.css";
import useFirestore from "../hooks/useFirestore";
import useFavorites from "../hooks/useFavorites";

const Home = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const { docs } = useFirestore("images");
  const { favorites, isFavorited, toggleFavorite } = useFavorites();
  const [showFavorites, setShowFavorites] = useState(false);
  // compute the list of docs to display: either favorites (mapped to {url, id}) or all images
  const displayedDocs = showFavorites
    ? favorites.map((f) => ({ url: f.url, id: f.id || f.url }))
    : docs;

  return (
    <div className="mt-20">
      <Navbar />
      <Title />
      {/* Status line for favorites filter */}
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
      <ImageGrid
        docs={displayedDocs}
        setSelectedImage={setSelectedImage}
        setSelectedIndex={setSelectedIndex}
        isFavorited={isFavorited}
        toggleFavorite={toggleFavorite}
      />
      {selectedImage && (
        <Modal
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
          docs={displayedDocs}
          selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex}
        />
      )}
    </div>
  );
};

export default Home;
