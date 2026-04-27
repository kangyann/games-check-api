"use client";
import { useState } from "react";
import { FaCopy, FaCheck, FaPlay, FaKey } from "react-icons/fa6";

interface CodeTabsProps {
  tabs: { label: string; language: string; code: string }[];
}

export default function CodeTabs({ tabs }: CodeTabsProps) {
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(tabs[active].code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-lg border border-border overflow-hidden my-3">
      {/* Tab Header */}
      <div className="flex items-center justify-between bg-surface border-b border-border px-1">
        <div className="flex">
          {tabs.map((tab, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`px-3 py-2 text-xs font-medium transition cursor-pointer ${
                active === i
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-xs text-muted hover:text-foreground transition px-2 py-1 cursor-pointer"
        >
          {copied ? (
            <>
              <FaCheck size={10} className="text-success" /> Copied
            </>
          ) : (
            <>
              <FaCopy size={10} /> Copy
            </>
          )}
        </button>
      </div>
      {/* Code Content */}
      <div className="p-4 bg-[#fafafa] overflow-x-auto">
        <pre className="text-xs font-mono whitespace-pre-wrap leading-relaxed">
          {tabs[active].code}
        </pre>
      </div>
    </div>
  );
}

interface PlaygroundField {
  name: string;
  label: string;
  placeholder: string;
  required?: boolean;
}

interface ApiPlaygroundProps {
  method: string;
  endpoint: string;
  defaultBody?: string;
  description?: string;
  requiresApiKey?: boolean;
  fields?: PlaygroundField[];
}

export function ApiPlayground({
  method,
  endpoint,
  defaultBody,
  description,
  requiresApiKey,
  fields,
}: ApiPlaygroundProps) {
  const [body, setBody] = useState(defaultBody || "");
  const [apiKey, setApiKey] = useState("");
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [fieldValues, setFieldValues] = useState<Record<string, string>>(() => {
    if (!fields) return {};
    const init: Record<string, string> = {};
    fields.forEach((f) => (init[f.name] = ""));
    // Pre-fill from defaultBody if available
    if (defaultBody) {
      try {
        const parsed = JSON.parse(defaultBody);
        fields.forEach((f) => {
          if (parsed[f.name]) init[f.name] = parsed[f.name];
        });
      } catch {}
    }
    return init;
  });

  const handleRun = async () => {
    if (requiresApiKey && !apiKey.trim()) {
      setResponse(
        JSON.stringify(
          { error: "Please enter your API key above before testing." },
          null,
          2
        )
      );
      return;
    }

    setLoading(true);
    setResponse("");
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (requiresApiKey && apiKey.trim()) {
        headers["x-api-key"] = apiKey.trim();
      }
      const config: RequestInit = { method, headers };
      if (method === "POST") {
        // Build body from fields or raw textarea
        const requestBody = fields
          ? JSON.stringify(
              Object.fromEntries(
                Object.entries(fieldValues).filter(([, v]) => v !== "")
              )
            )
          : body;
        if (requestBody) config.body = requestBody;
      }
      const res = await fetch(endpoint, config);
      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));
    } catch (err) {
      setResponse(JSON.stringify({ error: "Failed to fetch." }, null, 2));
    }
    setLoading(false);
  };

  return (
    <div className="rounded-lg border border-border overflow-hidden my-3">
      <div className="flex items-center justify-between bg-surface px-4 py-2.5 border-b border-border">
        <div className="flex items-center gap-2">
          <span
            className={`text-[10px] font-bold font-mono px-1.5 py-0.5 rounded ${
              method === "GET"
                ? "bg-success-light text-success"
                : "bg-warning-light text-warning"
            }`}
          >
            {method}
          </span>
          <code className="text-xs font-mono text-muted">{endpoint}</code>
        </div>
        <button
          onClick={handleRun}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-primary text-white text-xs font-medium hover:bg-primary-hover transition cursor-pointer disabled:opacity-60 active:scale-95"
        >
          <FaPlay size={8} />
          {loading ? "Running..." : "Try It"}
        </button>
      </div>
      {description && (
        <div className="px-4 py-2 text-xs text-muted bg-white border-b border-border-light">
          {description}
        </div>
      )}
      {/* API Key Input */}
      {requiresApiKey && (
        <div className="border-b border-border">
          <div className="px-4 py-1.5 text-[10px] font-semibold text-muted bg-surface flex items-center gap-1.5">
            <FaKey size={8} /> API Key
          </div>
          <div className="px-4 py-3 bg-white">
            <input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="mlx_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              className="w-full px-3 py-2 rounded-lg border border-border bg-[#fafafa] text-xs font-mono outline-none focus:border-primary focus:ring-2 focus:ring-primary-light transition placeholder:text-muted/50"
            />
            <p className="text-[10px] text-muted mt-1.5">
              Get your key from{" "}
              <a
                href="/dashboard/api-keys"
                className="text-primary hover:underline font-medium"
              >
                Dashboard → API Keys
              </a>
            </p>
          </div>
        </div>
      )}
      {/* Field Inputs */}
      {method === "POST" && fields && (
        <div className="border-b border-border">
          <div className="px-4 py-1.5 text-[10px] font-semibold text-muted bg-surface">
            Request Body
          </div>
          <div className="px-4 py-3 bg-white space-y-2.5">
            {fields.map((field) => (
              <div key={field.name}>
                <label className="flex items-center gap-1 text-[10px] font-medium text-muted mb-1">
                  {field.label}
                  {field.required && (
                    <span className="text-danger">*</span>
                  )}
                </label>
                <input
                  type="text"
                  value={fieldValues[field.name] || ""}
                  onChange={(e) =>
                    setFieldValues({
                      ...fieldValues,
                      [field.name]: e.target.value,
                    })
                  }
                  placeholder={field.placeholder}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-[#fafafa] text-xs font-mono outline-none focus:border-primary focus:ring-2 focus:ring-primary-light transition placeholder:text-muted/50"
                />
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Raw Body Textarea (fallback when no fields) */}
      {method === "POST" && !fields && (
        <div className="border-b border-border">
          <div className="px-4 py-1.5 text-[10px] font-semibold text-muted bg-surface">
            Request Body
          </div>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full p-4 text-xs font-mono bg-[#fafafa] outline-none resize-none min-h-[80px]"
            placeholder='{ "userId": "123456", "serverId": "1234" }'
          />
        </div>
      )}
      {response && (
        <div>
          <div className="px-4 py-1.5 text-[10px] font-semibold text-muted bg-surface border-t border-border">
            Response
          </div>
          <pre className="p-4 text-xs font-mono bg-[#fafafa] overflow-x-auto whitespace-pre-wrap leading-relaxed text-foreground">
            {response}
          </pre>
        </div>
      )}
    </div>
  );
}

