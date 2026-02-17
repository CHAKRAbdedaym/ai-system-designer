// src/features/analyses/pages/HistoryPage.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyAnalyses } from "../analysesApi";

export default function HistoryPage() {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalyses = async () => {
      try {
        const res = await getMyAnalyses();
        setAnalyses(res.data);
      } catch (err) {
        setError("Failed to load your analyses. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalyses();
  }, []);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-primary-900 mb-8">Your History</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card animate-pulse h-48"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto text-center py-16">
        <div className="message-error inline-block max-w-md">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold text-primary-900 mb-8 text-center md:text-left">
        Your Analysis History
      </h1>

      {analyses.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-card border border-neutral-200">
          <p className="text-xl text-gray-600 mb-6">
            You haven't created any analyses yet.
          </p>
          <Link to="/analyze">
            <button className="btn-primary text-lg px-10 py-4">
              Start Your First Analysis
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {analyses.map((analysis) => {
            const statusColor =
              analysis.status === "done" ? "bg-success text-white" :
              analysis.status === "processing" ? "bg-yellow-500 text-white" :
              analysis.status === "failed" ? "bg-danger text-white" :
              "bg-gray-500 text-white";

            return (
              <Link
                key={analysis.task_id}
                to={`/analysis/${analysis.task_id}`}
                className="card hover:shadow-xl transition-shadow duration-300 group block overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-primary-900 group-hover:text-accent transition-colors line-clamp-2">
                      {analysis.title}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}>
                      {analysis.status.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-sm text-gray-500 mb-4">
                    {new Date(analysis.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>

                  <p className="text-gray-600 text-sm line-clamp-3">
                    {analysis.description?.substring(0, 150) || "No description provided..."}
                    {analysis.description?.length > 150 ? "..." : ""}
                  </p>
                </div>

                <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-200">
                  <span className="text-accent font-medium text-sm group-hover:underline">
                    View Details →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}