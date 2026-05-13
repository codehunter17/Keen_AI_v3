"use client";

// Voice meal logger — Hindi/Hinglish/English friendly.
// Uses the browser Web Speech API (free, no server cost).
// Captures speech → POSTs transcript to /api/voice-log → Groq parses → saves.

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { awardBadge } from "@/lib/actions/badges";
import { scheduleAfterMealHydrationNudge } from "@/lib/notifications-client";

// minimal type so TS doesn't choke on Web Speech API (not in default lib)
interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}
interface SpeechRecognitionResult {
  isFinal: boolean;
  0: SpeechRecognitionAlternative;
}
interface SpeechRecognitionEvent extends Event {
  results: ArrayLike<SpeechRecognitionResult>;
  resultIndex: number;
}
interface SpeechRecognitionLike extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((e: SpeechRecognitionEvent) => void) | null;
  onerror: ((e: Event) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionLike;
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  }
}

interface ParsedResult {
  meals: { type: string; items: string[] }[];
  waterMl: number;
  moodWord: string | null;
  symptoms: string[];
  notes: string;
}

export function VoiceMic() {
  const router = useRouter();
  const [supported, setSupported] = useState(true);
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<ParsedResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lang, setLang] = useState<"hi-IN" | "en-IN">("hi-IN");

  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setSupported(false);
      return;
    }
    const r = new SR();
    // Continuous = stays open during pauses (key for slow Hindi speakers).
    r.continuous = true;
    r.interimResults = true;
    r.lang = lang;

    let accumulated = "";
    r.onresult = (e: SpeechRecognitionEvent) => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const res = e.results[i];
        if (res.isFinal) accumulated += res[0].transcript;
        else interim += res[0].transcript;
      }
      setTranscript((accumulated + " " + interim).trim());
    };

    r.onerror = (e: Event & { error?: string }) => {
      const code = (e as Event & { error?: string }).error ?? "unknown";
      if (code === "no-speech" || code === "aborted") {
        // benign — user paused or tapped stop
      } else if (code === "not-allowed" || code === "service-not-allowed") {
        setError("Microphone permission denied. Allow it in browser settings.");
      } else if (code === "network") {
        setError("Speech recognition needs internet to start.");
      } else {
        setError(`Mic error: ${code}`);
      }
      setRecording(false);
    };

    r.onend = () => {
      // If user is still actively recording, auto-restart (Chrome stops
      // recognition every ~1 minute even with continuous=true).
      setRecording(false);
    };

    recognitionRef.current = r;
    return () => {
      try {
        r.stop();
      } catch {
        /* ignore */
      }
    };
  }, [lang]);

  const start = async () => {
    if (!recognitionRef.current) return;
    setError(null);
    setResult(null);
    setTranscript("");

    // Explicitly request mic permission first. Web Speech API normally
    // triggers this implicitly, but some browsers + Permissions-Policy
    // configs don't fire the prompt reliably. Calling getUserMedia
    // forces it. We immediately stop the resulting tracks because
    // SpeechRecognition manages its own audio session.
    try {
      if (typeof navigator !== "undefined" && navigator.mediaDevices?.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((t) => t.stop());
      }
    } catch (err) {
      const name = (err as { name?: string })?.name ?? "";
      if (name === "NotAllowedError" || name === "PermissionDeniedError") {
        setError(
          "Microphone access was blocked. Click the 🔒 icon in the address bar → Site settings → Microphone → Allow.",
        );
      } else if (name === "NotFoundError" || name === "DevicesNotFoundError") {
        setError("No microphone found on this device.");
      } else {
        setError("Could not access mic. Try refreshing.");
      }
      return;
    }

    try {
      recognitionRef.current.lang = lang;
      recognitionRef.current.start();
      setRecording(true);
    } catch {
      setError("Could not start mic. Try refreshing the page.");
    }
  };

  const stop = () => {
    recognitionRef.current?.stop();
    setRecording(false);
  };

  const submit = async () => {
    const t = transcript.trim();
    if (!t) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/voice-log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: t }),
      });
      if (!res.ok) {
        const text = await res.text();
        setError(text || "Failed to parse what you said.");
        return;
      }
      const data = (await res.json()) as { ok: boolean; parsed: ParsedResult };
      setResult(data.parsed);
      // Award the voice-logger badge + schedule hydration nudge if a meal was logged.
      awardBadge("VOICE_LOGGER").catch(() => {});
      if (data.parsed.meals.length > 0) {
        scheduleAfterMealHydrationNudge().catch(() => {});
      }
      router.refresh();
    } catch {
      setError("Network error. Try again.");
    } finally {
      setBusy(false);
    }
  };

  if (!supported) {
    return (
      <div className="rounded-2xl bg-muted/50 p-4 text-sm">
        Voice logging needs Chrome / Safari. On other browsers, use the Wellness page.
      </div>
    );
  }

  return (
    <section className="rounded-2xl bg-card lift p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Voice log · Hinglish friendly
          </p>
          <p className="font-heading text-lg mt-1">
            Just speak what you ate
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try: <em>&ldquo;Subah do roti aur dal khaayi, ek glass paani peeya&rdquo;</em>
          </p>
        </div>
        <div className="flex flex-col gap-1.5 items-end">
          <button
            type="button"
            onClick={() => setLang(lang === "hi-IN" ? "en-IN" : "hi-IN")}
            className="chip cursor-pointer text-[10px]"
          >
            {lang === "hi-IN" ? "हिन्दी" : "English"}
          </button>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-3">
        <button
          type="button"
          onClick={recording ? stop : start}
          className={`flex items-center justify-center w-16 h-16 rounded-full lift transition-all ${
            recording ? "bg-destructive text-destructive-foreground animate-pulse" : "bg-primary text-primary-foreground"
          }`}
          aria-label={recording ? "Stop recording" : "Start recording"}
        >
          {recording ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
        </button>
        <div className="flex-1 min-h-[3rem] rounded-xl border border-border bg-input/40 px-3 py-2 text-sm">
          {transcript || (
            <span className="text-muted-foreground">
              {recording ? "Listening…" : "Tap mic and speak"}
            </span>
          )}
        </div>
      </div>

      {transcript && !recording && !result && (
        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => {
              setTranscript("");
              setResult(null);
            }}
            className="text-sm text-muted-foreground underline"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold disabled:opacity-50"
          >
            {busy && <Loader2 className="w-4 h-4 animate-spin" />}
            {busy ? "Logging…" : "Log it"}
          </button>
        </div>
      )}

      {result && (
        <div className="mt-4 rounded-xl bg-primary/10 border border-primary/30 p-3 text-sm">
          <p className="font-medium text-primary">Logged ✓</p>
          {result.meals.length > 0 && (
            <p className="mt-1 text-xs">
              Meals: {result.meals.map((m) => `${m.type}: ${m.items.join(", ")}`).join(" · ")}
            </p>
          )}
          {result.waterMl > 0 && (
            <p className="mt-0.5 text-xs">Water: {result.waterMl} ml</p>
          )}
          {result.moodWord && <p className="mt-0.5 text-xs">Mood: {result.moodWord}</p>}
          {result.symptoms.length > 0 && (
            <p className="mt-0.5 text-xs">Symptoms: {result.symptoms.join(", ")}</p>
          )}
        </div>
      )}

      {error && (
        <div className="mt-3 rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      )}
    </section>
  );
}
