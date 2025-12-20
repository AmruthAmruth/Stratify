import React from "react";

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
  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{plan.plan}</h2>
        <p className="text-gray-600 mb-4">{plan.description}</p>
        <p className="text-gray-500 mb-2">
          Duration: {plan.durationInMonths} {plan.durationInMonths > 1 ? "months" : "month"}
        </p>
        <p className="text-3xl font-extrabold text-blue-600 mb-6">₹{plan.amount}</p>
      </div>

      {mode === "company" && (
        <button
          onClick={() => onBuy?.(plan)}
          className="mt-auto bg-blue-600 text-white py-3 px-5 rounded-xl hover:bg-blue-700 font-semibold transition"
        >
          Buy Now
        </button>
      )}

      {mode === "super-admin" && (
        <div className="mt-auto flex space-x-3">
          <button
            onClick={() => onEdit?.(plan)}
            className="bg-yellow-500 text-white py-2 px-4 rounded-xl hover:bg-yellow-600 font-semibold transition"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete?.(plan)}
            className="bg-red-600 text-white py-2 px-4 rounded-xl hover:bg-red-700 font-semibold transition"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default PlanCard;
