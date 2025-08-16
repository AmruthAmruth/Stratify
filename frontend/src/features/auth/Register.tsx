import React from "react";
import AuthForm from "../../shared/components/Forms/DynamicForm";
import { registerFields } from "../../shared/components/Forms/formFields";
import { registerSchema } from "@/shared/utils/validations";
import { Navbar } from "../Genaral/Navbar";
const Register: React.FC = () => {
  const handleRegister = (values: Record<string, unknown>) => {
    console.log("Register Data:", values);
    // Call API here
  };

  return (
   <>
  <Navbar />

  <div className="bg-gray-100 min-h-screen pt-24 flex justify-center items-start">
    <div className="bg-white shadow-2xl rounded-2xl p-12 max-w-3xl w-full mx-4">
      {/* Headline */}
      <h1 className="text-4xl font-extrabold text-gray-800 text-center mb-3">
        Create Your Company Account
      </h1>

      {/* Caption */}
      <p className="text-center text-gray-500 mb-10">
        Join our platform to manage your company efficiently and effortlessly.
      </p>

      {/* Registration Form */}
      <AuthForm
        fields={registerFields}
        validationSchema={registerSchema}
        onSubmit={handleRegister}
        buttonText="Register"
      />
    </div>
  </div>
</>

  );
};

export default Register;
