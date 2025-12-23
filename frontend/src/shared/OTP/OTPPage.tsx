import React, { useState, useEffect } from "react";
import ReusableOTP from "@/shared/components/OTP/ReusableOTP";
import { Users } from "lucide-react";
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
    <div className="min-h-screen flex flex-col bg-bg">
      <div className="flex flex-1 flex-col lg:flex-row pt-20">
        {/* Left Side */}
        <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-primary to-text text-white flex-col justify-center items-center p-16 text-left">
          <Users className="w-20 h-20 mb-6 text-white" />
          <h1 className="text-5xl font-bold mb-4 leading-snug">
            {context === "register" ? "Verify Your Account" : "Reset Your Password"}
          </h1>
          <p className="text-lg text-accent max-w-md">
            Enter the 6-digit code sent to your email to{" "}
            {context === "register" ? "activate your account" : "reset your password"}.
          </p>
        </div>

        {/* Right Side */}
        <div className="flex w-full lg:w-1/2 justify-center items-center px-6 py-12 lg:px-12">
          <div className="bg-surface shadow-2xl rounded-3xl p-8 sm:p-10 md:p-12 lg:p-14 w-full max-w-lg md:max-w-xl lg:max-w-2xl transition-all duration-300 border border-accent">
            <div className="flex justify-center mb-6">
              <span className="bg-accent text-text px-5 py-2 rounded-full text-sm md:text-base font-medium shadow-sm">
                {context === "register" ? "Account Verification" : "Password Reset Verification"}
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-text text-center mb-3">
              Enter OTP
            </h2>
            <p className="text-center text-gray-500 mb-8 md:mb-10 text-base">
              {context === "register"
                ? "Please type the 6-digit code sent to your email to verify your account."
                : "Please type the 6-digit code sent to your email to reset your password."}
            </p>

            {/* OTP Component */}
            <div className="flex justify-center gap-4 mb-8">
              <ReusableOTP value={otp} onChange={setOtp} numInputs={6} inputSize="3.5rem" gap="1rem" />
            </div>

            {/* Timer */}
            <div className="text-center mb-4">
              {timeLeft > 0 ? (
                <p className="text-text text-sm">
                  OTP will expire in{" "}
                  <span className="font-semibold text-primary">{formatTime(timeLeft)}</span>
                </p>
              ) : (
                <p className="text-red-500 text-sm font-medium">OTP expired. Please resend.</p>
              )}
            </div>

            {/* Verify Button */}
            <button
              onClick={handleVerify}
              disabled={timeLeft <= 0}
              className={`w-full text-white font-semibold py-3 rounded-xl shadow-md transition transform hover:scale-105 ${timeLeft <= 0 ? "bg-gray-400 cursor-not-allowed" : "bg-primary hover:bg-primaryHover"
                }`}
            >
              Verify OTP
            </button>

            {/* Resend */}
            <div className="mt-6 text-center text-sm md:text-base">
              <p className="text-text">
                Didn't receive the code?{" "}
                <span
                  className={`font-medium cursor-pointer ${timeLeft > 0
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-primary hover:underline"
                    }`}
                  onClick={() => {
                    if (timeLeft <= 0) handleResendOTP();
                  }}
                >
                  Resend OTP
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPPage;
