// src/components/shared/Footer.jsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  ChevronRight,
  ArrowUp,
  Send,
  CheckCircle,
} from "lucide-react";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
} from "react-icons/fa";

// ==================== FOOTER COMPONENT ====================
export default function Footer({
  companyName = "RentEase",
  companyTagline = "Your trusted platform for property rental and booking",
  year = new Date().getFullYear(),
  socialLinks = [
    { icon: FaFacebook, href: "#", label: "Facebook", color: "hover:text-blue-600" },
    { icon: FaTwitter, href: "#", label: "Twitter", color: "hover:text-blue-400" },
    { icon: FaInstagram, href: "#", label: "Instagram", color: "hover:text-pink-500" },
    { icon: FaLinkedin, href: "#", label: "LinkedIn", color: "hover:text-blue-700" },
    { icon: FaYoutube, href: "#", label: "YouTube", color: "hover:text-red-600" },
  ],
  quickLinks = [
    { name: "Home", href: "/" },
    { name: "Properties", href: "/properties" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
  ],
  supportLinks = [
    { name: "Help Center", href: "/help" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "FAQ", href: "/faq" },
  ],
  contactInfo = {
    email: "support@rentease.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main Street, New York, NY 10001",
  },
}) {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail("");
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-gray-900 text-white overflow-hidden">
      {/* Decorative Top Gradient */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600" />

      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Column 1 - Brand */}
          <div className="space-y-4">
            {/* Logo - Same as Navbar */}
            <Link 
              href="/" 
              className="cursor-pointer inline-flex items-center gap-2.5 group flex-shrink-0 transition-transform hover:scale-[1.02] active:scale-95"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-[0_4px_14px_rgba(37,99,235,0.4)] flex-shrink-0 transition-all duration-300 group-hover:shadow-[0_6px_24px_rgba(37,99,235,0.5)] group-hover:brightness-105">
                <Building2 className="w-5 h-5 text-white" strokeWidth={2.2} />
              </div>
              <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                Rent<span className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">Ease</span>
              </span>
            </Link>

            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              {companyTagline}
            </p>

            {/* Social Links */}
            <div className="flex gap-3 pt-2">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`cursor-pointer w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 transition-all duration-300 hover:bg-white/10 ${social.color}`}
                  >
                    <Icon className="w-4.5 h-4.5" />
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* Column 2 - Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="cursor-pointer text-gray-400 hover:text-blue-400 transition-colors duration-200 text-sm flex items-center gap-2 group"
                  >
                    <ChevronRight className="w-3 h-3 text-blue-400/40 group-hover:translate-x-1 transition-transform" strokeWidth={2} />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 - Support */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Support
            </h3>
            <ul className="space-y-2.5">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="cursor-pointer text-gray-400 hover:text-blue-400 transition-colors duration-200 text-sm flex items-center gap-2 group"
                  >
                    <ChevronRight className="w-3 h-3 text-blue-400/40 group-hover:translate-x-1 transition-transform" strokeWidth={2} />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 - Contact & Newsletter */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Get in Touch
            </h3>

            {/* Contact Info */}
            <div className="space-y-3 mb-4">
              <div className="flex items-start gap-3 text-gray-400 text-sm">
                <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" strokeWidth={2} />
                <span>{contactInfo.address}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400 text-sm">
                <Phone className="w-4 h-4 text-blue-400 flex-shrink-0" strokeWidth={2} />
                <a 
                  href={`tel:${contactInfo.phone}`} 
                  className="cursor-pointer hover:text-blue-400 transition-colors"
                >
                  {contactInfo.phone}
                </a>
              </div>
              <div className="flex items-center gap-3 text-gray-400 text-sm">
                <Mail className="w-4 h-4 text-blue-400 flex-shrink-0" strokeWidth={2} />
                <a 
                  href={`mailto:${contactInfo.email}`} 
                  className="cursor-pointer hover:text-blue-400 transition-colors"
                >
                  {contactInfo.email}
                </a>
              </div>
            </div>

            {/* Newsletter Subscription */}
            {/* <div className="mt-4">
              <p className="text-xs text-gray-400 mb-2">
                Subscribe to our newsletter
              </p>
              <form onSubmit={handleSubscribe} className="relative">
                <input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 pr-12 bg-white/10 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-white placeholder:text-gray-500 text-sm transition-all duration-300"
                  required
                />
                <button
                  type="submit"
                  className="cursor-pointer absolute right-1 top-1/2 -translate-y-1/2 p-2 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg text-white hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  {isSubscribed ? (
                    <CheckCircle className="w-4 h-4" strokeWidth={2} />
                  ) : (
                    <Send className="w-4 h-4" strokeWidth={2} />
                  )}
                </button>
              </form>
            </div> */}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="relative mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm">
              &copy; {year} {companyName}. All rights reserved.
            </p>

            <div className="flex items-center gap-6 text-xs text-gray-500">
              <Link href="/privacy" className="cursor-pointer hover:text-gray-300 transition-colors">
                Privacy Policy
              </Link>
              <span className="w-px h-3 bg-gray-700" />
              <Link href="/terms" className="cursor-pointer hover:text-gray-300 transition-colors">
                Terms of Service
              </Link>
              <span className="w-px h-3 bg-gray-700" />
              <Link href="/cookies" className="cursor-pointer hover:text-gray-300 transition-colors">
                Cookies
              </Link>
            </div>

            {/* Scroll to Top Button */}
            <motion.button
              onClick={scrollToTop}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer p-2.5 bg-blue-600/20 border border-blue-500/30 rounded-xl text-blue-400 hover:bg-blue-600/30 transition-all duration-300 group"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform" strokeWidth={2} />
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  );
}