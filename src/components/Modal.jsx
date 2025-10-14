import React, { useEffect, useCallback } from "react";
import { motion } from "framer-motion";

const Modal = ({
  setSelectedImage,
  selectedImage,
  docs = [],
  selectedIndex,
  setSelectedIndex,
}) => {
  const handleClick = (e) => {
    if (e.target.classList.contains("backdrop")) {
      setSelectedImage(null);
    }
  };

  const goPrev = useCallback(() => {
    if (selectedIndex !== null && selectedIndex > 0) {
      const newIndex = selectedIndex - 1;
      setSelectedIndex(newIndex);
      setSelectedImage(docs[newIndex].url);
    }
  }, [selectedIndex, docs, setSelectedImage, setSelectedIndex]);

  const goNext = useCallback(() => {
    if (selectedIndex !== null && selectedIndex < docs.length - 1) {
      const newIndex = selectedIndex + 1;
      setSelectedIndex(newIndex);
      setSelectedImage(docs[newIndex].url);
    }
  }, [selectedIndex, docs, setSelectedImage, setSelectedIndex]);

  const handleKey = useCallback(
    (e) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "Escape") setSelectedImage(null);
    },
    [goPrev, goNext, setSelectedImage]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  return (
    <motion.div
      className="backdrop"
      onClick={handleClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <button
        aria-label="Previous"
        onClick={(e) => {
          e.stopPropagation();
          goPrev();
        }}
        className={`modal-arrow left ${
          selectedIndex === 0 || selectedIndex === null ? "disabled" : ""
        }`}
        disabled={selectedIndex === 0 || selectedIndex === null}
      >
        ‹
      </button>

      <motion.img
        className="group"
        src={selectedImage}
        alt="modal image"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      />

      <button
        aria-label="Next"
        onClick={(e) => {
          e.stopPropagation();
          goNext();
        }}
        className={`modal-arrow right ${
          selectedIndex === null || selectedIndex === docs.length - 1
            ? "disabled"
            : ""
        }`}
        disabled={selectedIndex === null || selectedIndex === docs.length - 1}
      >
        ›
      </button>
    </motion.div>
  );
};

export default Modal;
