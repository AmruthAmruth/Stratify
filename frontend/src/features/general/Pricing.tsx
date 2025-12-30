"use client"

import { useState } from "react"
import { Check, X, ArrowRight, Rocket, Building2, Crown, Users, FolderKanban, Calendar, BarChart3, Shield, Clock, Headphones, Zap, Globe } from "lucide-react"
import { Navbar } from "./Navbar"
import Footer from "./Footer"
import { Link } from "react-router-dom"

const PricingPage = () => {
    const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly")

    const plans = [
        {
            name: "Free Trial",
            description: "Perfect for small teams to explore Stratify",
            monthlyPrice: 0,
            annualPrice: 0,
            icon: Rocket,
            color: "from-primary/80 to-primary",
            borderColor: "border-primary/30",
            features: [
                { name: "Up to 15 employees", included: true },
                { name: "3 active projects", included: true },
                { name: "Basic task & issue tracking", included: true },
                { name: "Team collaboration tools", included: true },
                { name: "Basic analytics dashboard", included: true },
                { name: "Email support (48hr response)", included: true },
                { name: "Advanced reporting & insights", included: false },
                { name: "Priority support", included: false },
                { name: "Custom workflows & automation", included: false },
                { name: "API access & integrations", included: false },
                { name: "Dedicated account manager", included: false },
                { name: "SSO & advanced security", included: false },
            ],
            cta: "Start Free Trial",
            ctaLink: "/register",
            popular: false,
            badge: "14 Days Free",
        },
        {
            name: "Professional",
            description: "For growing teams that need powerful features",
            monthlyPrice: 2999,
            annualPrice: 28790,
            icon: Building2,
            color: "from-primary to-primaryHover",
            borderColor: "border-primary",
            features: [
                { name: "Up to 100 employees", included: true },
                { name: "Unlimited projects", included: true },
                { name: "Advanced task, issue & sprint management", included: true },
                { name: "Real-time collaboration & meetings", included: true },
                { name: "Advanced analytics & custom reports", included: true },
                { name: "Priority email & chat support (24hr)", included: true },
                { name: "Custom workflows & automation", included: true },
                { name: "API access & integrations", included: true },
                { name: "Role-based access control", included: true },
                { name: "Document management", included: true },
                { name: "Dedicated account manager", included: false },
                { name: "SSO & advanced security", included: false },
            ],
            cta: "Start Free Trial",
            ctaLink: "/register",
            popular: true,
            badge: "Most Popular",
        },
        {
            name: "Enterprise",
            description: "For large organizations with custom needs",
            monthlyPrice: 9999,
            annualPrice: 95990,
            icon: Crown,
            color: "from-primaryHover to-primary",
            borderColor: "border-primaryHover",
            features: [
                { name: "Unlimited employees", included: true },
                { name: "Unlimited projects & storage", included: true },
                { name: "Complete project & HR management suite", included: true },
                { name: "Advanced collaboration & video meetings", included: true },
                { name: "Custom analytics & BI dashboards", included: true },
                { name: "24/7 priority support (1hr response)", included: true },
                { name: "Custom workflows & automation", included: true },
                { name: "Full API access & custom integrations", included: true },
                { name: "Advanced security & compliance", included: true },
                { name: "SSO, SAML & directory sync", included: true },
                { name: "Dedicated account manager", included: true },
                { name: "Custom onboarding & training", included: true },
            ],
            cta: "Contact Sales",
            ctaLink: "/contact",
            popular: false,
            badge: "Custom Solutions",
        },
    ]

    const features = [
        {
            icon: Users,
            title: "Employee Management",
            description: "Complete HR suite with attendance, leave management, and performance tracking"
        },
        {
            icon: FolderKanban,
            title: "Project & Task Management",
            description: "Kanban boards, sprints, issues, and milestones for agile teams"
        },
        {
            icon: Calendar,
            title: "Meeting & Scheduling",
            description: "Integrated calendar, meeting rooms, and team scheduling tools"
        },
        {
            icon: BarChart3,
            title: "Analytics & Reporting",
            description: "Real-time insights, custom reports, and performance metrics"
        },
        {
            icon: Shield,
            title: "Security & Compliance",
            description: "Enterprise-grade security with role-based access and audit logs"
        },
        {
            icon: Zap,
            title: "Automation & Workflows",
            description: "Automate repetitive tasks and create custom workflows"
        }
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
                    <div className="inline-flex items-center space-x-2 bg-surface border-2 border-accent px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-lg mb-6">
                        <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                        <span className="text-text font-bold text-sm sm:text-base">Trusted by 500+ Companies in India</span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-4 sm:mb-6">
                        <span className="block text-text">Simple Pricing for</span>
                        <span className="block bg-gradient-to-r from-primary to-primaryHover bg-clip-text text-transparent">Powerful Management</span>
                    </h1>

                    <p className="text-lg sm:text-xl lg:text-2xl text-text/80 max-w-3xl mx-auto leading-relaxed">
                        Start with a free trial. Scale as you grow. All plans include 14-day free trial with no credit card required.
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
                            <span className="ml-2 text-sm bg-primary text-textOnPrimary px-3 py-1 rounded-full font-bold">Save 20%</span>
                        </span>
                    </div>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            className={`relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 ${plan.popular ? plan.borderColor : "border-accent"
                                } ${plan.popular ? "transform scale-105 md:scale-110 z-10" : "hover:scale-105"}`}
                        >
                            {plan.badge && (
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                    <div className={`${plan.popular
                                        ? "bg-gradient-to-r from-primary to-primaryHover"
                                        : plan.name === "Free Trial"
                                            ? "bg-primary"
                                            : "bg-gradient-to-r from-primaryHover to-primary"
                                        } text-textOnPrimary px-6 py-2 rounded-full text-sm font-bold shadow-lg`}>
                                        {plan.badge}
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
                                    <span className="text-2xl font-bold text-text/70">₹</span>
                                    <span className="text-5xl font-black text-text ml-1">
                                        {billingCycle === "monthly"
                                            ? plan.monthlyPrice.toLocaleString('en-IN')
                                            : Math.floor(plan.annualPrice / 12).toLocaleString('en-IN')}
                                    </span>
                                    <span className="text-text/70 ml-2">/month</span>
                                </div>
                                {billingCycle === "annual" && plan.annualPrice > 0 && (
                                    <p className="text-sm text-text/60 mt-2">
                                        Billed ₹{plan.annualPrice.toLocaleString('en-IN')} annually
                                    </p>
                                )}
                                {plan.monthlyPrice === 0 && (
                                    <p className="text-sm font-semibold text-primary mt-2">No credit card required</p>
                                )}
                            </div>

                            <Link
                                to={plan.ctaLink}
                                className={`block w-full py-4 rounded-2xl font-bold text-lg text-center mb-8 transition-all duration-300 ${plan.popular
                                    ? "bg-gradient-to-r from-primary to-primaryHover text-textOnPrimary shadow-lg hover:shadow-xl transform hover:scale-105"
                                    : plan.name === "Free Trial"
                                        ? "bg-primary text-textOnPrimary shadow-lg hover:shadow-xl transform hover:scale-105"
                                        : "bg-gradient-to-r from-primaryHover to-primary text-textOnPrimary shadow-lg hover:shadow-xl transform hover:scale-105"
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
                                        <span className={`text-sm ${feature.included ? "text-text font-medium" : "text-text/40"}`}>
                                            {feature.name}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Features Section */}
                <div className="mb-20">
                    <h2 className="text-3xl sm:text-4xl font-bold text-center text-text mb-4">
                        Everything You Need to Manage Your Company
                    </h2>
                    <p className="text-center text-text text-lg mb-12 max-w-3xl mx-auto">
                        Stratify is a complete company management platform with powerful features for teams of all sizes
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div key={index} className="bg-surface rounded-2xl p-6 shadow-lg border-2 border-accent hover:border-primary transition-all duration-300 hover:shadow-xl">
                                <div className="w-12 h-12 bg-gradient-to-br from-primary to-primaryHover rounded-xl flex items-center justify-center mb-4">
                                    <feature.icon className="w-6 h-6 text-textOnPrimary" />
                                </div>
                                <h3 className="text-xl font-bold text-text mb-2">{feature.title}</h3>
                                <p className="text-text">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="max-w-4xl mx-auto mb-20">
                    <h2 className="text-3xl sm:text-4xl font-bold text-center text-text mb-12">
                        Frequently Asked Questions
                    </h2>
                    <div className="space-y-6">
                        {[
                            {
                                q: "How does the free trial work?",
                                a: "Start with our Free Trial plan for 14 days with no credit card required. You get access to core features for up to 15 employees and 3 projects. Upgrade anytime to unlock more features.",
                            },
                            {
                                q: "Can I change plans later?",
                                a: "Absolutely! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any charges or credits.",
                            },
                            {
                                q: "What payment methods do you accept?",
                                a: "We accept all major credit/debit cards, UPI, net banking, and bank transfers for Enterprise plans. All payments are processed securely.",
                            },
                            {
                                q: "Is my data secure?",
                                a: "Yes! We use enterprise-grade security with SSL encryption, regular backups, and comply with industry standards. Your data is stored securely in Indian data centers.",
                            },
                            {
                                q: "What happens when I cancel?",
                                a: "You can cancel anytime with no penalties. Your account remains active until the end of your billing period, and you can export all your data.",
                            },
                            {
                                q: "Do you offer discounts for annual billing?",
                                a: "Yes! Save 20% when you choose annual billing. For example, the Professional plan costs ₹2,999/month (₹35,988/year) monthly, but only ₹28,790/year with annual billing.",
                            },
                        ].map((faq, index) => (
                            <div key={index} className="bg-surface rounded-2xl p-6 shadow-lg border-2 border-accent hover:border-primary transition-all duration-300">
                                <h3 className="text-lg font-bold text-text mb-2 flex items-center">
                                    <Clock className="w-5 h-5 text-primary mr-2" />
                                    {faq.q}
                                </h3>
                                <p className="text-text ml-7">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA Section */}
                <div className="text-center">
                    <div className="bg-gradient-to-r from-primary via-primaryHover to-primary rounded-3xl p-12 shadow-2xl relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
                        <div className="relative z-10">
                            <Headphones className="w-16 h-16 text-textOnPrimary mx-auto mb-4" />
                            <h2 className="text-3xl sm:text-4xl font-bold text-textOnPrimary mb-4">Need Help Choosing the Right Plan?</h2>
                            <p className="text-textOnPrimary/90 text-lg mb-8 max-w-2xl mx-auto">
                                Our team is here to help you find the perfect plan for your organization. Get personalized recommendations and answers to all your questions.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                <Link
                                    to="/contact"
                                    className="inline-flex items-center space-x-3 bg-surface text-primary px-8 py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                                >
                                    <span>Contact Sales</span>
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                                <Link
                                    to="/register"
                                    className="inline-flex items-center space-x-3 bg-transparent border-2 border-textOnPrimary text-textOnPrimary px-8 py-4 rounded-2xl font-bold text-lg hover:bg-surface hover:text-primary shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                                >
                                    <span>Start Free Trial</span>
                                    <Rocket className="w-5 h-5" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}

export default PricingPage
