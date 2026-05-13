import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { TIER_PRICING, TIER_LIMITS } from "@/lib/tiers";
import { RazorpayCheckoutButton } from "@/components/razorpay-checkout";
import { RedeemForm } from "./redeem-form";

export const metadata = { title: "Plans · NutriMama" };

const FEATURES: { label: string; tiers: ("FREE" | "CARE_49" | "PRO_99")[] }[] = [
  { label: "Cycle tracking & calendar", tiers: ["FREE", "CARE_49", "PRO_99"] },
  { label: "Daily wellness log (sleep, mood, water)", tiers: ["FREE", "CARE_49", "PRO_99"] },
  { label: "Curated content library", tiers: ["FREE", "CARE_49", "PRO_99"] },
  { label: "AI chat companion", tiers: ["FREE", "CARE_49", "PRO_99"] },
  { label: "Medical report analysis", tiers: ["CARE_49", "PRO_99"] },
  { label: "Personalized meal plans", tiers: ["CARE_49", "PRO_99"] },
  { label: "PCOS screening + insights", tiers: ["CARE_49", "PRO_99"] },
  { label: "Pregnancy risk prediction (ML)", tiers: ["CARE_49", "PRO_99"] },
  { label: "PDF export of your reports", tiers: ["CARE_49", "PRO_99"] },
  { label: "Unlimited reports & meal plans", tiers: ["PRO_99"] },
  { label: "Partner / family access", tiers: ["PRO_99"] },
  { label: "Priority support", tiers: ["PRO_99"] },
];

export default async function PricingPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:py-20">
        <div className="text-center mb-10">
          <span className="chip surface-premium border-primary/30 text-primary">Plans</span>
          <h1 className="mt-3 font-heading text-4xl sm:text-5xl tracking-tight">
            Care that grows with you
          </h1>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Start free. Upgrade when you want unlimited AI, deeper insights, and
            partner access. Cancel anytime.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 items-stretch pt-4">
          <PlanCard
            tier="FREE"
            current={!session}
            highlight={false}
            features={FEATURES.filter((f) => f.tiers.includes("FREE"))}
            limits={[
              `${TIER_LIMITS.FREE.aiChatsPerDay} AI chats / day`,
              "Cycle + daily wellness log",
              "No reports, no meal plans",
            ]}
            cta={
              session ? (
                <div className="block w-full text-center rounded-full border border-border bg-muted/30 py-2.5 text-sm font-semibold text-muted-foreground">
                  Your current plan
                </div>
              ) : (
                <a href="/auth/sign-up" className="block w-full text-center rounded-full border border-primary py-2.5 text-sm font-semibold text-primary hover:bg-primary/5 transition-colors">
                  Get started free
                </a>
              )
            }
          />

          <PlanCard
            tier="CARE_49"
            highlight={true}
            features={FEATURES.filter((f) => f.tiers.includes("CARE_49"))}
            limits={[
              `${TIER_LIMITS.CARE_49.aiChatsPerDay} AI chats / day`,
              `${TIER_LIMITS.CARE_49.reportAnalysesPerMonth} report analyses / month`,
              `${TIER_LIMITS.CARE_49.nutritionPlanPerMonth} meal plans / month`,
            ]}
            cta={
              session ? (
                <RazorpayCheckoutButton
                  tier="CARE_49"
                  label="Upgrade to Care · ₹49/mo"
                  user={{ name: session.user.name ?? "", email: session.user.email ?? "" }}
                />
              ) : (
                <a href="/auth/sign-up" className="block w-full text-center rounded-full bg-primary py-2 text-sm font-medium text-primary-foreground">
                  Sign up to upgrade
                </a>
              )
            }
          />

          <PlanCard
            tier="PRO_99"
            highlight={false}
            premium={true}
            features={FEATURES.filter((f) => f.tiers.includes("PRO_99"))}
            limits={[
              `${TIER_LIMITS.PRO_99.aiChatsPerDay} AI chats / day`,
              "Unlimited reports",
              "Unlimited meal plans",
              "Partner / family access",
            ]}
            cta={
              session ? (
                <RazorpayCheckoutButton
                  tier="PRO_99"
                  variant="secondary"
                  label="Go Pro · ₹99/mo"
                  user={{ name: session.user.name ?? "", email: session.user.email ?? "" }}
                />
              ) : (
                <a href="/auth/sign-up" className="block w-full text-center rounded-full border border-border py-2 text-sm font-medium">
                  Sign up to upgrade
                </a>
              )
            }
          />
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          Pricing in INR. Billed monthly via Razorpay (UPI, cards, netbanking).
          Cancel anytime in Settings → Subscription.
        </p>

        {session && <RedeemForm />}
      </div>
    </main>
  );
}

function PlanCard({
  tier,
  features,
  limits,
  cta,
  highlight,
  premium,
  current,
}: {
  tier: "FREE" | "CARE_49" | "PRO_99";
  features: { label: string }[];
  limits: string[];
  cta: React.ReactNode;
  highlight?: boolean;
  premium?: boolean;
  current?: boolean;
}) {
  const p = TIER_PRICING[tier];
  return (
    <div
      className={`relative flex flex-col rounded-2xl p-6 lift h-full ${
        highlight
          ? "surface-premium ring-2 ring-primary scale-[1.02] z-10"
          : premium
            ? "surface-gold ring-1 ring-amber-300/50"
            : "bg-card border border-border"
      }`}
    >
      {highlight && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center rounded-full bg-primary text-primary-foreground border border-primary px-3 py-1 text-xs font-bold uppercase tracking-wider shadow-lg whitespace-nowrap">
          Most popular
        </span>
      )}
      {current && (
        <span className="absolute -top-3 right-4 inline-flex items-center rounded-full bg-card border border-border px-3 py-1 text-xs font-medium shadow-sm">
          Current
        </span>
      )}

      <div className="flex items-baseline gap-2 mb-1">
        <span className="font-heading text-2xl">{p.label}</span>
        {premium && (
          <span className="inline-flex items-center rounded-full border border-amber-300 bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">
            Pro
          </span>
        )}
      </div>
      <p className="text-sm text-muted-foreground mb-4 min-h-[2.5rem]">{p.tagline}</p>

      <div className="mb-5">
        {p.priceInPaise === 0 ? (
          <span className="font-heading text-3xl">Free</span>
        ) : (
          <>
            <span className="font-heading text-3xl">₹{p.priceInPaise / 100}</span>
            <span className="text-sm text-muted-foreground"> /month</span>
          </>
        )}
      </div>

      <ul className="space-y-1.5 text-sm mb-4">
        {limits.map((l) => (
          <li key={l} className="text-foreground">• {l}</li>
        ))}
      </ul>

      <div className="h-px w-full bg-border/60 my-2" />

      <ul className="space-y-1.5 text-sm text-muted-foreground mb-6 flex-1">
        {features.map((f) => (
          <li key={f.label} className="flex items-start gap-2">
            <span className="text-primary font-bold mt-0.5">✓</span>
            <span>{f.label}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-2">{cta}</div>
    </div>
  );
}
