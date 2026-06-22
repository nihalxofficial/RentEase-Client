// src/components/sections/CustomerReviews.jsx
"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Marquee from "react-fast-marquee";
import {
  Star,
  Sparkles,
  User,
  Quote,
} from "lucide-react";

// ==================== CUSTOMER REVIEWS COMPONENT ====================
export default function CustomerReviews({
  title = "What Our Customers Say",
  subtitle = "Real reviews from real tenants and property owners",
  reviews = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Tenant",
      date: "2 months ago",
      rating: 5,
      comment: "Amazing platform! Found my dream apartment in just 3 days. The booking process was smooth and secure.",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Owner",
      date: "1 month ago",
      rating: 5,
      comment: "As a property owner, I've listed 5 properties and all got rented within a week. Highly recommend!",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    },
    {
      id: 3,
      name: "Emily Davis",
      role: "Tenant",
      date: "3 weeks ago",
      rating: 4.5,
      comment: "The dashboard is so intuitive! I love how I can track all my bookings and payments in one place.",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    },
    {
      id: 4,
      name: "David Wilson",
      role: "Tenant",
      date: "1 week ago",
      rating: 5,
      comment: "Excellent customer support! They helped me resolve an issue with my booking within minutes.",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    },
    {
      id: 5,
      name: "Lisa Thompson",
      role: "Owner",
      date: "2 weeks ago",
      rating: 5,
      comment: "The best platform for property rentals. Professional, secure, and incredibly easy to use.",
      avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100&h=100&fit=crop&crop=face",
    },
    {
      id: 6,
      name: "James Rodriguez",
      role: "Tenant",
      date: "3 days ago",
      rating: 4.5,
      comment: "Found a beautiful apartment in my dream location. The whole process was seamless.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    },
    {
      id: 7,
      name: "Rachel Green",
      role: "Owner",
      date: "1 week ago",
      rating: 5,
      comment: "Rented out my property within 48 hours of listing. Incredible platform!",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
    },
    {
      id: 8,
      name: "Tom Anderson",
      role: "Tenant",
      date: "5 days ago",
      rating: 4.5,
      comment: "Great experience overall. The property listings are accurate and the photos are high quality.",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face",
    },
  ],
}) {
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />);
    }
    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star className="w-3.5 h-3.5 text-yellow-400" />
          <div className="absolute inset-0 w-1/2 overflow-hidden">
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
          </div>
        </div>
      );
    }
    return stars;
  };

  const ReviewCard = ({ review, variant = "default" }) => (
    <div
      className={`mx-4 w-80 bg-white rounded-xl shadow-md p-5 border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
        variant === "highlight" 
          ? "border-blue-200/60 bg-gradient-to-br from-blue-50/50 to-white"
          : "border-blue-100/50"
      }`}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm">
          {review.avatar ? (
            <Image
              src={review.avatar}
              alt={review.name}
              fill
              className="object-cover"
              sizes="40px"
            />
          ) : (
            review.name.split(' ').map(n => n[0]).join('')
          )}
        </div>
        <div>
          <h4 className="font-semibold text-gray-800">{review.name}</h4>
          <div className="flex items-center gap-1">
            {renderStars(review.rating)}
          </div>
        </div>
      </div>
      <Quote size={14} className="text-blue-400 mb-1" />
      <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">{review.comment}</p>
      <p className="text-gray-400 text-xs mt-2">{review.date}</p>
    </div>
  );

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
              Testimonials
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-2">
            {title}
          </h2>
          <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </motion.div>
      </div>

      {/* First Row - Right to Left */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="absolute left-0 top-0 bottom-0 w-48 z-10 bg-gradient-to-r from-white via-white/90 to-transparent pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-48 z-10 bg-gradient-to-l from-white via-white/90 to-transparent pointer-events-none"></div>
        <Marquee speed={50} pauseOnHover gradient={false} direction="right" className="py-4">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} variant="default" />
          ))}
        </Marquee>
      </div>

      {/* Second Row - Left to Right */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        <div className="absolute left-0 top-0 bottom-0 w-48 z-10 bg-gradient-to-r from-white via-white/90 to-transparent pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-48 z-10 bg-gradient-to-l from-white via-white/90 to-transparent pointer-events-none"></div>
        <Marquee speed={50} pauseOnHover gradient={false} direction="left" className="py-4">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} variant="highlight" />
          ))}
        </Marquee>
      </div>

      {/* Bottom Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex flex-wrap justify-center gap-8">
          <div className="flex items-center gap-2 text-gray-500">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <Star size={14} className="text-blue-500" />
            </div>
            <span className="text-sm">4.8/5 Average Rating</span>
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <User size={14} className="text-blue-500" />
            </div>
            <span className="text-sm">10,000+ Happy Customers</span>
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <Quote size={14} className="text-blue-500" />
            </div>
            <span className="text-sm">Verified Reviews</span>
          </div>
        </div>
      </div>
    </section>
  );
}