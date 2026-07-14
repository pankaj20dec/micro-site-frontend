"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import {
  capturePaypalOrder,
  createPaypalOrder,
  createStripeIntent,
} from "@/lib/application-api";
import { PayPalReviewModal } from "../components/PayPalReviewModal";
import { PayPalCheckoutModal } from "../components/PayPalCheckoutModal";
import { isPayPalStubMode } from "../lib/launch-paypal-checkout";

const PURPLE = "#802B7D";
const INACTIVE = "#5F7287";
const BORDER_INACTIVE = "#E0E0E0";
const LAVENDER = "#f3eef6";

const MEMBERSHIP_OPTIONS = [
  {
    type: "INDIVIDUAL" as const,
    amount: 250,
    feeLabel: "Fee: 32.5% + VAT",
  },
  {
    type: "ORGANISATION" as const,
    amount: 500,
    feeLabel: "Fee: 30% + VAT.",
  },
];

const PAYMENT_NOTE =
  "If you do not progress to become a Claimant Member by completing Step 2, you will remain a Supporter Member and we will retain your payment. You will receive access to case updates, invitations to briefings and will participate in the wider campaign, but you will not make a claim for damages. If you become a Claimant Member, the amount you pay will have an impact on the fee that is deducted from any damages associated with your claim. If you pay £250, then the fee deducted will be 32.5% + VAT; and if you pay £500 then the fee deducted will be 30% + VAT.";

export interface PaymentSectionHandle {
  processPayment: () => Promise<void>;
}

interface Props {
  membershipType: string;
  setMembershipType: (v: string) => void;
  payMethod: "stripe" | "paypal" | null;
  setPayMethod: (v: "stripe" | "paypal" | null) => void;
  paymentPaid: boolean;
  onPaymentPaid: () => void;
}

function PayPalLogoMark() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#003087"
        d="M8.3 19.5h3.1c2.1 0 3.5-1.3 3.8-3.2l1.6-10.2c.1-.6-.4-1.1-1-1.1H9.1c-.5 0-.9.3-1 1L5.2 18.4c-.1.6.3 1.1.9 1.1h2.2z"
      />
      <path
        fill="#009CDE"
        d="M18.2 5.5c-.3-.1-.6-.1-1-.1H11c-.5 0-.9.3-1 1l-1.2 7.6h3.1c2.1 0 3.5-1.3 3.8-3.2l1.5-4.3z"
      />
    </svg>
  );
}

function StripeLogoMark() {
  return (
    <svg width="42" height="18" viewBox="0 0 60 25" aria-hidden>
      <path
        fill="#635BFF"
        d="M59.64 14.28h-8.06c.18 1.08.88 1.85 2.34 1.85 1.17 0 1.98-.58 2.27-1.45h3.36c-.58 2.48-2.87 4.12-5.72 4.12-3.72 0-6.28-2.52-6.28-6.48 0-3.84 2.52-6.48 6.16-6.48 3.78 0 5.93 2.7 5.93 6.36 0 .42-.03.9-.1 1.08zm-5.72-4.98c-1.32 0-2.16.78-2.4 2.04h4.68c-.18-1.32-.9-2.04-2.28-2.04zM40.95 20.16c-1.02 0-1.86-.48-2.22-1.26l-.06 1.08h-3.06V6.6h3.24v5.58c.36-.78 1.14-1.26 2.1-1.26 2.64 0 4.26 2.04 4.26 5.52 0 3.36-1.68 5.52-4.26 5.52zm-.72-8.64c-1.38 0-2.34 1.08-2.34 2.88v.12c0 1.74.96 2.82 2.34 2.82 1.38 0 2.34-1.08 2.34-2.94 0-1.8-.96-2.88-2.34-2.88zM31.45 6.6h3.24v13.38h-3.24V6.6zm-4.74 13.56c-3.72 0-6.28-2.52-6.28-6.48 0-3.84 2.52-6.48 6.16-6.48 3.78 0 5.93 2.7 5.93 6.36 0 .42-.03.9-.1 1.08h-8.06c.18 1.08.88 1.85 2.34 1.85 1.17 0 1.98-.58 2.27-1.45h3.36c-.58 2.48-2.87 4.12-5.72 4.12zm-.66-10.5c-1.32 0-2.16.78-2.4 2.04h4.68c-.18-1.32-.9-2.04-2.28-2.04zM8.64 6.6l-3.3 13.38H2.1L0 6.6h3.36l1.38 7.38L6.12 6.6h2.52z"
      />
    </svg>
  );
}

