// src/app/about/page.jsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Accordion } from "@heroui/react";
import {
  ChevronDown,
  Users,
  Building2,
  Award,
  Heart,
  Shield,
  Clock,
  Sparkles,
  CheckCircle,
  ArrowRight,
  Rocket,
  Target,
  TrendingUp,
  Zap,
  Search,
  Calendar,
  Headphones,
  Play,
  Pause,
  Quote,
  Star,
  Globe,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Twitter,
  Github,
  Camera,
  Palette,
  Code,
  Coffee,
} from "lucide-react";

// FAQ Items
const faqItems = [
  {
    title: "How do I find a property?",
    content:
      "Simply use our search bar on the homepage. You can filter by location, property type, price range, and amenities to find your perfect match. Save your favorites and compare properties side by side.",
    icon: <Search className="w-4 h-4" />,
  },
  {
    title: "How do I book a property?",
    content:
      "Once you find a property you like, click 'View Details' and then 'Book Property'. Fill in your move-in date and contact details, then proceed to payment. You'll receive a confirmation email with all the details.",
    icon: <Calendar className="w-4 h-4" />,
  },
  {
    title: "Is my payment secure?",
    content:
      "Yes! All payments are processed through Stripe's secure payment gateway. Your financial information is encrypted and never stored on our servers. We also offer multiple payment options for your convenience.",
    icon: <Shield className="w-4 h-4" />,
  },
  {
    title: "Can I cancel my booking?",
    content:
      "Yes, you can cancel your booking up to 48 hours before the move-in date for a full refund. Cancellations within 48 hours may be subject to a cancellation fee. Please review our cancellation policy for more details.",
    icon: <Clock className="w-4 h-4" />,
  },
  {
    title: "How are properties verified?",
    content:
      "All properties on RentEase go through a rigorous verification process. We verify property ownership, conduct background checks on owners, and ensure all listings have accurate photos and descriptions.",
    icon: <CheckCircle className="w-4 h-4" />,
  },
  {
    title: "What if I have issues with my rental?",
    content:
      "Our 24/7 support team is always here to help. You can contact us via phone, email, or live chat. We'll work with you and the property owner to resolve any issues quickly and fairly.",
    icon: <Headphones className="w-4 h-4" />,
  },
];

// Team Members
const teamMembers = [
  {
    name: "John Smith",
    role: "CEO & Founder",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    bio: "15+ years in real estate technology",
    social: { linkedin: "#", twitter: "#" },
    color: "from-blue-500 to-blue-600",
  },
  {
    name: "Sarah Johnson",
    role: "Head of Operations",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
    bio: "Expert in property management",
    social: { linkedin: "#", twitter: "#" },
    color: "from-emerald-500 to-emerald-600",
  },
  {
    name: "Michael Chen",
    role: "Lead Developer",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
    bio: "Full-stack architect",
    social: { linkedin: "#", twitter: "#" },
    color: "from-purple-500 to-purple-600",
  },
  {
    name: "Emily Davis",
    role: "Customer Success",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
    bio: "Passionate about user experience",
    social: { linkedin: "#", twitter: "#" },
    color: "from-rose-500 to-rose-600",
  },
];

// Testimonials
const testimonials = [
  {
    id: 1,
    name: "Alex Thompson",
    role: "Property Owner",
    content: "RentEase has completely transformed how I manage my properties. I've found reliable tenants within days of listing.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    rating: 5,
  },
  {
    id: 2,
    name: "Maria Garcia",
    role: "Tenant",
    content: "Found my dream apartment in just 3 days! The platform is so easy to use and the verification process gives me peace of mind.",
    avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100&h=100&fit=crop&crop=face",
    rating: 5,
  },
  {
    id: 3,
    name: "David Kim",
    role: "First-time Renter",
    content: "As a first-time renter, I was nervous. But RentEase guided me through every step and made the process seamless.",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face",
    rating: 4,
  },
];

