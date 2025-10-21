import { useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  deleteDoc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { useAuth } from "./useAuth";
import { toast } from "react-toastify";

const useLikes = () => {
  const [likes, setLikes] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setLikes([]);
      return;
    }

    // Subscribe to all likes by this user
    const likesRef = collection(db, "likes");
    const q = query(likesRef, where("likedBy", "==", user.email));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userLikes = [];
      snapshot.forEach((doc) => {
        userLikes.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setLikes(userLikes);
    });

    return () => unsubscribe();
  }, [user]);

  const isLiked = (imageUrl) => {
    return likes.some((like) => like.imageUrl === imageUrl);
  };

  const toggleLike = async (imageUrl, imageOwnerEmail) => {
    if (!user) {
      toast.error("Please login to like images");
      return;
    }

    try {
      const existingLike = likes.find((like) => like.imageUrl === imageUrl);

      if (existingLike) {
        // Unlike: remove the like
        const likesRef = collection(db, "likes");
        const q = query(
          likesRef,
          where("imageUrl", "==", imageUrl),
          where("likedBy", "==", user.email)
        );
        const snapshot = await getDocs(q);
        snapshot.forEach(async (doc) => {
          await deleteDoc(doc.ref);
        });
      } else {
        // Like: add the like
        await addDoc(collection(db, "likes"), {
          imageUrl,
          imageOwnerEmail,
          likedBy: user.email,
          likedByName: user.displayName || user.email,
          likedByPhoto: user.photoURL || null,
          createdAt: serverTimestamp(),
        });

        // Create notification for the image owner (don't notify yourself)
        if (imageOwnerEmail && imageOwnerEmail !== user.email) {
          await addDoc(collection(db, "notifications"), {
            type: "like",
            imageUrl,
            imageOwnerEmail,
            triggeredBy: user.email,
            triggeredByName: user.displayName || user.email,
            triggeredByPhoto: user.photoURL || null,
            message: `${user.displayName || user.email} liked your picture`,
            read: false,
            createdAt: serverTimestamp(),
          });
        }
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      toast.error("Failed to update like");
    }
  };

  const getLikesCount = async (imageUrl) => {
    try {
      const likesRef = collection(db, "likes");
      const q = query(likesRef, where("imageUrl", "==", imageUrl));
      const snapshot = await getDocs(q);
      return snapshot.size;
    } catch (error) {
      console.error("Error getting likes count:", error);
      return 0;
    }
  };

  return { likes, isLiked, toggleLike, getLikesCount };
};

export default useLikes;
