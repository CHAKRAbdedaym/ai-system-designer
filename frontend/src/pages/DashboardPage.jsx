// src/pages/DashboardPage.jsx (or wherever you put it)
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getMyAnalyses } from '../features/analyses/analysesApi';


export default function DashboardPage() {
  const navigate = useNavigate();
  const [analyses, setAnalyses] = useState([]);
  const [stats, setStats] = useState({ total: 0, processing: 0, completed: 0, failed: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Replace with your real API call
        const res = await getMyAnalyses(); // Assume this returns list of user's analyses
        setAnalyses(res.data || []);

        // Simple stats calculation
        const total = res.data?.length || 0;
        const processing = res.data?.filter(a => a.status === "processing").length || 0;
        const completed = res.data?.filter(a => a.status === "done").length || 0;
        const failed = res.data?.filter(a => a.status === "failed").length || 0;

        setStats({ total, processing, completed, failed });
      } catch (err) {
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const lastAnalysis = analyses[0] || null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto animate-pulse space-y-12">
          <div className="h-16 bg-gray-300 rounded-xl w-1/2"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-300 rounded-2xl"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-300 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-lg text-center bg-white p-10 rounded-2xl shadow-xl border border-gray-200">
          <h2 className="text-3xl font-bold text-red-800 mb-6">Oops!</h2>
          <p className="text-gray-700 text-xl mb-10">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-10 py-5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-lg hover:shadow-xl"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Welcome + Quick Stats */}
        <div className="mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Welcome back!
          </h1>
          <p className="text-xl text-gray-600">
            Here's what's happening with your system designs
          </p>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition">
              <h3 className="text-lg font-semibold text-gray-700">Total Analyses</h3>
              <p className="text-4xl font-bold text-gray-900 mt-2">{stats.total}</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition">
              <h3 className="text-lg font-semibold text-gray-700">Processing</h3>
              <p className="text-4xl font-bold text-yellow-600 mt-2">{stats.processing}</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition">
              <h3 className="text-lg font-semibold text-gray-700">Completed</h3>
              <p className="text-4xl font-bold text-green-600 mt-2">{stats.completed}</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition">
              <h3 className="text-lg font-semibold text-gray-700">Failed</h3>
              <p className="text-4xl font-bold text-red-600 mt-2">{stats.failed}</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-16 flex flex-col sm:flex-row gap-6">
          <Link
            to="/analyze"
            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xl py-8 px-10 rounded-2xl shadow-xl hover:shadow-2xl hover:from-blue-700 hover:to-indigo-700 transition transform hover:scale-[1.02] text-center"
          >
            Start New Analysis
          </Link>

          <Link
            to="/history"
            className="flex-1 bg-white text-gray-900 font-bold text-xl py-8 px-10 rounded-2xl shadow-lg border border-gray-200 hover:bg-gray-50 hover:shadow-xl transition text-center"
          >
            View All History
          </Link>
        </div>

        {/* Recent Analyses */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="p-8 border-b border-gray-200 bg-gray-50">
            <h2 className="text-3xl font-bold text-gray-900">
              Recent Analyses
            </h2>
            <p className="text-gray-600 mt-2">
              {lastAnalysis
                ? `Last one: ${formatDate(lastAnalysis.created_at)}`
                : "No analyses yet — start creating!"}
            </p>
          </div>

          {analyses.length === 0 ? (
            <div className="p-12 text-center text-gray-500 text-xl">
              You haven't created any analyses yet.<br />
              <Link to="/analyze" className="text-blue-600 hover:underline font-medium">
                Start your first one now →
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Title</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Created</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {analyses.slice(0, 5).map((item) => (
                    <tr key={item.task_id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-5 text-sm font-medium text-gray-900">
                        {item.title || "Untitled Analysis"}
                      </td>
                      <td className="px-6 py-5 text-sm">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                          item.status === "done" ? "bg-green-100 text-green-800" :
                          item.status === "processing" ? "bg-yellow-100 text-yellow-800" :
                          "bg-red-100 text-red-800"
                        }`}>
                          {item.status === "done" ? "Completed" : item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-sm text-gray-600">
                        {formatDate(item.created_at)}
                      </td>
                      <td className="px-6 py-5 text-right">
                        <Link
                          to={`/analysis/${item.task_id}`}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          View →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Safe date formatter (same as your History page)
function formatDate(dateStr) {
  if (!dateStr) return "—";

  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "Invalid date";

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}  