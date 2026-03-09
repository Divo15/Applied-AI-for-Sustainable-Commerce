import { useState, useEffect } from "react";
import { getAILogs } from "../services/api";

export default function AILogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAILogs()
      .then((r) => setLogs(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">
        AI Prompt & Response Logs
      </h1>
      <p className="text-gray-500 mb-6">
        All AI interactions are logged for transparency and debugging.
      </p>

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : logs.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center text-gray-400">
          <p className="text-4xl mb-2">📝</p>
          <p>No AI logs yet. Generate some results first!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {logs.map((log) => (
            <div
              key={log._id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-medium ${
                      log.status === "success"
                        ? "bg-green-100 text-green-700"
                        : log.status === "fallback"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {log.status}
                  </span>
                  <span className="text-sm font-medium text-gray-700">
                    {log.module}
                  </span>
                  <span className="text-xs text-gray-400">{log.model}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  {log.latency_ms != null && <span>{log.latency_ms}ms</span>}
                  {log.tokens_used > 0 && (
                    <span>{log.tokens_used} tokens</span>
                  )}
                  <span>{new Date(log.createdAt).toLocaleString()}</span>
                </div>
              </div>
              <details>
                <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700">
                  View prompt & response
                </summary>
                <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">
                      Prompt
                    </p>
                    <pre className="p-2 bg-gray-50 rounded text-xs overflow-auto max-h-40 whitespace-pre-wrap">
                      {log.prompt}
                    </pre>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">
                      Response
                    </p>
                    <pre className="p-2 bg-gray-900 text-green-400 rounded text-xs overflow-auto max-h-40 whitespace-pre-wrap">
                      {log.response}
                    </pre>
                  </div>
                </div>
              </details>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
