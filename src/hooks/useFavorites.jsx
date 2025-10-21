import { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useAuth } from "./useAuth";

const useFavorites = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [pendingAdds, setPendingAdds] = useState(new Set());
  const [pendingRemoves, setPendingRemoves] = useState(new Set());

  useEffect(() => {
    if (!user) {
      setFavorites([]);
      return;
    }

    const colRef = collection(db, "favorites");
    const q = query(colRef, where("userEmail", "==", user.email));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const favs = [];
      snapshot.forEach((doc) => {
        favs.push({ ...doc.data(), id: doc.id, ref: doc.ref });
      });
      const favUrls = favs.map((f) => f.url);
      setFavorites(favs);

      // clear pending adds that the server now confirms
      setPendingAdds((prev) => {
        const next = new Set([...prev].filter((u) => !favUrls.includes(u)));
        return next;
      });

      // clear pending removes that the server now applies (i.e., url not in favUrls)
      setPendingRemoves((prev) => {
        const next = new Set([...prev].filter((u) => favUrls.includes(u)));
        return next;
      });
    });

    return () => unsubscribe();
  }, [user]);

  const toggleFavorite = async (url) => {
    if (!user) {
      throw new Error("Not authenticated");
    }
    const existing = favorites.find((f) => f.url === url);
    if (existing) {
      // optimistic remove
      setPendingRemoves((prev) => new Set([...prev, url]));
      setFavorites((prev) => prev.filter((f) => f.url !== url));
      try {
        if (existing.ref) await deleteDoc(existing.ref);
      } catch (e) {
        console.error("Error removing favorite:", e);
        // revert on error
        setPendingRemoves((prev) => {
          const next = new Set(prev);
          next.delete(url);
          return next;
        });
        setFavorites((prev) => [...prev, existing]);
      }
    } else {
      // optimistic add (will be replaced by onSnapshot result)
      const optimistic = { url, userEmail: user.email, id: `optimistic-${Date.now()}`, ref: null };
      setPendingAdds((prev) => new Set(prev).add(url));
      setFavorites((prev) => [...prev, optimistic]);
      try {
        await addDoc(collection(db, "favorites"), {
          url,
          userEmail: user.email,
          createdAt: serverTimestamp(),
        });
      } catch (e) {
        console.error("Error adding favorite:", e);
        // remove optimistic entry on error
        setFavorites((prev) => prev.filter((f) => f.id !== optimistic.id));
        setPendingAdds((prev) => {
          const next = new Set(prev);
          next.delete(url);
          return next;
        });
      }
    }
  };

  const isFavorited = (url) => {
    if (pendingAdds.has(url)) return true;
    if (pendingRemoves.has(url)) return false;
    return favorites.some((f) => f.url === url);
  };

  return { favorites, toggleFavorite, isFavorited };
};

export default useFavorites;
