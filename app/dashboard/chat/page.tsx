"use client";
import React, { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getChatSessions,
  getChatMessages,
  createChatSession,
  deleteChatSession,
  updateChatSessionTitle,
} from "@/lib/actions/chat";
import { motion, AnimatePresence } from "motion/react";
import {
  Plus,
  Send,
  MessageCircle,
  Trash2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  PanelLeftClose,
  PanelLeftOpen,
  MessageCircleWarning,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import { useSession } from "@/lib/auth-client";
import Link from "next/link";

const thinkingMessages = [
  "Analyzing your symptoms with care...",
  "Refining the best maternal advice for you...",
  "Reviewing clinical guidelines for your week of pregnancy...",
  "Synthesizing personalized nutrition tips...",
  "Thinking about the best way to support you right now...",
  "Looking into safety precautions for your trimester...",
  "Checking for common wellness milestones...",
  "Ensuring advice is gentle and evidence-based...",
  "Gathering insights from your recent health logs...",
  "Almost there, putting it all together for you...",
];

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ChatSession {
  id: string;
  title: string | null;
  updatedAt: Date;
}

export default function ChatPage() {
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [thinkingIndex, setThinkingIndex] = useState(0);
  const [expandedThoughts, setExpandedThoughts] = useState<
    Record<string, boolean>
  >({});
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [limitError, setLimitError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const isProcessing = useRef(false);
  const abortRef = useRef<AbortController | null>(null);
  const [showScrollDown, setShowScrollDown] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);

  const queryClient = useQueryClient();

  // Queries
  const { data: sessions, isLoading: sessionsLoading } = useQuery({
    queryKey: ["chatSessions"],
    queryFn: async () => await getChatSessions(),
  });

  const { data: dbMessages } = useQuery({
    queryKey: ["chatMessages", activeSessionId],
    queryFn: async () => {
      if (!activeSessionId) return [];
      return await getChatMessages(activeSessionId);
    },
    enabled: !!activeSessionId,
  });

  // Mutations
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => await deleteChatSession(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chatSessions"] });
      if (activeSessionId === sessionToDelete) {
        setActiveSessionId(null);
        setMessages([]);
      }
      setSessionToDelete(null);
    },
  });

  useEffect(() => {
    if (dbMessages && !isStreaming) {
      queueMicrotask(() => {
        setMessages(dbMessages as ChatMessage[]);
      });
    }
  }, [dbMessages, isStreaming]);

  useEffect(() => {
    if (autoScroll) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, autoScroll]);

  // Detect when user scrolls up — pause auto-scroll, show "jump to bottom" button.
  useEffect(() => {
    const el = messagesContainerRef.current;
    if (!el) return;
    const onScroll = () => {
      const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
      const nearBottom = distanceFromBottom < 80;
      setShowScrollDown(!nearBottom);
      setAutoScroll(nearBottom);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const jumpToBottom = () => {
    setAutoScroll(true);
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const stopStreaming = () => {
    abortRef.current?.abort();
    abortRef.current = null;
    setIsStreaming(false);
    isProcessing.current = false;
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isStreaming) {
      interval = setInterval(() => {
        setThinkingIndex((prev) => (prev + 1) % thinkingMessages.length);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isStreaming]);

  // Handlers
  const handleCreateSession = async () => {
    if (isCreatingSession) return;
    setIsCreatingSession(true);
    try {
      const session = await createChatSession("New Chat");
      queryClient.invalidateQueries({ queryKey: ["chatSessions"] });
      setActiveSessionId(session.id);
      setMessages([]);
    } finally {
      setIsCreatingSession(false);
    }
  };

  const toggleThought = (id: string) => {
    setExpandedThoughts((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSend = async (text: string = input) => {
    if (!text.trim() || isProcessing.current) return;
    isProcessing.current = true;
    setIsStreaming(true);

    const assistantMsgId = (Date.now() + 1).toString();
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: text,
    };
    let textContent = "";

    try {
      let currentSessionId = activeSessionId;
      if (!currentSessionId) {
        const newSession = await createChatSession(text.slice(0, 40));
        queryClient.invalidateQueries({ queryKey: ["chatSessions"] });
        currentSessionId = newSession.id;
        setActiveSessionId(newSession.id);
      } else if (messages.length === 0) {
        await updateChatSessionTitle(currentSessionId, text.slice(0, 40));
        queryClient.invalidateQueries({ queryKey: ["chatSessions"] });
      }

      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setMessages((prev) => [
        ...prev,
        { id: assistantMsgId, role: "assistant" as const, content: "" },
      ]);

      // Abort controller — wired to the stop button
      abortRef.current = new AbortController();
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: currentSessionId, message: text }),
        signal: abortRef.current.signal,
      });

      if (response.headers.get("X-Emergency") === "true") {
        const emergencyText = await response.text();
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsgId ? { ...m, content: emergencyText } : m,
          ),
        );
        return;
      }

      if (!response.ok) {
        const errorText = await response.text();
        if (response.status === 403) {
          setLimitError(errorText);
          setShowLimitModal(true);
          // Remove the empty assistant message we added
          setMessages((prev) => prev.filter((m) => m.id !== assistantMsgId));
        } else {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMsgId ? { ...m, content: errorText } : m,
            ),
          );
        }
        return;
      }

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      // Typewriter smoothing: server may flush large chunks; we pace the
      // visual reveal at a steady ~60 chars/sec so it reads naturally.
      let pendingBuffer = "";
      let displayed = "";
      let streamFinished = false;
      const CHARS_PER_TICK = 2;
      const TICK_MS = 16; // ~60 fps; effective ~125 chars/sec, feels real-time

      const tickerDone = new Promise<void>((resolve) => {
        const interval = setInterval(() => {
          if (pendingBuffer.length > 0) {
            const next = pendingBuffer.slice(0, CHARS_PER_TICK);
            pendingBuffer = pendingBuffer.slice(CHARS_PER_TICK);
            displayed += next;
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantMsgId ? { ...m, content: displayed } : m,
              ),
            );
          } else if (streamFinished) {
            clearInterval(interval);
            resolve();
          }
        }, TICK_MS);
      });

      // Pull from network as fast as it streams; just append to buffer.
      // If user clicks Stop (AbortController fires), reader.read() throws —
      // we catch it, mark stream finished, keep whatever was already shown.
      (async () => {
        try {
          let done = false;
          while (!done) {
            const { value, done: doneReading } = await reader.read();
            done = doneReading;
            if (value) {
              const chunkValue = decoder.decode(value, { stream: true });
              textContent += chunkValue;
              pendingBuffer += chunkValue;
            }
          }
        } catch {
          // Aborted — flush whatever's still in the buffer to the screen
          // by letting the ticker drain it.
        } finally {
          streamFinished = true;
        }
      })();

      await tickerDone;

      // Final cache update
      queryClient.setQueryData(
        ["chatMessages", currentSessionId],
        (old: ChatMessage[] | undefined) => {
          const newMessage: ChatMessage = {
            id: assistantMsgId,
            role: "assistant",
            content: textContent,
          };
          if (!old) return [userMsg, newMessage];
          // Remove temporary messages AND any message that might have been
          // saved/refetched in the background with the same content to avoid duplicates
          const filtered = old.filter(
            (m: ChatMessage) =>
              m.id !== userMsg.id &&
              m.id !== assistantMsgId &&
              !(m.role === "user" && m.content === text),
          );
          return [...filtered, userMsg, newMessage];
        },
      );
      queryClient.invalidateQueries({ queryKey: ["chatSessions"] });
    } catch (err) {
      // If the user pressed Stop, AbortError fires here — we want to KEEP
      // the partial message that was already streamed, not overwrite it.
      const wasAborted =
        err instanceof DOMException && err.name === "AbortError";
      if (!wasAborted) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsgId
              ? { ...m, content: "Sorry, I encountered an error." }
              : m,
          ),
        );
      }
    } finally {
      setIsStreaming(false);
      isProcessing.current = false;
      abortRef.current = null;
    }
  };

  // Parsing Helpers
  const parseContent = (content: string) => {
    // 1. Match <think> or <thought> tags
    const xmlThoughtMatch = content.match(
      /<(?:think|thought)>([\s\S]*?)(?:<\/(?:think|thought)>|$)/i,
    );

    // 2. Match INTERNAL REASONING style (often wrapped in << >>)
    const customThoughtMatch =
      content.match(
        /(?:INTERNAL REASONING|REASONING)[\s\S]*?<<([\s\S]*?)>>/i,
      ) || content.match(/<<([\s\S]*?)>>/i);

    const thought = (
      xmlThoughtMatch
        ? xmlThoughtMatch[1]
        : customThoughtMatch
          ? customThoughtMatch[1]
          : null
    )?.trim();

    // Cleanly remove all variations of thinking blocks from the main visible response
    const response = content
      .replace(/<(?:think|thought)>[\s\S]*?(?:<\/(?:think|thought)>|$)/i, "")
      .replace(/(?:INTERNAL REASONING|REASONING)[\s\S]*?<<[\s\S]*?>>/gi, "")
      .replace(/<<[\s\S]*?>>/gi, "")
      .trim();

    return { thought, response };
  };

  const { data: session } = useSession();
  const userName = session?.user?.name?.split(" ")[0] || "there";

  const currentTime = new Date().getHours();
  const greeting =
    currentTime < 12
      ? "Good Morning"
      : currentTime < 17
        ? "Good Afternoon"
        : "Good Evening";

  return (
    <div className="flex h-full w-full border border-border bg-card rounded-md overflow-hidden shadow-2xl shadow-primary/5 transition-all duration-700">
      {/* Sidebar - Minimal Glassmorphism */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            {/* Mobile Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 md:hidden "
            />

            {/* Sidebar Container */}
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              className={cn(
                "fixed md:relative inset-y-0 left-0 z-50 md:z-auto flex flex-col  border-r border-border bg-background/95 md:bg-background/30 backdrop-blur-xl transition-all duration-100",
                "w-72 shadow-2xl md:shadow-none",
              )}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={handleCreateSession}
                    disabled={isCreatingSession}
                    className="flex-1 flex items-center justify-between px-5 py-3.5 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all group disabled:opacity-50 disabled:hover:scale-100"
                  >
                    <div className="flex items-center space-x-2">
                      <Plus className="w-5 h-5" />
                      <span>New Thread</span>
                    </div>
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-2 space-y-6">
                <div>
                  <div className="px-4 mb-4 flex items-center justify-between">
                    <span className="font-semibold text-sm uppercase text-foreground/80">
                      Recents
                    </span>
                  </div>
                  <div className="space-y-1">
                    {sessionsLoading ? (
                      <div className="flex items-center justify-center p-8">
                        <div className="w-5 h-5 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                      </div>
                    ) : (
                      sessions?.map((s: ChatSession) => (
                        <button
                          key={s.id}
                          onClick={() => setActiveSessionId(s.id)}
                          className={`w-full text-left p-3.5 rounded-2xl  text-sm transition-all flex items-center  space-x-3 ${activeSessionId === s.id ? "bg-primary/10 font-bold text-primary ring-1 ring-primary/20" : "hover:bg-muted/50 text-foreground/90 hover:text-foreground"}`}
                        >
                          <MessageCircle className="w-4 h-4 shrink-0" />
                          <span className="truncate flex-1">
                            {s.title || "Untitled Chat"}
                          </span>
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              setSessionToDelete(s.id);
                            }}
                            className="opacity-100 p-1.5 hover:bg-red-500/10 text-red-500/60 hover:text-red-500 rounded-lg transition-all cursor-pointer "
                          >
                            <Trash2 className="w-4 h-4" />
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <Link
                href="/dashboard/profile"
                className="p-3 border-t border-border bg-background/50"
              >
                <div className="flex items-center space-x-3 p-2 rounded-2xl hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="w-8 h-8 rounded-full bg-linear-to-br from-primary to-secondary flex items-center justify-center text-white text-xs font-bold">
                    {userName[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-md font-bold truncate">
                      {session?.user?.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {session?.user?.email}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-linear-to-b from-background via-background to-primary/5 relative overflow-hidden">
        {/* Animated Background Blob */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[120px] pointer-events-none" />

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {sessionToDelete && (
            <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm ">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-card rounded-[2.5rem] p-10 max-w-sm w-full shadow-2xl border border-border"
              >
                <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mb-6 text-red-500">
                  <Trash2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-heading font-bold text-foreground mb-2">
                  Delete Thread?
                </h3>
                <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
                  This conversation will be gone forever. Sure about this?
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setSessionToDelete(null)}
                    className="flex-1 px-6 py-4 rounded-2xl border border-border font-bold hover:bg-background transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => deleteMutation.mutate(sessionToDelete)}
                    className="flex-1 px-6 py-4 rounded-2xl bg-red-500 text-white font-bold hover:bg-red-600 transition-all"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <div className="flex-none sticky w-fit top-2 left-2 flex items-center justify-between  backdrop-blur-md z-40 ">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-sm border-2 border-primary/10 hover:bg-muted text-muted-foreground transition-all"
              title={isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
            >
              {isSidebarOpen ? (
                <PanelLeftClose className="w-5 h-5" />
              ) : (
                <PanelLeftOpen className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
        {/* Messages Area */}
        <div
          ref={messagesContainerRef}
          className={cn(
            "flex-1 overflow-y-auto custom-scrollbar transition-all duration-500 chat-print-content",
            messages.length === 0
              ? "flex items-center justify-center"
              : "p-8 md:p-10 pt-13 pb-40 md:pb-30",
          )}
        >
          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-3xl px-6   text-center"
            >
              <h2 className="text-4xl md:text-5xl font-heading font-black text-foreground mb-4 tracking-tight">
                {greeting}, <span className="text-primary">{userName}</span>
              </h2>
              <p className="text-2xl text-muted-foreground mb-12 font-medium">
                What&apos;s on your{" "}
                <span className="text-secondary ">maternal journey</span> today?
              </p>

              {/* Central Input Bar (Initial State) */}
              <div className="w-full max-w-lg mx-auto mb-5 group relative">
                <div className="absolute -inset-1 bg-linear-to-r from-primary to-secondary rounded-lg blur opacity-40 group-hover:opacity-60 transition duration-1000 group-hover:duration-200" />
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (isStreaming) {
                      stopStreaming();
                      return;
                    }
                    handleSend();
                  }}
                  className="relative bg-card border border-border rounded-xl p-2 flex items-center shadow-xl"
                >
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={isStreaming ? "Streaming…" : "Ask NutriMama..."}
                    className="flex-1 bg-transparent px-4 md:px-6 md:py-4 py-2 text-sm md:text-lg font-medium outline-none min-w-0"
                    disabled={isStreaming}
                  />
                  {isStreaming ? (
                    <button
                      type="submit"
                      className="bg-foreground text-background p-2.5 md:p-4 rounded-xl hover:scale-105 active:scale-95 transition-all shrink-0"
                      aria-label="Stop"
                      title="Stop"
                    >
                      <span className="block w-4 h-4 bg-background rounded-sm mx-auto" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isCreatingSession || !input.trim()}
                      className="bg-primary text-white p-2.5 md:p-4 rounded-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 shrink-0"
                    >
                      <Send className="w-5 h-5 md:w-6 md:h-6" />
                    </button>
                  )}
                </form>
              </div>

              {/* Example Question Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
                {[
                  { q: "Healthy meal plan for 2nd trimester", icon: "🥗" },
                  { q: "How to manage morning fatigue?", icon: "⚡" },
                  { q: "Safe exercises for this week", icon: "🧘" },
                  { q: "Top 5 nutrients I need right now", icon: "✨" },
                ].map((item) => (
                  <button
                    key={item.q}
                    onClick={() => handleSend(item.q)}
                    disabled={isStreaming || isCreatingSession}
                    className="flex items-center space-x-2 p-3 md:p-5 bg-card/40 border border-border rounded-2xl text-left hover:bg-card hover:border-primary/30 hover:shadow-lg transition-all group disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
                  >
                    <span className="text-lg md:text-2xl group-hover:scale-125 transition-transform">
                      {item.icon}
                    </span>
                    <span className="text-sm md:text-xl font-bold text-foreground/80">
                      {item.q}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <div className="w-full min-h-full mx-auto space-y-10 pt-10">
              {messages.map((m: ChatMessage, i: number) => {
                const { thought, response } =
                  m.role === "assistant"
                    ? parseContent(m.content)
                    : { thought: null, response: m.content };
                const messageKey = m.id || i.toString();
                return (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={messageKey}
                    className={cn(
                      "flex w-full group scroll-mb-40",
                      m.role === "user" ? "justify-end" : "justify-start",
                    )}
                  >
                    <div className={cn("max-w-[95%] md:max-w-[85%] space-y-3")}>
                      {thought && (
                        <div className="mb-4">
                          <button
                            onClick={() => toggleThought(messageKey)}
                            className={cn(
                              "flex items-center space-x-2 uppercase font-bold py-2 px-4 rounded-full border transition-all shadow-sm",
                              expandedThoughts[messageKey]
                                ? "bg-secondary/10 border-secondary/30 text-secondary"
                                : "bg-muted/50 border-border text-muted-foreground hover:bg-muted",
                            )}
                          >
                            <Sparkles className="w-3 h-3 " />
                            <span className="text-xs md:text-sm">
                              {expandedThoughts[messageKey]
                                ? "Thought Process"
                                : "View Reasoning"}
                            </span>
                            {expandedThoughts[messageKey] ? (
                              <ChevronUp className="w-3 h-3" />
                            ) : (
                              <ChevronDown className="w-3 h-3" />
                            )}
                          </button>
                          {expandedThoughts[m.id || i] && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              className="mt-3 p-5 bg-muted/30 border-l-4 border-primary/20 rounded-r-lg text-md  text-muted-foreground  leading-relaxed backdrop-blur-sm"
                            >
                              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {thought}
                              </ReactMarkdown>
                            </motion.div>
                          )}
                        </div>
                      )}
                      <div
                        className={cn(
                          "p-4  rounded-lg shadow-sm",
                          m.role === "user"
                            ? "bg-primary text-white rounded-br-none px-4"
                            : "bg-card border border-border rounded-bl-none text-foreground ",
                        )}
                      >
                        <div>
                          {m.role === "assistant" ? (
                            response ? (
                              <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                  h1: ({ children }) => (
                                    <h1 className="text-2xl font-black text-primary underline underline-offset-8 decoration-primary/40 mb-6 mt-2 uppercase tracking-tighter">
                                      {children}
                                    </h1>
                                  ),
                                  h2: ({ children }) => (
                                    <h2 className="text-xl font-bold text-primary underline underline-offset-4 decoration-primary/30 mb-4 mt-8 uppercase ">
                                      {children}
                                    </h2>
                                  ),
                                  h3: ({ children }) => (
                                    <h3 className="text-lg font-bold text-primary/90 underline underline-offset-4 decoration-primary/20 mb-3 mt-6 uppercase ">
                                      {children}
                                    </h3>
                                  ),
                                  p: ({ children }) => (
                                    <p className="mb-6 last:mb-0 text-lg text-foreground/90 font-medium">
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
                                    <strong className="font-bold text-primary text-lg underline  decoration-primary/20 underline-offset-2">
                                      {children}
                                    </strong>
                                  ),
                                  code: ({ children }) => (
                                    <code className="bg-primary/10 text-primary px-1.5 py-0.5 rounded-md font-mono text-[11px] font-bold">
                                      {children}
                                    </code>
                                  ),
                                  table: ({ children }) => (
                                    <div className="my-8 overflow-hidden rounded-2xl border border-border shadow-xl">
                                      <table className="w-full border-collapse text-md">
                                        {children}
                                      </table>
                                    </div>
                                  ),
                                  thead: ({ children }) => (
                                    <thead className="bg-primary text-white">
                                      {children}
                                    </thead>
                                  ),
                                  th: ({ children }) => (
                                    <th className="border-r border-white/10 p-4 text-left font-black uppercase text-sm last:border-r-0">
                                      {children}
                                    </th>
                                  ),
                                  td: ({ children }) => (
                                    <td className="border-b border-r border-border/50 p-4 font-medium text-foreground last:border-r-0">
                                      {children}
                                    </td>
                                  ),
                                  tr: ({ children }) => (
                                    <tr className="bg-card  transition-colors last:child:border-b-0">
                                      {children}
                                    </tr>
                                  ),
                                }}
                              >
                                {response.replace(/<br\s*\/?>/gi, "\n")}
                              </ReactMarkdown>
                            ) : (
                              <div className="flex items-center space-x-3 text-primary/60 font-black py-2">
                                <motion.div
                                  animate={{ scale: [1, 1.2, 1] }}
                                  transition={{
                                    repeat: Infinity,
                                    duration: 1.5,
                                  }}
                                  className="w-2 h-2 bg-primary rounded-full"
                                />
                                <span className="uppercase animate-pulse text-sm md:text-md">
                                  {thinkingMessages[thinkingIndex]}
                                </span>
                              </div>
                            )
                          ) : (
                            <div className="whitespace-pre-wrap font-bold text-md md:text-lg text-white">
                              {m.content}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Floating: only the scroll-to-bottom chevron when user has scrolled
              up. Stop button now lives inline in the input form (Claude/ChatGPT pattern). */}
          {showScrollDown && (
            <button
              type="button"
              onClick={jumpToBottom}
              className="absolute right-4 bottom-32 md:bottom-28 z-30 rounded-full bg-card lift border border-border w-10 h-10 flex items-center justify-center hover:scale-105 transition-transform"
              aria-label="Jump to latest"
              title="Jump to latest"
            >
              <ChevronDown className="w-5 h-5 text-primary" />
            </button>
          )}
        </div>

        {/* Input Area (Bottom Fixed State) */}
        {messages.length > 0 && (
          <div className="absolute -bottom-4 md:-bottom-15 left-0 right-0 p-6 z-20 ">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (isStreaming) {
                  stopStreaming();
                  return;
                }
                handleSend();
              }}
              className="relative flex items-center max-w-4xl mx-auto group"
            >
              <div className="absolute -inset-1 bg-linear-to-r from-primary to-secondary rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000" />
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isStreaming ? "Streaming…" : "Ask NutriMama..."}
                className="w-full bg-card/40 backdrop-blur-3xl border border-white/20 rounded-[2.5rem] pl-6 pr-14 md:pl-8 md:pr-16 py-4 md:py-6 focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary shadow-lg transition-all text-sm md:text-base text-foreground placeholder:text-foreground/70"
                disabled={isStreaming}
              />
              {/* Single button: turns into a Stop button while streaming.
                  Same position as Send, like Claude / ChatGPT. */}
              {isStreaming ? (
                <button
                  type="submit"
                  className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 bg-foreground text-background p-3 md:p-4 rounded-full hover:scale-110 active:scale-95 transition-all shadow-lg"
                  aria-label="Stop streaming"
                  title="Stop"
                >
                  <span className="block w-3 h-3 md:w-3.5 md:h-3.5 bg-background rounded-sm" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isCreatingSession || !input.trim()}
                  className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 bg-primary text-white p-3 md:p-4 rounded-full hover:scale-110 active:scale-95 disabled:opacity-50 transition-all shadow-lg shadow-primary/30"
                  aria-label="Send"
                >
                  <Send className="w-5 h-5 md:w-6 md:h-6" />
                </button>
              )}
            </form>
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
                  <MessageCircleWarning className="w-10 h-10 animate-pulse" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-3xl font-heading font-black text-foreground tracking-tight">
                    Limit Reached
                  </h3>
                  <p className="text-muted-foreground font-medium leading-relaxed">
                    {limitError ||
                      "You've reached your chat limit for this tier."}
                  </p>
                </div>

                <div className="pt-4 flex flex-col space-y-3">
                  <Link
                    href="/dashboard/profile"
                    className="w-full bg-primary text-white py-4 rounded-2xl font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/20 flex items-center justify-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Upgrade to Pro Max</span>
                  </Link>
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
