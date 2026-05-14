"use client";
import { useState } from "react";
import Link from "next/link";
import { signIn, useSession, isGoogleSocialEnabled } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";

import { AlertCircle } from "lucide-react";
import { Loader } from "@/components/ui/loader";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const googleSocialEnabled = isGoogleSocialEnabled;

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  const handleSignIn = async (e: React.FormEvent) => {
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
          // Better Auth signals an unverified email account on sign-in
          // attempt — surface a clear message + offer to resend.
          if (
            code === "EMAIL_NOT_VERIFIED" ||
            msg.toLowerCase().includes("verify") ||
            msg.toLowerCase().includes("not verified")
          ) {
            setError(
              "Your email isn't verified yet. Check your inbox for the link we sent, or click below to resend.",
            );
          } else if (ctx.error.status === 401) {
            setError(
              "Invalid email or password. Please check your spelling or sign up below.",
            );
          } else {
            setError(msg || "Something went wrong. Please try again.");
          }
        },
      },
    });
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
        className="w-full max-w-md rounded-2xl bg-card p-8 shadow-xl backdrop-blur-xl border border-white/20"
      >
        <div className="mb-8 text-center flex flex-col items-center">
          <Image
            src="/NutriLogo.svg"
            alt="NutriMama Logo"
            width={64}
            height={64}
            className="rounded-2xl mb-4 shadow-lg"
          />
          <h1 className="text-3xl font-heading text-primary">Welcome Back</h1>
          <p className="mt-2 text-muted-foreground">Sign in to NutriMama</p>
        </div>
        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground">
              Email
            </label>
            <input
              type="email"
              className="mt-1 block w-full rounded-xl border border-input bg-card/50 px-4 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary h-11"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {error && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2 rounded-xl bg-red-500/10 p-3 text-sm text-red-500 border border-red-500/20"
            >
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}
          <div>
            <label className="block text-sm font-medium text-foreground">
              Password
            </label>
            <input
              type="password"
              className="mt-1 block w-full rounded-xl border border-input bg-card/50 px-4 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary h-11 transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-primary px-4 py-3 font-semibold text-white transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center space-x-2"
          >
            {loading ? (
              <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between">
          <div className="h-px w-full bg-border" />
          <span className="px-4 text-xs font-medium text-muted-foreground uppercase whitespace-nowrap">
            Or continue with
          </span>
          <div className="h-px w-full bg-border" />
        </div>

        {googleSocialEnabled ? (
          <>
            <button
              onClick={async () => {
                setLoading(true);
                await signIn.social({
                  provider: "google",
                  callbackURL: "/dashboard",
                });
              }}
              className="mt-6 flex w-full items-center justify-center space-x-3 rounded-xl border border-border bg-card px-4 py-3 font-semibold transition-all hover:bg-muted hover:scale-[1.02] active:scale-95"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              <span>Google</span>
            </button>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              Or sign in with your email and password.
            </p>
          </>
        ) : null}
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
