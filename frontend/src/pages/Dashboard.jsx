import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getHealth, getCatalogResults, getProposals } from "../services/api";

export default function Dashboard() {
  const [health, setHealth] = useState(null);
  const [stats, setStats] = useState({ catalogCount: 0, proposalCount: 0 });

  useEffect(() => {
    getHealth()
      .then((r) => setHealth(r.data))
      .catch(() => setHealth({ status: "offline" }));
    getCatalogResults()
      .then((r) =>
        setStats((s) => ({ ...s, catalogCount: r.data.data?.length || 0 }))
      )
      .catch(() => {});
    getProposals()
      .then((r) =>
        setStats((s) => ({ ...s, proposalCount: r.data.data?.length || 0 }))
      )
      .catch(() => {});
  }, []);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Rayeva AI Systems
        </h1>
        <p className="text-gray-500 mt-1">
          AI-Powered Modules for Sustainable Commerce
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Module 1 card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">🏷️</span>
            <h3 className="font-semibold text-gray-800">Module 1</h3>
          </div>
          <p className="text-sm text-gray-500 mb-3">
            Auto-Category & Tag Generator
          </p>
          <p className="text-3xl font-bold text-primary-600">
            {stats.catalogCount}
          </p>
          <p className="text-xs text-gray-400">products categorized</p>
          <Link
            to="/category"
            className="mt-4 inline-block text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Open →
          </Link>
        </div>

        {/* Module 2 card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">📋</span>
            <h3 className="font-semibold text-gray-800">Module 2</h3>
          </div>
          <p className="text-sm text-gray-500 mb-3">B2B Proposal Generator</p>
          <p className="text-3xl font-bold text-primary-600">
            {stats.proposalCount}
          </p>
          <p className="text-xs text-gray-400">proposals generated</p>
          <Link
            to="/proposal"
            className="mt-4 inline-block text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Open →
          </Link>
        </div>

        {/* Health card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">💚</span>
            <h3 className="font-semibold text-gray-800">Server</h3>
          </div>
          <p className="text-sm text-gray-500 mb-3">API Health Status</p>
          <p
            className={`text-lg font-bold ${
              health?.status === "ok" ? "text-green-600" : "text-red-500"
            }`}
          >
            {health
              ? health.status === "ok"
                ? "● Online"
                : "○ Offline"
              : "Checking..."}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {health?.timestamp || ""}
          </p>
        </div>
      </div>

      {/* Architecture Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-800 mb-4">
          Architecture Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-700 mb-2">
              ✅ Fully Implemented
            </h4>
            <ul className="space-y-1 text-gray-600">
              <li>• Module 1: AI Auto-Category & Tag Generator</li>
              <li>• Module 2: AI B2B Proposal Generator</li>
              <li>• Prompt / Response Logging</li>
              <li>• Structured JSON Outputs</li>
            </ul>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-700 mb-2">
              📐 Architecture Outlined
            </h4>
            <ul className="space-y-1 text-gray-600">
              <li>• Module 3: AI Impact Reporting Generator</li>
              <li>• Module 4: AI WhatsApp Support Bot</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
