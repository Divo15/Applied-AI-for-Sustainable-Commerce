import { useState } from "react";
import { generateProposal } from "../services/api";

export default function ProposalGenerator() {
  const [form, setForm] = useState({
    client_name: "",
    industry: "",
    budget: "",
    requirements: "",
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const payload = { ...form, budget: Number(form.budget) };
      const res = await generateProposal(payload);
      setResult(res.data.data);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">
        Module 2: AI B2B Proposal Generator
      </h1>
      <p className="text-gray-500 mb-6">
        Generate sustainable product proposals with budget allocation and impact
        analysis.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ── Input Form ─────────────────────────────────────────── */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-800 mb-4">Client Details</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Client Name *
              </label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                placeholder="e.g. GreenCorp Ltd."
                value={form.client_name}
                onChange={(e) =>
                  setForm({ ...form, client_name: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Industry *
              </label>
              <select
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                value={form.industry}
                onChange={(e) =>
                  setForm({ ...form, industry: e.target.value })
                }
              >
                <option value="">Select industry</option>
                <option>Hospitality</option>
                <option>Retail</option>
                <option>Food & Beverage</option>
                <option>Corporate / Office</option>
                <option>Healthcare</option>
                <option>Education</option>
                <option>E-commerce</option>
                <option>Manufacturing</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Budget (₹) *
              </label>
              <input
                type="number"
                required
                min="1000"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                placeholder="e.g. 50000"
                value={form.budget}
                onChange={(e) =>
                  setForm({ ...form, budget: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Requirements (optional)
              </label>
              <textarea
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                placeholder="Any specific sustainable product needs..."
                value={form.requirements}
                onChange={(e) =>
                  setForm({ ...form, requirements: e.target.value })
                }
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Generating Proposal..." : "📋 Generate B2B Proposal"}
            </button>
          </form>
          {error && (
            <p className="mt-3 text-sm text-red-600 bg-red-50 p-2 rounded">
              {error}
            </p>
          )}
        </div>

        {/* ── Result Display ─────────────────────────────────────── */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-800 mb-4">Proposal Output</h2>
          {result ? (
            <div className="space-y-5">
              {/* Product Mix Table */}
              <div>
                <span className="text-xs font-medium text-gray-500 uppercase">
                  Sustainable Product Mix
                </span>
                <div className="mt-2 overflow-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 text-left">
                        <th className="pb-2 font-medium text-gray-600">
                          Product
                        </th>
                        <th className="pb-2 font-medium text-gray-600">Qty</th>
                        <th className="pb-2 font-medium text-gray-600 text-right">
                          Subtotal
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.product_mix?.map((p, i) => (
                        <tr key={i} className="border-b border-gray-100">
                          <td className="py-2">
                            <p className="font-medium text-gray-800">
                              {p.product_name}
                            </p>
                            <p className="text-xs text-green-600">
                              {p.sustainability_note}
                            </p>
                          </td>
                          <td className="py-2 text-gray-600">{p.quantity}</td>
                          <td className="py-2 text-right text-gray-800">
                            ₹{p.subtotal?.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Budget Allocation */}
              <div>
                <span className="text-xs font-medium text-gray-500 uppercase">
                  Budget Allocation
                </span>
                <div className="mt-2 space-y-2">
                  {result.budget_allocation &&
                    Object.entries(result.budget_allocation)
                      .filter(([key]) => key !== "_id")
                      .map(([key, val]) => (
                        <div key={key} className="flex justify-between text-sm">
                          <span className="text-gray-600 capitalize">
                            {key.replace(/_/g, " ")}
                          </span>
                          <span
                            className={`font-medium ${
                              key === "total"
                                ? "text-primary-700"
                                : "text-gray-800"
                            }`}
                          >
                            ₹{val?.toLocaleString()}
                          </span>
                        </div>
                      ))}
                </div>
              </div>

              {/* Cost Breakdown */}
              <div>
                <span className="text-xs font-medium text-gray-500 uppercase">
                  Cost Breakdown
                </span>
                <div className="mt-2 space-y-1">
                  {result.cost_breakdown &&
                    Object.entries(result.cost_breakdown)
                      .filter(([key]) => key !== "_id")
                      .map(([key, val]) => (
                        <div key={key} className="flex justify-between text-sm">
                          <span className="text-gray-600 capitalize">
                            {key.replace(/_/g, " ")}
                          </span>
                          <span
                            className={`font-medium ${
                              key === "grand_total"
                                ? "text-primary-700 font-bold"
                                : "text-gray-800"
                            }`}
                          >
                            ₹{val?.toLocaleString()}
                          </span>
                        </div>
                      ))}
                </div>
              </div>

              {/* Impact Summary */}
              <div>
                <span className="text-xs font-medium text-gray-500 uppercase">
                  Impact Positioning Summary
                </span>
                <p className="mt-1 text-sm text-gray-700 bg-green-50 p-3 rounded-lg border border-green-100">
                  {result.impact_summary}
                </p>
              </div>

              {/* Raw JSON */}
              <details>
                <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700">
                  View Raw JSON
                </summary>
                <pre className="mt-2 p-3 bg-gray-900 text-green-400 rounded-lg text-xs overflow-auto max-h-64">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </details>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <p className="text-4xl mb-2">📋</p>
              <p>
                Enter client details and click generate to see AI proposal
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
