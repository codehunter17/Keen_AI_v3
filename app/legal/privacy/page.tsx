// DRAFT — review with a lawyer before public launch.
// Aligned with India's Digital Personal Data Protection Act 2023 and the
// Information Technology (Reasonable Security Practices) Rules 2011.

export const metadata = { title: "Privacy Policy · NutriMama" };

const POLICY_VERSION = "privacy-2026-05-07";

export default function PrivacyPage() {
  return (
    <>
      <h1>Privacy Policy</h1>
      <p>
        <strong>Version:</strong> {POLICY_VERSION} · <strong>Effective:</strong>{" "}
        7 May 2026
      </p>

      <p>
        This Privacy Policy explains how <strong>NutriMama</strong> (&quot;we&quot;,
        &quot;us&quot;) collects, uses, stores, and protects your personal data
        when you use our website and mobile app (the &quot;Service&quot;). We comply
        with India&apos;s Digital Personal Data Protection Act 2023 (DPDP Act).
      </p>

      <h2>1. The data we collect</h2>
      <ul>
        <li>
          <strong>Account data:</strong> name, email, date of birth, language
          preference, and (if you choose) phone number.
        </li>
        <li>
          <strong>Health data you provide:</strong> menstrual cycle, symptoms,
          pregnancy details, medical reports you upload, vitals, dietary
          preferences, mood, sleep, and other inputs you log.
        </li>
        <li>
          <strong>Device data:</strong> IP address, user-agent, app version, and
          basic usage telemetry needed to keep the Service working and secure.
        </li>
        <li>
          <strong>Payment data:</strong> processed by Razorpay (and optionally
          Stripe). We never see your full card or UPI credentials — only a
          masked reference and the payment status.
        </li>
      </ul>

      <h2>2. How we use it</h2>
      <ul>
        <li>To provide cycle tracking, AI chat, report analysis, meal plans, and other features you request.</li>
        <li>To personalize content and recommendations to your life stage.</li>
        <li>To detect emergencies (e.g., self-harm or obstetric danger keywords) and surface helpline numbers.</li>
        <li>To process subscriptions and prevent fraud.</li>
        <li>
          <strong>Optionally,</strong> to improve our AI models — only if you
          opt in. Data used for training is anonymized and aggregated. You can
          withdraw this consent anytime in <em>Settings → Privacy</em>.
        </li>
      </ul>

      <h2>3. AI and our medical position</h2>
      <p>
        Our AI features use Google Gemini and other third-party large language
        models. We do not allow these providers to train on your data
        (Gemini API default for paid tiers, Anthropic API). Your conversations
        and reports are sent to Google&apos;s servers in encrypted form to
        produce a response and are not retained beyond Google&apos;s standard
        operational windows.
      </p>
      <p>
        <strong>Important:</strong> NutriMama is a wellness companion. It is{" "}
        <strong>not</strong> a medical device, is not registered with the
        CDSCO, and does not provide medical advice, diagnosis, or treatment.
        Always consult a qualified doctor for medical concerns.
      </p>

      <h2>4. Children (under 18)</h2>
      <p>
        Standalone NutriMama accounts are restricted to users aged{" "}
        <strong>18 and over</strong>. Children may use the Service only as a{" "}
        <em>Dependent Profile</em> created by a verified parent or legal
        guardian. Verifiable parental consent is captured via a Razorpay ₹1
        authenticated payment (refunded immediately) and recorded as required
        by DPDP Act §9.
      </p>
      <p>
        For Dependent Profiles we never run open-ended AI generation. Children
        only see human-curated educational content. We do not perform
        behavioural monitoring, do not show advertisements, and do not share
        any data with third parties except as strictly required to operate the
        Service (e.g., hosting, payment processing).
      </p>

      <h2>5. Data security &amp; storage</h2>
      <ul>
        <li>Encrypted in transit (TLS 1.2+) and at rest (AES-256).</li>
        <li>Hosted on infrastructure within India where available, otherwise standard cloud regions.</li>
        <li>Access controlled, audited, and limited to staff with a need-to-know.</li>
      </ul>

      <h2>6. Your rights under the DPDP Act</h2>
      <ul>
        <li><strong>Access &amp; correction:</strong> view and update your data anytime.</li>
        <li><strong>Erasure:</strong> request full deletion in <em>Settings → Privacy → Delete my data</em>. Hard purge runs within 7 days.</li>
        <li><strong>Withdrawal of consent:</strong> withdraw any optional consent (e.g., model training) anytime, with no impact on the core service.</li>
        <li><strong>Grievance:</strong> contact our Data Protection Officer at <a href="mailto:privacy@nutrimama.app">privacy@nutrimama.app</a>. We aim to respond within 7 business days.</li>
      </ul>

      <h2>7. Sharing</h2>
      <p>
        We do <strong>not</strong> sell your data. We share data only with
        sub-processors strictly necessary to run NutriMama: Neon (database),
        Vercel (hosting), Google (Gemini AI), UploadThing/Cloudflare (file
        storage), Razorpay (payments), and email/notification providers. Each
        sub-processor is contractually bound to confidentiality and security
        obligations.
      </p>

      <h2>8. Retention</h2>
      <p>
        We retain your data while your account is active. After deletion we
        retain only the minimum required for legal, financial, or security
        reasons (typically up to 3 years for invoicing).
      </p>

      <h2>9. Changes</h2>
      <p>
        We&apos;ll notify you in-app before any material change. The version
        identifier above will increment so historical consents remain
        traceable.
      </p>

      <h2>10. Contact</h2>
      <p>
        Data Protection Officer · <a href="mailto:privacy@nutrimama.app">privacy@nutrimama.app</a>
      </p>
    </>
  );
}