// Stats
const stats = [
  { value: "10,000+", label: "Happy Users", icon: Users, color: "blue" },
  { value: "2,500+", label: "Properties Listed", icon: Building2, color: "emerald" },
  { value: "98%", label: "Satisfaction Rate", icon: Award, color: "purple" },
  { value: "500+", label: "Trusted Owners", icon: Heart, color: "rose" },
];

// Values
const values = [
  {
    icon: Shield,
    title: "Trust & Transparency",
    description: "We believe in honest communication and transparent processes for all our users.",
    color: "blue",
  },
  {
    icon: Users,
    title: "User First",
    description: "Every decision we make is driven by what's best for our community of users.",
    color: "emerald",
  },
  {
    icon: Rocket,
    title: "Innovation",
    description: "We continuously innovate to make property rental easier and more accessible.",
    color: "purple",
  },
  {
    icon: Heart,
    title: "Community",
    description: "Building a strong community of tenants and property owners is at our core.",
    color: "rose",
  },
];

export default function AboutPage() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);

  // Auto-play testimonials
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const getColorStyles = (color) => {
    const colors = {
      blue: { bg: "bg-blue-50", border: "border-blue-200/60", text: "text-blue-600", gradient: "from-blue-500 to-blue-600", iconBg: "bg-blue-100" },
      emerald: { bg: "bg-emerald-50", border: "border-emerald-200/60", text: "text-emerald-600", gradient: "from-emerald-500 to-emerald-600", iconBg: "bg-emerald-100" },
      purple: { bg: "bg-purple-50", border: "border-purple-200/60", text: "text-purple-600", gradient: "from-purple-500 to-purple-600", iconBg: "bg-purple-100" },
      rose: { bg: "bg-rose-50", border: "border-rose-200/60", text: "text-rose-600", gradient: "from-rose-500 to-rose-600", iconBg: "bg-rose-100" },
    };
    return colors[color] || colors.blue;
  };

  return (
    <div ref={containerRef} className="overflow-hidden">
      {/* Hero Section with Parallax */}
      <section className="relative pt-32 pb-20 bg-gradient-to-b from-blue-50/50 via-white to-white overflow-hidden">
        <motion.div style={{ y }} className="absolute inset-0 opacity-20">
          <div className="absolute top-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-3xl" />
        </motion.div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 25, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50/80 backdrop-blur-sm rounded-full border border-blue-100/50 mb-4"
            >
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span className="text-blue-600 font-semibold text-xs uppercase tracking-widest">
                About Us
              </span>
            </motion.div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mt-2 leading-tight">
              Making Property Rental <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 bg-[length:200%_auto] animate-gradient">
                Simple & Secure
              </span>
            </h1>
            <p className="text-gray-500 mt-4 text-lg max-w-2xl mx-auto">
              RentEase is a trusted platform connecting tenants with quality properties and property owners with reliable tenants.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/properties"
                  className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl shadow-[0_4px_14px_rgba(37,99,235,0.35)] hover:shadow-[0_8px_24px_rgba(37,99,235,0.45)] transition-all duration-300 hover:-translate-y-1 group"
                >
                  <span>Browse Properties</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2.5} />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="#faq"
                  className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 font-semibold rounded-xl border-2 border-blue-100 hover:border-blue-400 shadow-sm hover:shadow-[0_8px_24px_rgba(37,99,235,0.12)] transition-all duration-300 hover:-translate-y-1 group"
                >
                  <span>View FAQ</span>
                  <ChevronDown className="w-4 h-4 transition-transform duration-300 group-hover:translate-y-1" strokeWidth={2.5} />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Decorative floating elements */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </section>

      {/* Stats Section with Animated Numbers */}
      <section className="py-16 bg-white border-y border-gray-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              const colors = getColorStyles(stat.color);
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center group"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`w-14 h-14 ${colors.iconBg} rounded-2xl flex items-center justify-center mx-auto mb-3 transition-all duration-300 group-hover:shadow-lg`}
                  >
                    <Icon className={`w-7 h-7 ${colors.text}`} strokeWidth={2} />
                  </motion.div>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
                    className="text-2xl md:text-3xl font-extrabold text-gray-900"
                  >
                    {stat.value}
                  </motion.p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Story Section with Animated Elements */}
      <section className="py-20 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50/80 backdrop-blur-sm rounded-full border border-blue-100/50 mb-4">
                <Sparkles className="w-4 h-4 text-blue-500" />
                <span className="text-blue-600 font-semibold text-xs uppercase tracking-widest">
                  Our Story
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
                Built to Simplify <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-700">
                  Property Rental
                </span>
              </h2>
              <p className="text-gray-500 leading-relaxed mb-4">
                Founded in 2024, RentEase was created with a simple mission: to make property rental as easy and transparent as possible. We understand the challenges both tenants and property owners face, and we&apos;ve built a platform that addresses them all.
              </p>
              <p className="text-gray-500 leading-relaxed">
                Today, we&apos;re proud to serve thousands of happy users across the country, connecting them with their ideal properties and tenants with trust and security.
              </p>
              
              {/* Timeline dots */}
              <div className="flex gap-2 mt-6">
                {[2024, 2025, 2026].map((year, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.2 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-2"
                  >
                    <div className="w-3 h-3 rounded-full bg-blue-600" />
                    <span className="text-sm font-medium text-gray-600">{year}</span>
                    {i < 2 && <span className="w-8 h-0.5 bg-blue-200" />}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <div className="relative h-[400px] w-full">
                  <Image
                    src="https://media.istockphoto.com/id/1409298953/photo/real-estate-agents-shake-hands-after-the-signing-of-the-contract-agreement-is-complete.jpg?s=612x612&w=0&k=20&c=SFybbpGMB0wIoI0tJotFqptzAYK_mICVITNdQIXqnyc="
                    alt="Our Story"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 to-transparent" />
                </div>
                
                {/* Floating Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  viewport={{ once: true }}
                  className="absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/50 max-w-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center animate-pulse">
                      <Target className="w-6 h-6 text-blue-600" strokeWidth={2} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">Our Mission</p>
                      <p className="text-xs text-gray-500">Making rentals simple</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values Section with 3D Cards */}
      <section className="py-20 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50/80 backdrop-blur-sm rounded-full border border-blue-100/50 mb-4">
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span className="text-blue-600 font-semibold text-xs uppercase tracking-widest">
                Our Values
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-2">
              What <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-700">Drives Us</span>
            </h2>
            <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
              These core values guide everything we do at RentEase
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              const colors = getColorStyles(value.color);
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30, rotateY: 20 }}
                  whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="bg-white rounded-2xl p-6 border-2 border-blue-100/50 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_40px_rgba(37,99,235,0.08)] transition-all duration-300 hover:border-blue-200/70 text-center group"
                >
                  <motion.div
                    whileHover={{ scale: 1.15, rotate: 5 }}
                    className={`w-14 h-14 ${colors.iconBg} rounded-2xl flex items-center justify-center mx-auto mb-4 transition-all duration-300 group-hover:shadow-lg`}
                  >
                    <Icon className={`w-7 h-7 ${colors.text}`} strokeWidth={2} />
                  </motion.div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {value.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50/80 backdrop-blur-sm rounded-full border border-blue-100/50 mb-4">
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span className="text-blue-600 font-semibold text-xs uppercase tracking-widest">
                Testimonials
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-2">
              What Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-700">Community Says</span>
            </h2>
            <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
              Real stories from real people who found their perfect home
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-br from-blue-50/50 to-white rounded-3xl p-8 md:p-10 border-2 border-blue-100/50 shadow-[0_8px_30px_rgba(0,0,0,0.04)]"
              >
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  <div className="relative w-20 h-20 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={testimonials[activeTestimonial].avatar}
                      alt={testimonials[activeTestimonial].name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 border-2 border-blue-500/20 rounded-full" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Quote className="w-5 h-5 text-blue-400" />
                      <p className="text-lg font-semibold text-gray-900">
                        {testimonials[activeTestimonial].name}
                      </p>
                    </div>
                    <p className="text-sm text-blue-600 font-medium">
                      {testimonials[activeTestimonial].role}
                    </p>
                    <div className="flex gap-0.5 mt-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < testimonials[activeTestimonial].rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-gray-600 text-lg mt-3 leading-relaxed">
                      &quot;{testimonials[activeTestimonial].content}&quot;
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4 mt-6">
              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTestimonial(index)}
                    className={`cursor-pointer transition-all duration-300 rounded-full ${
                      activeTestimonial === index
                        ? "w-8 h-2 bg-blue-600"
                        : "w-2 h-2 bg-gray-300 hover:bg-gray-400"
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                className="cursor-pointer p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                {isAutoPlaying ? (
                  <Pause className="w-4 h-4 text-gray-500" />
                ) : (
                  <Play className="w-4 h-4 text-gray-500" />
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50/80 backdrop-blur-sm rounded-full border border-blue-100/50 mb-4">
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span className="text-blue-600 font-semibold text-xs uppercase tracking-widest">
                FAQ
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-2">
              Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-700">Questions</span>
            </h2>
            <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
              Everything you need to know about using RentEase
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <Accordion className="w-full space-y-3">
              {faqItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <Accordion.Item 
                    className="border-2 border-blue-100/50 rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_40px_rgba(37,99,235,0.06)] transition-all duration-300 bg-white"
                  >
                    <Accordion.Heading>
                      <Accordion.Trigger className="w-full px-6 py-4 flex items-center justify-between hover:bg-blue-50/30 transition-colors cursor-pointer">
                        <span className="flex items-center gap-3 text-gray-900 font-semibold">
                          <span className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 flex-shrink-0">
                            {item.icon}
                          </span>
                          {item.title}
                        </span>
                        <Accordion.Indicator className="text-gray-400 transition-transform duration-300 data-[open=true]:rotate-180">
                          <ChevronDown className="w-5 h-5" />
                        </Accordion.Indicator>
                      </Accordion.Trigger>
                    </Accordion.Heading>
                    <Accordion.Panel>
                      <Accordion.Body className="px-6 pb-4 pt-1 text-gray-500 text-sm leading-relaxed">
                        {item.content}
                      </Accordion.Body>
                    </Accordion.Panel>
                  </Accordion.Item>
                </motion.div>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* Team Section with Hover Effects */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50/80 backdrop-blur-sm rounded-full border border-blue-100/50 mb-4">
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span className="text-blue-600 font-semibold text-xs uppercase tracking-widest">
                Team
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-2">
              Meet Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-700">Team</span>
            </h2>
            <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
              The passionate people behind RentEase
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className="group bg-white rounded-2xl p-6 border-2 border-blue-100/50 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_40px_rgba(37,99,235,0.08)] transition-all duration-300 hover:border-blue-200/70 text-center relative overflow-hidden"
              >
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500 bg-gradient-to-br ${member.color}`} />
                <div className="relative z-10">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden mx-auto mb-4">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                    <div className={`absolute inset-0 border-2 border-transparent group-hover:border-${member.color.split('-')[1]}-500/30 rounded-full transition-all duration-300`} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-sm text-blue-600 font-medium mb-1">{member.role}</p>
                  <p className="text-xs text-gray-400">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 rounded-3xl p-12 md:p-16 text-center overflow-hidden"
          >
            {/* Animated background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 animate-pulse" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 animate-pulse delay-1000" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse delay-500" />
            
            {/* Floating particles */}
            <div className="absolute top-10 left-10 w-2 h-2 bg-white/20 rounded-full animate-ping" />
            <div className="absolute bottom-10 right-10 w-3 h-3 bg-white/20 rounded-full animate-ping delay-300" />
            <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-white/20 rounded-full animate-ping delay-700" />
            
            <div className="relative z-10">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 25, delay: 0.2 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 mb-4"
              >
                <Rocket className="w-4 h-4 text-white" />
                <span className="text-white font-semibold text-xs uppercase tracking-widest">
                  Get Started
                </span>
              </motion.div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
                Ready to Find Your Dream Property?
              </h2>
              <p className="text-blue-100 text-lg max-w-2xl mx-auto mb-8">
                Join thousands of happy users and start your rental journey today
              </p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/properties"
                  className="cursor-pointer inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-700 font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2.5} />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
}