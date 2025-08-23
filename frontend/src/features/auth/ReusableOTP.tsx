import React, { useState } from "react";

interface ReusableOTPProps {
  onVerify: (otp: string) => void;
  loading?: boolean;
}

const ReusableOTP: React.FC<ReusableOTPProps> = ({ onVerify, loading }) => {
  const [otp, setOtp] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length === 6) {
      onVerify(otp);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
      <input
        type="text"
        maxLength={6}
        value={otp}
        onChange={handleChange}
        className="border rounded-lg px-4 py-2 text-center text-lg tracking-widest"
        placeholder="Enter OTP"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Verifying..." : "Verify"}
      </button>
    </form>
  );
};

export default ReusableOTP;