function SelectedCheck() {
  return (
    <span
      className="flex h-5 w-5 shrink-0 items-center justify-center rounded-[4px] text-white"
      style={{ backgroundColor: PURPLE }}
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M20 6 9 17l-5-5"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

const StripeCheckoutForm = forwardRef<
  { confirm: () => Promise<void> },
  { onPaid: () => void }
>(function StripeCheckoutForm({ onPaid }, ref) {
  const stripe = useStripe();
  const elements = useElements();

  useImperativeHandle(ref, () => ({
    async confirm() {
      if (!stripe || !elements) {
        throw new Error("Payment form is still loading.");
      }
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
      });
      if (error) throw new Error(error.message ?? "Payment failed.");
      if (paymentIntent?.status === "succeeded") onPaid();
    },
  }));

  return <PaymentElement options={{ layout: "tabs" }} />;
});

function StubStripeNotice() {
  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
      <strong>Dev mode:</strong> Stripe is not configured. Click{" "}
      <strong>Continue</strong> below to simulate a successful payment.
    </div>
  );
}

const PAYMENT_METHODS = [
  {
    id: "paypal" as const,
    label: "Pay with PayPal",
    logo: <PayPalLogoMark />,
  },
  {
    id: "stripe" as const,
    label: "Pay with Stripe",
    logo: <StripeLogoMark />,
  },
];

