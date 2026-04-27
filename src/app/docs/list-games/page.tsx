"use client";
import { useEffect } from "react";
import { useOnThisPage } from "@/context/OnThisPage";
import CodeTabs, {
  ApiPlayground,
} from "@/components/organisms/docs/code-tabs";

const anchorLinks = [
  { id: "endpoint", label: "Endpoint" },
  { id: "example-request", label: "Example Request" },
  { id: "example-response", label: "Example Response" },
  { id: "try-it", label: "Try It" },
];

export default function DocsListGames() {
  const { setItems } = useOnThisPage();

  useEffect(() => {
    setItems(anchorLinks);
  }, [setItems]);

  return (
    <div className="space-y-8">
      {/* Endpoint */}
      <section id="endpoint">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded bg-success-light text-success">
            GET
          </span>
          <h2 className="text-xl font-bold">/api/list-games</h2>
        </div>
        <p className="text-sm text-muted">
          Retrieve all available game types. No authentication required.
        </p>
      </section>

      {/* Example Request */}
      <section id="example-request">
        <h3 className="text-lg font-semibold mb-3">Example Request</h3>
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
  .then(data => console.log(data))
  .catch(err => console.error(err))`,
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

      {/* Example Response */}
      <section id="example-response">
        <h3 className="text-lg font-semibold mb-3">Example Response</h3>
        <div className="rounded-lg border border-border overflow-hidden">
          <div className="px-4 py-2 bg-surface border-b border-border flex items-center gap-2">
            <span className="text-[10px] font-bold text-success">200</span>
            <span className="text-xs text-muted">application/json</span>
          </div>
          <pre className="p-4 bg-[#fafafa] text-xs font-mono overflow-x-auto leading-relaxed">
            {JSON.stringify(
              {
                message: "200 - Data successfully retrieved",
                status: 200,
                data: [
                  { name: "Mobile Legends", prefix: "mobile-legends" },
                  { name: "Free Fire", prefix: "free-fire" },
                  { name: "Point Blank", prefix: "point-blank" },
                ],
              },
              null,
              2
            )}
          </pre>
        </div>
      </section>

      {/* Try It */}
      <section id="try-it">
        <h3 className="text-lg font-semibold mb-3">Try It Live</h3>
        <ApiPlayground
          method="GET"
          endpoint="/api/list-games"
          description="Returns the list of supported games."
        />
      </section>
    </div>
  );
}
