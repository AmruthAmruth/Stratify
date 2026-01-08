import React, { useState, useEffect } from "react";
import ReusableOTP from "@/shared/components/OTP/ReusableOTP";
import { Mail, Shield, Clock, CheckCircle } from "lucide-react";
import { forgotPasswordVerifyOTP, resendOTP, verifyOTP } from "@/services/authApi";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";

interface OTPProps {
  context: "register" | "forgotPassword";
}



const OTPPage: React.FC<OTPProps> = ({ context }) => {
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  // Load expiry from localStorage
  useEffect(() => {
    const expiry = localStorage.getItem("otpExpiry");
    if (expiry) {
      const diff = Math.floor((Number(expiry) - Date.now()) / 1000);
      setTimeLeft(diff > 0 ? diff : 0);
    }
  }, []);

  // Countdown
  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const handleVerify = async () => {
    try {
      if (context === "register") {
        const email = localStorage.getItem("email");
        if (!email) throw new Error("Email not found, please register again.");

        await verifyOTP({ email, otp }).then(() => {
          enqueueSnackbar("OTP verified! Registration complete.", { variant: "success" });
          navigate("/company-pending-approval");
        });
      }

      if (context === "forgotPassword") {
        const email = localStorage.getItem("email");
        if (!email) throw new Error("Email not found, please try again.");

        await forgotPasswordVerifyOTP({ email, otp });
        enqueueSnackbar("OTP verified! You can now reset your password.", { variant: "success" });
        navigate("/reset-password");
      }
    } catch (err: unknown) {
      const error = err as { message?: string };
      enqueueSnackbar(error?.message || "OTP verification failed", { variant: "error" });
    }
  };

  const handleResendOTP = () => {
    const email = localStorage.getItem("email");
    if (!email) {
      enqueueSnackbar("No email found for resend OTP", { variant: "error" });
      return;
    }

    resendOTP({ email, context })
      .then(() => {
        const newExpiry = Date.now() + 3 * 60 * 1000;
        localStorage.setItem("otpExpiry", String(newExpiry));
        setTimeLeft(180);
        enqueueSnackbar("New OTP has been sent!", { variant: "info" });
      })
      .catch(() => {
        enqueueSnackbar("Failed to resend OTP. Try again.", { variant: "error" });
      });
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4 shadow-sm">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {context === "register" ? "Verify Your Email" : "Reset Password"}
          </h1>
          <p className="text-gray-600">
            Enter the 6-digit code sent to your email
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          {/* Email Info */}
          <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4 mb-6">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Mail className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">Check your email</p>
              <p className="text-xs text-gray-600 truncate">
                {localStorage.getItem("email") || "your-email@example.com"}
              </p>
            </div>
          </div>

          {/* OTP Inputs */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-900 mb-3">
              Enter verification code
            </label>
            <div className="flex justify-center">
              <ReusableOTP value={otp} onChange={setOtp} numInputs={6} inputSize="3rem" gap="0.5rem" />
            </div>
          </div>

          {/* Timer */}
          <div className="mb-6">
            {timeLeft > 0 ? (
              <div className="flex items-center justify-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700">
                  Code expires in <span className="font-semibold text-gray-900">{formatTime(timeLeft)}</span>
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 text-sm text-red-600 bg-red-50 rounded-lg py-2 px-3">
                <span className="font-medium">Code expired. Please request a new one.</span>
              </div>
            )}
          </div>

          {/* Verify Button */}
          <button
            onClick={handleVerify}
            disabled={timeLeft <= 0 || otp.length !== 6}
            className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${timeLeft <= 0 || otp.length !== 6
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-primary text-white hover:bg-primaryHover shadow-sm hover:shadow-md"
              }`}
          >
            {otp.length === 6 && <CheckCircle className="w-5 h-5" />}
            Verify Code
          </button>

          {/* Resend */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Didn't receive the code?{" "}
              <button
                onClick={handleResendOTP}
                disabled={timeLeft > 0}
                className={`font-semibold transition-colors ${timeLeft > 0
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-primary hover:text-primaryHover"
                  }`}
              >
                Resend
              </button>
            </p>
          </div>
        </div>

        {/* Footer Help Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Having trouble? Contact{" "}
            <a href="mailto:support@stratify.com" className="text-primary hover:underline font-medium">
              support@stratify.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OTPPage;
