import React, { useEffect, useState } from 'react';
import { listSubscriptionPlan, createSubscriptionPlan, verifyPayment } from '@/services/company';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useSnackbar } from 'notistack';

interface Plan {
  plan: string;
  amount: number;
  durationInMonths: number;
}

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

const SubscriptionPlans: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const company = useSelector((state: RootState) => state.auth);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await listSubscriptionPlan();
        setPlans(data);
      } catch (err) {
        console.error(err);
        enqueueSnackbar("Failed to load subscription plans.", { variant: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const handleBuy = async (plan: Plan) => {
    try {
      const orderData = await createSubscriptionPlan(plan.plan);
      const subscription = orderData.subscription;

      if (!window.Razorpay) {
        enqueueSnackbar("Razorpay SDK not loaded", { variant: 'warning' });
        return;
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
            await verifyPayment({
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              planName: plan.plan,
            });
            enqueueSnackbar("Payment successful & subscription activated!", { variant: 'success' });
          } catch (err) {
            console.error(err);
            enqueueSnackbar("Payment verification failed.", { variant: 'error' });
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

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: any) {
      console.error(err);
      enqueueSnackbar(err.message || "Payment initiation failed", { variant: 'error' });
    }
  };

  if (loading) return <div className="text-center mt-20 text-gray-500">Loading plans...</div>;
  if (plans.length === 0) return <div className="text-center mt-20 text-gray-500">No subscription plans available</div>;

  return (
    <div className="max-w-6xl mx-auto mt-12 px-4">
      <h1 className="text-4xl font-extrabold text-center mb-12 text-gray-800">Choose Your Subscription</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div
            key={plan.plan}
            className="bg-white border border-gray-200 rounded-3xl p-6 shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">{plan.plan}</h2>
              <p className="text-gray-500 mb-4">
                Duration: {plan.durationInMonths} {plan.durationInMonths > 1 ? "months" : "month"}
              </p>
              <p className="text-3xl font-extrabold text-blue-600 mb-6">₹{plan.amount}</p>
            </div>
            <button
              onClick={() => handleBuy(plan)}
              className="mt-auto bg-blue-600 text-white py-3 px-5 rounded-xl hover:bg-blue-700 font-semibold transition"
            >
              Buy Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionPlans;
