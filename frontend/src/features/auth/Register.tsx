import React from "react";
import AuthForm from "../../shared/components/Forms/DynamicForm";
import { registerFields } from "../../shared/components/Forms/formFields";
import { registerSchema } from "@/shared/utils/validations";
import { Navbar } from "../Genaral/Navbar";

const Register: React.FC = () => {
  const handleRegister = (values: Record<string, unknown>) => {
    console.log("Register Data:", values);
    // TODO: Call API here
  };

  return (
    <>
      <Navbar />

      <div className="bg-gray-50 min-h-screen pt-28 flex justify-center items-center px-6">
        <div className="bg-white shadow-2xl rounded-3xl flex flex-col lg:flex-row w-full max-w-8xl overflow-hidden">
          {/* Left Section - Welcome */}
          <div className="lg:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex flex-col justify-center items-center p-12">
            <h2 className="text-4xl font-extrabold mb-6 text-center">
              Welcome to Stratify 🚀
            </h2>
            <p className="text-lg text-center opacity-90 leading-relaxed">
              Streamline your company’s management and empower your team with our
              all-in-one platform. Register today and take the first step towards
              smarter operations.
            </p>
            <img
              src="https://illustrations.popsy.co/gray/business-deal.svg"
              alt="Welcome Illustration"
              className="mt-10 w-72 hidden md:block"
            />
          </div>

          {/* Right Section - Registration Form */}
          <div className="lg:w-1/2 p-12 flex flex-col justify-center ">
            <h1 className="text-3xl font-bold text-gray-800 text-center mb-4">
              Create Your Company Account
            </h1>
            <p className="text-center text-gray-500 mb-8">
              Join our platform to manage your company efficiently and
              effortlessly.
            </p>

            <AuthForm
              fields={registerFields}
              validationSchema={registerSchema}
              onSubmit={handleRegister}
              buttonText="Register"
            />

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
