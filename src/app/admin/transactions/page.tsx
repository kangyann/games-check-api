"use client";
import { useEffect, useState } from "react";
import { FaCircleCheck, FaClock, FaCircleXmark, FaReceipt } from "react-icons/fa6";

interface TransactionData {
  id: number;
  nickname: string;
  targetId: string;
  serverId: string;
  status: string;
  createdAt: string;
  ListGames: { name: string; prefix: string };
}

interface Stats { total: number; success: number; pending: number; failed: number; }

export default function AdminTransactionsPage() {
  const [txs, setTxs] = useState<TransactionData[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    const p = new URLSearchParams();
    if (statusFilter) p.set("status", statusFilter);
    fetch(`/api/admin/transactions?${p}`)
      .then(r => r.json())
      .then(d => { if (d.status === 200) { setTxs(d.data); setStats(d.stats); } setLoading(false); })
      .catch(() => setLoading(false));
  }, [statusFilter]);

  const statusStyle: Record<string, { color: string; bg: string; icon: any }> = {
    SUCCESS: { color: "text-success", bg: "bg-success-light", icon: FaCircleCheck },
    PENDING: { color: "text-warning", bg: "bg-warning-light", icon: FaClock },
    FAILED: { color: "text-danger", bg: "bg-danger-light", icon: FaCircleXmark },
  };

  if (loading) return <div className="space-y-4 animate-pulse-soft"><div className="grid grid-cols-4 gap-4">{[1,2,3,4].map(i=><div key={i} className="h-24 skeleton rounded-xl"/>)}</div><div className="h-64 skeleton rounded-xl"/></div>;

  return (
    <div className="space-y-4">
      <div><h2 className="text-lg font-bold">Transaction History</h2><p className="text-xs text-muted">All game check transactions.</p></div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total", value: stats?.total ?? 0, color: "text-foreground", bg: "bg-surface" },
          { label: "Success", value: stats?.success ?? 0, color: "text-success", bg: "bg-success-light" },
          { label: "Pending", value: stats?.pending ?? 0, color: "text-warning", bg: "bg-warning-light" },
          { label: "Failed", value: stats?.failed ?? 0, color: "text-danger", bg: "bg-danger-light" },
        ].map((s, i) => (
          <div key={s.label} className="bg-white rounded-xl border border-border p-4 animate-fadeIn" style={{ animationDelay: `${i*60}ms` }}>
            <p className="text-xs text-muted font-medium">{s.label}</p>
            <p className={`text-xl font-bold mt-1 ${s.color}`}>{s.value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-3 items-center">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 rounded-lg border border-border bg-white text-sm outline-none focus:border-primary transition cursor-pointer">
          <option value="">All Status</option><option value="SUCCESS">Success</option><option value="PENDING">Pending</option><option value="FAILED">Failed</option>
        </select>
        <span className="text-xs text-muted">{txs.length} transaction{txs.length !== 1 ? "s" : ""}</span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border bg-surface">
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted">ID</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted">Game</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted">Target</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted">Nickname</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted">Status</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted">Date</th>
            </tr></thead>
            <tbody>
              {txs.map((tx, i) => {
                const st = statusStyle[tx.status] || statusStyle.PENDING;
                const Icon = st.icon;
                return (
                  <tr key={tx.id} className="border-b border-border-light hover:bg-surface-hover transition animate-fadeIn" style={{ animationDelay: `${i*20}ms` }}>
                    <td className="px-4 py-3 text-xs font-mono text-muted">#{tx.id}</td>
                    <td className="px-4 py-3"><span className="text-xs font-medium">{tx.ListGames.name}</span></td>
                    <td className="px-4 py-3 text-xs font-mono">{tx.targetId}{tx.serverId ? ` (${tx.serverId})` : ""}</td>
                    <td className="px-4 py-3 text-xs">{tx.nickname || "—"}</td>
                    <td className="px-4 py-3"><span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${st.bg} ${st.color}`}><Icon size={10} />{tx.status}</span></td>
                    <td className="px-4 py-3 text-xs text-muted">{new Date(tx.createdAt).toLocaleString()}</td>
                  </tr>
                );
              })}
              {txs.length === 0 && <tr><td colSpan={6} className="text-center py-12 text-sm text-muted"><FaReceipt size={24} className="mx-auto mb-2 opacity-20" />No transactions found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
