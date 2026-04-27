"use client";
import { useEffect, useState } from "react";
import { FaPlus, FaXmark, FaTrash, FaBell, FaCircleInfo, FaTriangleExclamation, FaCircleCheck, FaStar } from "react-icons/fa6";

interface NotifData {
  id: number;
  userId: number | null;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  isGlobal: boolean;
  createdAt: string;
  user: { username: string; email: string } | null;
}

interface UserOption {
  id: number;
  username: string;
  email: string;
}

const typeConfig: Record<string, { icon: any; color: string; bg: string }> = {
  INFO: { icon: FaCircleInfo, color: "text-primary", bg: "bg-primary-subtle" },
  WARNING: { icon: FaTriangleExclamation, color: "text-warning", bg: "bg-warning-light" },
  SUCCESS: { icon: FaCircleCheck, color: "text-success", bg: "bg-success-light" },
  PROMO: { icon: FaStar, color: "text-accent", bg: "bg-accent-light" },
};

export default function AdminNotificationsPage() {
  const [notifs, setNotifs] = useState<NotifData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [typeFilter, setTypeFilter] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<NotifData | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [users, setUsers] = useState<UserOption[]>([]);
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [form, setForm] = useState({ title: "", message: "", type: "INFO", isGlobal: true, userId: "" });

  const fetchNotifs = () => {
    const p = new URLSearchParams();
    if (typeFilter) p.set("type", typeFilter);
    fetch(`/api/admin/notifications?${p}`)
      .then((r) => r.json())
      .then((d) => { if (d.status === 200) setNotifs(d.data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchNotifs(); fetch("/api/admin/users").then(r => r.json()).then(d => { if (d.status === 200) setUsers(d.data); }); }, [typeFilter]);

  const showMsg = (t: string, tx: string) => { setMsg({ type: t, text: tx }); setTimeout(() => setMsg({ type: "", text: "" }), 3000); };

  const handleCreate = async () => {
    if (!form.title || !form.message) { showMsg("error", "Title and message required."); return; }
    setCreating(true);
    const payload: any = { title: form.title, message: form.message, type: form.type, isGlobal: form.isGlobal };
    if (!form.isGlobal && form.userId) payload.userId = parseInt(form.userId);
    const res = await fetch("/api/admin/notifications", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const data = await res.json();
    if (data.status === 201) { showMsg("success", "Notification sent."); setShowCreate(false); setForm({ title: "", message: "", type: "INFO", isGlobal: true, userId: "" }); fetchNotifs(); }
    else showMsg("error", data.message || "Failed.");
    setCreating(false);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    await fetch("/api/admin/notifications", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: deleteTarget.id }) });
    showMsg("success", "Deleted."); setDeleteTarget(null); fetchNotifs(); setDeleting(false);
  };

  if (loading) return <div className="space-y-4 animate-pulse-soft">{[1,2,3].map(i => <div key={i} className="h-20 skeleton rounded-xl" />)}</div>;

  return (
    <div className="space-y-4">
      {msg.text && <div className={`fixed top-4 right-4 z-[100] px-4 py-3 rounded-xl text-sm font-medium shadow-lg animate-fadeIn ${msg.type === "success" ? "bg-success text-white" : "bg-danger text-white"}`}>{msg.text}</div>}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h2 className="text-lg font-bold">Notification Management</h2><p className="text-xs text-muted">Send and manage notifications.</p></div>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-white text-xs font-medium hover:bg-primary-hover transition cursor-pointer active:scale-95"><FaPlus size={10} /> Send Notification</button>
      </div>

      <div className="flex gap-3 items-center">
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="px-3 py-2 rounded-lg border border-border bg-white text-sm outline-none focus:border-primary transition cursor-pointer">
          <option value="">All Types</option><option value="INFO">Info</option><option value="WARNING">Warning</option><option value="SUCCESS">Success</option><option value="PROMO">Promo</option>
        </select>
        <span className="text-xs text-muted">{notifs.length} notification{notifs.length !== 1 ? "s" : ""}</span>
      </div>

      <div className="space-y-3">
        {notifs.map((n, i) => {
          const c = typeConfig[n.type] || typeConfig.INFO; const Icon = c.icon;
          return (
            <div key={n.id} className="bg-white rounded-xl border border-border p-4 animate-fadeIn" style={{ animationDelay: `${i * 30}ms` }}>
              <div className="flex items-start gap-3">
                <div className={`${c.bg} ${c.color} p-2.5 rounded-lg flex-shrink-0`}><Icon size={14} /></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-semibold">{n.title}</p>
                    <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${c.bg} ${c.color}`}>{n.type}</span>
                    {n.isGlobal ? <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-surface text-muted">Global</span> : <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-primary-subtle text-primary">@{n.user?.username || "unknown"}</span>}
                  </div>
                  <p className="text-xs text-muted leading-relaxed">{n.message}</p>
                  <span className="text-[10px] text-muted mt-1 block">{new Date(n.createdAt).toLocaleString()}</span>
                </div>
                <button onClick={() => setDeleteTarget(n)} className="p-1.5 rounded-lg text-muted hover:bg-danger-light hover:text-danger transition cursor-pointer flex-shrink-0"><FaTrash size={12} /></button>
              </div>
            </div>
          );
        })}
        {notifs.length === 0 && <div className="text-center py-16 bg-white rounded-xl border border-border"><FaBell size={28} className="mx-auto mb-3 opacity-20" /><p className="text-sm font-medium text-muted">No notifications yet.</p></div>}
      </div>

      {showCreate && (
        <div className="fixed inset-0 bg-black/40 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl animate-fadeIn overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 className="text-sm font-bold">Send Notification</h3>
              <button onClick={() => setShowCreate(false)} className="text-muted hover:text-foreground transition cursor-pointer"><FaXmark size={16} /></button>
            </div>
            <div className="px-6 py-4 space-y-3">
              <div><label className="block text-xs font-medium text-muted mb-1">Title <span className="text-danger">*</span></label><input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Notification title" className="w-full px-3 py-2 rounded-lg border border-border bg-white text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary-light transition" /></div>
              <div><label className="block text-xs font-medium text-muted mb-1">Message <span className="text-danger">*</span></label><textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Write message..." rows={3} className="w-full px-3 py-2 rounded-lg border border-border bg-white text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary-light transition resize-none" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs font-medium text-muted mb-1">Type</label><select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-border bg-white text-sm outline-none focus:border-primary transition cursor-pointer"><option value="INFO">Info</option><option value="WARNING">Warning</option><option value="SUCCESS">Success</option><option value="PROMO">Promo</option></select></div>
                <div><label className="block text-xs font-medium text-muted mb-1">Target</label><select value={form.isGlobal ? "global" : "user"} onChange={(e) => setForm({ ...form, isGlobal: e.target.value === "global" })} className="w-full px-3 py-2 rounded-lg border border-border bg-white text-sm outline-none focus:border-primary transition cursor-pointer"><option value="global">All Users</option><option value="user">Specific User</option></select></div>
              </div>
              {!form.isGlobal && <div><label className="block text-xs font-medium text-muted mb-1">Select User</label><select value={form.userId} onChange={(e) => setForm({ ...form, userId: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-border bg-white text-sm outline-none focus:border-primary transition cursor-pointer"><option value="">Choose user...</option>{users.map(u => <option key={u.id} value={u.id}>{u.username} ({u.email})</option>)}</select></div>}
            </div>
            <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-border bg-surface">
              <button onClick={() => setShowCreate(false)} className="px-4 py-2 rounded-lg text-sm border border-border hover:bg-white transition cursor-pointer">Cancel</button>
              <button onClick={handleCreate} disabled={creating} className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-hover transition cursor-pointer disabled:opacity-60">{creating ? "Sending..." : "Send"}</button>
            </div>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 bg-black/40 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl animate-fadeIn overflow-hidden">
            <div className="px-6 py-4 text-center"><div className="w-12 h-12 rounded-full bg-danger-light flex items-center justify-center text-danger mx-auto mb-3"><FaTrash size={18} /></div><p className="text-sm font-semibold mb-1">Delete this notification?</p><p className="text-xs text-muted">This cannot be undone.</p></div>
            <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-border bg-surface">
              <button onClick={() => setDeleteTarget(null)} className="px-4 py-2 rounded-lg text-sm border border-border hover:bg-white transition cursor-pointer">Cancel</button>
              <button onClick={handleDelete} disabled={deleting} className="px-4 py-2 rounded-lg bg-danger text-white text-sm font-medium hover:opacity-90 transition cursor-pointer disabled:opacity-60">{deleting ? "Deleting..." : "Delete"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
