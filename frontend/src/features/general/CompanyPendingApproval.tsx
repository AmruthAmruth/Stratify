import React from "react";
import { Mail, Clock, CheckCircle, ArrowRight, HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CompanyPendingApproval: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-6 shadow-lg">
            <CheckCircle className="w-12 h-12 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Registration Successful!
          </h1>
          <p className="text-lg text-gray-600">
            Your company registration has been submitted for review
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-6">
          {/* Status Badge */}
          <div className="flex items-center justify-center mb-8">
            <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-full px-4 py-2">
              <Clock className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-semibold text-amber-900">Pending Approval</span>
            </div>
          </div>

          {/* What's Next Section */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">What happens next?</h2>
            <div className="space-y-4">
              {/* Step 1 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Verification</h3>
                  <p className="text-sm text-gray-600">
                    Our team will verify your company details and registration information.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Email Notification</h3>
                  <p className="text-sm text-gray-600">
                    You'll receive an email once your company has been approved.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Get Started</h3>
                  <p className="text-sm text-gray-600">
                    Log in and start managing your projects and teams immediately!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Info Boxes */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {/* Timeline */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm mb-1">Review Time</h4>
                  <p className="text-xs text-gray-700">
                    Typically <span className="font-semibold">24-48 hours</span> during business days
                  </p>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm mb-1">Check Your Email</h4>
                  <p className="text-xs text-gray-700">
                    We'll send updates to your registered email address
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Help Section */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <HelpCircle className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-gray-900 text-sm mb-1">Need Help?</h4>
                <p className="text-xs text-gray-700 mb-2">
                  If you haven't received approval within 48 hours, contact us at:
                </p>
                <a
                  href="mailto:support@stratify.com"
                  className="text-sm text-primary hover:underline font-medium"
                >
                  support@stratify.com
                </a>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate("/login")}
              className="flex-1 bg-primary text-white py-3 px-4 rounded-xl font-semibold hover:bg-primaryHover transition-colors shadow-sm"
            >
              Go to Login
            </button>
            <button
              onClick={() => navigate("/")}
              className="flex-1 bg-white text-gray-700 py-3 px-4 rounded-xl font-semibold border border-gray-300 hover:border-gray-400 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            Thank you for choosing Stratify! 🚀
          </p>
        </div>
      </div>
    </div>
  );
};

export default CompanyPendingApproval;
