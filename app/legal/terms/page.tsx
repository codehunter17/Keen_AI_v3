// DRAFT — review with a lawyer before public launch.

export const metadata = { title: "Terms of Use · NutriMama" };

const TERMS_VERSION = "terms-2026-05-07";

export default function TermsPage() {
  return (
    <>
      <h1>Terms of Use</h1>
      <p>
        <strong>Version:</strong> {TERMS_VERSION} · <strong>Effective:</strong>{" "}
        7 May 2026
      </p>

      <p>
        These Terms govern your use of <strong>NutriMama</strong> (the
        &quot;Service&quot;). By creating an account you agree to these Terms.
        If you do not agree, please do not use the Service.
      </p>

      <h2>1. Eligibility</h2>
      <p>
        You must be at least <strong>18 years old</strong> to create an account.
        Users under 18 may use NutriMama only as a Dependent Profile created
        by a verified parent or legal guardian, after the parent has provided
        verifiable parental consent in accordance with the DPDP Act §9.
      </p>

      <h2>2. Not medical advice</h2>
      <p>
        NutriMama is an AI-assisted wellness companion. It provides general
        information, educational content, and personalised suggestions. It is{" "}
        <strong>not</strong> a medical device, is not a substitute for a
        doctor, and does not diagnose, prescribe, or treat any condition. In a
        medical emergency, dial <strong>112</strong>.
      </p>

      <h2>3. Your account</h2>
      <ul>
        <li>You&apos;re responsible for keeping your login credentials secure.</li>
        <li>The information you provide must be accurate and your own.</li>
        <li>If you create a Dependent Profile, you confirm you are the parent or legal guardian of that child.</li>
      </ul>

      <h2>4. Acceptable use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Use the Service for any unlawful purpose;</li>
        <li>Attempt to bypass safety, age-gate, or rate-limit controls;</li>
        <li>Reverse-engineer, copy, or compete with NutriMama;</li>
        <li>Submit content that infringes someone else&apos;s rights;</li>
        <li>Use the AI to harm yourself or others or to obtain advice you would not seek from a qualified professional.</li>
      </ul>

      <h2>5. Subscriptions &amp; payments</h2>
      <p>
        Paid tiers (Care ₹49/month, Pro ₹99/month) are billed monthly via
        Razorpay. Subscriptions auto-renew until canceled in <em>Settings →
        Subscription</em>. Refunds are at our discretion and generally only
        granted for billing errors. Coupon codes are for one-time use unless
        stated otherwise.
      </p>

      <h2>6. AI behaviour &amp; safety</h2>
      <p>
        Our AI may produce inaccurate or incomplete information. You should
        not rely on it for medical decisions. If our safety system detects
        keywords associated with an emergency or self-harm, the AI will not
        respond and instead provide India helpline numbers.
      </p>

      <h2>7. Intellectual property</h2>
      <p>
        NutriMama (including the brand, design, software, and curated content)
        is owned by us. You may use the Service for personal, non-commercial
        use only. Content you upload remains yours; you grant us a limited
        license to host and process it solely to provide the Service.
      </p>

      <h2>8. Termination</h2>
      <p>
        You may close your account anytime. We may suspend or terminate your
        access if you violate these Terms or applicable law, with notice
        where reasonable.
      </p>

      <h2>9. Limitation of liability</h2>
      <p>
        To the maximum extent permitted by Indian law, NutriMama&apos;s total
        liability for any claim is limited to the amount you paid us in the
        12 months before the claim arose. We are not liable for indirect or
        consequential damages, or for medical decisions you make based on
        information from the Service.
      </p>

      <h2>10. Governing law</h2>
      <p>
        These Terms are governed by the laws of India. Disputes are subject
        to the exclusive jurisdiction of the courts of Bengaluru, Karnataka.
      </p>

      <h2>11. Contact</h2>
      <p>
        Questions? <a href="mailto:hello@nutrimama.app">hello@nutrimama.app</a>
      </p>
    </>
  );
}
