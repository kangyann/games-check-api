"use client";
import { useEffect, useState } from "react";
import {
  FaBell,
  FaCheck,
  FaCircleInfo,
  FaTriangleExclamation,
  FaCircleCheck,
  FaStar,
} from "react-icons/fa6";

interface NotifData {
  id: number;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  isGlobal: boolean;
  createdAt: string;
}

const typeConfig: Record<string, { icon: any; color: string; bg: string }> = {
  INFO: { icon: FaCircleInfo, color: "text-primary", bg: "bg-primary-subtle" },
  WARNING: { icon: FaTriangleExclamation, color: "text-warning", bg: "bg-warning-light" },
  SUCCESS: { icon: FaCircleCheck, color: "text-success", bg: "bg-success-light" },
  PROMO: { icon: FaStar, color: "text-accent", bg: "bg-accent-light" },
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotifData[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifs = () => {
    fetch("/api/user/notifications")
      .then((r) => r.json())
      .then((d) => {
        if (d.status === 200) {
          setNotifications(d.data);
          setUnreadCount(d.unreadCount);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchNotifs();
  }, []);

  const markAsRead = async (id: number) => {
    await fetch("/api/user/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchNotifs();
  };

  const markAllRead = async () => {
    await fetch("/api/user/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markAllRead: true }),
    });
    fetchNotifs();
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse-soft">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 skeleton rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold">Notifications</h2>
          <p className="text-xs text-muted">
            {unreadCount > 0
              ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
              : "All caught up!"}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-medium hover:bg-surface-hover transition cursor-pointer"
          >
            <FaCheck size={10} /> Mark all read
          </button>
        )}
      </div>

      {/* List */}
      <div className="space-y-3">
        {notifications.map((notif, i) => {
          const config = typeConfig[notif.type] || typeConfig.INFO;
          const Icon = config.icon;
          return (
            <div
              key={notif.id}
              className={`bg-white rounded-xl border p-4 transition animate-fadeIn ${
                notif.isRead
                  ? "border-border-light opacity-70"
                  : "border-border shadow-sm"
              }`}
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`${config.bg} ${config.color} p-2.5 rounded-lg flex-shrink-0 mt-0.5`}
                >
                  <Icon size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-semibold">{notif.title}</p>
                    {!notif.isRead && (
                      <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                    )}
                    {notif.isGlobal && (
                      <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-surface text-muted">
                        Global
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted leading-relaxed">
                    {notif.message}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-[10px] text-muted">
                      {new Date(notif.createdAt).toLocaleString()}
                    </span>
                    {!notif.isRead && (
                      <button
                        onClick={() => markAsRead(notif.id)}
                        className="text-[10px] text-primary hover:underline font-medium cursor-pointer"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {notifications.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl border border-border">
            <FaBell size={28} className="mx-auto mb-3 opacity-20" />
            <p className="text-sm font-medium text-muted">
              No notifications yet
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
