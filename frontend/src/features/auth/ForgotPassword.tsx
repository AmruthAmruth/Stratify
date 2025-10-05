import React, { useState } from "react";
import { Mail, ArrowLeft, CheckCircle, AlertCircle, Loader2, Shield, Lock } from "lucide-react";
import { enqueueSnackbar } from "notistack";
import { forgotPassword } from "@/services/authApi";
import { useNavigate } from "react-router-dom";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Email is required");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    localStorage.setItem("email", email);

    forgotPassword(email)
      .then((data) => {
        localStorage.setItem("otpExpiry", String(new Date(data.time).getTime()));
        enqueueSnackbar("Verification successful! OTP sent to your email.", { variant: "success" });
        navigate("/forgot-otp");
      })
      .catch((err: any) => {
        enqueueSnackbar(err?.message || "Verification failed", { variant: "error" });
      })
      .finally(() => setIsLoading(false));
  };

  const handleBackToLogin = () => {
    console.log("Navigate to login");
  };

  return (
    <div className="min-h-screen bg-[#fbfbfb] flex">
      {/* Left Side */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#009063]/10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-[#dfdcef] rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#dfdcef]/50 rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-16 text-[#3b3b3b]">
          <div className="mb-12">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-[#009063]/20 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-[#009063]" />
              </div>
              <h1 className="text-3xl font-bold">Stratify</h1>
            </div>
            <div className="w-16 h-1 bg-[#dfdcef] rounded-full"></div>
          </div>
          <div className="space-y-6">
            <h2 className="text-4xl xl:text-5xl font-bold leading-tight">
              Secure Account
              <span className="block text-[#009063]">Recovery</span>
            </h2>
            <p className="text-xl leading-relaxed max-w-md text-[#3b3b3b]">
              Enter your email and we'll send you an OTP to reset your password securely.
            </p>
            <div className="space-y-4 pt-8">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-[#dfdcef] rounded-lg flex items-center justify-center">
                  <Lock className="w-4 h-4 text-[#009063]" />
                </div>
                <span className="text-[#3b3b3b]">Bank-level security encryption</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-[#dfdcef] rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-[#009063]" />
                </div>
                <span className="text-[#3b3b3b]">Instant OTP delivery</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-[#dfdcef] rounded-lg flex items-center justify-center">
                  <Shield className="w-4 h-4 text-[#009063]" />
                </div>
                <span className="text-[#3b3b3b]">24/7 account protection</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-[#009063] rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-[#3b3b3b]">Stratify</h1>
            </div>
          </div>

          {!isSubmitted ? (
            <div className="bg-[#fbfbfb] rounded-2xl shadow-xl border border-[#dfdcef] p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-[#dfdcef] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-[#009063]" />
                </div>
                <h2 className="text-2xl font-bold text-[#3b3b3b] mb-2">Forgot Password?</h2>
                <p className="text-[#3b3b3b]">
                  Enter your email and we'll send a One-Time Password (OTP) to reset your password.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[#3b3b3b] mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-[#3b3b3b]/50" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#009063] focus:border-transparent transition-all duration-200 ${
                        error ? "border-red-300 bg-red-50" : "border-[#dfdcef] bg-[#fbfbfb]"
                      }`}
                      placeholder="Enter your email address"
                      disabled={isLoading}
                    />
                  </div>
                  {error && (
                    <div className="mt-2 flex items-center space-x-2 text-red-600">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm">{error}</span>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#009063] text-white py-3 px-4 rounded-xl font-medium hover:bg-green-700 focus:ring-2 focus:ring-[#009063] focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Sending OTP...</span>
                    </>
                  ) : (
                    <span>Send OTP</span>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={handleBackToLogin}
                  className="inline-flex items-center space-x-2 text-[#3b3b3b] hover:text-[#009063] transition-colors duration-200"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Login</span>
                </button>
              </div>

              <div className="mt-8 p-4 bg-[#dfdcef] rounded-xl border border-[#dfdcef]/50">
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-[#009063] mt-0.5" />
                  <div>
                    <p className="text-sm text-[#009063] font-medium">Security Notice</p>
                    <p className="text-sm text-[#3b3b3b] mt-1">
                      We'll send a secure OTP to your email. It will expire in 15 minutes for your protection.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#fbfbfb] rounded-2xl shadow-xl border border-[#dfdcef] p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-[#009063]" />
              </div>
              <h2 className="text-2xl font-bold text-[#3b3b3b] mb-2">OTP Sent!</h2>
              <p className="text-[#3b3b3b] mb-6">
                We've sent a One-Time Password (OTP) to <strong>{email}</strong>
              </p>
              <div className="space-y-4">
                <button
                  onClick={handleBackToLogin}
                  className="w-full bg-[#009063] text-white py-3 px-4 rounded-xl font-medium hover:bg-green-700 transition-all duration-200"
                >
                  Back to Login
                </button>
                <p className="text-sm text-[#3b3b3b]">
                  Didn't receive the OTP? Check your spam folder or{" "}
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setEmail("");
                    }}
                    className="text-[#009063] hover:text-green-700 font-medium"
                  >
                    try again
                  </button>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
