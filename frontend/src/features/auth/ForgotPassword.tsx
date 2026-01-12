import React, { useState, useRef } from "react";
import { Mail, ArrowLeft, CheckCircle, AlertCircle, Shield, Lock } from "lucide-react";
import { enqueueSnackbar } from "notistack";
import { forgotPassword } from "@/services/authApi";
import { useNavigate } from "react-router-dom";
import { LoadingSpinner } from "@/shared/components/Loading";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const requestInProgress = useRef(false);

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

    // Prevent duplicate requests
    if (requestInProgress.current || isLoading) {
      return;
    }

    setIsLoading(true);
    requestInProgress.current = true;
    localStorage.setItem("email", email);

    try {
      const data = await forgotPassword(email);
      localStorage.setItem("otpExpiry", String(new Date(data.time).getTime()));
      enqueueSnackbar("Verification successful! OTP sent to your email.", { variant: "success" });
      navigate("/forgot-otp");
    } catch (err: any) {
      const errorMessage = err?.message || "Verification failed";

      // Check if it's a rate limit error
      if (err?.response?.status === 429 || errorMessage.toLowerCase().includes("too many")) {
        enqueueSnackbar("Too many attempts. Please try again after an hour.", { variant: "error" });
        setError("You've exceeded the maximum number of password reset attempts. Please try again later.");
      } else {
        enqueueSnackbar(errorMessage, { variant: "error" });
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
      requestInProgress.current = false;
    }
  };

  const handleBackToLogin = () => {
    console.log("Navigate to login");
  };

  return (
    <div className="min-h-screen bg-bg flex">
      {/* Left Side */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary/10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-accent rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/50 rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-16 text-text">
          <div className="mb-12">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-3xl font-bold">Stratify</h1>
            </div>
            <div className="w-16 h-1 bg-accent rounded-full"></div>
          </div>
          <div className="space-y-6">
            <h2 className="text-4xl xl:text-5xl font-bold leading-tight">
              Secure Account
              <span className="block text-primary">Recovery</span>
            </h2>
            <p className="text-xl leading-relaxed max-w-md text-text">
              Enter your email and we'll send you an OTP to reset your password securely.
            </p>
            <div className="space-y-4 pt-8">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                  <Lock className="w-4 h-4 text-primary" />
                </div>
                <span className="text-text">Bank-level security encryption</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-primary" />
                </div>
                <span className="text-text">Instant OTP delivery</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                  <Shield className="w-4 h-4 text-primary" />
                </div>
                <span className="text-text">24/7 account protection</span>
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
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-text">Stratify</h1>
            </div>
          </div>

          {!isSubmitted ? (
            <div className="bg-bg rounded-2xl shadow-xl border border-accent p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-text mb-2">Forgot Password?</h2>
                <p className="text-text">
                  Enter your email and we'll send a One-Time Password (OTP) to reset your password.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-text mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-text/50" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 ${error ? "border-red-300 bg-red-50" : "border-accent bg-bg"
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
                  className="w-full bg-primary text-white py-3 px-4 rounded-xl font-medium hover:bg-primaryHover focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <LoadingSpinner variant="dots" size="small" color="#ffffff" />
                  ) : (
                    <span>Send OTP</span>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={handleBackToLogin}
                  className="inline-flex items-center space-x-2 text-text hover:text-primary transition-colors duration-200"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Login</span>
                </button>
              </div>

              <div className="mt-8 p-4 bg-accent rounded-xl border border-accent/50">
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-primary font-medium">Security Notice</p>
                    <p className="text-sm text-text mt-1">
                      We'll send a secure OTP to your email. It will expire in 15 minutes for your protection.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-bg rounded-2xl shadow-xl border border-accent p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-text mb-2">OTP Sent!</h2>
              <p className="text-text mb-6">
                We've sent a One-Time Password (OTP) to <strong>{email}</strong>
              </p>
              <div className="space-y-4">
                <button
                  onClick={handleBackToLogin}
                  className="w-full bg-primary text-white py-3 px-4 rounded-xl font-medium hover:bg-primaryHover transition-all duration-200"
                >
                  Back to Login
                </button>
                <p className="text-sm text-text">
                  Didn't receive the OTP? Check your spam folder or{" "}
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setEmail("");
                    }}
                    className="text-primary hover:text-primaryHover font-medium"
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
