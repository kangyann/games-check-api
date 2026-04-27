"use client";
import { useEffect, useState } from "react";
import { useOnThisPage } from "@/context/OnThisPage";
import CodeTabs, {
  ApiPlayground,
} from "@/components/organisms/docs/code-tabs";
import { ListGames } from "@/data/list-games";
import Link from "next/link";

const anchorLinks = [
  { id: "endpoint", label: "Endpoint" },
  { id: "authentication", label: "Authentication" },
  { id: "parameters", label: "Parameters" },
  { id: "example-request", label: "Example Request" },
  { id: "example-response", label: "Example Response" },
  { id: "try-it", label: "Try It" },
];

export default function DocsCheckUserGame() {
  const { setItems } = useOnThisPage();
  const [selectedGame, setSelectedGame] = useState("mobile-legends");

  useEffect(() => {
    setItems(anchorLinks);
  }, [setItems]);

  return (
    <div className="space-y-8">
      {/* Endpoint */}
      <section id="endpoint">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded bg-warning-light text-warning">
            POST
          </span>
          <h2 className="text-xl font-bold">/api/check-games</h2>
        </div>
        <p className="text-sm text-muted">
          Validate a game user account by User ID and Server ID. <strong>Requires API Key.</strong>
        </p>
      </section>

      {/* Authentication */}
      <section id="authentication">
        <h3 className="text-lg font-semibold mb-3">Authentication</h3>
        <div className="rounded-lg border border-border overflow-hidden">
          <div className="px-4 py-2 bg-surface border-b border-border text-xs font-semibold text-muted">Required Header</div>
          <div className="p-4 bg-[#fafafa]">
            <code className="text-xs font-mono">x-api-key: <span className="text-primary">YOUR_API_KEY</span></code>
          </div>
        </div>
        <p className="text-xs text-muted mt-2">
          Get your API key from the <Link href="/dashboard/api-keys" className="text-primary hover:underline font-medium">Dashboard → API Keys</Link> page.
          Free members get 1000 requests/day. VIP members have unlimited access.
        </p>
      </section>

      {/* Parameters */}
      <section id="parameters">
        <h3 className="text-lg font-semibold mb-3">Parameters</h3>

        {/* Query Params */}
        <div className="mb-4">
          <h4 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">
            Query Parameters
          </h4>
          <div className="rounded-lg border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface border-b border-border">
                  <th className="text-left px-4 py-2 text-xs font-semibold text-muted">
                    Name
                  </th>
                  <th className="text-left px-4 py-2 text-xs font-semibold text-muted">
                    Type
                  </th>
                  <th className="text-left px-4 py-2 text-xs font-semibold text-muted">
                    Required
                  </th>
                  <th className="text-left px-4 py-2 text-xs font-semibold text-muted">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-2 text-xs">
                    <code className="bg-surface px-1.5 py-0.5 rounded font-mono">
                      type
                    </code>
                  </td>
                  <td className="px-4 py-2 text-xs text-muted">string</td>
                  <td className="px-4 py-2 text-xs">
                    <span className="text-danger font-semibold">Yes</span>
                  </td>
                  <td className="px-4 py-2 text-xs text-muted">
                    Game type from{" "}
                    <Link
                      href="/docs/list-games"
                      className="text-primary hover:underline"
                    >
                      /api/list-games
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Body Params */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h4 className="text-xs font-semibold text-muted uppercase tracking-wider">
              Request Body
            </h4>
            <select
              value={selectedGame}
              onChange={(e) => setSelectedGame(e.target.value)}
              className="text-xs px-2 py-1 rounded border border-border bg-white cursor-pointer outline-none focus:border-primary transition"
            >
              {ListGames.map((g) => (
                <option key={g.prefix} value={g.prefix}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>
          <div className="rounded-lg border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface border-b border-border">
                  <th className="text-left px-4 py-2 text-xs font-semibold text-muted">
                    Name
                  </th>
                  <th className="text-left px-4 py-2 text-xs font-semibold text-muted">
                    Type
                  </th>
                  <th className="text-left px-4 py-2 text-xs font-semibold text-muted">
                    Required
                  </th>
                  <th className="text-left px-4 py-2 text-xs font-semibold text-muted">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border-light">
                  <td className="px-4 py-2 text-xs">
                    <code className="bg-surface px-1.5 py-0.5 rounded font-mono">
                      userId
                    </code>
                  </td>
                  <td className="px-4 py-2 text-xs text-muted">string</td>
                  <td className="px-4 py-2 text-xs">
                    <span className="text-danger font-semibold">Yes</span>
                  </td>
                  <td className="px-4 py-2 text-xs text-muted">
                    Game user ID
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-xs">
                    <code className="bg-surface px-1.5 py-0.5 rounded font-mono">
                      serverId
                    </code>
                  </td>
                  <td className="px-4 py-2 text-xs text-muted">string</td>
                  <td className="px-4 py-2 text-xs">
                    <span className="text-muted">
                      {selectedGame === "mobile-legends" ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-xs text-muted">
                    Zone/Server ID
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Example Request */}
      <section id="example-request">
        <h3 className="text-lg font-semibold mb-3">Example Request</h3>
        <CodeTabs
          tabs={[
            {
              label: "cURL",
              language: "bash",
              code: `curl -X POST 'https://mylix.app/api/check-games?type=${selectedGame}' \\
  -H 'Content-Type: application/json' \\
  -H 'x-api-key: YOUR_API_KEY' \\
  -d '{"userId": "123456789", "serverId": "1234"}'`,
            },
            {
              label: "JavaScript",
              language: "javascript",
              code: `fetch('https://mylix.app/api/check-games?type=${selectedGame}', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'YOUR_API_KEY'
  },
  body: JSON.stringify({
    userId: '123456789',
    serverId: '1234'
  })
})
  .then(res => res.json())
  .then(data => console.log(data))`,
            },
            {
              label: "Python",
              language: "python",
              code: `import requests

response = requests.post(
    'https://mylix.app/api/check-games?type=${selectedGame}',
    headers={'x-api-key': 'YOUR_API_KEY'},
    json={"userId": "123456789", "serverId": "1234"}
)
print(response.json())`,
            },
          ]}
        />
      </section>

      {/* Example Response */}
      <section id="example-response">
        <h3 className="text-lg font-semibold mb-3">Example Response</h3>
        <div className="space-y-3">
          {/* Success */}
          <div className="rounded-lg border border-border overflow-hidden">
            <div className="px-4 py-2 bg-surface border-b border-border flex items-center gap-2">
              <span className="text-[10px] font-bold text-success">200</span>
              <span className="text-xs text-muted">Success</span>
            </div>
            <pre className="p-4 bg-[#fafafa] text-xs font-mono overflow-x-auto leading-relaxed">
              {JSON.stringify(
                {
                  status: 200,
                  message: "Data successfully retrieved",
                  data: { username: "kangyann.", country: "Indonesia" },
                },
                null,
                2
              )}
            </pre>
          </div>
          {/* Error */}
          <div className="rounded-lg border border-border overflow-hidden">
            <div className="px-4 py-2 bg-surface border-b border-border flex items-center gap-2">
              <span className="text-[10px] font-bold text-danger">404</span>
              <span className="text-xs text-muted">Not Found</span>
            </div>
            <pre className="p-4 bg-[#fafafa] text-xs font-mono overflow-x-auto leading-relaxed">
              {JSON.stringify(
                {
                  status: 404,
                  message: "Not found user with this userId: 123456789",
                },
                null,
                2
              )}
            </pre>
          </div>
        </div>
      </section>

      {/* Try It */}
      <section id="try-it">
        <h3 className="text-lg font-semibold mb-3">Try It Live</h3>
        <ApiPlayground
          method="POST"
          endpoint={`/api/check-games?type=${selectedGame}`}
          description={`Test check-games with ${selectedGame}`}
          requiresApiKey
          fields={[
            {
              name: "userId",
              label: "User ID",
              placeholder: "123456789",
              required: true,
            },
            {
              name: "serverId",
              label: "Zone / Server ID",
              placeholder: "1234",
              required: selectedGame === "mobile-legends",
            },
          ]}
          defaultBody={JSON.stringify(
            { userId: "123456789", serverId: "1234" },
            null,
            2
          )}
        />
      </section>
    </div>
  );
}
