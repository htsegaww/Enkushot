import { useEffect, useState } from "react";
import { db, projectStorage } from "../firebase/firebase";

import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { collection, doc, setDoc } from "firebase/firestore";
import { useAuth } from "./useAuth";

const useStorage = (file, metadata = {}) => {
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [url, setUrl] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!file) return;

    const storageRef = ref(projectStorage, file.name);
    const collectionRef = doc(collection(db, "images"));
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(percentage);
      },
      (error) => {
        setError(error);
      },
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        await setDoc(collectionRef, {
          url,
          createdAt: new Date(),
          userEmail: user?.email,
          firstName: metadata.firstName || (user?.displayName ? user.displayName.split(" ")[0] : ""),
        });
        setUrl(url);
      }
    );
  }, [file, user, metadata]);

  return { progress, url, error };
};

export default useStorage;
