import React, { useState } from "react";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { updatePassword } from "@/services/authApi";
import { Navbar } from "../general/Navbar";
import { Shield, Lock, Eye, EyeOff } from "lucide-react";

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      enqueueSnackbar("Passwords do not match!", { variant: "error" });
      return;
    }

    try {
      const email = localStorage.getItem("email");
      if (!email) throw new Error("Email not found, please try again.");

      await updatePassword({ email, password });
      enqueueSnackbar("Password updated successfully! Please login.", {
        variant: "success",
      });
      localStorage.removeItem("email");
      navigate("/login");
    } catch (err) {
      const error = err as { message?: string };
      enqueueSnackbar(error?.message || "Failed to reset password", {
        variant: "error",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar */}
      <Navbar />

      {/* Main Section */}
      <div className="flex flex-1 flex-col lg:flex-row pt-20">
        {/* Branding (only visible on lg+) */}
        <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-indigo-600 to-blue-800 text-white flex-col justify-center items-center p-16 text-left">
          <Shield className="w-20 h-20 mb-6 text-white" />
          <h1 className="text-5xl font-bold mb-4 leading-snug">
            Secure Reset
          </h1>
          <p className="text-lg text-gray-200 max-w-md text-center">
            Your security is our priority. Create a{" "}
            <span className="font-semibold">strong, secure password</span> to
            protect your account and keep your data safe.
          </p>
          <div className="mt-8 space-y-3 text-sm text-gray-300">
            <div className="flex items-center">
              <Lock className="w-4 h-4 mr-2" />
              <span>Use at least 8 characters</span>
            </div>
            <div className="flex items-center">
              <Lock className="w-4 h-4 mr-2" />
              <span>Include uppercase and lowercase letters</span>
            </div>
            <div className="flex items-center">
              <Lock className="w-4 h-4 mr-2" />
              <span>Add numbers and special characters</span>
            </div>
          </div>
        </div>

        {/* Reset Password Form */}
        <div className="flex w-full lg:w-1/2 justify-center items-center px-6 py-12 lg:px-12">
          <div className="bg-white shadow-2xl rounded-3xl p-8 sm:p-10 md:p-12 lg:p-14 w-full max-w-lg md:max-w-xl lg:max-w-2xl transition-all duration-300">
            {/* Badge */}
            <div className="flex justify-center mb-6">
              <span className="bg-indigo-100 text-indigo-700 px-5 py-2 rounded-full text-sm md:text-base font-medium shadow-sm">
                Password Reset
              </span>
            </div>

            {/* Title */}
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-3">
              Set New Password
            </h2>
            <p className="text-center text-gray-500 mb-8 md:mb-10 text-base">
              Create a strong password to secure your account
            </p>

            {/* Reset Password Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 pr-12 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-base text-gray-900 placeholder-gray-500"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 pr-12 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-base text-gray-900 placeholder-gray-500"
                    placeholder="Re-enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white py-3 px-4 rounded-xl font-medium text-base transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Update Password
              </button>
            </form>

            {/* Back to Login Link */}
            <div className="mt-6 text-center text-gray-500 text-sm md:text-base">
              <p>
                Remember your password?{" "}
                <a href="/login" className="text-blue-600 hover:underline">
                  Back to Login
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;