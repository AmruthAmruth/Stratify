"use client"

import type React from "react"
import { useState } from "react"
import AuthForm from "../../shared/components/Forms/DynamicForm"
import { registerFields } from "../../shared/components/Forms/formFields"
import { registerSchema } from "@/shared/utils/validations"
import { companyRegistration } from "@/services/authApi"
import { useSnackbar } from "notistack"
import { useNavigate } from "react-router-dom"
import { Loader2, Building2, Users, Shield, Zap } from "lucide-react"
import { Navbar } from "../Genaral/Navbar"

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
        localStorage.setItem("otpExpiry", String(new Date(data.time).getTime()))
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
  
<Navbar/>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-8xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl lg:rounded-3xl overflow-hidden border border-white/20 grid lg:grid-cols-2 min-h-[600px]">
            <div className="hidden lg:flex bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white p-12 flex-col justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-indigo-800/20"></div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>

              <div className="relative z-10 space-y-8">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium">
                    <Building2 className="w-4 h-4" />
                    Company Management Platform
                  </div>

                  <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
                    Welcome to{" "}
                    <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                      Stratify
                    </span>
                  </h2>

                  <p className="text-xl text-blue-100 leading-relaxed">
                    Transform your business operations with our comprehensive management platform
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl flex items-center justify-center">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">Team Collaboration</h4>
                      <p className="text-blue-100 text-sm leading-relaxed">
                        Real-time collaboration tools that keep your team synchronized and productive
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">Multi-Company Management</h4>
                      <p className="text-blue-100 text-sm leading-relaxed">
                        Manage multiple companies and projects from a single, unified dashboard
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl flex items-center justify-center">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">Secure & Reliable</h4>
                      <p className="text-blue-100 text-sm leading-relaxed">
                        Enterprise-grade security with automated backups and compliance features
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/20">
                  <p className="text-blue-100 text-sm flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Join 10,000+ companies already using Stratify
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 lg:p-12 flex flex-col justify-center bg-white/50">
              <div className="max-w-7xl mx-auto w-full space-y-8">
                {/* Header */}
                <div className="text-center space-y-3">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-4">
                    <Building2 className="w-8 h-8 text-white" />
                  </div>

                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">Create Account</h1>
                  <p className="text-gray-600 text-lg">Start your journey with Stratify today</p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
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
                          Create Company Account
                        </span>
                      )
                    }
                    buttonClassName={`w-full font-semibold py-4 rounded-xl transition-all duration-300 transform ${
                      loading
                        ? "bg-gray-400 cursor-not-allowed scale-95"
                        : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                    }`}
                    disabled={loading}
                  />
                </div>

                <div className="text-center">
                  <p className="text-gray-600">
                    Already have an account?{" "}
                    <a
                      href="/login"
                      className="font-semibold text-blue-600 hover:text-blue-700 transition-colors duration-200 hover:underline"
                    >
                      Sign in here
                    </a>
                  </p>
                </div>

                {/* Mobile-only features preview */}
                <div className="lg:hidden pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="space-y-2">
                      <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mx-auto">
                        <Users className="w-5 h-5 text-blue-600" />
                      </div>
                      <p className="text-xs text-gray-600 font-medium">Team Collaboration</p>
                    </div>
                    <div className="space-y-2">
                      <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mx-auto">
                        <Building2 className="w-5 h-5 text-blue-600" />
                      </div>
                      <p className="text-xs text-gray-600 font-medium">Multi-Company</p>
                    </div>
                    <div className="space-y-2">
                      <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mx-auto">
                        <Shield className="w-5 h-5 text-blue-600" />
                      </div>
                      <p className="text-xs text-gray-600 font-medium">Secure Platform</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Register
