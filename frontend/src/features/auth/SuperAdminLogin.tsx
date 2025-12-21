import React from "react";
import AuthForm from "../../shared/components/Forms/DynamicForm";
import { loginFields } from "../../shared/components/Forms/formFields";
import { loginSchema } from "@/shared/utils/validations";
import { superAdminLogin } from "@/services/authApi";
import { ShieldCheck } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

const SuperAdminLogin: React.FC = () => {
  interface LoginValues {
    email: string;
    password: string;
  }

  interface DecodedToken {
    id: string;
    role: string;
    exp: number;
    name: string
  }

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const handleLogin = (values: Record<string, unknown>) => {
    const loginValues = values as unknown as LoginValues;
    superAdminLogin(loginValues)
      .then((data) => {
        if (data.accessToken) {
          const decoded: DecodedToken = jwtDecode(data.accessToken);
          dispatch(
            setCredentials({
              accessToken: data.accessToken,
              role: decoded.role,
              userId: decoded.id,
              name: decoded.name || "Super Admin",
            })
          );

          enqueueSnackbar("Login successful!", { variant: "success" });
          navigate("/dashboard");
        }
      })
      .catch((err) => {
        enqueueSnackbar(err?.error || "Login failed", { variant: "error" });
      });
  };

  return (
    <div className="min-h-screen flex bg-[#fbfbfb]">
      {/* Left Panel */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-[#009063] to-[#3b3b3b] text-white flex-col justify-center items-center p-12 rounded-r-3xl shadow-lg">
        <ShieldCheck className="w-20 h-20 mb-6 text-white" />
        <h1 className="text-4xl font-bold mb-4">Stratify Admin Portal</h1>
        <p className="text-lg text-gray-200 max-w-md text-center">
          Secure access for Super Administrators. Manage your company and
          oversee operations with full control.
        </p>
      </div>

      {/* Right Panel */}
      <div className="flex w-full lg:w-1/2 justify-center items-center px-6">
        <div className="bg-white shadow-2xl rounded-3xl p-14 w-full max-w-3xl border border-[#dfdcef]">
          {/* Badge */}
          <div className="flex justify-center mb-8 ">
            <span className="bg-[#009063] text-[#ffffff] px-5 py-1.5 rounded-full text-sm font-medium shadow-sm">
              Super Admin Login
            </span>
          </div>

          {/* Title */}
          <h2 className="text-4xl font-bold text-[#3b3b3b] text-center mb-4">
            Welcome Back 👋
          </h2>
          <p className="text-center text-gray-500 mb-10 text-lg">
            Sign in to continue to your admin dashboard
          </p>

          {/* Form */}
          <div className="space-y-6">
            <AuthForm
              fields={loginFields}
              validationSchema={loginSchema}
              onSubmit={handleLogin}
              buttonText="Login"
            />
          </div>

          {/* Links */}
          <div className="mt-10 text-center text-gray-500 text-base">
            <p>
              Forgot your password?{" "}
              <a
                href="/forgot-password"
                className="text-[#009063] hover:underline font-medium"
              >
                Reset it
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminLogin;
