import React, { useState } from "react";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Password reset link sent to ${email}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#6a11cb] to-[#2575fc] px-4">
      <div className="bg-[#ffffff] rounded-3xl shadow-2xl max-w-2xl w-full flex flex-col md:flex-row overflow-hidden">
        
        {/* Left Side - Illustration */}
        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-[#6a11cb] to-[#2575fc] items-center justify-center">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="Forgot Password"
            className="w-64 h-64 animate-bounce"
          />
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-10">
          <h2 className="text-4xl font-bold text-[#1f1f1f] mb-4">
            Forgot Password
          </h2>
          <p className="text-[#555555] mb-8">
            Enter your email address below and we’ll send you a link to reset your password.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-[#1f1f1f] font-medium mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6a11cb] focus:border-transparent transition"
                placeholder="you@example.com"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg text-white font-semibold bg-gradient-to-br from-[#6a11cb] to-[#2575fc] hover:from-[#2575fc] hover:to-[#6a11cb] transition-all duration-300 shadow-lg"
            >
              Send Reset Link
            </button>
          </form>

          <p className="text-center text-[#555555] mt-6">
            Remember your password?{" "}
            <a
              href="/login"
              className="text-[#2575fc] font-medium hover:underline"
            >
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
