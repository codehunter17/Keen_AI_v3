import Link from "next/link";
import Image from "next/image";
import { Shield, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Privacy Policy — NutriMama",
  description:
    "How NutriMama collects, uses, and protects your health data under India's DPDP Act, 2023.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/NutriLogo.svg"
              alt="NutriMama Logo"
              width={32}
              height={32}
              className="rounded-lg"
            />
            <span className="font-heading font-bold text-lg">NutriMama</span>
          </Link>
          <Link
            href="/"
            className="flex items-center space-x-1 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Home</span>
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-widest mb-4">
          <Shield className="w-3 h-3 mr-2" />
          Privacy & Data Protection
        </div>
        <h1 className="text-4xl md:text-5xl font-heading font-bold mb-3">
          Privacy Policy
        </h1>
        <p className="text-muted-foreground mb-12">
          Last updated: 19 May 2026
        </p>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-heading font-bold mb-3">1. Who we are</h2>
            <p>
              NutriMama (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is an
              AI-assisted women&apos;s health companion focused on pre-pregnancy,
              pregnancy, postpartum, and menstrual wellness. This policy explains
              what personal data we collect, why we collect it, and the rights
              you have under India&apos;s Digital Personal Data Protection Act,
              2023 (&quot;DPDP Act&quot;).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-bold mb-3">
              2. What we collect
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Account data:</strong> name, email, phone number, hashed
                password.
              </li>
              <li>
                <strong>Health data you provide:</strong> pregnancy stage, last
                menstrual period, cycle logs, symptoms, mood, sleep, nutrition
                preferences, condition flags such as PCOS.
              </li>
              <li>
                <strong>Conversations:</strong> messages you send to the AI
                assistant, stored to maintain context and improve safety.
              </li>
              <li>
                <strong>Device & usage data:</strong> browser type, locale,
                anonymised analytics events.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-bold mb-3">
              3. Why we use your data
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Personalising nutrition, cycle, and wellness guidance.</li>
              <li>
                Running medical triage (RED / YELLOW / GREEN) and emergency
                escalations.
              </li>
              <li>Sending check-in reminders and weekly summaries.</li>
              <li>Processing subscription payments via Razorpay.</li>
              <li>Detecting abuse and keeping the service secure.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-bold mb-3">
              4. Legal basis (DPDP Act, 2023)
            </h2>
            <p>
              We process your personal data on the basis of your explicit consent,
              which you give during sign-up and onboarding. You may withdraw
              consent at any time from{" "}
              <Link
                href="/dashboard/settings/privacy"
                className="text-primary underline"
              >
                Settings → Privacy
              </Link>
              . Withdrawal does not affect lawful processing already carried out.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-bold mb-3">
              5. AI processing & PII redaction
            </h2>
            <p>
              Before any message is sent to an AI provider (Groq, Gemini, Claude),
              we automatically scrub Indian PII — Aadhaar, PAN, phone numbers,
              email, ABHA, voter ID, and bank account numbers — so the model only
              receives the clinical content it needs.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-bold mb-3">
              6. Sharing and third parties
            </h2>
            <p>
              We do not sell your data. We share limited data only with:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>AI providers strictly for generating responses.</li>
              <li>Razorpay for payment processing.</li>
              <li>Hosting and email infrastructure (Vercel, Resend).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-bold mb-3">
              7. Retention
            </h2>
            <p>
              Account and health data are retained while your account is active
              and for up to 90 days after deletion to satisfy audit and legal
              obligations, after which they are permanently erased.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-bold mb-3">
              8. Your rights
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access and download a copy of your data.</li>
              <li>Correct inaccurate information.</li>
              <li>Erase your account and associated data.</li>
              <li>Withdraw consent for specific processing.</li>
              <li>Nominate a person to act on your behalf (DPDP § 14).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-bold mb-3">
              9. Children & minors
            </h2>
            <p>
              For users under 18, we require verifiable parental consent before
              processing any personal data, evidenced by a ₹1 Razorpay
              transaction from a verified parent, as per DPDP § 9.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-bold mb-3">
              10. Contact
            </h2>
            <p>
              For privacy questions or grievances, contact our Data Protection
              Officer at <strong>privacy@nutrimama.app</strong>.
            </p>
          </section>
        </div>
      </main>

      <footer className="border-t border-border mt-16">
        <div className="max-w-4xl mx-auto px-6 py-8 flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          <span>© {new Date().getFullYear()} NutriMama</span>
          <div className="flex space-x-6">
            <Link href="/privacy" className="hover:text-primary transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-primary transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
