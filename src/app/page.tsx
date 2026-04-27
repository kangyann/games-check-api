import Image from "next/image";
import LogoIcon from "@/app/icon.png";
import Link from "next/link";

export default function Home(): React.ReactNode {
  return (
    <div className="font-[family-name:var(--font-geist-sans)] bg-white text-foreground">
      <main className="w-full min-h-screen flex flex-col items-center justify-center px-6">
        <div className="flex flex-col items-center text-center animate-fadeIn">
          <Image
            src={LogoIcon}
            alt="mylix_icon"
            width={180}
            height={180}
            draggable={false}
            className="mb-4"
          />
          <div className="flex flex-col max-w-md gap-2">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Games Account{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Validation API
              </span>
            </h1>
            <p className="text-sm text-muted">
              Open Source · Developer Friendly · Free to Use
            </p>
            <div className="flex flex-wrap justify-center items-center gap-2 mt-4">
              <Link
                href="/docs"
                className="text-xs bg-primary text-white px-5 py-2 rounded-lg font-medium hover:bg-primary-hover active:scale-[.95] transition"
              >
                Read Docs
              </Link>
              <Link
                href="/login"
                className="text-xs border border-border text-foreground px-5 py-2 rounded-lg font-medium hover:bg-surface-hover active:scale-[.95] transition"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
