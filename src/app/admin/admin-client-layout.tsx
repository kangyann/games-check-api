"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import LogoIcon from "@/app/icon.png";
import { usePathname, useRouter } from "next/navigation";
import {
  FaChartBar, FaUsers, FaWaveSquare, FaHeartPulse,
  FaBars, FaXmark, FaRightFromBracket, FaBell, FaReceipt,
} from "react-icons/fa6";

const sidebarLinks = [
  { href: "/admin", label: "Overview", icon: FaChartBar },
  { href: "/admin/users", label: "Users", icon: FaUsers },
  { href: "/admin/monitoring", label: "Monitoring", icon: FaWaveSquare },
  { href: "/admin/notifications", label: "Notifications", icon: FaBell },
  { href: "/admin/transactions", label: "Transactions", icon: FaReceipt },
  { href: "/admin/health", label: "Health", icon: FaHeartPulse },
];

export default function AdminClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<Record<string, any> | null>(null);

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(d => { if (d.status === 200) setUser(d.data); });
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <div className="font-[family-name:var(--font-geist-sans)] flex min-h-screen bg-surface text-foreground">
      {sidebarOpen && <div className="fixed inset-0 bg-black/20 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      <aside className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-[260px] bg-white border-r border-border flex flex-col transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-border">
          <Image src={LogoIcon} alt="Mylix" width={28} height={28} />
          <div><h1 className="text-sm font-bold text-foreground leading-none">Mylix Admin</h1><span className="text-[10px] text-muted">Dashboard</span></div>
          <button className="ml-auto lg:hidden text-muted hover:text-foreground cursor-pointer" onClick={() => setSidebarOpen(false)}><FaXmark size={18} /></button>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href;
            return (<Link key={link.href} href={link.href} onClick={() => setSidebarOpen(false)} className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition ${isActive ? "bg-primary-subtle text-primary font-semibold" : "text-muted hover:bg-surface-hover hover:text-foreground"}`}><link.icon size={16} />{link.label}</Link>);
          })}
        </nav>
        <div className="p-3 border-t border-border">
          <div className="flex items-center gap-2.5 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center text-primary text-xs font-bold">{user?.username?.[0]?.toUpperCase() || "A"}</div>
            <div className="flex-1 min-w-0"><p className="text-sm font-medium truncate">{user?.username || "Admin"}</p><p className="text-[10px] text-muted truncate">{user?.email || ""}</p></div>
            <button onClick={handleLogout} className="text-muted hover:text-danger transition cursor-pointer" title="Logout"><FaRightFromBracket size={14} /></button>
          </div>
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-sm border-b border-border px-6 py-3 flex items-center gap-3">
          <button className="lg:hidden text-muted hover:text-foreground cursor-pointer" onClick={() => setSidebarOpen(true)}><FaBars size={18} /></button>
          <h2 className="text-sm font-semibold text-foreground">{sidebarLinks.find((l) => l.href === pathname)?.label || "Admin"}</h2>
        </header>
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
