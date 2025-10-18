import { useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import { useAuth } from "./useAuth";

const useFirestore = (images) => {
  const [docs, setDocs] = useState([]);

  // console.log(user);

  useEffect(() => {
    //order the new images in descending order according to createdAt. the newest ones at the top.
    const collectionRef = collection(db, "images");
    const q = query(collectionRef, orderBy("createdAt", "desc"));

    //onSnapshot is an event listener that updates every time there is a change in the document
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let images = [];
      snapshot.forEach((doc) => {
        const url = doc.data().url;
        const createdAt = doc.data().createdAt.toDate();
        const userEmail = doc.data().userEmail;

        images.push({ url, createdAt, userEmail, ref: doc.ref, id: doc.id });
      });
      setDocs(images);
    });

    // this is a cleanup function that react will run when
    // a component using the hook unmounts

    return () => unsubscribe && unsubscribe();
  }, [images]);

  return { docs };
};

export default useFirestore;

/**
 * 
 * 
 * snapshot.forEach((doc) => {
        images.push({
          ...doc.data(),
          id: doc.id,
        });
        setDocs(images);
      });
 */


