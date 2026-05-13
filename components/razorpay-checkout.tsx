"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  createCheckoutOrder,
  confirmPayment,
} from "@/lib/actions/subscription";

declare global {
  interface Window {
    Razorpay?: new (opts: RazorpayOptions) => { open: () => void };
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill?: { name?: string; email?: string };
  theme?: { color?: string };
  handler: (response: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => void;
  modal?: { ondismiss?: () => void };
}

const SCRIPT_SRC = "https://checkout.razorpay.com/v1/checkout.js";

function loadScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = SCRIPT_SRC;
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

export function RazorpayCheckoutButton({
  tier,
  label,
  user,
  variant = "default",
  className,
}: {
  tier: "CARE_49" | "PRO_99";
  label: string;
  user: { name: string; email: string };
  variant?: "default" | "secondary";
  className?: string;
}) {
  const [busy, setBusy] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [showCoupon, setShowCoupon] = useState(false);

  useEffect(() => {
    loadScript();
  }, []);

  const handleClick = async () => {
    setBusy(true);
    try {
      let order;
      try {
        order = await createCheckoutOrder({
          tier,
          couponCode: coupon || undefined,
        });
      } catch (e) {
        const msg = e instanceof Error ? e.message : "";
        if (msg.includes("Razorpay order failed: 400") || msg.includes("not active")) {
          alert(
            "Razorpay isn't ready yet — your merchant account needs KYC activation before live payments work.\n\n" +
            "For now, scroll down and use the coupon code box on the pricing page to unlock Pro instantly.",
          );
        } else {
          alert("Could not start checkout: " + msg.slice(0, 200));
        }
        return;
      }
      if (!order.ok) {
        alert("Could not start checkout. Please try again.");
        return;
      }
      const ok = await loadScript();
      if (!ok || !window.Razorpay) {
        alert("Could not load Razorpay. Please check your connection.");
        return;
      }
      const rzp = new window.Razorpay({
        key: order.razorpayKeyId,
        amount: order.amountInPaise,
        currency: "INR",
        name: "NutriMama",
        description: tier === "CARE_49" ? "Care plan – ₹49/month" : "Pro plan – ₹99/month",
        order_id: order.razorpayOrderId,
        prefill: { name: user.name, email: user.email },
        theme: { color: "#1F4D3F" },
        handler: async (resp) => {
          const result = await confirmPayment({
            razorpayOrderId: resp.razorpay_order_id,
            razorpayPaymentId: resp.razorpay_payment_id,
            razorpaySignature: resp.razorpay_signature,
            tier,
            amountInPaise: order.amountInPaise,
            couponCode: order.couponApplied,
          });
          if (result.ok) {
            window.location.href = "/dashboard?upgraded=1";
          } else {
            alert("Payment verification failed. Contact support.");
          }
        },
        modal: { ondismiss: () => setBusy(false) },
      });
      rzp.open();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={className}>
      <Button
        variant={variant}
        onClick={handleClick}
        disabled={busy}
        className="w-full"
      >
        {busy ? "Loading…" : label}
      </Button>
      <button
        type="button"
        onClick={() => setShowCoupon((s) => !s)}
        className="mt-2 text-xs text-muted-foreground underline"
      >
        {showCoupon ? "Hide coupon" : "Have a coupon?"}
      </button>
      {showCoupon && (
        <input
          type="text"
          placeholder="MOTHERSDAY50"
          value={coupon}
          onChange={(e) => setCoupon(e.target.value.toUpperCase())}
          className="mt-2 w-full rounded-xl border border-border bg-input/40 px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
      )}
    </div>
  );
}
