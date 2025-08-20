import React from "react";
import AuthForm from "../../shared/components/Forms/DynamicForm";
import { loginFields } from "../../shared/components/Forms/formFields";
import { loginSchema } from "@/shared/utils/validations";
import { Navbar } from "../Genaral/Navbar";
import { Users } from "lucide-react";
import { companyLogin } from "@/services/authApi";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCredentials } from "@/store/slices/authSlice";
import { useSnackbar } from "notistack";


const Login: React.FC = () => {
  interface LoginValues {
    email: string;
    password: string;
  }

    interface DecodedToken {
  id: string;
  role: string;
  exp: number;
}

const dispatch = useDispatch()
const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

const handleLogin = async (values: LoginValues) => {
  console.log("Login Data:", values);
  try {
    const data = await companyLogin(values);
    console.log("Login Successful", data);
    enqueueSnackbar("Login successful!", {
          variant: "success",
        });

    if (data.accessToken) {
      const decoded: DecodedToken = jwtDecode(data.accessToken);
      console.log("decoded", decoded);

      dispatch(
        setCredentials({
          accessToken: data.accessToken,
          role: decoded.role,
          userId: decoded.id,
        })
      );

      navigate("/dashboard");
    }
  } catch (err) {
    console.error("Login failed:", err);
   
        enqueueSnackbar(err?.error || "Registration failed", {
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
          <Users className="w-20 h-20 mb-6 text-white" />
          <h1 className="text-5xl font-bold mb-4 leading-snug">
            Welcome to Stratify
          </h1>
          <p className="text-lg text-gray-200 max-w-md">
            Secure login for{" "}
            <span className="font-semibold">Companies, Managers, and Teams</span>.  
            Collaborate, manage, and achieve your goals together.
          </p>
        </div>

        {/* Login Form */}
        <div className="flex w-full lg:w-1/2 justify-center items-center px-6 py-12 lg:px-12">
          <div className="bg-white shadow-2xl rounded-3xl p-8 sm:p-10 md:p-12 lg:p-14 w-full max-w-lg md:max-w-xl lg:max-w-2xl transition-all duration-300">
            {/* Badge */}
            <div className="flex justify-center mb-6">
              <span className="bg-indigo-100 text-indigo-700 px-5 py-2 rounded-full text-sm md:text-base font-medium shadow-sm">
                Login Portal
              </span>
            </div>

            {/* Title */}
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-3">
              Sign in to Continue
            </h2>
            <p className="text-center text-gray-500 mb-8 md:mb-10 text-base">
              Enter your details to access your account
            </p>

            {/* Auth Form */}
            <AuthForm
              fields={loginFields}
              validationSchema={loginSchema}
              onSubmit={handleLogin}
              buttonText="Login"
            />

            {/* Links */}
            <div className="mt-6 text-center text-gray-500 text-sm md:text-base">
              <p>
                Forgot your password?{" "}
                <a href="/forgot-password" className="text-blue-600 hover:underline">
                  Reset it
                </a>
              </p>
              <p className="mt-3">
                Don’t have an account?{" "}
                <a href="/register" className="text-blue-600 hover:underline">
                  Sign up
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
