import { useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";

const useFirestore = (collectionName) => {
  const [docs, setDocs] = useState([]);

  useEffect(() => {
    const collectionRef = collection(db, collectionName);
    const q = query(collectionRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const images = snapshot.docs.map((doc) => ({
        url: doc.data().url,
        createdAt: doc.data().createdAt.toDate(),
        userEmail: doc.data().userEmail,
        ref: doc.ref,
        id: doc.id,
      }));
      setDocs(images);
    });

    return () => unsubscribe();
  }, [collectionName]);

  return { docs };
};

export default useFirestore;


