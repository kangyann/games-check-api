"use client";
import { useEffect } from "react";
import { useOnThisPage } from "@/context/OnThisPage";
import CodeTabs, {
  ApiPlayground,
} from "@/components/organisms/docs/code-tabs";
import { FaRocket, FaCode, FaShieldHalved, FaBolt } from "react-icons/fa6";

const anchorLinks = [
  { id: "getting-started", label: "Introduction" },
  { id: "features", label: "Features" },
  { id: "quick-start", label: "Quick Start" },
  { id: "try-it", label: "Try It" },
];

export default function Docs() {
  const { setItems } = useOnThisPage();

  useEffect(() => {
    setItems(anchorLinks);
  }, [setItems]);

  return (
    <div className="space-y-8">
      {/* Intro */}
      <section id="getting-started">
        <h2 className="text-xl font-bold mb-2">Getting Started</h2>
        <p className="text-sm text-muted leading-relaxed">
          The Mylix Games API lets you validate game user accounts instantly.
          Free, fast, and developer-friendly.
        </p>
      </section>

      {/* Features */}
      <section id="features">
        <h3 className="text-lg font-semibold mb-3">Features</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            {
              icon: FaBolt,
              title: "Real-Time Validation",
              desc: "Instantly verify game accounts with live data.",
              color: "text-warning",
              bg: "bg-warning-light",
            },
            {
              icon: FaCode,
              title: "Developer Friendly",
              desc: "Simple JSON responses, RESTful design.",
              color: "text-primary",
              bg: "bg-primary-subtle",
            },
            {
              icon: FaRocket,
              title: "Fast & Reliable",
              desc: "Low latency with real-time game data.",
              color: "text-success",
              bg: "bg-success-light",
            },
            {
              icon: FaShieldHalved,
              title: "Supports JSON",
              desc: "All responses in standard JSON format.",
              color: "text-accent",
              bg: "bg-accent-light",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="flex items-start gap-3 p-3 rounded-lg border border-border-light hover:border-border transition"
            >
              <div className={`${f.bg} ${f.color} p-2 rounded-lg flex-shrink-0`}>
                <f.icon size={14} />
              </div>
              <div>
                <p className="text-sm font-semibold">{f.title}</p>
                <p className="text-xs text-muted mt-0.5">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Start */}
      <section id="quick-start">
        <h3 className="text-lg font-semibold mb-3">Quick Start</h3>
        <p className="text-sm text-muted mb-3">
          Use any HTTP client to make requests:
        </p>
        <CodeTabs
          tabs={[
            {
              label: "cURL",
              language: "bash",
              code: `curl https://mylix.app/api/list-games`,
            },
            {
              label: "JavaScript",
              language: "javascript",
              code: `fetch('https://mylix.app/api/list-games')
  .then(res => res.json())
  .then(data => console.log(data))`,
            },
            {
              label: "Python",
              language: "python",
              code: `import requests

response = requests.get('https://mylix.app/api/list-games')
print(response.json())`,
            },
          ]}
        />
      </section>

      {/* Try It */}
      <section id="try-it">
        <h3 className="text-lg font-semibold mb-3">Try It Live</h3>
        <p className="text-sm text-muted mb-3">
          Test the API right here — no setup needed.
        </p>
        <ApiPlayground
          method="GET"
          endpoint="/api/list-games"
          description="Retrieve all available game types."
        />
      </section>
    </div>
  );
}