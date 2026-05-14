"use client";

import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  FileText,
  User,
  Bell,
  Heart,
  BookOpen,
  Settings,
  Droplets,
  Sparkles,
  Leaf,
  Inbox,
  Apple,
  MoreHorizontal,
  X,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { TierBadge } from "@/components/tier-badge";
import { useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { DailyCheckIn } from "@/components/daily-check-in";
import { Loader } from "@/components/ui/loader";

const NAV_ITEMS = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Cycle", href: "/dashboard/cycle", icon: Heart },
  { label: "Wellness", href: "/dashboard/wellness", icon: Droplets },
  { label: "Meals", href: "/dashboard/meals", icon: Apple },
  { label: "Self-care", href: "/dashboard/selfcare", icon: Leaf },
  { label: "Remedies", href: "/dashboard/remedies", icon: Sparkles },
  { label: "Chat", href: "/dashboard/chat", icon: MessageSquare },
  { label: "Learn", href: "/dashboard/learn", icon: BookOpen },
  { label: "Reports", href: "/dashboard/reports", icon: FileText },
  { label: "Inbox", href: "/dashboard/inbox", icon: Inbox },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

// Mobile bottom nav shows only the 4 most-used destinations + a "More"
// button. Anything not in this list lives in the More sheet.
const MOBILE_PRIMARY_HREFS = new Set([
  "/dashboard",
  "/dashboard/cycle",
  "/dashboard/chat",
  "/dashboard/meals",
]);
const MOBILE_PRIMARY = NAV_ITEMS.filter((i) => MOBILE_PRIMARY_HREFS.has(i.href));
const MOBILE_SECONDARY = NAV_ITEMS.filter((i) => !MOBILE_PRIMARY_HREFS.has(i.href));

export function DashboardShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);

  // Close the More sheet whenever we navigate (a tap inside the sheet
  // changes pathname, so this also handles "tap, close, navigate").
  useEffect(() => {
    setMobileMoreOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/auth/sign-in");
    }
  }, [session, isPending, router]);

  if (isPending) {
    return <Loader />;
  }

  if (!session) return null;

  return (
    <div
      className={cn(
        "bg-[#FDFCFB] dark:bg-background text-foreground transition-colors duration-300",
        pathname === "/dashboard/chat"
          ? "h-screen overflow-hidden print:h-auto print:overflow-visible"
          : "min-h-screen",
      )}
    >
      {/* Premium Top Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-white/80 dark:bg-background/80 backdrop-blur-xl no-print">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-8">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-3 shrink-0 hover:opacity-80 transition-opacity"
          >
            <div className="relative w-10 h-10 overflow-hidden rounded-xl shadow-md border border-primary/20">
              <Image
                src="/Nutrilogo.jpg"
                alt="NutriMama Logo"
                fill
                priority
                sizes="40px"
                className="object-cover"
              />
            </div>
            <span className="text-xl font-heading font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent hidden sm:block">
              NutriMama
            </span>
            <TierBadge />
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-4">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-bold transition-all flex items-center space-x-2",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  {isActive && <item.icon className="w-4 h-4" />}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-3 md:space-x-4">
            <button
              type="button"
              className="p-2.5 rounded-full hover:bg-muted relative"
            >
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-white dark:border-background" />
            </button>
            <ThemeToggle />
            <Link
              href="/dashboard/profile"
              className="w-10 h-10 rounded-full bg-primary/10 border-2 border-white dark:border-border overflow-hidden flex items-center justify-center text-primary font-bold shadow-sm hover:scale-105 transition-transform"
            >
              <User className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main
        className={cn(
          "mx-auto transition-all duration-500",
          pathname === "/dashboard/chat"
            ? "max-w-none h-[calc(100vh-5rem)] py-0 overflow-hidden"
            : "max-w-7xl py-12 md:py-16 px-6",
        )}
      >
        <div
          className={cn(
            "h-full w-full",
            pathname === "/dashboard/chat"
              ? "pb-0"
              : "flex justify-center items-center",
          )}
        >
          {children}
        </div>
      </main>

      {/* Mobile Navigation — 4 primary tabs + More. Anything beyond the
          four lives in the slide-up sheet so labels never collide. */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 border-t border-border bg-white/95 dark:bg-background/95 backdrop-blur-xl md:hidden no-print pb-[env(safe-area-inset-bottom)]">
        {MOBILE_PRIMARY.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center justify-center gap-1 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground",
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive && "scale-110 transition-transform")} />
              <span className="text-[10px] font-semibold tracking-wide">
                {item.label}
              </span>
            </Link>
          );
        })}
        <button
          type="button"
          onClick={() => setMobileMoreOpen((v) => !v)}
          aria-expanded={mobileMoreOpen}
          aria-label="More"
          className={cn(
            "flex flex-1 flex-col items-center justify-center gap-1 transition-colors",
            mobileMoreOpen
              ? "text-primary"
              : MOBILE_SECONDARY.some((i) => i.href === pathname)
                ? "text-primary"
                : "text-muted-foreground",
          )}
        >
          <MoreHorizontal className="h-5 w-5" />
          <span className="text-[10px] font-semibold tracking-wide">More</span>
        </button>
      </nav>

      {/* Mobile "More" sheet — slides up from the bottom, lists everything
          not on the primary nav. Tapping anywhere outside dismisses. */}
      {mobileMoreOpen && (
        <div className="fixed inset-0 z-[60] md:hidden no-print">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-foreground/40 backdrop-blur-sm animate-in fade-in"
            onClick={() => setMobileMoreOpen(false)}
          />
          {/* Sheet */}
          <div
            className="absolute bottom-0 left-0 right-0 bg-card border-t border-border rounded-t-3xl shadow-2xl pb-[calc(env(safe-area-inset-bottom)+1rem)] pt-4 px-5 animate-in slide-in-from-bottom"
            role="dialog"
            aria-label="More navigation"
          >
            {/* Grab handle */}
            <div className="w-10 h-1 rounded-full bg-border mx-auto mb-3" />
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading text-lg text-foreground">More</h2>
              <button
                type="button"
                onClick={() => setMobileMoreOpen(false)}
                aria-label="Close"
                className="p-1.5 rounded-full hover:bg-muted text-muted-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {MOBILE_SECONDARY.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex flex-col items-center justify-center gap-2 rounded-2xl p-4 border transition-all",
                      isActive
                        ? "bg-primary/10 border-primary/30 text-primary"
                        : "bg-card border-border hover:bg-muted text-foreground",
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="text-xs font-medium text-center">
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <DailyCheckIn />
    </div>
  );
}
