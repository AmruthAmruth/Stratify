"use client"

import type React from "react"
import { useState } from "react"
import AuthForm from "../../shared/components/Forms/DynamicForm"
import { registerFields } from "../../shared/components/Forms/formFields"
import { registerSchema } from "@/shared/utils/validations"
import { companyRegistration } from "@/services/authApi"
import { useSnackbar } from "notistack"
import { useNavigate } from "react-router-dom"
import { Loader2, Building2 } from "lucide-react"
import { Navbar } from "../general/Navbar"

const Register: React.FC = () => {
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const [loading, setLoading] = useState(false)

  const handleRegister = (values: Record<string, unknown>) => {
    console.log("Register Data:", values)
    localStorage.setItem("email", values.email as string)

    setLoading(true)

    companyRegistration(values)
      .then((data) => {
        console.log("After Registration:", data)

        enqueueSnackbar("Registration successful! OTP sent to your email.", {
          variant: "success",
        })
        if (data.time) {
          localStorage.setItem("otpExpiry", String(new Date(data.time).getTime()))
        }
        navigate("/verify-otp")
      })
      .catch((err) => {
        console.error("Registration failed:", err)

        enqueueSnackbar(err?.message || "Registration failed", {
          variant: "error",
        })
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen mt-10 flex items-center justify-center px-4 sm:px-6 lg:px-8" style={{ backgroundColor: "#f7f9fc", paddingTop: "80px" }}>
        <div
          className="w-full p-8 rounded-2xl shadow-xl relative overflow-hidden max-w-7xl"
          style={{
            background: "linear-gradient(135deg, #ffffff 0%, #f0f4f8 100%)",
            border: "1px solid #e0e4eb",
          }}
        >
          {/* Minimal background shapes */}
          <div className="absolute -top-16 -left-16 w-40 h-40 rounded-full bg-gradient-to-r from-primary to-accent opacity-10"></div>
          <div className="absolute -bottom-16 -right-16 w-40 h-40 rounded-full bg-gradient-to-r from-primary to-accent opacity-10"></div>

          {/* Header */}
          <div className="text-center mb-6">
            <div
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
              style={{ background: "linear-gradient(to right, #009063, #dfdcef)" }}
            >
              <Building2 className="w-8 h-8 text-white" />
            </div>

            <h1 className="text-3xl lg:text-4xl font-bold text-gray-800">
              Create Company Account
            </h1>
            <p className="text-lg text-gray-600">Start your journey with Stratify today</p>
          </div>

          {/* Form */}
          <AuthForm
            fields={registerFields}
            validationSchema={registerSchema}
            onSubmit={handleRegister}
            buttonText={
              loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin h-5 w-5" />
                  Creating Account...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Create Account
                </span>
              )
            }
            disabled={loading}
          />


          {/* Footer */}
          <div className="text-center mt-6">
            <p className="text-gray-600">
              Already have an account?{" "}
              <a
                href="/login"
                className="font-semibold text-primary hover:underline"
              >
                Sign in here
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Register
