"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle,
  ArrowRight,
  Clock,
  Headphones,
  Shield,
  Award,
  Users,
  TrendingUp,
  ChevronRight,
  MessageCircle,
  Globe,
  Calendar,
  Building2,
} from "lucide-react";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa";

// ==================== CONTACT PAGE ====================
export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    console.log("Contact Form Data:", formData);
    setIsSubmitted(true);
    setIsLoading(false);
    
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    }, 5000);
  };

  const contactMethods = [
    {
      icon: Phone,
      title: "Call Us",
      details: "+1 (555) 123-4567",
      sub: "Mon-Fri, 9am-6pm EST",
      href: "tel:+15551234567",
      color: "blue",
    },
    {
      icon: Mail,
      title: "Email Us",
      details: "support@rentease.com",
      sub: "We respond within 24 hours",
      href: "mailto:support@rentease.com",
      color: "emerald",
    },
    {
      icon: MapPin,
      title: "Visit Us",
      details: "123 Main Street",
      sub: "New York, NY 10001",
      href: "#",
      color: "purple",
    },
    {
      icon: Clock,
      title: "Working Hours",
      details: "Monday - Friday",
      sub: "9:00 AM - 6:00 PM EST",
      href: "#",
      color: "rose",
    },
  ];

  const stats = [
    { value: "10,000+", label: "Happy Users", icon: Users },
    { value: "98%", label: "Satisfaction Rate", icon: TrendingUp },
    { value: "24/7", label: "Support Available", icon: Headphones },
    { value: "500+", label: "Trusted Owners", icon: Shield },
  ];

  const socialLinks = [
    { icon: FaFacebook, href: "#", label: "Facebook", color: "hover:bg-blue-600" },
    { icon: FaTwitter, href: "#", label: "Twitter", color: "hover:bg-blue-400" },
    { icon: FaInstagram, href: "#", label: "Instagram", color: "hover:bg-pink-600" },
    { icon: FaLinkedin, href: "#", label: "LinkedIn", color: "hover:bg-blue-700" },
  ];

  const getColorStyles = (color) => {
    const colors = {
      blue: {
        bg: "bg-blue-50",
        iconBg: "bg-blue-100",
        text: "text-blue-600",
        border: "border-blue-200/60",
        hover: "hover:border-blue-300 hover:shadow-blue-100/30",
        gradient: "from-blue-500 to-blue-600",
      },
      emerald: {
        bg: "bg-emerald-50",
        iconBg: "bg-emerald-100",
        text: "text-emerald-600",
        border: "border-emerald-200/60",
        hover: "hover:border-emerald-300 hover:shadow-emerald-100/30",
        gradient: "from-emerald-500 to-emerald-600",
      },
      purple: {
        bg: "bg-purple-50",
        iconBg: "bg-purple-100",
        text: "text-purple-600",
        border: "border-purple-200/60",
        hover: "hover:border-purple-300 hover:shadow-purple-100/30",
        gradient: "from-purple-500 to-purple-600",
      },
      rose: {
        bg: "bg-rose-50",
        iconBg: "bg-rose-100",
        text: "text-rose-600",
        border: "border-rose-200/60",
        hover: "hover:border-rose-300 hover:shadow-rose-100/30",
        gradient: "from-rose-500 to-rose-600",
      },
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-gradient-to-b from-blue-50/50 via-white to-white overflow-hidden">
        <div className="absolute top-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50/80 backdrop-blur-sm rounded-full border border-blue-100/50 mb-4">
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span className="text-blue-600 font-semibold text-xs uppercase tracking-widest">
                Contact Us
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mt-2">
              Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-700">Touch</span>
            </h1>
            <p className="text-gray-500 mt-4 text-lg max-w-2xl mx-auto">
              Have questions about RentEase? We&apos;re here to help. Reach out to us anytime.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-y border-gray-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="flex items-center justify-center mb-2">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                      <Icon className="w-5 h-5 text-blue-600" strokeWidth={2} />
                    </div>
                  </div>
                  <p className="text-xl font-extrabold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Methods Grid - Clean & Compact */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">
              Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-700">Touch</span>
            </h2>
            <p className="text-gray-500 mt-2 text-sm">
              Choose your preferred way to reach us
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {contactMethods.map((method, index) => {
              const Icon = method.icon;
              const colors = getColorStyles(method.color);
              const isHovered = hoveredCard === index;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className={`group relative bg-white rounded-2xl p-6 border-2 ${colors.border} shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)] ${colors.hover} cursor-pointer`}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg`}>
                      <Icon className={`w-5 h-5 ${colors.text}`} strokeWidth={2} />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-gray-900 mb-0.5 group-hover:text-blue-600 transition-colors">
                        {method.title}
                      </h3>
                      <a
                        href={method.href}
                        className="text-gray-700 text-sm font-medium hover:text-blue-600 transition-colors block truncate"
                      >
                        {method.details}
                      </a>
                      <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" strokeWidth={2} />
                        {method.sub}
                      </p>
                    </div>
                  </div>

                  {/* Hover Arrow Indicator */}
                  <motion.div
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -5 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                  >
                    <ChevronRight className={`w-4 h-4 ${colors.text}`} strokeWidth={2.5} />
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form & Map Section */}
      <section className="py-20 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left: Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50/80 backdrop-blur-sm rounded-full border border-blue-100/50 mb-4">
                <Sparkles className="w-4 h-4 text-blue-500" />
                <span className="text-blue-600 font-semibold text-xs uppercase tracking-widest">
                  Send Message
                </span>
              </div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
                We&apos;d Love to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-700">Hear From You</span>
              </h2>
              <p className="text-gray-500 mb-6">
                Fill out the form below and our team will get back to you within 24 hours.
              </p>

              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-emerald-50 border-2 border-emerald-200/60 rounded-2xl p-8 text-center"
                >
                  <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-emerald-600" strokeWidth={2} />
                  </div>
                  <h3 className="text-xl font-bold text-emerald-700 mb-2">
                    Message Sent Successfully!
                  </h3>
                  <p className="text-emerald-600/70 text-sm">
                    Thank you for reaching out. We&apos;ll respond within 24 hours.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="John Doe"
                        className="w-full px-4 py-3 bg-gray-50/80 border-2 border-blue-100/50 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-gray-800 placeholder:text-gray-400 shadow-sm hover:border-blue-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="john@example.com"
                        className="w-full px-4 py-3 bg-gray-50/80 border-2 border-blue-100/50 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-gray-800 placeholder:text-gray-400 shadow-sm hover:border-blue-300"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 123-4567"
                      className="w-full px-4 py-3 bg-gray-50/80 border-2 border-blue-100/50 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-gray-800 placeholder:text-gray-400 shadow-sm hover:border-blue-300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder="How can we help you?"
                      className="w-full px-4 py-3 bg-gray-50/80 border-2 border-blue-100/50 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-gray-800 placeholder:text-gray-400 shadow-sm hover:border-blue-300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="4"
                      placeholder="Tell us about your inquiry..."
                      className="w-full px-4 py-3 bg-gray-50/80 border-2 border-blue-100/50 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-gray-800 placeholder:text-gray-400 shadow-sm hover:border-blue-300 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full cursor-pointer px-6 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl shadow-[0_4px_14px_rgba(37,99,235,0.35)] hover:shadow-[0_8px_24px_rgba(37,99,235,0.45)] transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <Send className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>

            {/* Right: Map & Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              {/* Map */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-blue-100/50">
                <div className="relative h-[300px] w-full">
                  <Image
                    src="https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=800&h=600&fit=crop"
                    alt="Office Location Map"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent" />
                  
                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 border border-white/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-blue-600" strokeWidth={2} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Visit Our Office</p>
                        <p className="text-xs text-gray-500">123 Main Street, New York, NY 10001</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="bg-white rounded-2xl p-6 border-2 border-blue-100/50 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Connect With Us</h3>
                <div className="flex gap-3">
                  {socialLinks.map((social, index) => {
                    const Icon = social.icon;
                    return (
                      <motion.a
                        key={index}
                        href={social.href}
                        aria-label={social.label}
                        whileHover={{ scale: 1.1, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className={`cursor-pointer w-11 h-11 bg-gray-50 rounded-xl flex items-center justify-center text-gray-500 transition-all duration-300 hover:text-white ${social.color}`}
                      >
                        <Icon className="w-4.5 h-4.5" />
                      </motion.a>
                    );
                  })}
                </div>
              </div>

              {/* Quick Response Info */}
              <div className="bg-white rounded-2xl p-6 border-2 border-blue-100/50 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Headphones className="w-5 h-5 text-blue-600" strokeWidth={2} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">24/7 Support Available</h4>
                    <p className="text-sm text-gray-500 mt-1">
                      Our support team is available round the clock to assist you with any queries.
                    </p>
                    <Link
                      href="/faq"
                      className="inline-flex items-center gap-1 text-sm text-blue-600 font-medium mt-2 hover:text-blue-700 transition-colors group"
                    >
                      <span>Visit FAQ</span>
                      <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2.5} />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gray-50/50 rounded-3xl p-8 md:p-12 border-2 border-blue-100/50 shadow-[0_8px_30px_rgba(0,0,0,0.04)] text-center"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Can&apos;t Find What You&apos;re Looking For?
            </h3>
            <p className="text-gray-500 max-w-2xl mx-auto mb-6">
              Check our FAQ section for answers to common questions or reach out to our support team.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/faq"
                className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl shadow-[0_4px_14px_rgba(37,99,235,0.35)] hover:shadow-[0_8px_24px_rgba(37,99,235,0.45)] transition-all duration-300 hover:-translate-y-1 group"
              >
                <span>View FAQ</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2.5} />
              </Link>
              <Link
                href="mailto:support@rentease.com"
                className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 font-semibold rounded-xl border-2 border-blue-100 hover:border-blue-400 shadow-sm hover:shadow-[0_8px_24px_rgba(37,99,235,0.12)] transition-all duration-300 hover:-translate-y-1 group"
              >
                <Mail className="w-4 h-4" strokeWidth={2} />
                <span>Email Support</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}