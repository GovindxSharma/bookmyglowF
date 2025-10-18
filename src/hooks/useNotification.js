import { useState, useCallback } from "react";
import Notification from "../components/Notification";

export const useNotification = () => {
  const [notif, setNotif] = useState({ message: "", type: "", visible: false });

  const showNotification = useCallback((message, type = "success") => {
    setNotif({ message, type, visible: true });
  }, []);

  const hideNotification = useCallback(() => {
    setNotif((prev) => ({ ...prev, visible: false }));
  }, []);

  const NotificationComponent = notif.visible ? (
    <Notification
      message={notif.message}
      type={notif.type}
      onClose={hideNotification}
    />
  ) : null;

  return { showNotification, NotificationComponent };
};
