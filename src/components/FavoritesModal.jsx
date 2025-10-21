import { IoMdClose } from "react-icons/io";
import ImageGrid from "./ImageGrid";
import useLikes from "../hooks/useLikes";
import { useAuth } from "../hooks/useAuth";

const FavoritesModal = ({ onClose }) => {
  const { likes } = useLikes();
  const { user } = useAuth();

  const likedImages = likes.map((like) => ({
    url: like.imageUrl,
    id: like.id,
    userEmail: like.imageOwnerEmail,
    createdAt: like.createdAt,
  }));

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
        <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">Your Liked Photos ❤️</h2>

        <div className="mb-3 text-sm text-gray-600 text-center">
          {likes.length === 0
            ? "No liked images yet."
            : `Showing ${likes.length} liked image${likes.length > 1 ? "s" : ""}`}
        </div>

        {likes.length > 0 && (
          <ImageGrid
            images={likedImages}
            isFavoritesView
          />
        )}
      </div>
    </div>
  );
};

export default FavoritesModal;
