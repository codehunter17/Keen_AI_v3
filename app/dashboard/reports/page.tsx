"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getReports,
  createReport,
  analyzeReport,
  deleteReport,
} from "@/lib/actions/reports";
import { InlineReportUploader } from "@/components/inline-report-uploader";
import { isPaywallError } from "@/lib/errors";
import { motion, AnimatePresence } from "motion/react";
import {
  FileText,
  Plus,
  FileImage,
  Download,
  Activity,
  Play,
  Trash2,
  RefreshCw,
  OctagonAlert,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CustomSelect } from "@/components/ui/custom-select";

export default function ReportsPage() {
  const [newReport, setNewReport] = useState({
    fileName: "",
    reportType: "Ultrasound",
    reportDate: new Date().toISOString().split("T")[0],
    notes: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [reportToDelete, setReportToDelete] = useState<string | null>(null);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [limitError, setLimitError] = useState("");

  const queryClient = useQueryClient();

  const { data: reports, isLoading } = useQuery({
    queryKey: ["reports"],
    queryFn: async () => await getReports(),
  });

  const analyzeMutation = useMutation({
    mutationFn: async ({ id, url }: { id: string; url: string }) =>
      await analyzeReport(id, url),
    onMutate: (variables) => {
      setAnalyzingId(variables.id);
    },
    onSuccess: (result) => {
      // analyzeReport now returns a discriminated union so paywall
      // detection survives Next.js production error-masking.
      setAnalyzingId(null);
      if (result.kind === "paywall") {
        setLimitError(result.message);
        setShowLimitModal(true);
        return;
      }
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
    onError: (error: { message?: string }) => {
      setAnalyzingId(null);
      const msg = error.message || "Analysis failed";
      // Legacy fallback if the action throws an unexpected error.
      if (isPaywallError(error)) {
        setLimitError(msg);
        setShowLimitModal(true);
      } else {
        alert(msg);
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => await deleteReport(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      setReportToDelete(null);
    },
  });

  const downloadAnalysis = (id: string, fileName: string) => {
    const printContent = document.getElementById(`analysis-${id}`);
    if (!printContent) return;

    const printWindow = window.open("", "", "width=900,height=650");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>${fileName} - Analysis Report</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; padding: 50px; color: #1a1a1a; line-height: 1.7; max-width: 800px; margin: 0 auto; }
            .header { border-bottom: 2px solid #f97316; margin-bottom: 30px; padding-bottom: 20px; text-align: center; }
            .logo-text { font-size: 28px; font-weight: 800; color: #f97316; margin: 0; }
            .report-title { font-size: 20px; color: #4b5563; margin-top: 10px; font-weight: 600; }
            h1, h2, h3 { color: #f97316; margin-top: 1.5em; }
            table { width: 100%; border-collapse: collapse; margin-top: 25px; margin-bottom: 25px; border-radius: 8px; overflow: hidden; box-shadow: 0 0 0 1px #e5e7eb; }
            th, td { border: 1px solid #e5e7eb; padding: 14px 16px; text-align: left; font-size: 14px; }
            th { background-color: #f9fafb; font-weight: 700; color: #374151; text-transform: uppercase; letter-spacing: 0.05em; font-size: 12px; }
            tr:nth-child(even) { background-color: #fcfcfc; }
            .disclaimer { font-size: 12px; color: #6b7280; margin-top: 60px; border-top: 1px solid #e5e7eb; padding-top: 20px; font-style: italic; text-align: center; }
            p { margin-bottom: 1.2em; font-size: 15px; }
            ul, ol { margin-bottom: 1.5em; padding-left: 25px; }
            li { margin-bottom: 0.5em; font-size: 15px; }
          </style>
        </head>
        <body>
          <div class="header">
            <p class="logo-text">NutriMama AI Insights</p>
            <p class="report-title">Medical Report: ${fileName}</p>
          </div>
          <div class="content">
            ${printContent.innerHTML}
          </div>
          <div class="disclaimer">
            IMPORTANT DISCLAIMER: This analysis is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
  };

  if (isLoading)
    return (
      <div className="flex h-full items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="lg:max-w-6xl w-[90vw] mx-auto space-y-8">
      <div className="flex md:flex-row flex-col gap-2 justify-between md:items-center">
        <div>
          <h1 className="text-3xl font-heading text-foreground font-bold">
            Medical Reports
          </h1>
          <p className="text-muted-foreground mt-1 tracking-wide">
            Manage and instantly interpret your test results.
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center w-fit space-x-2 bg-primary text-white hover:bg-primary/90 px-5 py-3 rounded-xl font-semibold transition-all hover:scale-105 active:scale-95 shadow-md shadow-primary/20"
        >
          {showForm ? (
            "Cancel"
          ) : (
            <>
              <Plus className="w-5 h-5" /> <span>Upload</span>
            </>
          )}
        </button>
      </div>

      <AnimatePresence>
        {reportToDelete && (
          <div className="fixed inset-0 z-100  flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl border border-border"
            >
              <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6 text-red-500">
                <Trash2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-heading font-bold text-foreground mb-2">
                Delete Report?
              </h3>
              <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
                This will permanently remove this medical report and its AI
                analysis. This action cannot be undone.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setReportToDelete(null)}
                  className="flex-1 px-6 py-3 rounded-xl border border-border font-semibold hover:bg-background transition-all active:scale-95"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteMutation.mutate(reportToDelete)}
                  disabled={deleteMutation.isPending}
                  className="flex-1 px-6 py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition-all active:scale-95 disabled:opacity-50"
                >
                  {deleteMutation.isPending ? "Deleting..." : "Yes, Delete"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-primary/10 p-8 rounded-3xl shadow-sm border border-border mb-8">
              <h2 className="text-xl font-heading font-semibold mb-6 text-foreground">
                Upload New Report
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-foreground/80">
                      Report Name
                    </label>
                    <input
                      type="text"
                      className="w-full p-3.5 rounded-xl border border-input focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                      value={newReport.fileName}
                      onChange={(e) =>
                        setNewReport({ ...newReport, fileName: e.target.value })
                      }
                      placeholder="e.g. 20-week Scan"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5 text-foreground/80">
                        Type
                      </label>
                      <CustomSelect
                        value={newReport.reportType}
                        onChange={(val) =>
                          setNewReport({ ...newReport, reportType: val })
                        }
                        options={[
                          { value: "Ultrasound", label: "Ultrasound" },
                          { value: "Blood Test", label: "Blood Test" },
                          { value: "Urine Test", label: "Urine Test" },
                          { value: "Other", label: "Other" },
                        ]}
                        className="bg-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5 text-foreground/80">
                        Date
                      </label>
                      <input
                        type="date"
                        className="w-full p-3.5 rounded-xl border border-input focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-primary/20"
                        value={newReport.reportDate}
                        onChange={(e) =>
                          setNewReport({
                            ...newReport,
                            reportDate: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-foreground/80">
                      Notes (optional)
                    </label>
                    <input
                      type="text"
                      className="w-full p-3.5 rounded-xl border border-input focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                      value={newReport.notes}
                      onChange={(e) =>
                        setNewReport({ ...newReport, notes: e.target.value })
                      }
                      placeholder="Any context?"
                    />
                  </div>
                </div>

                <div className="h-full">
                  <InlineReportUploader
                    className="h-full"
                    meta={{
                      reportType: newReport.reportType,
                      reportDate: newReport.reportDate,
                      fileName: newReport.fileName,
                      notes: newReport.notes,
                    }}
                    onComplete={async () => {
                      // Server already created the Report row + analyzed it.
                      // Just refresh the list and close the form.
                      queryClient.invalidateQueries({ queryKey: ["reports"] });
                      setShowForm(false);
                      setNewReport({
                        fileName: "",
                        reportType: "Ultrasound",
                        reportDate: new Date().toISOString().split("T")[0],
                        notes: "",
                      });
                    }}
                    onError={(msg) => alert(msg)}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 gap-6">
        {reports?.map((r: { id: string; fileName: string; reportType: string; reportDate: string | Date; fileUrl: string; aiAnalysis?: string | null }) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={r.id}
            className="bg-primary/10 border  rounded-3xl p-3 md:p-6 shadow-sm flex flex-col relative overflow-hidden group border-primary/40 transition-colors"
          >
            <div className="flex items-start md:flex-row flex-col gap-4 justify-between mb-2">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-linear-to-br from-primary/10 to-secondary/30 rounded-2xl flex items-center justify-center text-primary shadow-inner">
                  {r.reportType === "Ultrasound" ? (
                    <FileImage className="w-7 h-7" />
                  ) : (
                    <FileText className="w-7 h-7" />
                  )}
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-lg hover:text-primary transition-colors line-clamp-1">
                    {r.fileName}
                  </h3>
                  <p className="text-sm text-muted-foreground font-medium">
                    {r.reportType} •{" "}
                    {new Date(r.reportDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setReportToDelete(r.id)}
                  className="p-3 bg-red-500/10 hover:bg-red-500 rounded-xl text-red-500 hover:text-white transition-all hover:scale-105 active:scale-95"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => downloadAnalysis(r.id, r.fileName)}
                  className="p-3 bg-secondary/30 hover:bg-secondary rounded-xl text-primary transition-colors hover:scale-105 active:scale-95"
                  title="Download PDF"
                >
                  <Download className="w-5 h-5" />
                </button>
                <button
                  onClick={() =>
                    analyzeMutation.mutate({ id: r.id, url: r.fileUrl })
                  }
                  disabled={analyzingId !== null}
                  className="p-3 bg-accent/20 hover:bg-accent rounded-xl text-accent-foreground transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                  title="Re-analyze with AI"
                >
                  {analyzingId === r.id ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <RefreshCw className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* AI Analysis Section */}
            <div className="mt-4 pt-5 border-t border-primary/15 flex-1">
              {r.aiAnalysis ? (
                <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10 relative group/analysis">
                  <div id={`analysis-${r.id}`} className="overflow-x-auto">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        h1: ({ children }) => (
                          <h1 className="text-3xl font-black text-primary underline underline-offset-8 decoration-primary/40 mb-6 mt-2 uppercase tracking-tighter">
                            {children}
                          </h1>
                        ),
                        h2: ({ children }) => (
                          <h2 className="text-xl font-bold text-primary underline underline-offset-4 decoration-primary/30 mb-4 mt-8 uppercase tracking-tight">
                            {children}
                          </h2>
                        ),
                        h3: ({ children }) => (
                          <h3 className="text-lg font-bold text-primary/90 underline underline-offset-4 decoration-primary/20 mb-3 mt-6 uppercase tracking-wide">
                            {children}
                          </h3>
                        ),
                        p: ({ children }) => (
                          <p className="mb-6 last:mb-0 text-foreground/90 font-medium">
                            {children}
                          </p>
                        ),
                        ul: ({ children }) => (
                          <ul className="list-disc ml-6 space-y-3 mb-6 text-foreground/80">
                            {children}
                          </ul>
                        ),
                        li: ({ children }) => (
                          <li className="marker:text-primary pl-1 font-medium">
                            {children}
                          </li>
                        ),
                        strong: ({ children }) => (
                          <strong className="font-bold text-primary underline decoration-primary/20 underline-offset-2">
                            {children}
                          </strong>
                        ),
                        code: ({ children }) => (
                          <code className="bg-primary/10 text-primary px-1.5 py-0.5 rounded-md font-mono text-[11px] font-bold">
                            {children}
                          </code>
                        ),
                        table: ({ children }) => (
                          <div className="my-8 overflow-x-auto custom-scrollbar rounded-2xl border border-border shadow-xl">
                            <table className="w-full border-collapse md:text-md text-sm">
                              {children}
                            </table>
                          </div>
                        ),
                        thead: ({ children }) => (
                          <thead className="bg-primary text-primary">
                            {children}
                          </thead>
                        ),
                        th: ({ children }) => (
                          <th className="border-b border-r border-primary/20 p-4 text-left font-black uppercase  last:border-r-0">
                            {children}
                          </th>
                        ),
                        td: ({ children }) => (
                          <td className="border-b border-r border-primary/20 p-4 font-medium text-foreground md:text-md text-xs last:border-r-0">
                            {children}
                          </td>
                        ),
                        tr: ({ children }) => (
                          <tr className="bg-card transition-colors last:child:border-b-0">
                            {children}
                          </tr>
                        ),
                      }}
                    >
                      {r.aiAnalysis}
                    </ReactMarkdown>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center py-6 space-y-4">
                  <div className="w-14 h-14 rounded-full bg-accent/20 flex items-center justify-center shadow-inner">
                    {analyzingId === r.id ? (
                      <div className="w-6 h-6 border-2 border-accent-foreground border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Activity className="w-6 h-6 text-accent-foreground" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Not analyzed yet.
                  </p>
                  <button
                    onClick={() =>
                      analyzeMutation.mutate({ id: r.id, url: r.fileUrl })
                    }
                    disabled={analyzingId !== null}
                    className="flex items-center space-x-2 bg-accent/20 hover:bg-accent/40 text-accent-foreground px-5 py-2.5 rounded-xl transition-all font-semibold cursor-pointer disabled:opacity-50 shadow-sm active:scale-95"
                  >
                    <Play className="w-4 h-4" />
                    <span>
                      {analyzingId === r.id
                        ? "Analyzing..."
                        : "Analyze with AI"}
                    </span>
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        ))}

        {reports?.length === 0 && (
          <div className="col-span-1 lg:col-span-2 py-24 flex flex-col items-center justify-center text-center bg-primary/10 rounded-3xl border border-border shadow-sm">
            <div className="w-24 h-24 bg-primary/30 rounded-full flex items-center justify-center mb-6">
              <FileText className="w-12 h-12 text-primary" />
            </div>
            <h3 className="text-2xl font-heading font-semibold text-primary">
              No reports uploaded
            </h3>
            <p className="text-primary/60 mt-3 max-w-md mx-auto text-md">
              Upload your blood tests or ultrasound scans to get AI-powered
              plain language summaries that help you understand your journey.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-8 text-primary font-semibold cursor-pointer  dark:bg-white bg-primary/10 px-6 py-2 rounded-full hover:bg-primary/20 transition-colors"
            >
              Upload your first report
            </button>
          </div>
        )}
      </div>
      {/* Limit Exceeded Modal */}
      <AnimatePresence>
        {showLimitModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-card border border-border rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl relative overflow-hidden group"
            >
              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/20 transition-all duration-700" />

              <div className="relative z-10 text-center space-y-6">
                <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto text-primary border border-primary/20 shadow-inner">
                  <OctagonAlert className="w-10 h-10 animate-pulse" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-3xl font-heading font-black text-foreground tracking-tight">
                    Limit Reached
                  </h3>
                  <p className="text-muted-foreground font-medium leading-relaxed">
                    {limitError ||
                      "You've reached your analysis limit for this tier."}
                  </p>
                </div>

                <div className="pt-4 flex flex-col space-y-3">
                  <button
                    onClick={() => {
                      setShowLimitModal(false);
                      window.location.href = "/dashboard/profile";
                    }}
                    className="w-full bg-primary text-white py-4 rounded-2xl font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/20 flex items-center justify-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Upgrade to Pro Max</span>
                  </button>
                  <button
                    onClick={() => setShowLimitModal(false)}
                    className="w-full py-4 rounded-2xl bg-muted/50 text-muted-foreground font-bold hover:bg-muted transition-all"
                  >
                    Maybe Later
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