const MembershipPaymentSection = forwardRef<PaymentSectionHandle, Props>(
  function MembershipPaymentSection(
    {
      membershipType,
      setMembershipType,
      payMethod,
      setPayMethod,
      paymentPaid,
      onPaymentPaid,
    },
    ref
  ) {
    const selected =
      MEMBERSHIP_OPTIONS.find((m) => m.type === membershipType) ??
      MEMBERSHIP_OPTIONS[0];
    const fee = selected.amount;

    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [stripeStub, setStripeStub] = useState(false);
    const [intentLoading, setIntentLoading] = useState(false);
    const [intentError, setIntentError] = useState<string | null>(null);
    const [paypalReviewOpen, setPaypalReviewOpen] = useState(false);
    const [paypalCheckoutOpen, setPaypalCheckoutOpen] = useState(false);
    const [paypalPaying, setPaypalPaying] = useState(false);
    const stripeFormRef = useRef<{ confirm: () => Promise<void> }>(null);
    const paypalPaymentPromiseRef = useRef<{
      resolve: () => void;
      reject: (err: Error) => void;
    } | null>(null);

    const stripePromise = useMemo(
      () =>
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
          ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
          : null,
      []
    );

    function closePayPalCheckout() {
      setPaypalCheckoutOpen(false);
      paypalPaymentPromiseRef.current?.reject(new Error("Payment cancelled."));
      paypalPaymentPromiseRef.current = null;
    }

    function closePayPalReview(reject?: Error) {
      setPaypalReviewOpen(false);
      if (reject) {
        paypalPaymentPromiseRef.current?.reject(reject);
      }
      paypalPaymentPromiseRef.current = null;
    }

    async function completePayPalStubPayment() {
      setPaypalPaying(true);
      setIntentError(null);
      try {
        const order = await createPaypalOrder(fee);
        await capturePaypalOrder(order.orderId);
        onPaymentPaid();
        setPaypalReviewOpen(false);
        paypalPaymentPromiseRef.current?.resolve();
        paypalPaymentPromiseRef.current = null;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "PayPal payment could not be completed.";
        setIntentError(message);
        paypalPaymentPromiseRef.current?.reject(
          err instanceof Error ? err : new Error(message)
        );
        paypalPaymentPromiseRef.current = null;
      } finally {
        setPaypalPaying(false);
      }
    }

    useEffect(() => {
      if (payMethod !== "stripe" || paymentPaid) {
        setClientSecret(null);
        setStripeStub(false);
        setIntentLoading(false);
        return;
      }

      // No Stripe key — dev stub UI only; do not hit the API on selection.
      if (!stripePromise) {
        setStripeStub(true);
        setClientSecret(null);
        setIntentLoading(false);
        setIntentError(null);
        return;
      }

      let cancelled = false;
      setIntentLoading(true);
      setIntentError(null);
      setClientSecret(null);
      setStripeStub(false);

      createStripeIntent(fee)
        .then((data) => {
          if (cancelled) return;
          setStripeStub(!!data.stub);
          setClientSecret(data.clientSecret ?? null);
        })
        .catch((err) => {
          if (!cancelled) {
            setIntentError(
              err instanceof Error ? err.message : "Could not start payment."
            );
          }
        })
        .finally(() => {
          if (!cancelled) setIntentLoading(false);
        });

      return () => {
        cancelled = true;
      };
    }, [payMethod, fee, paymentPaid, stripePromise]);

    useImperativeHandle(ref, () => ({
      async processPayment() {
        if (paymentPaid) return;
        if (!payMethod) throw new Error("Please choose a payment method.");

        if (payMethod === "stripe") {
          if (stripeStub || !stripePromise) {
            await createStripeIntent(fee, { confirmStub: true });
            onPaymentPaid();
            return;
          }
          await stripeFormRef.current?.confirm();
          return;
        }

        if (payMethod === "paypal") {
          if (isPayPalStubMode()) {
            return new Promise<void>((resolve, reject) => {
              paypalPaymentPromiseRef.current = { resolve, reject };
              setPaypalReviewOpen(true);
            });
          }
          return new Promise<void>((resolve, reject) => {
            paypalPaymentPromiseRef.current = { resolve, reject };
            setPaypalCheckoutOpen(true);
          });
        }
      },
    }));

    return (
      <div className="space-y-5">
        <h3 className="text-base font-bold" style={{ color: PURPLE }}>
          Select payment amount
        </h3>

        <div
          className="rounded-lg border bg-white p-5"
          style={{ borderColor: BORDER_INACTIVE }}
        >
          <p className="text-xs leading-relaxed text-zinc-600">
            <span className="font-bold text-[#263238]">Note: </span>
            {PAYMENT_NOTE}
          </p>
        </div>

        {paymentPaid && (
          <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-600 text-xs font-bold text-white">
              ✓
            </span>
            Payment received — you can continue to the next step.
          </div>
        )}

        {/* Amount cards — Figma layout */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {MEMBERSHIP_OPTIONS.map((option) => {
            const active = membershipType === option.type;
            return (
              <button
                key={option.type}
                type="button"
                disabled={paymentPaid}
                onClick={() => setMembershipType(option.type)}
                className="rounded-lg px-6 py-7 text-center transition-all disabled:opacity-60"
                style={{
                  backgroundColor: active ? LAVENDER : "#ffffff",
                  border: active
                    ? `2px solid ${PURPLE}`
                    : `1px solid ${BORDER_INACTIVE}`,
                }}
              >
                <div
                  className="text-3xl font-bold sm:text-[2rem]"
                  style={{ color: active ? PURPLE : INACTIVE }}
                >
                  £{option.amount}
                </div>
                <div
                  className={`mt-2 text-sm ${active ? "font-bold" : "font-normal"}`}
                  style={{ color: active ? PURPLE : INACTIVE }}
                >
                  {option.feeLabel}
                </div>
              </button>
            );
          })}
        </div>

        <hr className="border-t" style={{ borderColor: BORDER_INACTIVE }} />

        {/* Payment method — PayPal left, Stripe right */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {PAYMENT_METHODS.map((method) => {
            const active = payMethod === method.id;
            return (
              <button
                key={method.id}
                type="button"
                disabled={paymentPaid}
                onClick={() => setPayMethod(method.id)}
                className="flex items-center justify-between rounded-lg px-4 py-3.5 transition-all disabled:opacity-60"
                style={{
                  backgroundColor: active ? LAVENDER : "#fafafa",
                  border: active
                    ? `2px solid ${PURPLE}`
                    : `1px solid ${BORDER_INACTIVE}`,
                }}
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border bg-white"
                    style={{ borderColor: BORDER_INACTIVE }}
                  >
                    {method.logo}
                  </span>
                  <span className="text-sm font-normal text-[#263238]">
                    {method.label}
                  </span>
                </span>
                {active && <SelectedCheck />}
              </button>
            );
          })}
        </div>

        {payMethod === "stripe" && !paymentPaid && (
          <div
            className="rounded-lg border bg-white p-4"
            style={{ borderColor: BORDER_INACTIVE }}
          >
            {(intentLoading || (!clientSecret && !stripeStub && !intentError)) && (
              <p className="text-sm text-zinc-500">Preparing secure checkout…</p>
            )}
            {intentError && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                {intentError}
              </p>
            )}
            {!intentLoading && !intentError && (clientSecret || stripeStub) && (
              <>
                {stripeStub || !stripePromise ? (
                  <StubStripeNotice />
                ) : (
                  <Elements
                    stripe={stripePromise}
                    options={{
                      clientSecret: clientSecret!,
                      appearance: {
                        theme: "stripe",
                        variables: { colorPrimary: PURPLE, borderRadius: "8px" },
                      },
                    }}
                  >
                    <StripeCheckoutForm ref={stripeFormRef} onPaid={onPaymentPaid} />
                  </Elements>
                )}
              </>
            )}
          </div>
        )}

        {intentError && payMethod === "paypal" && !paymentPaid && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {intentError}
          </p>
        )}

        <PayPalReviewModal
          open={paypalReviewOpen}
          amount={fee}
          paying={paypalPaying}
          onClose={() => closePayPalReview(new Error("Payment cancelled."))}
          onPayNow={completePayPalStubPayment}
        />

        {!isPayPalStubMode() && (
          <PayPalCheckoutModal
            open={paypalCheckoutOpen}
            amount={fee}
            onClose={closePayPalCheckout}
            onError={(message) => setIntentError(message)}
          />
        )}
      </div>
    );
  }
);

export default MembershipPaymentSection;
