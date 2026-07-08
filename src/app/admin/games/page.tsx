"use client";
import { useEffect, useState, useCallback } from "react";
import {
  FaPlus,
  FaXmark,
  FaPenToSquare,
  FaTrash,
  FaEye,
  FaMagnifyingGlass,
  FaGamepad,
  FaCheck,
  FaCircleInfo,
  FaTriangleExclamation,
  FaArrowRight,
  FaChevronRight,
} from "react-icons/fa6";

interface GameData {
  id: number;
  name: string;
  prefix: string;
  status: boolean;
  userId: boolean;
  serverId: boolean;
  codeGame: string;
  updatedAt: string;
  createdAt?: string; // Optional since API may or may not return it based on SELECT
}

type ModalType = "view" | "edit" | "create" | "delete" | null;
type ModalStep = "form" | "confirm" | null;

export default function AdminGamesPage() {
  const [games, setGames] = useState<GameData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [reqsFilter, setReqsFilter] = useState("all");

  const [selectedGame, setSelectedGame] = useState<GameData | null>(null);
  const [modalType, setModalType] = useState<ModalType>(null);
  const [modalStep, setModalStep] = useState<ModalStep>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Form state
  const [form, setForm] = useState({
    name: "",
    prefix: "",
    codeGame: "",
    status: true,
    userId: true,
    serverId: false,
  });

  const fetchGames = useCallback(() => {
    fetch("/api/admin/games")
      .then((r) => r.json())
      .then((d) => {
        if (d.status === 200) {
          setGames(d.data || []);
        } else {
          showMessage("error", d.message || "Failed to retrieve games.");
        }
        setLoading(false);
      })
      .catch(() => {
        showMessage("error", "Network error. Failed to retrieve games.");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  const showMessage = (type: string, text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 4000);
  };

  const openModal = (type: ModalType, game?: GameData) => {
    setModalType(type);
    if (game) {
      setSelectedGame(game);
      if (type === "edit") {
        setForm({
          name: game.name,
          prefix: game.prefix,
          codeGame: game.codeGame,
          status: game.status,
          userId: game.userId,
          serverId: game.serverId,
        });
        setModalStep("form");
      } else if (type === "delete") {
        setModalStep("confirm"); // Delete has no form step, goes straight to confirmation
      } else if (type === "view") {
        setModalStep(null);
      }
    } else {
      setSelectedGame(null);
      setForm({
        name: "",
        prefix: "",
        codeGame: "",
        status: true,
        userId: true,
        serverId: false,
      });
      setModalStep("form");
    }
  };

  const closeModal = () => {
    setModalType(null);
    setModalStep(null);
    setSelectedGame(null);
  };

  // Switch from form edit/create step to confirmation step
  const handleProceedToConfirmation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.prefix || !form.codeGame) {
      showMessage("error", "Please fill in all required fields.");
      return;
    }
    setModalStep("confirm");
  };

  // Perform actual API actions
  const handleConfirmAction = async () => {
    setActionLoading(true);

    try {
      if (modalType === "create") {
        const res = await fetch("/api/admin/games", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (data.status === 201 || data.status === 200) {
          showMessage("success", `Game "${form.name}" has been successfully added.`);
          closeModal();
          fetchGames();
        } else {
          showMessage("error", data.message || "Failed to add game.");
        }
      } else if (modalType === "edit" && selectedGame) {
        const res = await fetch("/api/admin/games", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: selectedGame.id, data: form }),
        });
        const data = await res.json();
        if (data.status === 200) {
          showMessage("success", `Game "${form.name}" has been successfully updated.`);
          closeModal();
          fetchGames();
        } else {
          showMessage("error", data.message || "Failed to update game.");
        }
      } else if (modalType === "delete" && selectedGame) {
        const res = await fetch("/api/admin/games", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: selectedGame.id }),
        });
        const data = await res.json();
        if (data.status === 200) {
          showMessage("success", `Game "${selectedGame.name}" has been permanently deleted.`);
          closeModal();
          fetchGames();
        } else {
          showMessage("error", data.message || "Failed to delete game.");
        }
      }
    } catch (err) {
      showMessage("error", "An unexpected error occurred. Connection failed.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleStatusQuick = async (game: GameData) => {
    // Optimistic local state update
    setGames((prevGames) =>
      prevGames.map((g) => (g.id === game.id ? { ...g, status: !g.status, updatedAt: new Date().toISOString() } : g))
    );

    try {
      const res = await fetch("/api/admin/games", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: game.id, data: { status: !game.status } }),
      });
      const data = await res.json();
      if (data.status === 200) {
        showMessage("success", `Game "${game.name}" status set to ${!game.status ? "Active" : "Disabled"}.`);
        fetchGames();
      } else {
        showMessage("error", data.message || "Failed to toggle status.");
        fetchGames(); // Revert back
      }
    } catch (err) {
      showMessage("error", "Network error. Failed to toggle status.");
      fetchGames(); // Revert back
    }
  };

  // Filtered list computed on render, sorted by name alphabetically
  const filteredGames = games
    .filter((game) => {
      const matchesSearch =
        game.name.toLowerCase().includes(search.toLowerCase()) ||
        game.codeGame.toLowerCase().includes(search.toLowerCase()) ||
        game.prefix.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && game.status) ||
        (statusFilter === "disabled" && !game.status);

      const matchesReqs =
        reqsFilter === "all" ||
        (reqsFilter === "userId" && game.userId && !game.serverId) ||
        (reqsFilter === "serverId" && game.serverId) ||
        (reqsFilter === "both" && game.userId && game.serverId);

      return matchesSearch && matchesStatus && matchesReqs;
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  // Calculate fields that changed in "edit" mode for confirmation summary screen
  const getChangedFields = () => {
    if (!selectedGame || modalType !== "edit") return [];
    const changes = [];
    if (selectedGame.name !== form.name) {
      changes.push({ label: "Name", old: selectedGame.name, new: form.name });
    }
    if (selectedGame.prefix !== form.prefix) {
      changes.push({ label: "Prefix", old: selectedGame.prefix, new: form.prefix });
    }
    if (selectedGame.codeGame !== form.codeGame) {
      changes.push({ label: "Code Game", old: selectedGame.codeGame, new: form.codeGame });
    }
    if (selectedGame.status !== form.status) {
      changes.push({
        label: "Status",
        old: selectedGame.status ? "Active" : "Disabled",
        new: form.status ? "Active" : "Disabled",
      });
    }
    if (selectedGame.userId !== form.userId) {
      changes.push({
        label: "Requires User ID",
        old: selectedGame.userId ? "Yes" : "No",
        new: form.userId ? "Yes" : "No",
      });
    }
    if (selectedGame.serverId !== form.serverId) {
      changes.push({
        label: "Requires Server ID",
        old: selectedGame.serverId ? "Yes" : "No",
        new: form.serverId ? "Yes" : "No",
      });
    }
    return changes;
  };

  const changedFields = getChangedFields();

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
      {/* Toast Notification */}
      {message.text && (
        <div
          className={`fixed top-4 right-4 z-[100] px-4 py-3 rounded-xl text-sm font-medium shadow-lg animate-fadeIn ${
            message.type === "success" ? "bg-success text-white" : "bg-danger text-white"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold">Games Administration</h3>
          <p className="text-xs text-muted">Manage available game catalogs, code identifiers, and check requirements.</p>
        </div>
        <button
          onClick={() => openModal("create")}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-white text-xs font-medium hover:bg-primary-hover transition cursor-pointer active:scale-95 shadow-sm"
        >
          <FaPlus size={10} /> Add New Game
        </button>
      </div>

      {/* Filters & Tools */}
      <div className="flex flex-wrap gap-3 items-center bg-white rounded-xl border border-border p-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <FaMagnifyingGlass size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search by game name, prefix, or code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 rounded-lg border border-border bg-white text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary-light transition placeholder:text-muted"
          />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-border bg-white text-sm outline-none focus:border-primary transition cursor-pointer"
        >
          <option value="all">All Status</option>
          <option value="active">Active Only</option>
          <option value="disabled">Disabled Only</option>
        </select>

        {/* Requirements Filter */}
        <select
          value={reqsFilter}
          onChange={(e) => setReqsFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-border bg-white text-sm outline-none focus:border-primary transition cursor-pointer"
        >
          <option value="all">All Requirements</option>
          <option value="userId">User ID Only</option>
          <option value="serverId">Server ID Required</option>
          <option value="both">Both User & Server ID</option>
        </select>

        {/* Count Label */}
        <span className="text-xs text-muted ml-auto">
          {filteredGames.length} game{filteredGames.length !== 1 ? "s" : ""} found
        </span>
      </div>

      {/* Game Catalog Table */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted">Game Catalog Details</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted">Prefix</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted">Game Code</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted">Check Config</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted">Status</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted">Last Updated</th>
                <th className="text-right px-5 py-3.5 text-xs font-semibold text-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredGames.map((game, i) => (
                <tr
                  key={game.id}
                  className="border-b border-border-light hover:bg-surface-hover transition animate-fadeIn"
                  style={{ animationDelay: `${i * 30}ms` }}
                >
                  {/* Game Name */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-primary-light flex items-center justify-center text-primary flex-shrink-0">
                        <FaGamepad size={16} />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-foreground">{game.name}</p>
                        <p className="text-[10px] text-muted">ID: #{game.id}</p>
                      </div>
                    </div>
                  </td>

                  {/* Prefix */}
                  <td className="px-5 py-3.5 text-xs font-mono font-medium text-slate-600">
                    <span className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">{game.prefix}</span>
                  </td>

                  {/* Code Game */}
                  <td className="px-5 py-3.5 text-xs font-mono font-semibold text-primary">
                    {game.codeGame}
                  </td>

                  {/* Check Config Indicators */}
                  <td className="px-5 py-3.5">
                    <div className="flex flex-wrap gap-1.5">
                      {game.userId && (
                        <span className="text-[10px] font-medium bg-primary-subtle text-primary px-2 py-0.5 rounded-full">
                          User ID
                        </span>
                      )}
                      {game.serverId && (
                        <span className="text-[10px] font-medium bg-accent-light text-accent px-2 py-0.5 rounded-full">
                          Server ID
                        </span>
                      )}
                      {!game.userId && !game.serverId && (
                        <span className="text-[10px] text-muted font-normal italic">None</span>
                      )}
                    </div>
                  </td>

                  {/* Status Toggle Badge */}
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => handleToggleStatusQuick(game)}
                      className="cursor-pointer group flex items-center"
                      title={game.status ? "Click to deactivate game" : "Click to activate game"}
                    >
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full transition-all duration-200 group-hover:scale-105 ${
                          game.status
                            ? "bg-success-light text-success border border-success/15"
                            : "bg-danger-light text-danger border border-danger/15"
                        }`}
                      >
                        {game.status ? "● Active" : "○ Disabled"}
                      </span>
                    </button>
                  </td>

                  {/* Last Updated */}
                  <td className="px-5 py-3.5 text-xs text-muted">
                    {new Date(game.updatedAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openModal("view", game)}
                        className="p-1.5 rounded-lg text-muted hover:bg-surface-hover hover:text-foreground transition cursor-pointer"
                        title="View Details"
                      >
                        <FaEye size={12} />
                      </button>
                      <button
                        onClick={() => openModal("edit", game)}
                        className="p-1.5 rounded-lg text-muted hover:bg-primary-subtle hover:text-primary transition cursor-pointer"
                        title="Edit Game"
                      >
                        <FaPenToSquare size={12} />
                      </button>
                      <button
                        onClick={() => openModal("delete", game)}
                        className="p-1.5 rounded-lg text-muted hover:bg-danger-light hover:text-danger transition cursor-pointer"
                        title="Delete Game"
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredGames.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-sm text-muted">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <FaGamepad size={28} className="text-slate-300 animate-bounce" />
                      <p className="font-semibold text-slate-400">No Games Found</p>
                      <p className="text-xs text-muted max-w-[280px]">
                        Try refining your search terms or filters, or add a new game configuration.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MODALS ================= */}
      {modalType && (
        <div className="fixed inset-0 bg-black/40 z-[60] flex items-center justify-center p-4 backdrop-blur-xs transition-all animate-fadeIn">
          <div
            className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-fadeIn overflow-hidden border border-slate-100 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4.5 border-b border-border bg-slate-50/50">
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  {modalType === "view" && "Game Specifications"}
                  {modalType === "create" && (modalStep === "form" ? "Add Game Catalog" : "Confirm Game Configuration")}
                  {modalType === "edit" && (modalStep === "form" ? "Modify Game Settings" : "Verify Modified Settings")}
                  {modalType === "delete" && "Confirm Deletion Request"}
                </h3>
                {modalStep && (
                  <div className="flex items-center gap-1 mt-1 text-[10px] font-semibold text-muted uppercase tracking-wider">
                    <span className={modalStep === "form" ? "text-primary" : "text-muted"}>1. Input details</span>
                    <FaChevronRight size={7} />
                    <span className={modalStep === "confirm" ? "text-primary" : "text-muted"}>2. Confirmation</span>
                  </div>
                )}
              </div>
              <button onClick={closeModal} className="text-muted hover:text-foreground transition cursor-pointer p-1 rounded-full hover:bg-slate-100">
                <FaXmark size={15} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-5 overflow-y-auto max-h-[70vh]">
              {/* ==================== VIEW MODAL ==================== */}
              {modalType === "view" && selectedGame && (
                <div className="space-y-5">
                  <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-border">
                    <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center text-primary text-xl flex-shrink-0">
                      <FaGamepad size={22} />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground text-base">{selectedGame.name}</h4>
                      <p className="text-xs text-primary font-mono">{selectedGame.codeGame}</p>
                    </div>
                    <span
                      className={`ml-auto text-[10px] font-bold px-2.5 py-1 rounded-full ${
                        selectedGame.status
                          ? "bg-success-light text-success border border-success/10"
                          : "bg-danger-light text-danger border border-danger/10"
                      }`}
                    >
                      {selectedGame.status ? "Active" : "Disabled"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-surface rounded-lg p-3.5 border border-border-light">
                      <p className="text-[9px] text-muted font-bold uppercase tracking-wider">Prefix URL</p>
                      <p className="text-xs font-mono mt-1 font-semibold text-slate-700 bg-slate-100/80 px-2 py-0.5 rounded w-max">
                        {selectedGame.prefix}
                      </p>
                    </div>

                    <div className="bg-surface rounded-lg p-3.5 border border-border-light">
                      <p className="text-[9px] text-muted font-bold uppercase tracking-wider">Identifier Code</p>
                      <p className="text-xs font-mono mt-1 font-semibold text-slate-700">
                        {selectedGame.codeGame}
                      </p>
                    </div>

                    <div className="bg-surface rounded-lg p-3.5 border border-border-light">
                      <p className="text-[9px] text-muted font-bold uppercase tracking-wider">User ID Validation</p>
                      <p className="text-xs mt-1 font-medium text-slate-800 flex items-center gap-1.5">
                        {selectedGame.userId ? (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-success"></span> Required
                          </>
                        ) : (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span> Disabled
                          </>
                        )}
                      </p>
                    </div>

                    <div className="bg-surface rounded-lg p-3.5 border border-border-light">
                      <p className="text-[9px] text-muted font-bold uppercase tracking-wider">Server ID Validation</p>
                      <p className="text-xs mt-1 font-medium text-slate-800 flex items-center gap-1.5">
                        {selectedGame.serverId ? (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-success"></span> Required
                          </>
                        ) : (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span> Disabled
                          </>
                        )}
                      </p>
                    </div>

                    <div className="bg-surface rounded-lg p-3.5 border border-border-light col-span-2">
                      <p className="text-[9px] text-muted font-bold uppercase tracking-wider">System Metadata</p>
                      <div className="grid grid-cols-2 gap-2 mt-1.5 text-xs text-muted">
                        <div>
                          <span className="block text-[10px]">Created at:</span>
                          <span className="font-medium text-slate-600">
                            {selectedGame.createdAt ? new Date(selectedGame.createdAt).toLocaleString() : "N/A"}
                          </span>
                        </div>
                        <div>
                          <span className="block text-[10px]">Last updated:</span>
                          <span className="font-medium text-slate-600">
                            {new Date(selectedGame.updatedAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ==================== CREATE / EDIT: FORM STEP ==================== */}
              {(modalType === "create" || modalType === "edit") && modalStep === "form" && (
                <form onSubmit={handleProceedToConfirmation} className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                      Game Catalog Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Mobile Legends: Bang Bang"
                      required
                      className="w-full px-3 py-2 rounded-lg border border-border bg-white text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary-light transition"
                    />
                  </div>

                  {/* Prefix & CodeGame */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                        Prefix Code <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        value={form.prefix}
                        onChange={(e) => setForm({ ...form, prefix: e.target.value.toLowerCase().replace(/\s+/g, "-") })}
                        placeholder="e.g. mlbb"
                        required
                        className="w-full px-3 py-2 rounded-lg border border-border bg-white text-sm font-mono outline-none focus:border-primary focus:ring-2 focus:ring-primary-light transition"
                      />
                      <span className="text-[10px] text-muted mt-1 block">Used for url parameters.</span>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                        Game Check Code <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        value={form.codeGame}
                        onChange={(e) => setForm({ ...form, codeGame: e.target.value.toLowerCase().replace(/\s+/g, "") })}
                        placeholder="e.g. mobilelegends"
                        required
                        className="w-full px-3 py-2 rounded-lg border border-border bg-white text-sm font-mono outline-none focus:border-primary focus:ring-2 focus:ring-primary-light transition"
                      />
                      <span className="text-[10px] text-muted mt-1 block">API identifier endpoint.</span>
                    </div>
                  </div>

                  {/* Toggle Configurations */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-border space-y-3">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Validation Settings</p>

                    {/* Require User ID */}
                    <label className="flex items-center justify-between cursor-pointer py-1">
                      <div>
                        <p className="text-xs font-semibold text-slate-700">Require User ID Input</p>
                        <p className="text-[10px] text-muted">Transaction checker will ask for game user account ID.</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={form.userId}
                        onChange={(e) => setForm({ ...form, userId: e.target.checked })}
                        className="w-4 h-4 rounded text-primary focus:ring-primary cursor-pointer"
                      />
                    </label>

                    {/* Require Server ID */}
                    <label className="flex items-center justify-between cursor-pointer py-1 border-t border-slate-200/60 pt-2">
                      <div>
                        <p className="text-xs font-semibold text-slate-700">Require Server ID Input</p>
                        <p className="text-[10px] text-muted">Ask for server code inputs (e.g. MLBB server ID zone).</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={form.serverId}
                        onChange={(e) => setForm({ ...form, serverId: e.target.checked })}
                        className="w-4 h-4 rounded text-primary focus:ring-primary cursor-pointer"
                      />
                    </label>
                  </div>

                  {/* Status Toggle */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Game Catalog Status</label>
                    <select
                      value={form.status ? "active" : "disabled"}
                      onChange={(e) => setForm({ ...form, status: e.target.value === "active" })}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-white text-sm outline-none focus:border-primary transition cursor-pointer"
                    >
                      <option value="active">Active (Visible in API Checks & Transactions)</option>
                      <option value="disabled">Disabled (API Requests blocked)</option>
                    </select>
                  </div>
                </form>
              )}

              {/* ==================== CREATE: CONFIRMATION STEP ==================== */}
              {modalType === "create" && modalStep === "confirm" && (
                <div className="space-y-4">
                  <div className="bg-primary-subtle text-primary p-4 rounded-xl border border-primary/20 flex items-start gap-3">
                    <FaCircleInfo size={16} className="mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-bold">Review Game Addition Request</p>
                      <p className="text-[11px] opacity-90 mt-0.5">
                        Please review the details below. Once confirmed, this game will be registered immediately and available for transaction queries.
                      </p>
                    </div>
                  </div>

                  {/* Detail Panel */}
                  <div className="border border-border rounded-xl overflow-hidden divide-y divide-border">
                    <div className="grid grid-cols-3 text-xs p-3">
                      <span className="font-semibold text-slate-500">Game Name</span>
                      <span className="col-span-2 font-bold text-foreground">{form.name}</span>
                    </div>
                    <div className="grid grid-cols-3 text-xs p-3">
                      <span className="font-semibold text-slate-500">URL Prefix</span>
                      <span className="col-span-2 font-mono font-medium text-slate-700 bg-slate-100 w-max px-1.5 py-0.5 rounded">
                        {form.prefix}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 text-xs p-3">
                      <span className="font-semibold text-slate-500">Game Code</span>
                      <span className="col-span-2 font-mono font-bold text-primary">{form.codeGame}</span>
                    </div>
                    <div className="grid grid-cols-3 text-xs p-3">
                      <span className="font-semibold text-slate-500">User ID Input</span>
                      <span className="col-span-2 font-medium text-slate-700">
                        {form.userId ? "Required" : "Optional / Disabled"}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 text-xs p-3">
                      <span className="font-semibold text-slate-500">Server ID Input</span>
                      <span className="col-span-2 font-medium text-slate-700">
                        {form.serverId ? "Required" : "Optional / Disabled"}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 text-xs p-3">
                      <span className="font-semibold text-slate-500">Status</span>
                      <span className="col-span-2">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            form.status ? "bg-success-light text-success" : "bg-danger-light text-danger"
                          }`}
                        >
                          {form.status ? "Active" : "Disabled"}
                        </span>
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-muted text-center italic">
                    Double-check configuration inputs before proceeding to compile in production.
                  </p>
                </div>
              )}

              {/* ==================== EDIT: CONFIRMATION STEP ==================== */}
              {modalType === "edit" && modalStep === "confirm" && (
                <div className="space-y-4">
                  <div className="bg-warning-light text-warning p-4 rounded-xl border border-warning/20 flex items-start gap-3">
                    <FaCircleInfo size={16} className="mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-bold">Review Modified Catalog Settings</p>
                      <p className="text-[11px] opacity-90 mt-0.5">
                        Verify the properties that will be modified. Old records and current transactions tied to this game id will be impacted.
                      </p>
                    </div>
                  </div>

                  {changedFields.length > 0 ? (
                    <div className="border border-border rounded-xl overflow-hidden">
                      <table className="w-full text-xs text-left">
                        <thead>
                          <tr className="bg-slate-50 border-b border-border text-muted font-bold">
                            <th className="p-3">Field</th>
                            <th className="p-3">Before</th>
                            <th className="p-3">After</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {changedFields.map((change, idx) => (
                            <tr key={idx} className="hover:bg-slate-50">
                              <td className="p-3 font-semibold text-slate-600">{change.label}</td>
                              <td className="p-3 text-danger font-medium line-through decoration-danger/40">
                                {change.old}
                              </td>
                              <td className="p-3 text-success font-bold flex items-center gap-1">
                                <FaArrowRight size={8} className="text-muted" />
                                {change.new}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="p-6 bg-slate-50 border border-border rounded-xl text-center">
                      <FaCheck size={18} className="text-success mx-auto mb-2" />
                      <p className="text-xs font-bold text-slate-600">No Changes Detected</p>
                      <p className="text-[10px] text-muted mt-1">
                        The properties are identical to the current configuration.
                      </p>
                    </div>
                  )}

                  <p className="text-[11px] text-muted text-center italic">
                    Changes will update database tables and take effect immediately.
                  </p>
                </div>
              )}

              {/* ==================== DELETE: CONFIRMATION STEP ==================== */}
              {modalType === "delete" && selectedGame && (
                <div className="text-center py-3">
                  <div className="w-12 h-12 rounded-full bg-danger-light flex items-center justify-center text-danger mx-auto mb-3.5 border border-danger/10 animate-bounce">
                    <FaTriangleExclamation size={20} />
                  </div>
                  <h4 className="text-sm font-bold text-foreground mb-1.5">
                    Permanently Delete &apos;{selectedGame.name}&apos;?
                  </h4>
                  <p className="text-xs text-muted max-w-sm mx-auto leading-relaxed">
                    You are requesting to remove this game configuration.
                  </p>

                  <div className="my-4 bg-danger-light/50 border border-danger-light text-danger p-3.5 rounded-xl text-left text-xs max-w-md mx-auto space-y-1.5">
                    <p className="font-semibold flex items-center gap-1.5">
                      <FaCircleInfo size={12} /> Warning Details:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-slate-700 text-[11px]">
                      <li>API endpoints for checking this game will immediately throw a 404 error.</li>
                      <li>Any transaction history records referencing this game will be decoupled or deleted.</li>
                      <li>This action is <strong className="text-danger underline animate-pulse">irreversible</strong>.</li>
                    </ul>
                  </div>

                  <div className="text-left bg-slate-50 border border-border p-3 rounded-lg max-w-xs mx-auto text-[11px] font-mono text-muted space-y-0.5">
                    <p>Catalog ID: {selectedGame.id}</p>
                    <p>Prefix: {selectedGame.prefix}</p>
                    <p>Identifier Code: {selectedGame.codeGame}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-border bg-slate-50/50">
              {/* Left back button (if in confirm step for Form modals) */}
              {modalStep === "confirm" && modalType !== "delete" && (
                <button
                  onClick={() => setModalStep("form")}
                  disabled={actionLoading}
                  className="mr-auto px-4 py-2 rounded-lg text-sm border border-border bg-white text-slate-700 hover:bg-slate-50 transition cursor-pointer font-medium disabled:opacity-60"
                >
                  Back to Edit
                </button>
              )}

              {/* Close / Cancel Button */}
              <button
                onClick={closeModal}
                disabled={actionLoading}
                className="px-4 py-2 rounded-lg text-sm border border-border bg-white text-slate-700 hover:bg-slate-50 transition cursor-pointer font-medium disabled:opacity-60"
              >
                {modalType === "view" ? "Close" : "Cancel"}
              </button>

              {/* Form submit transition button */}
              {(modalType === "create" || modalType === "edit") && modalStep === "form" && (
                <button
                  onClick={handleProceedToConfirmation}
                  className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition cursor-pointer shadow-sm shadow-primary/10 active:scale-95"
                >
                  Continue to Confirm
                </button>
              )}

              {/* Final Confirm: Create */}
              {modalType === "create" && modalStep === "confirm" && (
                <button
                  onClick={handleConfirmAction}
                  disabled={actionLoading}
                  className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition cursor-pointer shadow-sm disabled:opacity-60 flex items-center gap-1.5"
                >
                  {actionLoading ? "Saving game..." : "Yes, Add Game"}
                </button>
              )}

              {/* Final Confirm: Edit */}
              {modalType === "edit" && modalStep === "confirm" && (
                <button
                  onClick={handleConfirmAction}
                  disabled={actionLoading || changedFields.length === 0}
                  className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition cursor-pointer shadow-sm disabled:opacity-60 flex items-center gap-1.5"
                >
                  {actionLoading ? "Applying..." : "Yes, Apply Changes"}
                </button>
              )}

              {/* Final Confirm: Delete */}
              {modalType === "delete" && (
                <button
                  onClick={handleConfirmAction}
                  disabled={actionLoading}
                  className="px-4 py-2 rounded-lg bg-danger text-white text-sm font-semibold hover:bg-danger/95 transition cursor-pointer shadow-sm disabled:opacity-60"
                >
                  {actionLoading ? "Deauthorizing..." : "Yes, Delete Game"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
