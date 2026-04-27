"use client";
import { useEffect, useState } from "react";
import { FaChartLine } from "react-icons/fa6";

interface UsageData {
  daily: { date: string; count: number }[];
  total: number;
  limit: number;
  role: string;
}

export default function UsagePage() {
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/user/usage")
      .then((r) => r.json())
      .then((d) => {
        if (d.status === 200) setUsage(d.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse-soft">
        <div className="h-48 skeleton rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 skeleton rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const maxCount = Math.max(...(usage?.daily?.map((d) => d.count) || [1]), 1);
  const todayRequests = usage?.daily?.[usage.daily.length - 1]?.count ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold">Usage & Limits</h2>
        <p className="text-xs text-muted">
          Monitor your API usage and rate limits.
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-border p-5 animate-fadeIn">
          <p className="text-xs text-muted font-medium">Today</p>
          <p className="text-2xl font-bold mt-1">{todayRequests}</p>
          <p className="text-[10px] text-muted mt-1">requests</p>
        </div>
        <div
          className="bg-white rounded-xl border border-border p-5 animate-fadeIn"
          style={{ animationDelay: "100ms" }}
        >
          <p className="text-xs text-muted font-medium">All Time</p>
          <p className="text-2xl font-bold mt-1">
            {usage?.total?.toLocaleString() ?? 0}
          </p>
          <p className="text-[10px] text-muted mt-1">total requests</p>
        </div>
        <div
          className="bg-white rounded-xl border border-border p-5 animate-fadeIn"
          style={{ animationDelay: "200ms" }}
        >
          <p className="text-xs text-muted font-medium">Daily Limit</p>
          <p className="text-2xl font-bold mt-1">
            {usage?.limit === -1 ? "∞" : usage?.limit?.toLocaleString()}
          </p>
          <p className="text-[10px] text-muted mt-1">
            {usage?.role === "VIP" || usage?.role === "ADMIN"
              ? "Unlimited access"
              : "per day"}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl border border-border p-6 animate-fadeIn">
        <div className="flex items-center gap-2 mb-6">
          <FaChartLine size={14} className="text-primary" />
          <h3 className="text-sm font-semibold">Last 7 Days</h3>
        </div>
        <div className="flex items-end gap-3 h-40">
          {usage?.daily?.map((day, i) => {
            const height = maxCount > 0 ? (day.count / maxCount) * 100 : 0;
            const isToday = i === (usage?.daily?.length ?? 0) - 1;
            return (
              <div
                key={i}
                className="flex-1 flex flex-col items-center gap-1.5 group"
              >
                <span className="text-[10px] text-muted font-mono opacity-0 group-hover:opacity-100 transition">
                  {day.count}
                </span>
                <div className="w-full relative">
                  <div
                    className={`w-full rounded-t-lg transition-all duration-500 ${
                      isToday ? "bg-primary" : "bg-primary/40"
                    } group-hover:bg-primary min-h-[4px]`}
                    style={{ height: `${Math.max(height, 3)}%`, minHeight: "4px" }}
                  />
                </div>
                <span
                  className={`text-[9px] ${
                    isToday ? "text-primary font-semibold" : "text-muted"
                  }`}
                >
                  {new Date(day.date).toLocaleDateString("en", {
                    weekday: "short",
                  })}
                </span>
              </div>
            );
          })}
          {(!usage?.daily || usage.daily.length === 0) && (
            <p className="text-sm text-muted w-full text-center py-8">
              No usage data yet.
            </p>
          )}
        </div>
      </div>

      {/* Plan Info */}
      <div className="bg-white rounded-xl border border-border p-5 animate-fadeIn">
        <h3 className="text-sm font-semibold mb-3">Your Plan</h3>
        <div className="flex items-center gap-3">
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full ${
              usage?.role === "VIP"
                ? "bg-warning-light text-warning"
                : usage?.role === "ADMIN"
                ? "bg-danger-light text-danger"
                : "bg-primary-subtle text-primary"
            }`}
          >
            {usage?.role}
          </span>
          <p className="text-sm text-muted">
            {usage?.role === "VIP" || usage?.role === "ADMIN"
              ? "You have unlimited API access."
              : `${usage?.limit?.toLocaleString()} requests per day. Upgrade to VIP for unlimited access.`}
          </p>
        </div>
      </div>
    </div>
  );
}
