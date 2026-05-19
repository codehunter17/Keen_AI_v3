import Link from "next/link";
import Image from "next/image";
import { FileText, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Terms of Use — NutriMama",
  description:
    "The terms that govern your use of NutriMama, an AI-assisted women's health companion.",
};

export default function TermsPage() {
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
        <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-secondary/10 text-secondary font-bold text-xs uppercase tracking-widest mb-4">
          <FileText className="w-3 h-3 mr-2" />
          Legal
        </div>
        <h1 className="text-4xl md:text-5xl font-heading font-bold mb-3">
          Terms of Use
        </h1>
        <p className="text-muted-foreground mb-12">
          Last updated: 19 May 2026
        </p>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-heading font-bold mb-3">
              1. Acceptance
            </h2>
            <p>
              By creating an account or otherwise using NutriMama (the
              &quot;Service&quot;), you agree to be bound by these Terms of Use.
              If you do not agree, please do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-bold mb-3">
              2. Not medical advice
            </h2>
            <p>
              NutriMama is an informational and wellness companion. It is{" "}
              <strong>not a substitute for professional medical advice,
              diagnosis, or treatment</strong>. Always seek the advice of your
              physician or other qualified health provider with any questions you
              may have regarding a medical condition. If you think you may have a
              medical emergency, call your doctor or an emergency service
              immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-bold mb-3">
              3. Eligibility
            </h2>
            <p>
              You must be at least 18 years old to use the Service on your own.
              Users below 18 require verifiable parental consent as described in
              our{" "}
              <Link href="/privacy" className="text-primary underline">
                Privacy Policy
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-bold mb-3">
              4. Your account
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                You are responsible for keeping your login credentials secure.
              </li>
              <li>
                You agree to provide accurate health and profile information.
              </li>
              <li>
                You will not share your account or use the Service on behalf of
                someone else without proper consent.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-bold mb-3">
              5. Subscriptions & payments
            </h2>
            <p>
              Paid plans are billed through Razorpay. Prices, features, and tier
              limits are shown on the pricing page and may change with notice.
              Refunds are governed by our refund policy and applicable Indian
              consumer law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-bold mb-3">
              6. Acceptable use
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Do not attempt to reverse engineer or attack the Service.</li>
              <li>
                Do not use the Service to harm yourself or others, or to upload
                unlawful content.
              </li>
              <li>
                Do not exceed published rate limits or attempt to bypass tier
                gates.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-bold mb-3">
              7. AI-generated content
            </h2>
            <p>
              Responses are generated by AI models and may be inaccurate,
              incomplete, or out of date. You acknowledge that you use such
              responses at your own discretion and risk.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-bold mb-3">
              8. Intellectual property
            </h2>
            <p>
              All software, design, branding, and content of the Service are
              owned by NutriMama or its licensors. You retain ownership of the
              health data and content you provide.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-bold mb-3">
              9. Termination
            </h2>
            <p>
              We may suspend or terminate access if you breach these terms or use
              the Service in a way that endangers other users or our
              infrastructure. You may close your account at any time from
              Settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-bold mb-3">
              10. Limitation of liability
            </h2>
            <p>
              To the maximum extent permitted by law, NutriMama and its founders
              are not liable for indirect, incidental, or consequential damages
              arising out of your use of the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-bold mb-3">
              11. Governing law
            </h2>
            <p>
              These terms are governed by the laws of India, with exclusive
              jurisdiction of the courts at Bengaluru, Karnataka.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-bold mb-3">
              12. Contact
            </h2>
            <p>
              Questions about these terms? Email{" "}
              <strong>support@nutrimama.app</strong>.
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
