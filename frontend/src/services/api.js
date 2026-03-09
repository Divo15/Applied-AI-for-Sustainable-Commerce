import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

// ── Module 1 ───────────────────────────────────────────────────────
export const generateCategory = (data) => api.post("/module1/generate", data);
export const getCatalogResults = () => api.get("/module1/results");
export const getCategoryMeta = () => api.get("/module1/meta");

// ── Module 2 ───────────────────────────────────────────────────────
export const generateProposal = (data) => api.post("/module2/generate", data);
export const getProposals = () => api.get("/module2/proposals");

// ── Logs & Health ──────────────────────────────────────────────────
export const getAILogs = () => api.get("/logs");
export const getHealth = () => api.get("/health");
