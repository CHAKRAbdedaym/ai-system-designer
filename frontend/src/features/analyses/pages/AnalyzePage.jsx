// src/features/analyses/pages/AnalyzePage.jsx
import { useState } from "react";
import { createAnalysis } from "../analysesApi";
import { Link } from "react-router-dom";

export default function AnalyzePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      setMessage({
        type: "error",
        text: "Please provide both a title and a detailed description.",
      });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      await createAnalysis({ title, description });

      setMessage({
        type: "success",
        text: `Your analysis has been submitted successfully.\n\n` +
              `Processing typically takes 30–120 seconds.\n` +
              `You can submit another request right away.\n` +
              `Completed results will appear in your History page.`,
      });

      setTitle("");
      setDescription("");
    } catch (err) {
      setMessage({
        type: "error",
        text: "Failed to submit request. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-16 md:py-24">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
            System Design Analysis
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Describe your system requirements and constraints. Receive a detailed, production-ready architecture proposal including scalability considerations, trade-offs, failure modes, and cost estimates.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="p-8 md:p-12 lg:p-16">
            <form onSubmit={handleSubmit} className="space-y-10">
              {/* Title */}
              <div>
                <label
                  htmlFor="title"
                  className="block text-lg font-medium text-gray-900 mb-3"
                >
                  Title <span className="text-red-600">*</span>
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={loading}
                  placeholder="e.g. Global Video Streaming Platform (10M+ concurrent users)"
                  className="w-full px-5 py-4 border border-gray-300 rounded-xl text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-lg font-medium text-gray-900 mb-3"
                >
                  Detailed Description <span className="text-red-600">*</span>
                </label>
                <textarea
                  id="description"
                  rows={6}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={loading}
                  placeholder="Include: expected scale (users/requests per second), latency/availability targets, budget constraints, preferred technologies, must-have features, known risks or non-negotiables..."
                  className="w-full px-5 py-4 border border-gray-300 rounded-xl text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200 resize-y min-h-[280px] disabled:opacity-60 disabled:cursor-not-allowed"
                  required
                />
                <p className="mt-3 text-sm text-gray-500">
                  The more context you provide, the more precise and valuable the output will be.
                </p>
              </div>

              {/* Submit */}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-5 px-8 text-xl font-semibold rounded-xl transition-all duration-300 ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg active:scale-[0.98]"
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-3">
                      <svg className="animate-spin h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    "Generate Architecture Report"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`mt-12 p-8 rounded-2xl border-l-6 ${
            message.type === "success"
              ? "bg-green-50 border-green-600 text-green-800"
              : "bg-red-50 border-red-600 text-red-800"
          }`}>
            <pre className="whitespace-pre-wrap font-sans text-lg leading-relaxed">
              {message.text}
            </pre>
          </div>
        )}

        {/* Footer note */}
        <p className="mt-16 text-center text-gray-600 text-lg">
          All analyses run asynchronously. View completed results in your{" "}
          <Link to="/history" className="text-blue-600 hover:underline font-medium">
            History
          </Link>.
        </p>
      </div>
    </div>
  );
}