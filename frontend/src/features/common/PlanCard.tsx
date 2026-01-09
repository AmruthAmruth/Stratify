import React from "react";
import { Check, Star } from "lucide-react";

interface Plan {
  plan: string;
  description: string;
  amount: number;
  durationInMonths: number;
  [key: string]: unknown;
}

interface PlanCardProps {
  plan: Plan;
  mode: "super-admin" | "company";
  onBuy?: (plan: Plan) => void;
  onEdit?: (plan: Plan) => void;
  onDelete?: (plan: Plan) => void;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan, mode, onBuy, onEdit, onDelete }) => {
  // Determine if this is a featured/popular plan (middle tier or specific plan name)
  const isPopular = plan.plan.toLowerCase().includes('professional') ||
    plan.plan.toLowerCase().includes('premium') ||
    plan.durationInMonths === 6;

  return (
    <div className={`relative bg-surface border-2 ${isPopular ? 'border-primary shadow-lg' : 'border-borderColor'} rounded-2xl p-8 hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between ${isPopular ? 'ring-2 ring-primary ring-opacity-20' : ''}`}>
      {/* Popular Badge */}
      {isPopular && mode === "company" && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <div className="bg-primary text-textOnPrimary px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-1 shadow-md">
            <Star className="w-4 h-4 fill-current" />
            Popular
          </div>
        </div>
      )}

      <div>
        {/* Plan Name */}
        <h2 className="text-3xl font-bold text-heading mb-3 mt-2">{plan.plan}</h2>

        {/* Description */}
        <p className="text-text mb-6 leading-relaxed">{plan.description}</p>

        {/* Duration */}
        <div className="flex items-center gap-2 mb-6">
          <Check className="w-5 h-5 text-primary" />
          <p className="text-muted font-medium">
            {plan.durationInMonths} {plan.durationInMonths > 1 ? "months" : "month"} access
          </p>
        </div>

        {/* Price */}
        <div className="mb-8">
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-extrabold text-primary">₹{plan.amount}</span>
            <span className="text-muted text-lg">/ {plan.durationInMonths}mo</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {mode === "company" && (
        <button
          onClick={() => onBuy?.(plan)}
          className={`w-full ${isPopular ? 'bg-primary hover:bg-primaryHover' : 'bg-primary hover:bg-primaryHover'} text-textOnPrimary py-4 px-6 rounded-xl font-bold text-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105`}
        >
          Get Started
        </button>
      )}

      {mode === "super-admin" && (
        <div className="flex gap-3">
          <button
            onClick={() => onEdit?.(plan)}
            className="flex-1 bg-yellow-500 text-white py-3 px-4 rounded-xl hover:bg-yellow-600 font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete?.(plan)}
            className="flex-1 bg-red-600 text-white py-3 px-4 rounded-xl hover:bg-red-700 font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default PlanCard;
