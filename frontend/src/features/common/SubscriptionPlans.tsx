import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  listSubscriptionPlan,
  createSubscriptionPlan,
  createSubscriptionPlanForUnauthenticated,
  verifyPayment,
  verifyPaymentForUnauthenticated
} from "@/services/company";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useSnackbar } from "notistack";
import PlanCard from "../common/PlanCard";
import { LoadingSpinner } from "@/shared/components/Loading";
import type { PaymentResponse as CustomPaymentResponse } from "@/types/types";

interface Plan {
  plan: string;
  description: string;
  amount: number;
  durationInMonths: number;
  [key: string]: unknown;
}

interface SubscriptionPlansProps {
  isAuthenticated: boolean;
  onSuccessRedirect?: string; // Optional redirect path after successful payment
}

const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({
  isAuthenticated,
  onSuccessRedirect
}) => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const { companyId } = useParams<{ companyId: string }>();
  const company = useSelector((state: RootState) => state.auth);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  // Load Razorpay SDK dynamically (only for unauthenticated users)
  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      // Check if Razorpay is already loaded
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await listSubscriptionPlan();
        setPlans(data as unknown as Plan[]);
      } catch {
        enqueueSnackbar("Failed to load subscription plans.", { variant: "error" });
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, [enqueueSnackbar]);

  // Removed unused interfaces - using PaymentResponse type directly

  interface RazorpayResponse {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }

  interface RazorpayError {
    message?: string;
  }

  const handleBuy = async (plan: Plan) => {
    try {
      let orderData: CustomPaymentResponse;

      // Create subscription based on authentication status
      if (isAuthenticated) {
        orderData = await createSubscriptionPlan(plan.plan);
      } else {
        if (!companyId) {
          enqueueSnackbar("Company ID is required", { variant: "error" });
          return;
        }
        orderData = await createSubscriptionPlanForUnauthenticated(plan.plan, companyId);
      }

      // Validate payment data
      if (!orderData.orderId || !orderData.key) {
        console.error("Invalid payment data:", orderData);
        enqueueSnackbar("Invalid payment data received", { variant: "error" });
        return;
      }

      // Log payment data for debugging
      console.log("Payment data received:", {
        orderId: orderData.orderId,
        amount: orderData.amount,
        currency: orderData.currency,
        hasKey: !!orderData.key,
        planName: plan.plan
      });

      // Ensure Razorpay SDK is loaded (for both authenticated and unauthenticated users)
      if (!window.Razorpay) {
        console.log("Razorpay SDK not found, loading dynamically...");
        const isLoaded = await loadRazorpayScript();
        if (!isLoaded) {
          enqueueSnackbar("Failed to load Razorpay SDK", { variant: "error" });
          return;
        }
        console.log("Razorpay SDK loaded successfully");
      } else {
        console.log("Razorpay SDK already available");
      }

      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.orderId,
        name: "Stratify",
        description: `Purchase ${plan.plan}`,
        handler: async (response: RazorpayResponse) => {
          try {
            // Verify payment based on authentication status
            if (isAuthenticated) {
              await verifyPayment({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                planName: plan.plan,
              });
            } else {
              await verifyPaymentForUnauthenticated({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                planName: plan.plan,
                companyId: companyId || "",
              });
            }

            enqueueSnackbar("Payment successful & subscription activated!", { variant: "success" });

            // Handle post-success redirect
            if (onSuccessRedirect) {
              navigate(onSuccessRedirect);
            } else if (!isAuthenticated) {
              // Default redirect for unauthenticated users
              navigate("/login");
            }
          } catch {
            enqueueSnackbar("Payment verification failed.", { variant: "error" });
          }
        },
        prefill: {
          name: company.name || "",
          email: company.email || "",
        },
        theme: {
          color: "#16a34a",
        },
      };

      console.log("Opening Razorpay payment modal...");
      try {
        const razorpayInstance = new window.Razorpay(options);
        razorpayInstance.open();
      } catch (error) {
        console.error("Razorpay initialization error:", error);
        enqueueSnackbar("Failed to open payment gateway. Please try again.", { variant: "error" });
      }
    } catch (err: unknown) {
      const error = err as RazorpayError;
      console.error("Payment initiation error:", error);
      enqueueSnackbar(error.message || "Payment initiation failed. Please try again.", { variant: "error" });
    }
  };

  if (loading) return <LoadingSpinner fullScreen={true} text="Loading subscription plans..." />;
  if (plans.length === 0) return <div className="text-center mt-20 text-muted">No subscription plans available</div>;

  // Use different layouts based on authentication status
  const containerClass = isAuthenticated
    ? "max-w-7xl mx-auto py-12 px-6"
    : "w-full min-h-screen bg-bg flex flex-col items-center justify-center px-6 py-16";

  const titleClass = isAuthenticated
    ? "text-5xl font-extrabold text-center mb-4 text-heading"
    : "text-5xl font-extrabold text-center mb-4 text-heading";

  const subtitleClass = isAuthenticated
    ? "text-center text-lg text-muted mb-16 max-w-2xl mx-auto"
    : "text-center text-lg text-muted mb-16 max-w-2xl mx-auto";

  const gridClass = isAuthenticated
    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
    : "w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8";

  const cardWrapperClass = isAuthenticated
    ? ""
    : "";

  return (
    <div className={containerClass}>
      <div>
        <h1 className={titleClass}>
          Choose Your Perfect Plan
        </h1>
        <p className={subtitleClass}>
          Select the subscription that best fits your needs. All plans include full access to our platform.
        </p>
      </div>

      <div className={gridClass}>
        {plans.map((plan) => (
          <div key={plan.plan} className={cardWrapperClass}>
            <PlanCard plan={plan} mode="company" onBuy={handleBuy} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionPlans;