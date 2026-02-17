// src/features/analyses/pages/AnalysisDetailPage.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getAnalysisResult } from "../analysesApi";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import jsPDF from 'jspdf';
import toast from 'react-hot-toast';

export default function AnalysisDetailPage() {
  const { taskId } = useParams();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pdfGenerating, setPdfGenerating] = useState(false);

  useEffect(() => {
    let interval;

    const fetchAnalysis = async () => {
      try {
        const res = await getAnalysisResult(taskId);
        console.log("API Response (check created_at):", res.data);
        setAnalysis(res.data);
        setLoading(false);

        if (res.data.status === "processing") {
          interval = setTimeout(fetchAnalysis, 4000);
        }
      } catch (err) {
        setError("Failed to load analysis. It may still be processing or the task ID is invalid.");
        setLoading(false);
      }
    };

    fetchAnalysis();

    return () => clearTimeout(interval);
  }, [taskId]);

  const copyResult = () => {
    if (analysis?.result) {
      navigator.clipboard.writeText(analysis.result);
      toast.success("Report copied to clipboard!");
    }
  };

  const downloadPDF = () => {
    if (!analysis?.result) return;

    setPdfGenerating(true);
    toast.loading("Generating PDF...", { id: "pdf" });

    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      // Cover page
      doc.setFillColor(30, 58, 138);
      doc.rect(0, 0, 210, 297, 'F');

      doc.setFontSize(32);
      doc.setTextColor(255);
      doc.setFont("helvetica", "bold");
      doc.text(analysis.title || "System Design Analysis", 105, 120, { align: "center" });

      doc.setFontSize(18);
      doc.text("AI System Designer Report", 105, 150, { align: "center" });

      doc.setFontSize(14);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 105, 170, { align: "center" });

      doc.addPage();

      // Content pages
      doc.setFontSize(12);
      doc.setTextColor(0);

      const margin = 20;
      const lineHeight = 7;
      let y = margin;

      // Split result into lines for pagination
      const lines = analysis.result.split('\n');

      lines.forEach(line => {
        const text = doc.splitTextToSize(line, 170); // max width ~170mm
        if (y + text.length * lineHeight > 280) {
          doc.addPage();
          y = margin;
        }

        doc.text(text, margin, y);
        y += text.length * lineHeight + 2;
      });

      // Filename
      const safeTitle = (analysis.title || "Analysis").replace(/[^a-zA-Z0-9]/g, '_');
      const dateStr = new Date().toISOString().split('T')[0];
      doc.save(`${safeTitle}_${dateStr}.pdf`);

      toast.dismiss("pdf");
      toast.success("PDF downloaded!");
    } catch (err) {
      console.error("PDF error:", err);
      toast.dismiss("pdf");
      toast.error("Failed to generate PDF");
    } finally {
      setPdfGenerating(false);
    }
  };

  // Safe date formatting (same as your History page)
  const formatDate = (dateStr) => {
    if (!dateStr) return "Date not available";

    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      console.warn("Invalid created_at:", dateStr);
      return "Invalid date";
    }

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto animate-pulse space-y-8">
          <div className="h-12 bg-gray-200 rounded w-3/4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          <div className="space-y-6">
            <div className="h-8 bg-gray-200 rounded w-full"></div>
            <div className="h-64 bg-gray-200 rounded-xl"></div>
            <div className="h-96 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-lg text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Unable to load analysis</h2>
          <p className="text-gray-600 text-lg mb-10">{error || "This analysis might still be processing or no longer available."}</p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/analyze"
              className="px-10 py-5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition shadow-lg hover:shadow-xl"
            >
              Try Again
            </Link>
            <Link
              to="/history"
              className="px-10 py-5 bg-gray-200 text-gray-800 font-semibold rounded-xl hover:bg-gray-300 transition"
            >
              Back to History
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const statusConfig = {
    processing: {
      label: "Processing",
      color: "bg-yellow-100 text-yellow-800 border-yellow-300",
      progress: "w-3/4 animate-pulse",
    },
    done: {
      label: "Completed",
      color: "bg-green-100 text-green-800 border-green-300",
      progress: "w-full",
    },
    failed: {
      label: "Failed",
      color: "bg-red-100 text-red-800 border-red-300",
      progress: "w-1/4",
    },
  };

  const status = statusConfig[analysis.status] || statusConfig.processing;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <Link
            to="/history"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-lg mb-6 hover:underline"
          >
            ← Back to History
          </Link>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {analysis.title || "System Design Analysis"}
          </h1>

          <div className="flex flex-wrap items-center gap-6">
            <span className={`inline-flex items-center px-6 py-2 rounded-full text-base font-medium border ${status.color}`}>
              {status.label}
            </span>

            <span className="text-gray-600 text-base">
              Created {formatDate(analysis.created_at)}
            </span>
          </div>
        </div>

        {/* Progress / Status Card */}
        {analysis.status !== "done" && (
          <div className="mb-16 bg-white rounded-2xl shadow border border-gray-200 p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-semibold text-gray-900">
                {analysis.status === "processing" ? "Generating your architecture..." : "Analysis Failed"}
              </h3>
              <span className="text-gray-600">{analysis.status === "processing" ? "In progress" : "Error"}</span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ease-in-out ${status.progress} ${
                  analysis.status === "processing" ? "bg-yellow-500" : "bg-red-500"
                }`}
              ></div>
            </div>

            <p className="mt-6 text-gray-700 text-lg">
              {analysis.status === "processing"
                ? "Processing usually takes 30–120 seconds. You can leave this page — results will appear in History when complete."
                : "Generation failed. Please try submitting again."}
            </p>
          </div>
        )}

        {/* Result Section */}
        {analysis.status === "done" && analysis.result && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="p-6 md:p-12 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <h2 className="text-3xl font-bold text-gray-900">
                Full Architecture Report
              </h2>

              <div className="flex gap-4">
                <button
                  onClick={copyResult}
                  className="flex items-center gap-3 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition font-medium shadow-md hover:shadow-lg active:scale-95"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy Report
                </button>

                <button
                  onClick={downloadPDF}
                  disabled={pdfGenerating}
                  className={`flex items-center gap-3 px-6 py-3 rounded-xl transition font-medium shadow-md active:scale-95 ${
                    pdfGenerating
                      ? "bg-gray-400 cursor-not-allowed text-white"
                      : "bg-green-600 hover:bg-green-700 text-white hover:shadow-lg"
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {pdfGenerating ? "Generating..." : "Download PDF"}
                </button>
              </div>
            </div>

            {/* Markdown rendering */}
            <div className="prose prose-lg md:prose-xl max-w-none p-6 md:p-12 text-gray-800 prose-headings:text-gray-900 prose-headings:font-bold prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:italic prose-code:bg-gray-100 prose-code:p-1 prose-code:rounded prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:p-6 prose-pre:rounded-xl prose-pre:overflow-x-auto prose-ul:list-disc prose-ol:list-decimal">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {analysis.result}
              </ReactMarkdown>
            </div>
          </div>
        )}

        {/* Failed state */}
        {analysis.status === "failed" && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-10 text-center mt-12">
            <h2 className="text-3xl font-bold text-red-800 mb-6">
              Analysis Failed
            </h2>
            <p className="text-red-700 text-xl mb-10">
              The AI service encountered an issue. This can happen with complex requests or temporary limits.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/analyze"
                className="px-10 py-5 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition shadow-lg hover:shadow-xl"
              >
                Try Again
              </Link>
              <Link
                to="/history"
                className="px-10 py-5 bg-gray-200 text-gray-800 font-semibold rounded-xl hover:bg-gray-300 transition"
              >
                Back to History
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}