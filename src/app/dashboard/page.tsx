"use client";
import { useEffect, useState } from "react";
import { FaKey, FaWaveSquare, FaGauge, FaArrowRight, FaRotate, FaXmark, FaStar } from "react-icons/fa6";
import Link from "next/link";

interface UserStats {
  apiKeysCount: number;
  requestsToday: number;
  rateLimit: { remaining: number; limit: number };
  role: string;
  username: string;
}

export default function DashboardOverview() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showVipPopup, setShowVipPopup] = useState(false);

  const fetchStats = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const res = await fetch("/api/user/stats");
      const d = await res.json();
      if (d.status === 200) {
        setStats(d.data);
        // Show VIP popup for MEMBER role (only first visit per session)
        if (d.data.role === "MEMBER" && !sessionStorage.getItem("vip_popup_shown")) {
          setTimeout(() => setShowVipPopup(true), 1000);
          sessionStorage.setItem("vip_popup_shown", "true");
        }
      }
    } catch {}
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => { fetchStats(); }, []);

  if (loading) return (
    <div className="space-y-6 animate-pulse-soft">
      <div className="h-28 skeleton rounded-xl" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">{[1,2,3].map(i => <div key={i} className="h-28 skeleton rounded-xl" />)}</div>
    </div>
  );

  const usagePercent = stats?.rateLimit.limit && stats.rateLimit.limit > 0 ? Math.min(100, ((stats.rateLimit.limit - stats.rateLimit.remaining) / stats.rateLimit.limit) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* VIP Selling Popup */}
      {showVipPopup && (
        <div className="fixed inset-0 bg-black/40 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl animate-fadeIn overflow-hidden">
            <div className="relative bg-gradient-to-br from-amber-400 via-orange-400 to-rose-400 p-6 text-white text-center">
              <button onClick={() => setShowVipPopup(false)} className="absolute top-3 right-3 text-white/70 hover:text-white transition cursor-pointer"><FaXmark size={16} /></button>
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3 backdrop-blur-sm"><FaStar size={28} /></div>
              <h3 className="text-lg font-bold">Upgrade to VIP</h3>
              <p className="text-sm opacity-90 mt-1">Unlock the full power of Mylix API</p>
            </div>
            <div className="p-6 space-y-3">
              <div className="space-y-2">
                {[
                  "Unlimited API requests per day",
                  "Up to 10 API keys (vs 3 for free)",
                  "Priority support",
                  "No rate limiting",
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm"><span className="w-5 h-5 rounded-full bg-success-light text-success flex items-center justify-center flex-shrink-0 text-[10px] font-bold">✓</span>{f}</div>
                ))}
              </div>
              <div className="pt-2 space-y-2">
                <a href="https://wa.me/6285174099457?text=Halo%20saya%20ingin%20upgrade%20ke%20VIP%20di%20Mylix.app" target="_blank" rel="noopener noreferrer" className="block w-full text-center px-4 py-2.5 rounded-lg bg-gradient-to-r from-amber-400 to-orange-400 text-white text-sm font-semibold hover:opacity-90 transition">Contact for Upgrade</a>
                <button onClick={() => setShowVipPopup(false)} className="block w-full text-center px-4 py-2 rounded-lg text-sm text-muted hover:text-foreground transition cursor-pointer">Maybe later</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Welcome */}
      <div className="bg-gradient-to-br from-primary via-indigo-500 to-accent rounded-xl p-6 text-white animate-fadeIn relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8" />
        <div className="absolute bottom-0 left-1/2 w-24 h-24 bg-white/5 rounded-full translate-y-12" />
        <div className="relative">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold">Welcome back, {stats?.username || "User"} 👋</h2>
            <button onClick={() => fetchStats(true)} disabled={refreshing} className="p-2 rounded-lg bg-white/15 hover:bg-white/25 transition cursor-pointer disabled:opacity-60" title="Refresh"><FaRotate size={12} className={refreshing ? "animate-spin" : ""} /></button>
          </div>
          <p className="text-sm opacity-80">Here&apos;s your API usage overview for today.</p>
          <div className="flex gap-2 mt-4">
            <Link href="/dashboard/api-keys" className="text-xs px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition font-medium backdrop-blur-sm">Manage API Keys</Link>
            <Link href="/docs" className="text-xs px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition font-medium backdrop-blur-sm">View Docs</Link>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/dashboard/api-keys" className="bg-white rounded-xl border border-border p-5 hover:shadow-md hover:border-primary/20 transition group animate-fadeIn" style={{ animationDelay: "100ms" }}>
          <div className="flex items-center justify-between">
            <div><p className="text-xs text-muted font-medium">API Keys</p><p className="text-2xl font-bold mt-1">{stats?.apiKeysCount ?? 0}</p></div>
            <div className="bg-primary-subtle text-primary p-2.5 rounded-lg"><FaKey size={18} /></div>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-muted mt-3 group-hover:text-primary transition">Manage keys <FaArrowRight size={8} /></div>
        </Link>
        <Link href="/dashboard/usage" className="bg-white rounded-xl border border-border p-5 hover:shadow-md hover:border-success/20 transition group animate-fadeIn" style={{ animationDelay: "200ms" }}>
          <div className="flex items-center justify-between">
            <div><p className="text-xs text-muted font-medium">Requests Today</p><p className="text-2xl font-bold mt-1">{stats?.requestsToday ?? 0}</p></div>
            <div className="bg-success-light text-success p-2.5 rounded-lg"><FaWaveSquare size={18} /></div>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-muted mt-3 group-hover:text-success transition">View usage <FaArrowRight size={8} /></div>
        </Link>
        <Link href="/dashboard/usage" className="bg-white rounded-xl border border-border p-5 hover:shadow-md hover:border-warning/20 transition group animate-fadeIn" style={{ animationDelay: "300ms" }}>
          <div className="flex items-center justify-between">
            <div><p className="text-xs text-muted font-medium">Rate Limit</p><p className="text-2xl font-bold mt-1">{stats?.rateLimit.limit === -1 ? "∞" : `${stats?.rateLimit.remaining}/${stats?.rateLimit.limit}`}</p></div>
            <div className="bg-warning-light text-warning p-2.5 rounded-lg"><FaGauge size={18} /></div>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-muted mt-3 group-hover:text-warning transition">View limits <FaArrowRight size={8} /></div>
        </Link>
      </div>

      {/* Usage Bar */}
      {stats?.rateLimit.limit !== -1 && (
        <div className="bg-white rounded-xl border border-border p-5 animate-fadeIn">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold">Daily Usage</h3>
            <span className="text-xs text-muted">{stats?.rateLimit.limit! - stats?.rateLimit.remaining!} / {stats?.rateLimit.limit} requests</span>
          </div>
          <div className="w-full bg-surface rounded-full h-3 overflow-hidden">
            <div className={`h-3 rounded-full transition-all duration-700 ease-out ${usagePercent > 80 ? "bg-danger" : usagePercent > 50 ? "bg-warning" : "bg-primary"}`} style={{ width: `${usagePercent}%` }} />
          </div>
          <p className="text-xs text-muted mt-2">{usagePercent > 80 ? "⚠️ You're approaching your daily limit. Upgrade to VIP for unlimited." : "✅ Usage is within normal range."}</p>
        </div>
      )}

      {stats?.role === "VIP" && (
        <div className="bg-gradient-to-r from-amber-400 to-orange-400 rounded-xl p-5 text-white animate-fadeIn relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-6 translate-x-6" />
          <div className="relative"><p className="text-sm font-bold">⭐ VIP Member</p><p className="text-xs opacity-90 mt-1">You have unlimited API access. Thank you for your support!</p></div>
        </div>
      )}
    </div>
  );
}
