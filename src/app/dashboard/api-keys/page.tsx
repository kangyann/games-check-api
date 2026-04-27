"use client";
import { useEffect, useState } from "react";
import {
  FaPlus,
  FaCopy,
  FaTrash,
  FaCheck,
  FaKey,
  FaXmark,
} from "react-icons/fa6";

interface ApiKeyData {
  id: number;
  key: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  _count: { logs: number };
}

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKeyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [deleteModal, setDeleteModal] = useState<ApiKeyData | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [keyLimit, setKeyLimit] = useState(3);
  const [toast, setToast] = useState("");

  const fetchKeys = () => {
    fetch("/api/user/api-keys")
      .then((r) => r.json())
      .then((d) => {
        if (d.status === 200) { setKeys(d.data); if (d.limit) setKeyLimit(d.limit); }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchKeys();
  }, []);

  const handleCreate = async () => {
    setCreating(true);
    const res = await fetch("/api/user/api-keys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newKeyName || "Default" }),
    });
    const data = await res.json();
    if (data.status === 403) {
      setToast(data.message);
      setTimeout(() => setToast(""), 3000);
    } else {
      setNewKeyName("");
      setShowCreate(false);
    }
    fetchKeys();
    setCreating(false);
  };

  const handleDelete = async () => {
    if (!deleteModal) return;
    setDeleting(true);
    await fetch("/api/user/api-keys", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: deleteModal.id }),
    });
    setDeleteModal(null);
    fetchKeys();
    setDeleting(false);
  };

  const handleCopy = async (key: string, id: number) => {
    await navigator.clipboard.writeText(key);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse-soft">
        <div className="h-10 skeleton rounded-lg w-48" />
        {[1, 2].map((i) => (
          <div key={i} className="h-20 skeleton rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Toast */}
      {toast && <div className="fixed top-4 right-4 z-[100] px-4 py-3 rounded-xl text-sm font-medium shadow-lg animate-fadeIn bg-danger text-white">{toast}</div>}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold">API Keys</h2>
          <p className="text-xs text-muted">
            {keys.length} / {keyLimit} keys used · Generate keys for API authentication.
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          disabled={keys.length >= keyLimit}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-white text-xs font-medium hover:bg-primary-hover transition cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaPlus size={10} /> {keys.length >= keyLimit ? "Limit Reached" : "New Key"}
        </button>
      </div>

      {/* Create Form */}
      {showCreate && (
        <div className="bg-white rounded-xl border border-border p-4 animate-fadeIn">
          <h4 className="text-sm font-medium mb-3">Create New API Key</h4>
          <div className="flex gap-2">
            <input
              type="text"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              placeholder="Key name (e.g. Production)"
              className="flex-1 px-3 py-2 rounded-lg border border-border bg-white text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary-light transition placeholder:text-muted"
            />
            <button
              onClick={handleCreate}
              disabled={creating}
              className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-hover transition disabled:opacity-60 cursor-pointer"
            >
              {creating ? "Creating..." : "Create"}
            </button>
            <button
              onClick={() => setShowCreate(false)}
              className="px-3 py-2 rounded-lg border border-border text-sm hover:bg-surface-hover transition cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Keys Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {keys.map((apiKey, i) => (
          <div
            key={apiKey.id}
            className="bg-white rounded-xl border border-border p-5 animate-fadeIn hover:shadow-sm transition"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="bg-primary-subtle text-primary p-2 rounded-lg">
                  <FaKey size={12} />
                </div>
                <div>
                  <p className="text-sm font-semibold">{apiKey.name}</p>
                  <p className="text-[10px] text-muted">
                    Created{" "}
                    {new Date(apiKey.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  apiKey.isActive
                    ? "bg-success-light text-success"
                    : "bg-danger-light text-danger"
                }`}
              >
                {apiKey.isActive ? "Active" : "Revoked"}
              </span>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <code className="flex-1 text-xs bg-surface px-3 py-2 rounded-lg font-mono text-muted truncate">
                {apiKey.key}
              </code>
              <button
                onClick={() => handleCopy(apiKey.key, apiKey.id)}
                className="flex-shrink-0 p-2 rounded-lg border border-border hover:bg-surface-hover transition cursor-pointer"
                title="Copy"
              >
                {copiedId === apiKey.id ? (
                  <FaCheck size={12} className="text-success" />
                ) : (
                  <FaCopy size={12} className="text-muted" />
                )}
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted">
                {apiKey._count.logs} request{apiKey._count.logs !== 1 ? "s" : ""}
              </span>
              <button
                onClick={() => setDeleteModal(apiKey)}
                className="text-xs text-muted hover:text-danger transition cursor-pointer flex items-center gap-1"
              >
                <FaTrash size={10} /> Revoke
              </button>
            </div>
          </div>
        ))}
        {keys.length === 0 && (
          <div className="text-center py-16 text-sm text-muted bg-white rounded-xl border border-border col-span-full">
            <FaKey size={28} className="mx-auto mb-3 opacity-20" />
            <p className="font-medium">No API keys yet</p>
            <p className="text-xs mt-1">
              Create one to start using the Mylix API.
            </p>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/40 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl animate-fadeIn overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 className="text-sm font-bold">Revoke API Key</h3>
              <button
                onClick={() => setDeleteModal(null)}
                className="text-muted hover:text-foreground transition cursor-pointer"
              >
                <FaXmark size={16} />
              </button>
            </div>
            <div className="px-6 py-4 text-center">
              <div className="w-12 h-12 rounded-full bg-danger-light flex items-center justify-center text-danger mx-auto mb-3">
                <FaTrash size={18} />
              </div>
              <p className="text-sm font-semibold mb-1">
                Revoke &quot;{deleteModal.name}&quot;?
              </p>
              <p className="text-xs text-muted">
                This will permanently delete this API key. Any applications
                using it will stop working.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-border bg-surface">
              <button
                onClick={() => setDeleteModal(null)}
                className="px-4 py-2 rounded-lg text-sm border border-border hover:bg-white transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 rounded-lg bg-danger text-white text-sm font-medium hover:opacity-90 transition cursor-pointer disabled:opacity-60"
              >
                {deleting ? "Revoking..." : "Revoke Key"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
