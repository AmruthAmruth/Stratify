"use client"

import { useState } from "react"
import { Check, X, ArrowRight, Zap, Star, Shield } from "lucide-react"
import { Navbar } from "./Navbar"
import Footer from "./Footer"
import { Link } from "react-router-dom"

const PricingPage = () => {
    const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly")

    const plans = [
        {
            name: "Starter",
            description: "Perfect for small teams getting started",
            monthlyPrice: 0,
            annualPrice: 0,
            icon: Zap,
            color: "from-blue-500 to-cyan-500",
            borderColor: "border-blue-500/50",
            features: [
                { name: "Up to 10 employees", included: true },
                { name: "5 projects", included: true },
                { name: "Basic task management", included: true },
                { name: "Email support", included: true },
                { name: "Advanced analytics", included: false },
                { name: "Priority support", included: false },
                { name: "Custom integrations", included: false },
                { name: "Dedicated account manager", included: false },
            ],
            cta: "Get Started Free",
            popular: false,
        },
        {
            name: "Professional",
            description: "For growing businesses that need more",
            monthlyPrice: 49,
            annualPrice: 470,
            icon: Star,
            color: "from-purple-500 to-pink-500",
            borderColor: "border-purple-500",
            features: [
                { name: "Up to 100 employees", included: true },
                { name: "Unlimited projects", included: true },
                { name: "Advanced task management", included: true },
                { name: "Priority email & chat support", included: true },
                { name: "Advanced analytics", included: true },
                { name: "API access", included: true },
                { name: "Custom integrations", included: false },
                { name: "Dedicated account manager", included: false },
            ],
            cta: "Start Free Trial",
            popular: true,
        },
        {
            name: "Enterprise",
            description: "For large organizations with custom needs",
            monthlyPrice: 199,
            annualPrice: 1990,
            icon: Shield,
            color: "from-[#009063] to-emerald-600",
            borderColor: "border-[#009063]",
            features: [
                { name: "Unlimited employees", included: true },
                { name: "Unlimited projects", included: true },
                { name: "Advanced task management", included: true },
                { name: "24/7 priority support", included: true },
                { name: "Advanced analytics", included: true },
                { name: "API access", included: true },
                { name: "Custom integrations", included: true },
                { name: "Dedicated account manager", included: true },
            ],
            cta: "Contact Sales",
            popular: false,
        },
    ]

    return (
        <div className="min-h-screen bg-[#fbfbfb] relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 left-10 w-96 h-96 bg-[#dfdcef]/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
                <div
                    className="absolute top-40 right-10 w-96 h-96 bg-[#009063]/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"
                    style={{ animationDelay: "2s" }}
                ></div>
                <div
                    className="absolute bottom-20 left-1/3 w-96 h-96 bg-[#dfdcef]/15 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"
                    style={{ animationDelay: "4s" }}
                ></div>
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#dfdcef_1px,transparent_1px),linear-gradient(to_bottom,#dfdcef_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20"></div>
            </div>

            {/* Navigation */}
            <nav className="relative z-50 flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
                <Navbar />
            </nav>

            <div className="relative z-40 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 lg:pt-20 pb-16 sm:pb-20 lg:pb-24">
                {/* Header */}
                <div className="text-center mb-12 sm:mb-16">
                    <div className="inline-flex items-center space-x-2 bg-white border-2 border-[#dfdcef] px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-lg mb-6">
                        <Star className="w-4 h-4 sm:w-5 sm:h-5 text-[#009063] fill-current" />
                        <span className="text-[#3b3b3b] font-bold text-sm sm:text-base">Simple, Transparent Pricing</span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-4 sm:mb-6">
                        <span className="block text-[#3b3b3b]">Choose Your</span>
                        <span className="block text-[#009063]">Perfect Plan</span>
                    </h1>

                    <p className="text-lg sm:text-xl lg:text-2xl text-[#3b3b3b]/80 max-w-3xl mx-auto leading-relaxed">
                        Start free, scale as you grow. No hidden fees, cancel anytime.
                    </p>

                    {/* Billing Toggle */}
                    <div className="flex items-center justify-center gap-4 mt-8">
                        <span className={`text-lg font-semibold ${billingCycle === "monthly" ? "text-[#009063]" : "text-[#3b3b3b]/60"}`}>
                            Monthly
                        </span>
                        <button
                            onClick={() => setBillingCycle(billingCycle === "monthly" ? "annual" : "monthly")}
                            className="relative w-16 h-8 bg-[#dfdcef] rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#009063] focus:ring-offset-2"
                        >
                            <div
                                className={`absolute top-1 left-1 w-6 h-6 bg-[#009063] rounded-full transition-transform duration-300 ${billingCycle === "annual" ? "translate-x-8" : ""
                                    }`}
                            ></div>
                        </button>
                        <span className={`text-lg font-semibold ${billingCycle === "annual" ? "text-[#009063]" : "text-[#3b3b3b]/60"}`}>
                            Annual
                            <span className="ml-2 text-sm bg-[#009063] text-white px-2 py-1 rounded-full">Save 20%</span>
                        </span>
                    </div>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            className={`relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 ${plan.popular ? plan.borderColor : "border-[#dfdcef]"
                                } ${plan.popular ? "transform scale-105 md:scale-110" : "hover:scale-105"}`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                                        Most Popular
                                    </div>
                                </div>
                            )}

                            <div className="text-center mb-8">
                                <div className={`w-16 h-16 bg-gradient-to-br ${plan.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md`}>
                                    <plan.icon className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-[#3b3b3b] mb-2">{plan.name}</h3>
                                <p className="text-[#3b3b3b]/70 text-sm">{plan.description}</p>
                            </div>

                            <div className="text-center mb-8">
                                <div className="flex items-baseline justify-center">
                                    <span className="text-5xl font-black text-[#3b3b3b]">
                                        ${billingCycle === "monthly" ? plan.monthlyPrice : Math.floor(plan.annualPrice / 12)}
                                    </span>
                                    <span className="text-[#3b3b3b]/70 ml-2">/month</span>
                                </div>
                                {billingCycle === "annual" && plan.annualPrice > 0 && (
                                    <p className="text-sm text-[#3b3b3b]/60 mt-2">Billed ${plan.annualPrice} annually</p>
                                )}
                            </div>

                            <Link
                                to={plan.name === "Enterprise" ? "/contact" : "/register"}
                                className={`block w-full py-4 rounded-2xl font-bold text-lg text-center mb-8 transition-all duration-300 ${plan.popular
                                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                                        : "bg-[#dfdcef]/50 text-[#3b3b3b] hover:bg-[#dfdcef] border-2 border-[#dfdcef]"
                                    }`}
                            >
                                {plan.cta}
                            </Link>

                            <div className="space-y-4">
                                {plan.features.map((feature, featureIndex) => (
                                    <div key={featureIndex} className="flex items-start space-x-3">
                                        {feature.included ? (
                                            <Check className="w-5 h-5 text-[#009063] flex-shrink-0 mt-0.5" />
                                        ) : (
                                            <X className="w-5 h-5 text-[#3b3b3b]/30 flex-shrink-0 mt-0.5" />
                                        )}
                                        <span className={`text-sm ${feature.included ? "text-[#3b3b3b]" : "text-[#3b3b3b]/40"}`}>
                                            {feature.name}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* FAQ Section */}
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl sm:text-4xl font-bold text-center text-[#3b3b3b] mb-12">
                        Frequently Asked Questions
                    </h2>
                    <div className="space-y-6">
                        {[
                            {
                                q: "Can I change plans later?",
                                a: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.",
                            },
                            {
                                q: "What payment methods do you accept?",
                                a: "We accept all major credit cards, PayPal, and bank transfers for Enterprise plans.",
                            },
                            {
                                q: "Is there a free trial?",
                                a: "Yes! All paid plans come with a 14-day free trial. No credit card required.",
                            },
                            {
                                q: "What happens when I cancel?",
                                a: "You can cancel anytime. Your account remains active until the end of your billing period.",
                            },
                        ].map((faq, index) => (
                            <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border-2 border-[#dfdcef]">
                                <h3 className="text-lg font-bold text-[#3b3b3b] mb-2">{faq.q}</h3>
                                <p className="text-[#3b3b3b]/70">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA Section */}
                <div className="mt-16 text-center">
                    <div className="bg-gradient-to-r from-[#009063] to-emerald-600 rounded-3xl p-12 shadow-2xl">
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Still have questions?</h2>
                        <p className="text-white/90 text-lg mb-8">Our team is here to help you find the perfect plan</p>
                        <Link
                            to="/contact"
                            className="inline-flex items-center space-x-3 bg-white text-[#009063] px-8 py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                        >
                            <span>Contact Sales</span>
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}

export default PricingPage
