"use client";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [user, setUser] = useState<Record<string, any> | null>(null);
  const [form, setForm] = useState({ name: "", email: "", username: "" });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingPw, setSavingPw] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [pwMessage, setPwMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.status === 200) {
          setUser(d.data);
          setForm({
            name: d.data.name || "",
            email: d.data.email,
            username: d.data.username,
          });
        }
        setLoading(false);
      });
  }, []);

  const showMsg = (
    setter: typeof setMessage,
    type: string,
    text: string
  ) => {
    setter({ type, text });
    setTimeout(() => setter({ type: "", text: "" }), 3000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/user/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    showMsg(
      setMessage,
      data.message.includes("success") ? "success" : "error",
      data.message
    );
    setSaving(false);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPw(true);
    const res = await fetch("/api/user/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(passwordForm),
    });
    const data = await res.json();
    const isOk = data.message.includes("success") || data.message.includes("updated");
    showMsg(setPwMessage, isOk ? "success" : "error", data.message);
    if (isOk) setPasswordForm({ currentPassword: "", newPassword: "" });
    setSavingPw(false);
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse-soft">
        <div className="h-48 skeleton rounded-xl" />
        <div className="h-36 skeleton rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold">Profile Settings</h2>
        <p className="text-xs text-muted">Manage your account information.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Info */}
        <div className="bg-white rounded-xl border border-border p-6 animate-fadeIn">
          <h3 className="text-sm font-semibold mb-4">Profile Information</h3>
          {message.text && (
            <div
              className={`mb-4 px-4 py-2 rounded-lg text-sm font-medium animate-fadeIn ${
                message.type === "success"
                  ? "bg-success-light text-success"
                  : "bg-danger-light text-danger"
              }`}
            >
              {message.text}
            </div>
          )}
          <form onSubmit={handleSave} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-muted mb-1">
                Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3.5 py-2 rounded-lg border border-border bg-white text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary-light transition"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1">
                Username
              </label>
              <input
                type="text"
                value={form.username}
                onChange={(e) =>
                  setForm({ ...form, username: e.target.value })
                }
                className="w-full px-3.5 py-2 rounded-lg border border-border bg-white text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary-light transition"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1">
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3.5 py-2 rounded-lg border border-border bg-white text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary-light transition"
              />
            </div>
            <div className="flex items-center gap-3 pt-1">
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-hover transition disabled:opacity-60 cursor-pointer"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  user?.role === "VIP"
                    ? "bg-warning-light text-warning"
                    : user?.role === "ADMIN"
                    ? "bg-danger-light text-danger"
                    : "bg-primary-subtle text-primary"
                }`}
              >
                {user?.role}
              </span>
            </div>
          </form>
        </div>

        {/* Change Password */}
        <div className="bg-white rounded-xl border border-border p-6 animate-fadeIn">
          <h3 className="text-sm font-semibold mb-4">Change Password</h3>
          {pwMessage.text && (
            <div
              className={`mb-4 px-4 py-2 rounded-lg text-sm font-medium animate-fadeIn ${
                pwMessage.type === "success"
                  ? "bg-success-light text-success"
                  : "bg-danger-light text-danger"
              }`}
            >
              {pwMessage.text}
            </div>
          )}
          <form onSubmit={handlePasswordChange} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-muted mb-1">
                Current Password
              </label>
              <input
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    currentPassword: e.target.value,
                  })
                }
                required
                className="w-full px-3.5 py-2 rounded-lg border border-border bg-white text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary-light transition"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1">
                New Password
              </label>
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    newPassword: e.target.value,
                  })
                }
                required
                minLength={6}
                className="w-full px-3.5 py-2 rounded-lg border border-border bg-white text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary-light transition"
              />
            </div>
            <button
              type="submit"
              disabled={savingPw}
              className="px-4 py-2 rounded-lg bg-foreground text-white text-sm font-medium hover:opacity-90 transition disabled:opacity-60 cursor-pointer"
            >
              {savingPw ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
