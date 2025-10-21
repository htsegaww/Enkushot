import { useEffect, useCallback } from "react";
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

      {/* bottom overlay pill with uploader info */}
      {selectedIndex !== null && docs[selectedIndex] && (
        (() => {
          const doc = docs[selectedIndex];
          const firstName = doc.firstName || (doc.userEmail ? doc.userEmail.split('@')[0] : '');
          const email = doc.userEmail || '';
          const createdAt = doc.createdAt ? (doc.createdAt.seconds ? new Date(doc.createdAt.seconds * 1000) : new Date(doc.createdAt)) : null;
          const dateStr = createdAt ? createdAt.toLocaleDateString() : null;
          const initials = firstName ? firstName.charAt(0).toUpperCase() : (email ? email.charAt(0).toUpperCase() : '?');

          return (
            <div style={{ position: 'absolute', bottom: 22, left: '50%', transform: 'translateX(-50%)', zIndex: 80 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(0,0,0,0.55)', color: '#fff', padding: '8px 12px', borderRadius: 999, boxShadow: '0 6px 20px rgba(0,0,0,0.4)' }}>
                <div style={{ width: 36, height: 36, borderRadius: 999, background: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{initials}</div>
                <div style={{ fontSize: 14, textAlign: 'left' }}>
                  <a href={email ? `/user?email=${encodeURIComponent(email)}` : '#'} style={{ color: '#fff', fontWeight: 600, textDecoration: 'underline' }} onClick={(e) => { if (!email) e.preventDefault(); }}>{firstName}</a>
                  {dateStr && <div style={{ fontSize: 12, opacity: 0.85 }}>{dateStr}</div>}
                </div>
              </div>
            </div>
          );
        })()
      )}

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
