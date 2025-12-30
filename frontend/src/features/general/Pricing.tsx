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
            color: "from-primary to-primary",
            borderColor: "border-primary",
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
        <div className="min-h-screen bg-bg relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 left-10 w-96 h-96 bg-accent/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
                <div
                    className="absolute top-40 right-10 w-96 h-96 bg-primary/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"
                    style={{ animationDelay: "2s" }}
                ></div>
                <div
                    className="absolute bottom-20 left-1/3 w-96 h-96 bg-accent/15 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"
                    style={{ animationDelay: "4s" }}
                ></div>
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#dfdcef_1px,transparent_1px),linear-gradient(to_bottom,#dfdcef_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20"></div>
            </div>

            {/* Navigation */}
            <Navbar />

            <div className="relative z-40 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 lg:pt-32 pb-16 sm:pb-20 lg:pb-24">
                {/* Header */}
                <div className="text-center mb-12 sm:mb-16">
                    <div className="inline-flex items-center space-x-2 bg-white border-2 border-accent px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-lg mb-6">
                        <Star className="w-4 h-4 sm:w-5 sm:h-5 text-primary fill-current" />
                        <span className="text-text font-bold text-sm sm:text-base">Simple, Transparent Pricing</span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-4 sm:mb-6">
                        <span className="block text-text">Choose Your</span>
                        <span className="block text-primary">Perfect Plan</span>
                    </h1>

                    <p className="text-lg sm:text-xl lg:text-2xl text-text/80 max-w-3xl mx-auto leading-relaxed">
                        Start free, scale as you grow. No hidden fees, cancel anytime.
                    </p>

                    {/* Billing Toggle */}
                    <div className="flex items-center justify-center gap-4 mt-8">
                        <span className={`text-lg font-semibold ${billingCycle === "monthly" ? "text-primary" : "text-text/60"}`}>
                            Monthly
                        </span>
                        <button
                            onClick={() => setBillingCycle(billingCycle === "monthly" ? "annual" : "monthly")}
                            className="relative w-16 h-8 bg-accent rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                        >
                            <div
                                className={`absolute top-1 left-1 w-6 h-6 bg-primary rounded-full transition-transform duration-300 ${billingCycle === "annual" ? "translate-x-8" : ""
                                    }`}
                            ></div>
                        </button>
                        <span className={`text-lg font-semibold ${billingCycle === "annual" ? "text-primary" : "text-text/60"}`}>
                            Annual
                            <span className="ml-2 text-sm bg-primary text-white px-2 py-1 rounded-full">Save 20%</span>
                        </span>
                    </div>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            className={`relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 ${plan.popular ? plan.borderColor : "border-accent"
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
                                <h3 className="text-2xl font-bold text-text mb-2">{plan.name}</h3>
                                <p className="text-text/70 text-sm">{plan.description}</p>
                            </div>

                            <div className="text-center mb-8">
                                <div className="flex items-baseline justify-center">
                                    <span className="text-5xl font-black text-text">
                                        ${billingCycle === "monthly" ? plan.monthlyPrice : Math.floor(plan.annualPrice / 12)}
                                    </span>
                                    <span className="text-text/70 ml-2">/month</span>
                                </div>
                                {billingCycle === "annual" && plan.annualPrice > 0 && (
                                    <p className="text-sm text-text/60 mt-2">Billed ${plan.annualPrice} annually</p>
                                )}
                            </div>

                            <Link
                                to={plan.name === "Enterprise" ? "/contact" : "/register"}
                                className={`block w-full py-4 rounded-2xl font-bold text-lg text-center mb-8 transition-all duration-300 ${plan.popular
                                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                                    : "bg-accent/50 text-text hover:bg-accent border-2 border-accent"
                                    }`}
                            >
                                {plan.cta}
                            </Link>

                            <div className="space-y-4">
                                {plan.features.map((feature, featureIndex) => (
                                    <div key={featureIndex} className="flex items-start space-x-3">
                                        {feature.included ? (
                                            <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                        ) : (
                                            <X className="w-5 h-5 text-text/30 flex-shrink-0 mt-0.5" />
                                        )}
                                        <span className={`text-sm ${feature.included ? "text-text" : "text-text/40"}`}>
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
                    <h2 className="text-3xl sm:text-4xl font-bold text-center text-text mb-12">
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
                            <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border-2 border-accent">
                                <h3 className="text-lg font-bold text-text mb-2">{faq.q}</h3>
                                <p className="text-text/70">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA Section */}
                <div className="mt-16 text-center">
                    <div className="bg-gradient-to-r from-primary to-primary rounded-3xl p-12 shadow-2xl">
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Still have questions?</h2>
                        <p className="text-white/90 text-lg mb-8">Our team is here to help you find the perfect plan</p>
                        <Link
                            to="/contact"
                            className="inline-flex items-center space-x-3 bg-white text-primary px-8 py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
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
