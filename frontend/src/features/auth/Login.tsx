import React from "react";
import AuthForm from "../../shared/components/Forms/DynamicForm";
import { loginFields } from "../../shared/components/Forms/formFields";
import { loginSchema } from "@/shared/utils/validations";
import { Navbar } from "../Genaral/Navbar";
const Login: React.FC = () => {
  const handleLogin = (values: Record<string, unknown>) => {
    console.log("Login Data:", values);

  };

  return (
   <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 px-4">
    <Navbar/>
  {/* Card */}
  <div className="bg-white shadow-2xl rounded-3xl p-16 w-full max-w-4xl">
    
    {/* Headline */}
    <h1 className="text-5xl font-bold text-gray-800 text-center mb-5">
      Welcome Back
    </h1>

    {/* Subtext / Caption */}
    <p className="text-center text-gray-500 text-lg mb-12">
      Login to access your account
    </p>

    {/* Login Form */}
    <AuthForm
      fields={loginFields} // Only email & password
      validationSchema={loginSchema}
      onSubmit={handleLogin}
      buttonText="Login"
    />

    {/* Optional: Links */}
    <div className="mt-8 text-center text-gray-500 text-base">
      <p>
        Forgot your password?{" "}
        <a href="/forgot-password" className="text-blue-600 hover:underline">
          Reset it
        </a>
      </p>
      <p className="mt-3">
        Don't have an account?{" "}
        <a href="/register" className="text-blue-600 hover:underline">
          Sign up
        </a>
      </p>
    </div>
  </div>
</div>



  );
};

export default Login;
