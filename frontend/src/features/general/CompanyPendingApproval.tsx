import React from "react";
import { Mail, Clock, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CompanyPendingApproval: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-2xl p-10 text-center">
        {/* Icon Section */}
        <div className="flex justify-center mb-6">
          <ShieldCheck className="w-20 h-20 text-blue-600 animate-bounce" />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Registration Submitted 🎉
        </h1>

        {/* Description */}
        <p className="text-gray-600 text-lg mb-6">
          Thank you for registering your company with us.  
          Your request is <span className="font-semibold text-blue-600">pending approval</span> from the <span className="font-semibold text-blue-600">Statify Team</span>.
        </p>

        {/* Info Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <Mail className="w-6 h-6 text-blue-600" />
            <p className="text-gray-700 font-medium">
              You’ll receive an email once your company is approved.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-blue-600" />
            <p className="text-gray-700 font-medium">
              Please verify your email within <span className="font-semibold">24 hours</span> after approval.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <p className="text-gray-500 mb-6">
          We appreciate your patience. You’ll be able to start your journey as soon as your account is approved 🚀
        </p>

        <button
          className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 transition-all duration-200"
          onClick={() => navigate("/login")}
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default CompanyPendingApproval;
