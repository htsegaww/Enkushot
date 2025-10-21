import { useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { useAuth } from "./useAuth";

const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    // Subscribe to notifications for this user
    const notificationsRef = collection(db, "notifications");
    const q = query(
      notificationsRef,
      where("imageOwnerEmail", "==", user.email)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const userNotifications = [];
        let unread = 0;

        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          userNotifications.push({
            id: docSnap.id,
            ...data,
            createdAt: data.createdAt?.toDate(),
          });
          if (!data.read) {
            unread++;
          }
        });

        // Sort by createdAt manually (newest first)
        userNotifications.sort((a, b) => {
          if (!a.createdAt) return 1;
          if (!b.createdAt) return -1;
          return b.createdAt - a.createdAt;
        });

        setNotifications(userNotifications);
        setUnreadCount(unread);
      },
      (error) => {
        console.error("Error loading notifications:", error);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const markAsRead = async (notificationId) => {
    try {
      const notificationRef = doc(db, "notifications", notificationId);
      await updateDoc(notificationRef, {
        read: true,
      });
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter((n) => !n.read);
      const promises = unreadNotifications.map((n) =>
        updateDoc(doc(db, "notifications", n.id), { read: true })
      );
      await Promise.all(promises);
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await deleteDoc(doc(db, "notifications", notificationId));
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const clearAllNotifications = async () => {
    try {
      const promises = notifications.map((n) =>
        deleteDoc(doc(db, "notifications", n.id))
      );
      await Promise.all(promises);
    } catch (error) {
      console.error("Error clearing notifications:", error);
    }
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
  };
};

export default useNotifications;
