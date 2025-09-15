import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { listSubscriptionPlan, createSubscriptionPlanForUnauthenticated, verifyPaymentForUnauthenticated } from "@/services/company";
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

const SubscriptionPlans: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const { companyId } = useParams<{ companyId: string }>();
  const company = useSelector((state: RootState) => state.auth);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  // Load Razorpay SDK dynamically
  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
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
      const orderData = await createSubscriptionPlanForUnauthenticated(plan.plan, companyId);
      const subscription = orderData.subscription;

      // Load Razorpay SDK
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        enqueueSnackbar("Failed to load Razorpay SDK", { variant: "error" });
        return;
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
            await verifyPaymentForUnauthenticated({
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              planName: plan.plan,
              companyId,
            });
            enqueueSnackbar("Payment successful & subscription activated!", { variant: "success" });

            // Redirect to login after success
            navigate("/login");
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

  return (
    <div className="max-w-6xl mx-auto mt-12 px-4">
      <h1 className="text-4xl font-extrabold text-center mb-12 text-gray-800">Choose Your Subscription</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <PlanCard key={plan.plan} plan={plan} mode="company" onBuy={handleBuy} />
        ))}
      </div>
    </div>
  );
};

export default SubscriptionPlans;
