import { useState } from "react";
import { generateCategory } from "../services/api";

export default function CategoryGenerator() {
  const [form, setForm] = useState({
    product_name: "",
    product_description: "",
    material: "",
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
      const res = await generateCategory(form);
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
        Module 1: AI Auto-Category & Tag Generator
      </h1>
      <p className="text-gray-500 mb-6">
        Enter product details to auto-generate categories, SEO tags, and
        sustainability filters.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ── Input Form ─────────────────────────────────────────── */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-800 mb-4">Product Input</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name *
              </label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                placeholder="e.g. Bamboo Toothbrush Set"
                value={form.product_name}
                onChange={(e) =>
                  setForm({ ...form, product_name: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Description *
              </label>
              <textarea
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                placeholder="Describe the product, its features, and sustainability aspects..."
                value={form.product_description}
                onChange={(e) =>
                  setForm({ ...form, product_description: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Material (optional)
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                placeholder="e.g. Bamboo, Organic Cotton"
                value={form.material}
                onChange={(e) =>
                  setForm({ ...form, material: e.target.value })
                }
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Generating..." : "🏷️ Generate Categories & Tags"}
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
          <h2 className="font-semibold text-gray-800 mb-4">AI Output</h2>
          {result ? (
            <div className="space-y-4">
              <div>
                <span className="text-xs font-medium text-gray-500 uppercase">
                  Primary Category
                </span>
                <p className="text-lg font-semibold text-primary-700">
                  {result.primary_category}
                </p>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-500 uppercase">
                  Sub-Category
                </span>
                <p className="text-gray-800">{result.sub_category}</p>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-500 uppercase">
                  SEO Tags
                </span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {result.seo_tags?.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-500 uppercase">
                  Sustainability Filters
                </span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {result.sustainability_filters?.map((f, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium"
                    >
                      🌿 {f}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-500 uppercase">
                  Confidence
                </span>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div
                    className="bg-primary-500 h-2 rounded-full transition-all"
                    style={{
                      width: `${(result.confidence_score || 0) * 100}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {((result.confidence_score || 0) * 100).toFixed(0)}%
                </p>
              </div>

              {/* Raw JSON */}
              <details className="mt-4">
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
              <p className="text-4xl mb-2">🏷️</p>
              <p>
                Enter product details and click generate to see AI results
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
