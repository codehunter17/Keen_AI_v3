"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { signIn, useSession, isGoogleSocialEnabled } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";

import { AlertCircle, Phone, Mail, ArrowLeft } from "lucide-react";
import { Loader } from "@/components/ui/loader";

type Mode = "phone" | "email";
type PhaseInPhone = "enter-phone" | "enter-code";

export default function SignInPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const googleSocialEnabled = isGoogleSocialEnabled;

  // Default to phone — it's the primary path for rural users. Email
  // remains one tap away for anyone who prefers it.
  const [mode, setMode] = useState<Mode>("phone");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Email-mode state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Phone-mode state
  const [phase, setPhase] = useState<PhaseInPhone>("enter-phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [confirmedPhone, setConfirmedPhone] = useState("");

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await signIn.email({
      email,
      password,
      fetchOptions: {
        onSuccess: () => {
          setLoading(false);
          router.push("/dashboard");
        },
        onError: (ctx) => {
          setLoading(false);
          const msg = ctx.error.message ?? "";
          const code = (ctx.error as { code?: string }).code ?? "";
          if (
            code === "EMAIL_NOT_VERIFIED" ||
            msg.toLowerCase().includes("verify") ||
            msg.toLowerCase().includes("not verified")
          ) {
            setError(
              "Your email isn't verified yet. Check your inbox for the link we sent.",
            );
          } else if (ctx.error.status === 401) {
            setError("Wrong email or password. Try again or sign up below.");
          } else {
            setError(msg || "Something went wrong. Please try again.");
          }
        },
      },
    });
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/otp/send", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      setLoading(false);
      if (!data.ok) {
        setError(data.message ?? "Couldn't send OTP. Try email sign-in instead.");
        return;
      }
      setConfirmedPhone(data.phone);
      setPhase("enter-code");
    } catch {
      setLoading(false);
      setError("Network issue. Check your connection and try again.");
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/otp/verify", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ phone: confirmedPhone, code }),
      });
      const data = await res.json();
      if (!data.ok) {
        setLoading(false);
        setError(data.message ?? "Wrong code. Try again.");
        return;
      }
      // Hard nav (not router.push) so the freshly-set session cookie is
      // applied before the destination page runs any auth checks. router.push
      // can occasionally race with the cookie write on slow connections.
      window.location.href = data.needsOnboarding ? "/onboarding" : "/dashboard";
    } catch {
      setLoading(false);
      setError("Network issue. Check your connection and try again.");
    }
  };

  if (isPending || loading) {
    return <Loader />;
  }
  if (session) return null;

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="absolute top-8 right-8">
        <ThemeToggle />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-2xl bg-card p-7 sm:p-8 shadow-xl backdrop-blur-xl border border-white/20"
      >
        <div className="mb-6 text-center flex flex-col items-center">
          <Image
            src="/NutriLogo.svg"
            alt="NutriMama Logo"
            width={56}
            height={56}
            className="rounded-2xl mb-3 shadow-lg"
          />
          <h1 className="text-2xl sm:text-3xl font-heading text-primary">Welcome Back</h1>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to NutriMama</p>
        </div>

        {/* Mode tabs — phone vs email. Phone first because rural India. */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-muted rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => {
              setMode("phone");
              setError("");
            }}
            className={
              "flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-colors " +
              (mode === "phone"
                ? "bg-card text-primary shadow-sm"
                : "text-muted-foreground hover:text-foreground")
            }
          >
            <Phone className="w-4 h-4" />
            Phone
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("email");
              setError("");
            }}
            className={
              "flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-colors " +
              (mode === "email"
                ? "bg-card text-primary shadow-sm"
                : "text-muted-foreground hover:text-foreground")
            }
          >
            <Mail className="w-4 h-4" />
            Email
          </button>
        </div>

        <AnimatePresence mode="wait">
          {mode === "phone" ? (
            <motion.div
              key="phone"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {phase === "enter-phone" ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground">
                      Mobile number
                    </label>
                    <div className="mt-1 flex rounded-xl border border-input bg-card/50 focus-within:ring-1 focus-within:ring-primary h-12 overflow-hidden">
                      <span className="px-3 inline-flex items-center text-sm font-medium text-muted-foreground bg-muted/40 border-r border-input">
                        +91
                      </span>
                      <input
                        type="tel"
                        inputMode="numeric"
                        autoComplete="tel"
                        pattern="[6-9]\d{9}"
                        maxLength={10}
                        className="flex-1 bg-transparent px-4 outline-none text-base"
                        placeholder="98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                        required
                      />
                    </div>
                    <p className="mt-1.5 text-xs text-muted-foreground">
                      We&apos;ll send a 6-digit code via SMS. Indian mobile numbers only for now.
                    </p>
                  </div>

                  {error && <ErrorBanner>{error}</ErrorBanner>}

                  <button
                    type="submit"
                    disabled={loading || phone.length !== 10}
                    className="w-full rounded-xl bg-primary px-4 py-3 font-semibold text-white transition hover:bg-primary/90 active:scale-95 disabled:opacity-50"
                  >
                    Send OTP
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="flex items-center gap-2 mb-1">
                    <button
                      type="button"
                      onClick={() => {
                        setPhase("enter-phone");
                        setCode("");
                        setError("");
                      }}
                      className="text-muted-foreground hover:text-foreground"
                      aria-label="Change number"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <span className="text-sm text-muted-foreground">
                      Code sent to <strong className="text-foreground">{confirmedPhone}</strong>
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground">
                      Enter 6-digit code
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      pattern="\d{4,8}"
                      maxLength={8}
                      className="mt-1 block w-full rounded-xl border border-input bg-card/50 px-4 py-2 outline-none focus:ring-1 focus:ring-primary h-12 text-center tracking-[0.4em] text-lg font-mono"
                      placeholder="••••••"
                      value={code}
                      onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                      required
                      autoFocus
                    />
                  </div>

                  {error && <ErrorBanner>{error}</ErrorBanner>}

                  <button
                    type="submit"
                    disabled={loading || code.length < 4}
                    className="w-full rounded-xl bg-primary px-4 py-3 font-semibold text-white transition hover:bg-primary/90 active:scale-95 disabled:opacity-50"
                  >
                    Verify & sign in
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      handleSendOtp(e);
                    }}
                    className="w-full text-center text-xs text-muted-foreground hover:text-primary"
                  >
                    Didn&apos;t get it? Resend
                  </button>
                </form>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="email"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <form onSubmit={handleEmailSignIn} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground">Email</label>
                  <input
                    type="email"
                    autoComplete="email"
                    className="mt-1 block w-full rounded-xl border border-input bg-card/50 px-4 py-2 outline-none focus:ring-1 focus:ring-primary h-12"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground">Password</label>
                  <input
                    type="password"
                    autoComplete="current-password"
                    className="mt-1 block w-full rounded-xl border border-input bg-card/50 px-4 py-2 outline-none focus:ring-1 focus:ring-primary h-12"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                {error && <ErrorBanner>{error}</ErrorBanner>}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-primary px-4 py-3 font-semibold text-white transition hover:bg-primary/90 active:scale-95 disabled:opacity-50"
                >
                  Sign in
                </button>
              </form>

              {googleSocialEnabled && (
                <>
                  <div className="my-5 flex items-center">
                    <div className="h-px w-full bg-border" />
                    <span className="px-3 text-[10px] font-medium text-muted-foreground uppercase whitespace-nowrap tracking-wider">
                      or
                    </span>
                    <div className="h-px w-full bg-border" />
                  </div>
                  <button
                    onClick={async () => {
                      setLoading(true);
                      await signIn.social({ provider: "google", callbackURL: "/dashboard" });
                    }}
                    className="flex w-full items-center justify-center space-x-3 rounded-xl border border-border bg-card px-4 py-3 font-semibold transition hover:bg-muted active:scale-95"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    <span>Continue with Google</span>
                  </button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/auth/sign-up" className="text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

function ErrorBanner({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-start space-x-2 rounded-xl bg-red-500/10 p-3 text-sm text-red-500 border border-red-500/20"
    >
      <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
      <span>{children}</span>
    </motion.div>
  );
}
