"use client";
import React, { useState } from "react";
import data from "@/data/pages/docs/data.json";
import Link from "next/link";
import Image from "next/image";
import LogoIcon from "@/app/icon.png";
import { DocscLayoutClient } from "./layout-client";
import { OnThisPageProvider } from "@/context/OnThisPage";
import { FaXmark, FaBars } from "react-icons/fa6";
import { usePathname } from "next/navigation";

export default function DocsClientLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [MenuHandle, setMenuHandle] = useState<boolean>(false);
  const pathname = usePathname();

  const isActive = (to: string) => pathname === to;

  return (
    <React.Fragment>
      <main className="font-[family-name:var(--font-geist-sans)] relative bg-white text-foreground min-h-screen">
        {/* Mobile Menu Overlay */}
        {MenuHandle && (
          <div
            className="fixed inset-0 bg-black/20 z-40 lg:hidden"
            onClick={() => setMenuHandle(false)}
          />
        )}
        <div
          className={`fixed top-0 left-0 h-full w-[280px] z-50 bg-white border-r border-border transform transition-transform duration-300 lg:hidden ${
            MenuHandle ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <span className="text-sm font-bold">Documentation</span>
              <button
                onClick={() => setMenuHandle(false)}
                className="text-muted hover:text-foreground cursor-pointer"
              >
                <FaXmark size={16} />
              </button>
            </div>
            <nav className="flex flex-col mt-4 gap-1 text-sm">
              {data["sidebar-link"].map(
                (value: Record<string, any>, index: number) => (
                  <React.Fragment key={`m-${value.alt}-${index}`}>
                    {!value.to && (
                      <span className="text-[10px] font-semibold text-muted uppercase tracking-wider mt-3 mb-1 px-2">
                        {value.title}
                      </span>
                    )}
                    {value.to && (
                      <Link
                        href={value.to}
                        className={`px-3 py-2 rounded-lg text-sm transition ${
                          isActive(value.to)
                            ? "bg-primary-subtle text-primary font-semibold"
                            : "hover:bg-surface-hover hover:text-foreground text-muted"
                        }`}
                        onClick={() => setMenuHandle(false)}
                      >
                        {value.title}
                      </Link>
                    )}
                    {value.data && (
                      <div className="flex flex-col gap-0.5 ml-2">
                        {value.data.map(
                          (item: Record<string, any>, idx: number) => (
                            <Link
                              key={`m-${item.alt}-${idx}`}
                              href={item.to}
                              onClick={() => setMenuHandle(false)}
                              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition ${
                                isActive(item.to)
                                  ? "bg-primary-subtle text-primary font-semibold"
                                  : "hover:bg-surface-hover text-muted"
                              }`}
                            >
                              <span
                                className={`text-[10px] font-bold font-mono px-1.5 py-0.5 rounded ${
                                  item.type.includes("GET")
                                    ? "bg-success-light text-success"
                                    : "bg-warning-light text-warning"
                                }`}
                              >
                                {item.type.replace(/[\[\] ]/g, "")}
                              </span>
                              <span>{item.text}</span>
                            </Link>
                          )
                        )}
                      </div>
                    )}
                  </React.Fragment>
                )
              )}
            </nav>
          </div>
        </div>

        {/* Sticky Header */}
        <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-sm border-b border-border">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <button
                className="lg:hidden text-muted hover:text-foreground cursor-pointer"
                onClick={() => setMenuHandle(true)}
              >
                <FaBars size={16} />
              </button>
              <Link href="/" className="flex items-center gap-2">
                <Image src={LogoIcon} alt="Mylix" width={24} height={24} />
                <span className="text-sm font-bold text-primary">
                  {data.title}
                </span>
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="text-xs text-muted hover:text-foreground transition px-2 py-1"
              >
                Login
              </Link>
              <a
                href={data["contact-us"].to}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs bg-primary text-white px-3 py-1.5 rounded-lg hover:bg-primary-hover active:scale-[.95] transition font-medium"
              >
                {data["contact-us"].title}
              </a>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="container flex mx-auto relative">
          {/* Desktop Sidebar */}
          <div className="flex-shrink-0 w-[220px] min-h-screen z-10 xl:block lg:block hidden border-r border-border-light">
            <nav className="sticky left-0 top-14 w-full px-4 py-4 text-sm flex flex-col gap-0.5">
              {data["sidebar-link"].map(
                (value: Record<string, any>, index: number) => (
                  <React.Fragment key={`d-${value.alt}-${index}`}>
                    {!value.to && (
                      <span className="text-[10px] font-semibold text-muted uppercase tracking-wider mt-4 mb-1 px-2">
                        {value.title}
                      </span>
                    )}
                    {value.to && (
                      <Link
                        href={value.to}
                        className={`px-3 py-1.5 rounded-lg transition ${
                          isActive(value.to)
                            ? "bg-primary-subtle text-primary font-semibold"
                            : "hover:bg-surface-hover hover:text-foreground text-muted"
                        }`}
                      >
                        {value.title}
                      </Link>
                    )}
                    {value.data && (
                      <div className="flex flex-col gap-0.5 ml-2">
                        {value.data.map(
                          (item: Record<string, any>, idx: number) => (
                            <Link
                              key={`d-${item.alt}-${idx}`}
                              href={item.to}
                              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition ${
                                isActive(item.to)
                                  ? "bg-primary-subtle text-primary font-semibold"
                                  : "hover:bg-surface-hover text-muted"
                              }`}
                            >
                              <span
                                className={`text-[10px] font-bold font-mono px-1.5 py-0.5 rounded ${
                                  item.type.includes("GET")
                                    ? "bg-success-light text-success"
                                    : "bg-warning-light text-warning"
                                }`}
                              >
                                {item.type.replace(/[\[\] ]/g, "")}
                              </span>
                              <span>{item.text}</span>
                            </Link>
                          )
                        )}
                      </div>
                    )}
                  </React.Fragment>
                )
              )}
            </nav>
          </div>

          {/* Content + On This Page */}
          <OnThisPageProvider>
            <article className="relative flex-1 p-6 pb-16 min-w-0">
              {children}
            </article>
            {/* On This Page - narrower */}
            <section className="flex-shrink-0 w-[160px] border-l border-border-light min-h-screen xl:block lg:block hidden">
              <DocscLayoutClient />
            </section>
          </OnThisPageProvider>
        </div>

        {/* Footer */}
        <footer className="border-t border-border py-4 text-center text-xs text-muted font-[family-name:var(--font-geist-mono)]">
          <p
            dangerouslySetInnerHTML={{ __html: data.footer.desc }}
            className="inline"
          />{" "}
          <a
            href={data.footer.to}
            className="text-primary hover:underline"
          >
            {data.footer.author}
          </a>
        </footer>
      </main>
    </React.Fragment>
  );
}
