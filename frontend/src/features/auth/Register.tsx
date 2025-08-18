import React, { useState } from "react";
import AuthForm from "../../shared/components/Forms/DynamicForm";
import { registerFields } from "../../shared/components/Forms/formFields";
import { registerSchema } from "@/shared/utils/validations";
import { Navbar } from "../Genaral/Navbar";
import { companyRegistration } from "@/services/authApi";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react"; 

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false); 

  const handleRegister = (values: Record<string, unknown>) => {
    console.log("Register Data:", values);
    localStorage.setItem("email", values.email as string);

    setLoading(true); 

    companyRegistration(values)
      .then((data) => {
        console.log("After Registration:", data);

        enqueueSnackbar("Registration successful! OTP sent to your email.", {
          variant: "success",
        });

        navigate("/otp");
      })
      .catch((err) => {
        console.error("Registration failed:", err);

        enqueueSnackbar(err?.error || "Registration failed", {
          variant: "error",
        });
      })
      .finally(() => {
        setLoading(false); 
      });
  };

  return (
    <>
      <Navbar />

      <div className="bg-gray-50 min-h-screen pt-28 flex justify-center items-center px-4 sm:px-6">
        <div className="bg-white shadow-2xl rounded-3xl flex flex-col lg:flex-row w-full max-w-8xl overflow-hidden border border-gray-100">
          {/* Left Section */}
          <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex-col justify-center p-12 space-y-6">
            <h2 className="text-4xl font-extrabold leading-tight">
              Welcome to <span className="text-yellow-300">Stratify</span> 🚀
            </h2>
            <p className="text-lg opacity-90 leading-relaxed">
              Streamline your company’s management and empower your team with our all-in-one platform.
              <br /><br />
              <span className="font-semibold text-white/90">Why choose Stratify?</span>
            </p>

            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-3 h-3 mt-2 bg-yellow-400 rounded-full"></span>
                <span className="text-white text-sm leading-snug">
                  Effortless team collaboration with real-time updates.
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-3 h-3 mt-2 bg-yellow-400 rounded-full"></span>
                <span className="text-white text-sm leading-snug">
                  Manage multiple companies and projects in a single platform.
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-3 h-3 mt-2 bg-yellow-400 rounded-full"></span>
                <span className="text-white text-sm leading-snug">
                  Secure payments, notifications, and reports at your fingertips.
                </span>
              </li>
            </ul>

            <p className="mt-4 text-white/80 text-sm">
              Join Stratify today and take the first step towards smarter operations.
            </p>
          </div>

          {/* Right Section - Registration Form */}
          <div className="w-full lg:w-1/2 p-6 sm:p-12 flex flex-col justify-center">
            <h1 className="text-3xl font-bold text-gray-800 text-center mb-2">
              Create Your Company Account
            </h1>
            <p className="text-center text-gray-500 mb-8">
              Join our platform to manage your company efficiently and effortlessly.
            </p>

            <div className="bg-gray-50 p-6 rounded-2xl shadow-inner border border-gray-100 w-full sm:w-[90%] mx-auto">
              <AuthForm
                fields={registerFields}
                validationSchema={registerSchema}
                onSubmit={handleRegister}
                buttonText={
                  loading ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="animate-spin h-5 w-5 mr-2" />
                      Processing...
                    </span>
                  ) : (
                    "Register"
                  )
                }
                buttonClassName={`w-full font-semibold py-3 rounded-xl shadow-md transition-all duration-200 ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg"
                }`}
                disabled={loading} // ✅ disables button
              />
            </div>

            <div className="mt-6 text-center text-gray-600">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-blue-600 font-semibold hover:underline"
              >
                Login
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
