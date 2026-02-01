import { useContext } from "react";
import { NotificationContext } from "../context/NotificationContext";

const Notification = () => {
  const { notifications, removeNotification } = useContext(NotificationContext);

  return (
    <div className="notification-container">
      {notifications.map((notification) => (
        <div key={notification.id} className={`notification notification-${notification.type}`}>
          <div className="notification-content">
            <div className="notification-icon">
              {notification.type === "success" && "✓"}
              {notification.type === "error" && "✕"}
              {notification.type === "warning" && "⚠"}
              {notification.type === "info" && "ℹ"}
            </div>
            <div className="notification-message">{notification.message}</div>
            <button
              className="notification-close"
              onClick={() => removeNotification(notification.id)}
              aria-label="Close notification"
            >
              ×
            </button>
          </div>
          <div className="notification-progress"></div>
        </div>
      ))}
    </div>
  );
};

export default Notification;
