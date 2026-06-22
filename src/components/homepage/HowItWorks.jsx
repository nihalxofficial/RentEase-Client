// src/components/sections/HowItWorks.jsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  FileCheck,
  Home,
  Sparkles,
  ChevronRight,
  ArrowRight,
  User,
  CreditCard,
  MapPin,
  Calendar,
  CheckCircle,
  Building2,
  Send,
  Heart,
} from "lucide-react";

// ==================== HOW IT WORKS COMPONENT ====================
export default function HowItWorks({
  title = "How It Works",
  subtitle = "Your journey to finding the perfect home starts here",
  viewAllLink = "/properties",
  viewAllText = "Start Your Journey",
  steps = [
    {
      id: 1,
      title: "Search & Discover",
      description: "Browse through thousands of verified listings and find your dream property",
      longDescription: "Use our smart filters to narrow down properties by location, price, amenities, and more. Save your favorites and compare options side by side.",
      icon: Search,
      image: "https://static.vecteezy.com/system/resources/thumbnails/053/285/823/small/stunning-modern-real-estate-property-showcasing-innovative-architecture-in-high-definition-free-photo.jpg",
      color: "blue",
      features: ["Smart Filters", "Save Favorites", "Compare Properties"],
    },
    {
      id: 2,
      title: "Book & Verify",
      description: "Submit your booking request with secure verification",
      longDescription: "Complete your booking with our secure payment system. Get instant verification and confirmation from property owners.",
      icon: FileCheck,
      image: "https://imageio.forbes.com/blogs-images/allbusiness/files/2019/03/real-estate-concept-1200x753.jpeg?height=446&width=711&fit=bounds",
      color: "emerald",
      features: ["Secure Payments", "Instant Verification", "Owner Confirmation"],
    },
    {
      id: 3,
      title: "Move In & Enjoy",
      description: "Complete the process and move into your new home",
      longDescription: "Get all the support you need for a smooth move-in. Our team is here to help with any questions or concerns.",
      icon: Home,
      image: "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=600&h=400&fit=crop",
      color: "purple",
      features: ["Move-in Support", "24/7 Assistance", "Community Access"],
    },
  ],
}) {
  const [activeStep, setActiveStep] = useState(0);

  const getColorStyles = (color) => {
    const colors = {
      blue: {
        bg: "bg-blue-50",
        border: "border-blue-200",
        text: "text-blue-600",
        gradient: "from-blue-500 to-blue-600",
        dark: "from-blue-600 to-blue-700",
        hover: "hover:border-blue-300 hover:shadow-blue-100/30",
        light: "bg-blue-100",
      },
      emerald: {
        bg: "bg-emerald-50",
        border: "border-emerald-200",
        text: "text-emerald-600",
        gradient: "from-emerald-500 to-emerald-600",
        dark: "from-emerald-600 to-emerald-700",
        hover: "hover:border-emerald-300 hover:shadow-emerald-100/30",
        light: "bg-emerald-100",
      },
      purple: {
        bg: "bg-purple-50",
        border: "border-purple-200",
        text: "text-purple-600",
        gradient: "from-purple-500 to-purple-600",
        dark: "from-purple-600 to-purple-700",
        hover: "hover:border-purple-300 hover:shadow-purple-100/30",
        light: "bg-purple-100",
      },
    };
    return colors[color] || colors.blue;
  };

  const currentStep = steps[activeStep];
  const colors = getColorStyles(currentStep?.color || "blue");

  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50/80 backdrop-blur-sm rounded-full border border-blue-100/50 mb-4">
            <Sparkles className="w-4 h-4 text-blue-500" />
            <span className="text-blue-600 font-semibold text-xs uppercase tracking-widest">
              Simple Process
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-2">
            {title}
          </h2>
          <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </motion.div>

        {/* Step Indicators */}
        <div className="flex justify-center items-center gap-4 mb-12">
          {steps.map((step, index) => (
            <button
              key={step.id}
              onClick={() => setActiveStep(index)}
              className={`cursor-pointer flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-300 ${
                activeStep === index
                  ? `bg-gradient-to-r ${colors.gradient} text-white shadow-lg scale-105`
                  : "bg-gray-50 text-gray-500 hover:bg-gray-100"
              }`}
            >
              <step.icon className="w-4 h-4" strokeWidth={2} />
              <span className="font-medium text-sm hidden sm:inline">
                {step.title.split(" ")[0]}
              </span>
              <span className="font-medium text-sm hidden md:inline">
                {step.title}
              </span>
            </button>
          ))}
        </div>

        {/* Step Content - Advanced Layout */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Image */}
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <div className="relative h-[400px] w-full">
                <Image
                  src={currentStep.image}
                  alt={currentStep.title}
                  fill
                  className="object-cover"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${colors.dark} opacity-60`} />
              </div>
              
              {/* Floating Badge */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/50">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center`}>
                      <currentStep.icon className={`w-6 h-6 ${colors.text}`} strokeWidth={2} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        Step {currentStep.id} of {steps.length}
                      </p>
                      <p className="text-xs text-gray-500">
                        {currentStep.title}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl" />
          </motion.div>

          {/* Right: Content */}
          <motion.div
            key={activeStep + "-content"}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Step Number */}
            <div className="inline-flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${colors.gradient} flex items-center justify-center text-white text-sm font-bold`}>
                {currentStep.id}
              </div>
              <span className="text-sm font-medium text-gray-400">
                Step {currentStep.id} of {steps.length}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-3xl font-extrabold text-gray-900">
              {currentStep.title}
            </h3>

            {/* Description */}
            <p className="text-gray-600 text-lg leading-relaxed">
              {currentStep.longDescription}
            </p>

            {/* Features List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {currentStep.features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2 text-gray-600">
                  <CheckCircle className={`w-4 h-4 ${colors.text}`} strokeWidth={2} />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>

            {/* Progress Bar */}
            <div className="pt-4">
              <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                <span>Progress</span>
                <span>{Math.round(((activeStep + 1) / steps.length) * 100)}%</span>
              </div>
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                  className={`h-full rounded-full bg-gradient-to-r ${colors.gradient}`}
                />
              </div>
            </div>

            {/* Navigation Arrows */}
            <div className="flex items-center justify-between pt-4">
              <button
                onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
                disabled={activeStep === 0}
                className={`cursor-pointer px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  activeStep === 0
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                }`}
              >
                ← Previous
              </button>
              <Link
                href={viewAllLink}
                className={`cursor-pointer inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${colors.gradient} text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group`}
              >
                <span>{activeStep === steps.length - 1 ? viewAllText : "Next Step"}</span>
                {activeStep === steps.length - 1 ? (
                  <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2.5} />
                ) : (
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2.5} />
                )}
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}