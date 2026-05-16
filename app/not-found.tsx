import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[100dvh] flex items-center justify-center px-6 py-12 bg-background">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="text-5xl">🌿</div>
        <h1 className="text-3xl font-heading font-bold text-foreground">
          We can&apos;t find that page
        </h1>
        <p className="text-sm text-muted-foreground">
          The page may have moved or doesn&apos;t exist. Let&apos;s get you back
          on track.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/dashboard"
            className="h-12 px-6 rounded-full bg-primary text-white font-semibold inline-flex items-center justify-center hover:opacity-90 transition"
          >
            Open dashboard
          </Link>
          <Link
            href="/"
            className="h-12 px-6 rounded-full border border-border text-foreground font-semibold inline-flex items-center justify-center hover:bg-muted transition"
          >
            Back home
          </Link>
        </div>
      </div>
    </div>
  );
}
