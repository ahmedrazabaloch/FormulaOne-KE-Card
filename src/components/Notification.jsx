import { useContext } from "react";
import { NotificationContext } from "../context/NotificationContext";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";

const iconMap = {
  success: <CheckCircle size={20} strokeWidth={2} />,
  error: <XCircle size={20} strokeWidth={2} />,
  warning: <AlertTriangle size={20} strokeWidth={2} />,
  info: <Info size={20} strokeWidth={2} />,
};

const Notification = () => {
  const { notifications, removeNotification } = useContext(NotificationContext);

  return (
    <div className="notification-container">
      {notifications.map((notification) => (
        <div key={notification.id} className={`notification notification-${notification.type}`}>
          <div className="notification-content">
            <span className="notification-icon">
              {iconMap[notification.type] || iconMap.info}
            </span>
            <span className="notification-message">{notification.message}</span>
            <button
              className="notification-close"
              onClick={() => removeNotification(notification.id)}
              aria-label="Close notification"
            >
              <X size={16} strokeWidth={2} />
            </button>
          </div>
          <div className="notification-progress"></div>
        </div>
      ))}
    </div>
  );
};

export default Notification;
