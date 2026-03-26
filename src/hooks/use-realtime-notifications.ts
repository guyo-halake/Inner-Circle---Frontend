"use client";

import { useState, useEffect } from "react";

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "info" | "success" | "warning";
}

export function useRealtimeNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Welcome to InnerCircle",
      message: "Your account has been successfully verified.",
      time: "2 hours ago",
      read: true,
      type: "success",
    },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const chance = Math.random();
      if (chance > 0.9) { // 10% chance to get a new notification every 10 seconds
        const newNotif: Notification = {
          id: Date.now().toString(),
          title: "Market Update",
          message: "A significant movement in Forex pairs has been detected.",
          time: "Just now",
          read: false,
          type: "info",
        };
        setNotifications(prev => [newNotif, ...prev]);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  return { notifications, markAsRead };
}
