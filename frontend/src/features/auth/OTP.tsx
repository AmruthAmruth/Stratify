import React, { useState } from "react";
import ReusableOTP from "@/shared/components/OTP/ReusableOTP";
import { Navbar } from "../Genaral/Navbar";

const OTP = () => {
  const [otp, setOtp] = useState("");

  const handleVerify = () => {
    console.log("Entered OTP:", otp);
    // Add verification logic
  };

  return (
     <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <Navbar/>
      <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-md w-full text-center border border-gray-100">
        {/* Headline */}
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
          Verify Your Account
        </h1>

        {/* Subheading */}
        <p className="text-gray-500 mb-10">
          Enter the 6-digit code sent to your email or phone number
        </p>

        {/* OTP Inputs */}
        <div className="flex justify-center gap-4 mb-8">
          <ReusableOTP
            value={otp}
            onChange={setOtp}
            numInputs={6}
            inputSize="3.5rem"
            gap="1rem"
          />
        </div>

        {/* Verify Button */}
        <button
          onClick={handleVerify}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-md transition transform hover:scale-105"
        >
          Verify OTP
        </button>

        {/* Optional info */}
        <p className="text-gray-400 text-sm mt-6">
          Didn't receive the code?{" "}
          <span className="text-blue-600 font-medium cursor-pointer hover:underline">
            Resend OTP
          </span>
        </p>
      </div>
    </div>
  );
};

export default OTP;
