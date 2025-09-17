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

interface Plan {
  plan: string;
  description: string;
  amount: number;
  durationInMonths: number;
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
        setPlans(data);
      } catch {
        enqueueSnackbar("Failed to load subscription plans.", { variant: "error" });
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, [enqueueSnackbar]);

  const handleBuy = async (plan: Plan) => {
    try {
      let orderData;
      
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

      const subscription = orderData.subscription;

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
        handler: async (response: any) => {
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
                companyId,
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
          color: "#2563eb",
        },
      };

      new window.Razorpay(options).open();
    } catch (err: any) {
      enqueueSnackbar(err.message || "Payment initiation failed", { variant: "error" });
    }
  };

  if (loading) return <div className="text-center mt-20 text-gray-500">Loading plans...</div>;
  if (plans.length === 0) return <div className="text-center mt-20 text-gray-500">No subscription plans available</div>;

  // Use different layouts based on authentication status
  const containerClass = isAuthenticated 
    ? "max-w-6xl mx-auto mt-12 px-4"
    : "w-full h-screen bg-white flex flex-col items-center justify-center px-6 py-12";

  const titleClass = isAuthenticated
    ? "text-4xl font-extrabold text-center mb-12 text-gray-800"
    : "text-4xl font-extrabold text-center mb-16 text-black";

  const gridClass = isAuthenticated
    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
    : "w-full h-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10";

  const cardWrapperClass = isAuthenticated
    ? ""
    : "w-full h-full bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 p-6 flex flex-col justify-between";

  return (
    <div className={containerClass}>
      <h1 className={titleClass}>
        Choose Your Subscription
      </h1>

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