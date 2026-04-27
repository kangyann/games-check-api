"use client";
import { useEffect, useState, useCallback } from "react";
import {
  FaPlus,
  FaXmark,
  FaPenToSquare,
  FaTrash,
  FaEye,
  FaMagnifyingGlass,
} from "react-icons/fa6";

interface UserData {
  id: number;
  username: string;
  email: string;
  name: string | null;
  role: string;
  isActive: boolean;
  createdAt: string;
  _count: { apiKeys: number };
}

type ModalType = "view" | "edit" | "create" | "delete" | null;

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [modalType, setModalType] = useState<ModalType>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Form state for create/edit
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    role: "MEMBER",
    isActive: true,
  });

  const fetchUsers = useCallback(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (roleFilter) params.set("role", roleFilter);

    fetch(`/api/admin/users?${params}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.status === 200) setUsers(d.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [search, roleFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const showMessage = (type: string, text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const openModal = (type: ModalType, user?: UserData) => {
    setModalType(type);
    if (user) {
      setSelectedUser(user);
      if (type === "edit") {
        setForm({
          name: user.name || "",
          username: user.username,
          email: user.email,
          password: "",
          role: user.role,
          isActive: user.isActive,
        });
      }
    } else {
      setSelectedUser(null);
      setForm({
        name: "",
        username: "",
        email: "",
        password: "",
        role: "MEMBER",
        isActive: true,
      });
    }
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedUser(null);
    setForm({
      name: "",
      username: "",
      email: "",
      password: "",
      role: "MEMBER",
      isActive: true,
    });
  };

  const handleCreate = async () => {
    if (!form.email || !form.username || !form.password) {
      showMessage("error", "Email, username and password are required.");
      return;
    }
    setActionLoading(true);
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (data.status === 201 || data.status === 200) {
      showMessage("success", "User created successfully.");
      closeModal();
      fetchUsers();
    } else {
      showMessage("error", data.message || "Failed to create user.");
    }
    setActionLoading(false);
  };

  const handleUpdate = async () => {
    if (!selectedUser) return;
    setActionLoading(true);
    const payload: Record<string, any> = {
      userId: selectedUser.id,
      name: form.name,
      username: form.username,
      email: form.email,
      role: form.role,
      isActive: form.isActive,
    };
    if (form.password) payload.password = form.password;

    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (data.status === 200) {
      showMessage("success", "User updated successfully.");
      closeModal();
      fetchUsers();
    } else {
      showMessage("error", data.message || "Failed to update user.");
    }
    setActionLoading(false);
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    setActionLoading(true);
    const res = await fetch("/api/admin/users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: selectedUser.id }),
    });
    const data = await res.json();
    if (data.status === 200) {
      showMessage("success", "User deleted successfully.");
      closeModal();
      fetchUsers();
    } else {
      showMessage("error", data.message || "Failed to delete user.");
    }
    setActionLoading(false);
  };

  const handleToggleActive = async (user: UserData) => {
    await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, isActive: !user.isActive }),
    });
    fetchUsers();
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse-soft">
        <div className="h-10 skeleton rounded-lg w-72" />
        <div className="h-64 skeleton rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Toast */}
      {message.text && (
        <div
          className={`fixed top-4 right-4 z-[100] px-4 py-3 rounded-xl text-sm font-medium shadow-lg animate-fadeIn ${
            message.type === "success"
              ? "bg-success text-white"
              : "bg-danger text-white"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold">User Management</h3>
          <p className="text-xs text-muted">
            Manage all registered users, roles, and access.
          </p>
        </div>
        <button
          onClick={() => openModal("create")}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-white text-xs font-medium hover:bg-primary-hover transition cursor-pointer active:scale-95"
        >
          <FaPlus size={10} /> Add User
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center bg-white rounded-xl border border-border p-3">
        <div className="relative flex-1 min-w-[200px]">
          <FaMagnifyingGlass
            size={12}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            type="text"
            placeholder="Search by username or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 rounded-lg border border-border bg-white text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary-light transition placeholder:text-muted"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-border bg-white text-sm outline-none focus:border-primary transition cursor-pointer"
        >
          <option value="">All Roles</option>
          <option value="ADMIN">Admin</option>
          <option value="MEMBER">Member</option>
          <option value="VIP">VIP</option>
        </select>
        <span className="text-xs text-muted">
          {users.length} user{users.length !== 1 ? "s" : ""} found
        </span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface">
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted">
                  User
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted">
                  Role
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted">
                  API Keys
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted">
                  Status
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted">
                  Joined
                </th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, i) => (
                <tr
                  key={user.id}
                  className="border-b border-border-light hover:bg-surface-hover transition animate-fadeIn"
                  style={{ animationDelay: `${i * 30}ms` }}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center text-primary text-xs font-bold flex-shrink-0">
                        {user.username[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{user.username}</p>
                        <p className="text-xs text-muted">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
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
                  </td>
                  <td className="px-4 py-3 text-xs text-muted">
                    {user._count.apiKeys}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleToggleActive(user)}
                      className="cursor-pointer"
                      title={user.isActive ? "Click to disable" : "Click to enable"}
                    >
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full transition hover:opacity-80 ${
                          user.isActive
                            ? "bg-success-light text-success"
                            : "bg-danger-light text-danger"
                        }`}
                      >
                        {user.isActive ? "Active" : "Disabled"}
                      </span>
                    </button>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openModal("view", user)}
                        className="p-1.5 rounded-lg text-muted hover:bg-surface-hover hover:text-foreground transition cursor-pointer"
                        title="View"
                      >
                        <FaEye size={12} />
                      </button>
                      <button
                        onClick={() => openModal("edit", user)}
                        className="p-1.5 rounded-lg text-muted hover:bg-primary-subtle hover:text-primary transition cursor-pointer"
                        title="Edit"
                      >
                        <FaPenToSquare size={12} />
                      </button>
                      <button
                        onClick={() => openModal("delete", user)}
                        className="p-1.5 rounded-lg text-muted hover:bg-danger-light hover:text-danger transition cursor-pointer"
                        title="Delete"
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-12 text-sm text-muted"
                  >
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===== MODALS ===== */}
      {modalType && (
        <div className="fixed inset-0 bg-black/40 z-[60] flex items-center justify-center p-4">
          <div
            className="bg-white rounded-2xl w-full max-w-md shadow-xl animate-fadeIn overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 className="text-sm font-bold">
                {modalType === "view" && "User Details"}
                {modalType === "edit" && "Edit User"}
                {modalType === "create" && "Create New User"}
                {modalType === "delete" && "Delete User"}
              </h3>
              <button
                onClick={closeModal}
                className="text-muted hover:text-foreground transition cursor-pointer"
              >
                <FaXmark size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-4">
              {/* VIEW */}
              {modalType === "view" && selectedUser && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary-light flex items-center justify-center text-primary text-lg font-bold">
                      {selectedUser.username[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold">
                        {selectedUser.name || selectedUser.username}
                      </p>
                      <p className="text-xs text-muted">
                        @{selectedUser.username}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-surface rounded-lg p-3">
                      <p className="text-[10px] text-muted font-semibold uppercase">
                        Email
                      </p>
                      <p className="text-xs mt-0.5 truncate">
                        {selectedUser.email}
                      </p>
                    </div>
                    <div className="bg-surface rounded-lg p-3">
                      <p className="text-[10px] text-muted font-semibold uppercase">
                        Role
                      </p>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full mt-0.5 inline-block ${
                          selectedUser.role === "ADMIN"
                            ? "bg-danger-light text-danger"
                            : selectedUser.role === "VIP"
                            ? "bg-warning-light text-warning"
                            : "bg-primary-subtle text-primary"
                        }`}
                      >
                        {selectedUser.role}
                      </span>
                    </div>
                    <div className="bg-surface rounded-lg p-3">
                      <p className="text-[10px] text-muted font-semibold uppercase">
                        Status
                      </p>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full mt-0.5 inline-block ${
                          selectedUser.isActive
                            ? "bg-success-light text-success"
                            : "bg-danger-light text-danger"
                        }`}
                      >
                        {selectedUser.isActive ? "Active" : "Disabled"}
                      </span>
                    </div>
                    <div className="bg-surface rounded-lg p-3">
                      <p className="text-[10px] text-muted font-semibold uppercase">
                        API Keys
                      </p>
                      <p className="text-xs mt-0.5">
                        {selectedUser._count.apiKeys}
                      </p>
                    </div>
                    <div className="bg-surface rounded-lg p-3 col-span-2">
                      <p className="text-[10px] text-muted font-semibold uppercase">
                        Joined
                      </p>
                      <p className="text-xs mt-0.5">
                        {new Date(selectedUser.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* CREATE / EDIT */}
              {(modalType === "create" || modalType === "edit") && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-muted mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      placeholder="John Doe"
                      className="w-full px-3 py-2 rounded-lg border border-border bg-white text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary-light transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted mb-1">
                      Username <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.username}
                      onChange={(e) =>
                        setForm({ ...form, username: e.target.value })
                      }
                      placeholder="johndoe"
                      required
                      className="w-full px-3 py-2 rounded-lg border border-border bg-white text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary-light transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted mb-1">
                      Email <span className="text-danger">*</span>
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      placeholder="you@example.com"
                      required
                      className="w-full px-3 py-2 rounded-lg border border-border bg-white text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary-light transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted mb-1">
                      Password{" "}
                      {modalType === "create" ? (
                        <span className="text-danger">*</span>
                      ) : (
                        <span className="text-muted font-normal">
                          (leave blank to keep current)
                        </span>
                      )}
                    </label>
                    <input
                      type="password"
                      value={form.password}
                      onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                      }
                      placeholder={
                        modalType === "edit"
                          ? "••••••••"
                          : "Min. 6 characters"
                      }
                      required={modalType === "create"}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-white text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary-light transition"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-muted mb-1">
                        Role
                      </label>
                      <select
                        value={form.role}
                        onChange={(e) =>
                          setForm({ ...form, role: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-border bg-white text-sm outline-none focus:border-primary transition cursor-pointer"
                      >
                        <option value="MEMBER">Member</option>
                        <option value="VIP">VIP</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted mb-1">
                        Status
                      </label>
                      <select
                        value={form.isActive ? "active" : "disabled"}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            isActive: e.target.value === "active",
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-border bg-white text-sm outline-none focus:border-primary transition cursor-pointer"
                      >
                        <option value="active">Active</option>
                        <option value="disabled">Disabled</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* DELETE */}
              {modalType === "delete" && selectedUser && (
                <div className="text-center py-2">
                  <div className="w-12 h-12 rounded-full bg-danger-light flex items-center justify-center text-danger mx-auto mb-3">
                    <FaTrash size={18} />
                  </div>
                  <p className="text-sm font-semibold mb-1">
                    Delete {selectedUser.username}?
                  </p>
                  <p className="text-xs text-muted">
                    This action cannot be undone. All associated data including
                    API keys and sessions will be permanently removed.
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-border bg-surface">
              <button
                onClick={closeModal}
                className="px-4 py-2 rounded-lg text-sm border border-border hover:bg-white transition cursor-pointer"
              >
                {modalType === "view" ? "Close" : "Cancel"}
              </button>
              {modalType === "create" && (
                <button
                  onClick={handleCreate}
                  disabled={actionLoading}
                  className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-hover transition cursor-pointer disabled:opacity-60"
                >
                  {actionLoading ? "Creating..." : "Create User"}
                </button>
              )}
              {modalType === "edit" && (
                <button
                  onClick={handleUpdate}
                  disabled={actionLoading}
                  className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-hover transition cursor-pointer disabled:opacity-60"
                >
                  {actionLoading ? "Saving..." : "Save Changes"}
                </button>
              )}
              {modalType === "delete" && (
                <button
                  onClick={handleDelete}
                  disabled={actionLoading}
                  className="px-4 py-2 rounded-lg bg-danger text-white text-sm font-medium hover:opacity-90 transition cursor-pointer disabled:opacity-60"
                >
                  {actionLoading ? "Deleting..." : "Delete User"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
