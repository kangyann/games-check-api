"use client";
import { useEffect, useState } from "react";
import {
  FaCircleCheck,
  FaCircleXmark,
  FaDatabase,
  FaServer,
  FaGlobe,
} from "react-icons/fa6";

interface HealthData {
  server: { status: string; uptime: number };
  database: { status: string; latency: number };
  externalApi: { status: string; latency: number };
}

export default function AdminHealthPage() {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchHealth = () => {
    setLoading(true);
    fetch("/api/admin/health")
      .then((r) => r.json())
      .then((d) => {
        if (d.status === 200) setHealth(d.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse-soft">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 skeleton rounded-xl" />
        ))}
      </div>
    );
  }

  const services = [
    {
      label: "Server",
      icon: FaServer,
      status: health?.server.status || "unknown",
      detail: health?.server.uptime
        ? `Uptime: ${Math.floor(health.server.uptime / 3600)}h ${Math.floor(
            (health.server.uptime % 3600) / 60
          )}m`
        : "—",
    },
    {
      label: "Database (Supabase)",
      icon: FaDatabase,
      status: health?.database.status || "unknown",
      detail: health?.database.latency
        ? `Latency: ${health.database.latency}ms`
        : "—",
    },
    {
      label: "External API (Omegatronik)",
      icon: FaGlobe,
      status: health?.externalApi.status || "unknown",
      detail: health?.externalApi.latency
        ? `Latency: ${health.externalApi.latency}ms`
        : "—",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">System Health</h3>
        <button
          onClick={fetchHealth}
          className="text-xs px-3 py-1.5 rounded-lg bg-primary text-white hover:bg-primary-hover transition cursor-pointer active:scale-95"
        >
          Refresh
        </button>
      </div>

      <div className="grid gap-4">
        {services.map((svc, i) => (
          <div
            key={svc.label}
            className="bg-white rounded-xl border border-border p-5 flex items-center gap-4 animate-fadeIn"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div
              className={`p-3 rounded-lg ${
                svc.status === "healthy"
                  ? "bg-success-light text-success"
                  : "bg-danger-light text-danger"
              }`}
            >
              <svc.icon size={20} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">{svc.label}</p>
              <p className="text-xs text-muted mt-0.5">{svc.detail}</p>
            </div>
            {svc.status === "healthy" ? (
              <FaCircleCheck className="text-success" size={20} />
            ) : (
              <FaCircleXmark className="text-danger" size={20} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
