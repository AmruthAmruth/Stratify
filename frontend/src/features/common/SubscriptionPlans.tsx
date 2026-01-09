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

  interface RazorpaySubscription {
    key: string;
    amount: number;
    currency: string;
    orderId: string;
  }

  interface RazorpayOrderData {
    subscription: RazorpaySubscription;
  }

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
      let orderData: RazorpayOrderData;

      // Create subscription based on authentication status
      if (isAuthenticated) {
        orderData = (await createSubscriptionPlan(plan.plan)) as unknown as RazorpayOrderData;
      } else {
        if (!companyId) {
          enqueueSnackbar("Company ID is required", { variant: "error" });
          return;
        }
        orderData = (await createSubscriptionPlanForUnauthenticated(plan.plan, companyId)) as unknown as RazorpayOrderData;
      }

      const subscription = orderData.subscription;
      if (!subscription) {
        enqueueSnackbar("No subscription data received", { variant: "error" });
        return;
      }

      // For unauthenticated users, dynamically load Razorpay SDK
      if (!isAuthenticated) {
        const isLoaded = await loadRazorpayScript();
        if (!isLoaded) {
          enqueueSnackbar("Failed to load Razorpay SDK", { variant: "error" });
          return;
        }
      } else {
        // For authenticated users, check if Razorpay is available
        if (!window.Razorpay) {
          enqueueSnackbar("Razorpay SDK not loaded", { variant: "warning" });
          return;
        }
      }

      const options = {
        key: subscription.key,
        amount: subscription.amount,
        currency: subscription.currency,
        order_id: subscription.orderId,
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

      new window.Razorpay(options).open();
    } catch (err: unknown) {
      const error = err as RazorpayError;
      enqueueSnackbar(error.message || "Payment initiation failed", { variant: "error" });
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