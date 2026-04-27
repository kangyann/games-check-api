"use client";
import { useEffect, useState } from "react";
import {
  FaUsers,
  FaKey,
  FaWaveSquare,
  FaGamepad,
  FaArrowRight,
  FaRotate,
} from "react-icons/fa6";
import Link from "next/link";

interface Stats {
  totalUsers: number;
  totalApiKeys: number;
  totalRequestsToday: number;
  totalGames: number;
  recentLogs: {
    id: number;
    endpoint: string;
    method: string;
    status: number;
    ip: string | null;
    createdAt: string;
  }[];
  recentUsers: {
    id: number;
    username: string;
    email: string;
    role: string;
    createdAt: string;
  }[];
}

export default function AdminOverview() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const res = await fetch("/api/admin/stats");
      const d = await res.json();
      if (d.status === 200) setStats(d.data);
    } catch {}
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const statCards = [
    {
      label: "Total Users",
      value: stats?.totalUsers ?? 0,
      icon: FaUsers,
      color: "text-primary",
      bg: "bg-primary-subtle",
      href: "/admin/users",
    },
    {
      label: "API Keys",
      value: stats?.totalApiKeys ?? 0,
      icon: FaKey,
      color: "text-accent",
      bg: "bg-accent-light",
      href: "/admin/users",
    },
    {
      label: "Requests Today",
      value: stats?.totalRequestsToday ?? 0,
      icon: FaWaveSquare,
      color: "text-success",
      bg: "bg-success-light",
      href: "/admin/monitoring",
    },
    {
      label: "Games",
      value: stats?.totalGames ?? 0,
      icon: FaGamepad,
      color: "text-warning",
      bg: "bg-warning-light",
      href: "/admin/health",
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse-soft">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 skeleton rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="h-72 skeleton rounded-xl" />
          <div className="h-72 skeleton rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold">Dashboard Overview</h2>
          <p className="text-xs text-muted">Welcome back, Admin.</p>
        </div>
        <button
          onClick={() => fetchStats(true)}
          disabled={refreshing}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-medium hover:bg-surface-hover transition cursor-pointer disabled:opacity-60"
        >
          <FaRotate size={10} className={refreshing ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <Link
            key={card.label}
            href={card.href}
            className="bg-white rounded-xl border border-border p-5 hover:shadow-md hover:border-primary/20 transition group animate-fadeIn"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted font-medium">{card.label}</p>
                <p className="text-2xl font-bold mt-1">
                  {card.value.toLocaleString()}
                </p>
              </div>
              <div className={`${card.bg} ${card.color} p-2.5 rounded-lg`}>
                <card.icon size={18} />
              </div>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-muted mt-3 group-hover:text-primary transition">
              View details <FaArrowRight size={8} />
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Users */}
        <div className="bg-white rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold">Recent Users</h3>
            <Link
              href="/admin/users"
              className="text-[10px] text-primary hover:underline font-medium"
            >
              View all →
            </Link>
          </div>
          <div className="space-y-3">
            {stats?.recentUsers?.length ? (
              stats.recentUsers.map((user, i) => (
                <div
                  key={user.id}
                  className="flex items-center gap-3 text-sm animate-fadeIn"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center text-primary text-xs font-bold flex-shrink-0">
                    {user.username[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{user.username}</p>
                    <p className="text-xs text-muted truncate">{user.email}</p>
                  </div>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      user.role === "ADMIN"
                        ? "bg-danger-light text-danger"
                        : user.role === "VIP"
                        ? "bg-warning-light text-warning"
                        : "bg-primary-subtle text-primary"
                    }`}
                  >
                    {user.role}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted text-center py-6">
                No users yet.
              </p>
            )}
          </div>
        </div>

        {/* Recent Logs */}
        <div className="bg-white rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold">Recent API Requests</h3>
            <Link
              href="/admin/monitoring"
              className="text-[10px] text-primary hover:underline font-medium"
            >
              View all →
            </Link>
          </div>
          <div className="space-y-2.5">
            {stats?.recentLogs?.length ? (
              stats.recentLogs.map((log, i) => (
                <div
                  key={log.id}
                  className="flex items-center gap-3 text-xs animate-fadeIn"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <span
                    className={`font-mono font-bold px-1.5 py-0.5 rounded ${
                      log.method === "GET"
                        ? "bg-success-light text-success"
                        : "bg-warning-light text-warning"
                    }`}
                  >
                    {log.method}
                  </span>
                  <span className="flex-1 truncate font-mono text-muted">
                    {log.endpoint}
                  </span>
                  <span
                    className={`font-semibold ${
                      log.status < 400 ? "text-success" : "text-danger"
                    }`}
                  >
                    {log.status}
                  </span>
                  <span className="text-muted text-[10px] hidden sm:block">
                    {new Date(log.createdAt).toLocaleTimeString()}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted text-center py-6">
                No requests yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
