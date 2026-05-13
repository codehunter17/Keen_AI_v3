"use client";

// Drag-and-drop / click upload that reads the file as base64 and sends
// it directly to the analyze server action. NO storage anywhere — the
// image bytes are discarded after Gemini analyzes them. We only persist
// the AI analysis + flagged findings.
//
// Privacy + zero-cost. No R2, no UploadThing, no card on file.

import { useRef, useState } from "react";
import { Loader2, Upload, FileCheck2, AlertCircle } from "lucide-react";
import { analyzeReportInline } from "@/lib/actions/reports";

interface ReportMeta {
  reportType: string;
  reportDate: string;
  fileName?: string;
  notes?: string;
}

interface Props {
  meta: ReportMeta;
  onComplete: (result: {
    reportId: string;
    analysis: string;
    fileName: string;
  }) => void | Promise<void>;
  onError?: (msg: string) => void;
  maxSizeMb?: number;
  className?: string;
}

const ACCEPT = "image/jpeg,image/png,image/webp,image/heic,application/pdf";

export function InlineReportUploader({
  meta,
  onComplete,
  onError,
  maxSizeMb = 12,
  className = "",
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [stage, setStage] = useState<"reading" | "analyzing" | null>(null);
  const [done, setDone] = useState<string | null>(null);
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        // result is "data:<mime>;base64,<...>", strip the prefix
        const text = String(reader.result || "");
        const idx = text.indexOf(",");
        resolve(idx >= 0 ? text.slice(idx + 1) : text);
      };
      reader.onerror = () => reject(new Error("Could not read the file."));
      reader.readAsDataURL(file);
    });

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    setErrMsg(null);
    setDone(null);

    if (file.size > maxSizeMb * 1024 * 1024) {
      const m = `File is too large. Max ${maxSizeMb} MB.`;
      setErrMsg(m);
      onError?.(m);
      return;
    }

    setBusy(true);
    setStage("reading");
    try {
      const base64 = await fileToBase64(file);
      setStage("analyzing");
      const result = await analyzeReportInline({
        fileBase64: base64,
        fileName: meta.fileName || file.name,
        contentType: file.type || "application/octet-stream",
        reportType: meta.reportType,
        reportDate: meta.reportDate,
        notes: meta.notes,
      });
      setDone(file.name);
      await onComplete({
        reportId: result.reportId,
        analysis: result.analysis,
        fileName: meta.fileName || file.name,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Analysis failed.";
      setErrMsg(msg);
      onError?.(msg);
    } finally {
      setBusy(false);
      setStage(null);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        if (!busy) handleFiles(e.dataTransfer.files);
      }}
      className={`relative rounded-2xl border-2 border-dashed transition-colors ${
        dragOver
          ? "border-primary bg-primary/10"
          : busy
            ? "border-primary/40 bg-primary/5"
            : "border-border bg-muted/20"
      } ${className}`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        onChange={(e) => handleFiles(e.target.files)}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        disabled={busy}
      />
      <div className="flex flex-col items-center justify-center p-8 text-center pointer-events-none">
        {busy ? (
          <>
            <Loader2 className="w-7 h-7 text-primary animate-spin" />
            <p className="mt-3 text-sm font-medium">
              {stage === "reading" ? "Reading file…" : "Analyzing with AI…"}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {stage === "analyzing"
                ? "This usually takes 5–15 seconds"
                : "Almost there"}
            </p>
          </>
        ) : done ? (
          <>
            <FileCheck2 className="w-7 h-7 text-primary" />
            <p className="mt-3 text-sm font-medium">{done}</p>
            <p className="text-xs text-muted-foreground">Analyzed ✓ · file discarded</p>
          </>
        ) : errMsg ? (
          <>
            <AlertCircle className="w-7 h-7 text-destructive" />
            <p className="mt-3 text-sm font-medium text-destructive">{errMsg}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Tap to try a different file
            </p>
          </>
        ) : (
          <>
            <Upload className="w-7 h-7 text-muted-foreground" />
            <p className="mt-3 text-sm font-medium">Tap or drop a report</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              JPG · PNG · WEBP · HEIC · PDF — up to {maxSizeMb} MB
            </p>
            <p className="text-[10px] text-muted-foreground mt-2 max-w-xs">
              🔒 Your file is sent to AI, analyzed, then discarded — never stored.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
