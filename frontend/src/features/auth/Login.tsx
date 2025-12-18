import React from "react";
import AuthForm from "../../shared/components/Forms/DynamicForm";
import { loginFields } from "../../shared/components/Forms/formFields";
import { loginSchema } from "@/shared/utils/validations";
import { Navbar } from "../general/Navbar";
import { Users } from "lucide-react";
import { companyLogin } from "@/services/authApi";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCredentials } from "@/store/slices/authSlice";
import { useSnackbar } from "notistack";
import { connectSocket } from "@/shared/socket/socket";


const Login: React.FC = () => {
  interface LoginValues {
    email: string;
    password: string;
  }

  interface DecodedToken {
    id: string;
    role: string;
    exp: number;
    name: string;
  }

  const dispatch = useDispatch()
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleLogin = async (values: LoginValues) => {
    console.log("Login Data:", values);
    try {
      const data = await companyLogin(values);
      console.log("Login Successful", data);

      enqueueSnackbar("Login successful!", { variant: "success" });

      if (data.accessToken) {
        const decoded: DecodedToken = jwtDecode(data.accessToken);
        console.log("decoded", decoded);

        dispatch(
          setCredentials({
            accessToken: data.accessToken,
            role: decoded.role,
            userId: decoded.id,
            name: decoded.name,
          })
        );

        connectSocket(decoded.id)

        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Login failed:", err);

      const error = err as { message?: string; details?: { companyId?: string } };
      const errorMessage = error?.message || "Login failed";

      // check if it's the subscription error
      if ( // replace with real logged-in name
        errorMessage ===
        "Your subscription is not active. Please subscribe to continue." &&
        error?.details?.companyId
      ) {
        const companyId = error.details.companyId; // ✅ safe access
        enqueueSnackbar("Redirecting to subscription purchase page...", {
          variant: "info",
        });
        navigate(`/subscription-purchase/${companyId}`);
        return;
      }

      // otherwise show normal error
      enqueueSnackbar(errorMessage, { variant: "error" });
    }
  };


  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#fbfbfb' }}>
      {/* Navbar */}
      <Navbar />

      {/* Main Section */}
      <div className="flex flex-1 flex-col lg:flex-row pt-20">
        {/* Branding (only visible on lg+) */}
        <div
          className="hidden lg:flex w-1/2 flex-col justify-center items-center p-16 text-left"
          style={{ background: 'linear-gradient(to bottom right, #009063, #3b3b3b)', color: '#fbfbfb' }}
        >
          <Users className="w-20 h-20 mb-6" />
          <h1 className="text-5xl font-bold mb-4 leading-snug">
            Welcome to Stratify
          </h1>
          <p className="text-lg max-w-md" style={{ color: '#dfdcef' }}>
            Secure login for{" "}
            <span className="font-semibold">Companies, Managers, and Teams</span>.
            Collaborate, manage, and achieve your goals together.
          </p>
        </div>

        <div className="flex w-full lg:w-1/2 justify-center items-center px-6 py-12 lg:px-12">
          <div
            className="shadow-2xl rounded-3xl p-8 sm:p-10 md:p-12 lg:p-14 w-full max-w-lg md:max-w-xl lg:max-w-2xl transition-all duration-300"
            style={{ backgroundColor: '#fbfbfb', border: '1px solid #dfdcef' }}
          >
            <div className="flex justify-center mb-6">
              <span
                className="px-5 py-2 rounded-full text-sm md:text-base font-medium shadow-sm"
                style={{ backgroundColor: '#009063', color: '#fbfbfb' }}
              >
                Login Portal
              </span>
            </div>

            {/* Title */}
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-3" style={{ color: '#3b3b3b' }}>
              Sign in to Continue
            </h2>
            <p className="text-center mb-8 md:mb-10 text-base" style={{ color: '#3b3b3b' }}>
              Enter your details to access your account
            </p>

            {/* Auth Form */}
            <AuthForm
              fields={loginFields}
              validationSchema={loginSchema}
              onSubmit={handleLogin}
              buttonText="Login"
              buttonColor="#009063"
            />

            {/* Links */}
            <div className="mt-6 text-center text-sm md:text-base">
              <p style={{ color: '#3b3b3b' }}>
                Forgot your password?{" "}
                <a href="/forgot-password" className="hover:underline" style={{ color: '#009063' }}>
                  Reset it
                </a>
              </p>
              <p className="mt-3" style={{ color: '#3b3b3b' }}>
                Don’t have an account?{" "}
                <a href="/register" className="hover:underline" style={{ color: '#009063' }}>
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
