import React, { useState } from "react";
import ReusableOTP from "@/shared/components/OTP/ReusableOTP";
import { Navbar } from "../Genaral/Navbar";
import { Users } from "lucide-react";
import { verifyOTP } from "@/services/authApi";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";


const OTP: React.FC = () => {
  const [otp, setOtp] = useState("");
 const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar(); 


  const handleVerify = () => {
    console.log("Entered OTP:", otp);
    
    const email = localStorage.getItem("email");
if (!email) {
  alert("Email not found. Please register first.");
  return;
}
      verifyOTP({ otp, email })
    .then((data) => {
      console.log("Registered data", data);
      enqueueSnackbar(data.message, {
          variant: "success",
        });
        localStorage.removeItem('email')
    })
    .catch((err) => {
      console.error("OTP verification failed:", err);
      enqueueSnackbar(err?.error || err.message, {
          variant: "error",
        });
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar */}
      <Navbar />

      <div className="flex flex-1 flex-col lg:flex-row pt-20">
        {/* Branding Section (only visible on lg+) */}
        <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-indigo-600 to-blue-800 text-white flex-col justify-center items-center p-16 text-left">
          <Users className="w-20 h-20 mb-6 text-white" />
          <h1 className="text-5xl font-bold mb-4 leading-snug">
            Verify Your Account
          </h1>
          <p className="text-lg text-gray-200 max-w-md">
            Enter the 6-digit code sent to your email or phone number to continue 
            accessing your account securely.
          </p>
        </div>

        {/* OTP Form Section */}
        <div className="flex w-full lg:w-1/2 justify-center items-center px-6 py-12 lg:px-12">
          <div className="bg-white shadow-2xl rounded-3xl p-8 sm:p-10 md:p-12 lg:p-14 w-full max-w-lg md:max-w-xl lg:max-w-2xl transition-all duration-300">
            
            {/* Badge */}
            <div className="flex justify-center mb-6">
              <span className="bg-indigo-100 text-indigo-700 px-5 py-2 rounded-full text-sm md:text-base font-medium shadow-sm">
                OTP Verification
              </span>
            </div>

            {/* Title */}
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-3">
              Enter OTP
            </h2>
            <p className="text-center text-gray-500 mb-8 md:mb-10 text-base">
              Please type the 6-digit code sent to your email or phone
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
            <div className="mt-6 text-center text-gray-500 text-sm md:text-base">
              <p>
                Didn't receive the code?{" "}
                <span className="text-blue-600 font-medium cursor-pointer hover:underline">
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

export default OTP;
