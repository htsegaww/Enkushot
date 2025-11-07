import { useEffect, useState, useRef } from "react";
import { db, projectStorage } from "../firebase/firebase";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { collection, doc, setDoc } from "firebase/firestore";
import { useAuth } from "./useAuth";
import { analyzeImage } from "../services/aiService";

const useStorage = (file, metadata = {}) => {
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [url, setUrl] = useState(null);
  const { user } = useAuth();
  const uploadedRef = useRef(false);
  const fileNameRef = useRef(null);

  useEffect(() => {
    if (file && file.name !== fileNameRef.current) {
      uploadedRef.current = false;
      fileNameRef.current = file.name;
    }
  }, [file]);

  useEffect(() => {
    if (!file || uploadedRef.current) {
      return;
    }

    console.log('🚀 Starting upload for:', file.name);
    uploadedRef.current = true;

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
        console.error('❌ Upload error:', error);
        setError(error);
        uploadedRef.current = false;
      },
      async () => {
        try {
          console.log('✅ Upload complete, getting download URL...');
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          
          let aiData = {
            category: 'other',
            tags: [],
            confidence: 0
          };
          
          try {
            aiData = await analyzeImage(downloadUrl);
          } catch (err) {
            console.error('AI analysis failed:', err);
          }
          
          console.log('💾 Saving to Firestore...');
          await setDoc(collectionRef, {
            url: downloadUrl,
            createdAt: new Date(),
            userEmail: user?.email,
            firstName: metadata.firstName || (user?.displayName ? user.displayName.split(" ")[0] : ""),
            category: aiData.category,
            tags: aiData.tags,
            aiConfidence: aiData.confidence,
          });
          
          console.log('✨ Upload complete!');
          setUrl(downloadUrl);
        } catch (err) {
          console.error('❌ Upload completion error:', err);
          setError(err);
          uploadedRef.current = false;
        }
      }
    );

    return () => {
      if (uploadTask) {
        uploadTask.cancel?.();
      }
    };
  }, [file, user?.email, user?.displayName, metadata.firstName]);

  return { progress, url, error };
};

export default useStorage;
