import { useEffect, useState } from "react";
import { db, projectStorage } from "../firebase/firebase";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { useAuth } from "./useAuth";

const useStorage = (file) => {
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [url, setUrl] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const storageRef = ref(projectStorage, file.name);
    const collectionRef = doc(collection(db, "images"));

    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percentage =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(percentage);
      },
      (error) => {
        setError(error);
      },
      async () => {
        await getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          setDoc(collectionRef, {
            url,
            createdAt: new Date(),
            userEmail: user?.email,
          });
          setUrl(url);
        });
      }
    );
  }, [file]);

  return { progress, url, error };
};

export default useStorage;
