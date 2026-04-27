"use client";
import { useEffect, useState } from "react";

interface LogEntry {
  id: number;
  endpoint: string;
  method: string;
  status: number;
  ip: string | null;
  createdAt: string;
  apiKey: { name: string; user: { username: string } } | null;
}

export default function AdminMonitoringPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [endpointFilter, setEndpointFilter] = useState("");

  useEffect(() => {
    const params = new URLSearchParams();
    if (endpointFilter) params.set("endpoint", endpointFilter);

    fetch(`/api/admin/monitoring?${params}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.status === 200) setLogs(d.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [endpointFilter]);

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse-soft">
        <div className="h-10 skeleton rounded-lg w-72" />
        <div className="h-96 skeleton rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <select
          value={endpointFilter}
          onChange={(e) => setEndpointFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-border bg-white text-sm outline-none focus:border-primary transition cursor-pointer"
        >
          <option value="">All Endpoints</option>
          <option value="/api/check-games">Check Games</option>
          <option value="/api/list-games">List Games</option>
        </select>
        <span className="text-xs text-muted ml-auto">
          {logs.length} log{logs.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Logs */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface">
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted">
                  Time
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted">
                  Method
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted">
                  Endpoint
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted">
                  Status
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted">
                  User
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted">
                  IP
                </th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr
                  key={log.id}
                  className="border-b border-border-light hover:bg-surface-hover transition"
                >
                  <td className="px-4 py-3 text-xs text-muted font-mono">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-[10px] font-bold font-mono px-1.5 py-0.5 rounded ${
                        log.method === "GET"
                          ? "bg-success-light text-success"
                          : "bg-warning-light text-warning"
                      }`}
                    >
                      {log.method}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs font-mono truncate max-w-[200px]">
                    {log.endpoint}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs font-semibold ${
                        log.status < 400 ? "text-success" : "text-danger"
                      }`}
                    >
                      {log.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted">
                    {log.apiKey?.user?.username || "—"}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted font-mono">
                    {log.ip || "—"}
                  </td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-8 text-sm text-muted"
                  >
                    No logs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
