// src/components/sections/FeaturedProperties.jsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Bed,
  Bath,
  Ruler,
  Heart,
  MapPin,
  ChevronRight,
  Star,
  Sparkles,
  TrendingUp,
  Clock,
} from "lucide-react";
import { toast } from "react-toastify";

// ==================== FEATURED PROPERTIES COMPONENT ====================
export default function FeaturedProperties({
  title = "Featured Properties",
  subtitle = "Discover our handpicked selection of premium rental properties",
  viewAllLink = "/properties",
  viewAllText = "View All Properties",
  initialProperties = [],
  userId = null,
  onWishlistToggle = null,
}) {
  const router = useRouter();
  const [properties, setProperties] = useState(initialProperties);
  const [wishlist, setWishlist] = useState([]);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

  // Check if user is logged in
  const isLoggedIn = !!userId;

  // ========== FETCH USER WISHLIST ==========
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        if (userId) {
          // Fetch from API if userId is provided
          const response = await fetch(`/api/wishlist?userId=${userId}`);
          if (!response.ok) throw new Error("Failed to fetch wishlist");
          const data = await response.json();
          setWishlist(data);
        } else {
          // Fallback to localStorage
          const savedWishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
          setWishlist(savedWishlist);
        }
      } catch (error) {
        console.error("Error fetching wishlist:", error);
        // Fallback to localStorage
        const savedWishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
        setWishlist(savedWishlist);
      }
    };
    fetchWishlist();
  }, [userId]);

  // ========== WISHLIST HANDLERS ==========
  const handleAddToWishlist = async (propertyId) => {
    setIsWishlistLoading(true);
    try {
      // Optimistic update
      setWishlist((prev) => [...prev, propertyId]);

      if (userId) {
        // API call
        const response = await fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ propertyId, userId }),
        });

        if (!response.ok) throw new Error("Failed to add to wishlist");
        const data = await response.json();
        
        // Update localStorage
        const savedWishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
        localStorage.setItem("wishlist", JSON.stringify([...savedWishlist, propertyId]));
        
        toast.success("Added to wishlist!");
        
        if (onWishlistToggle) {
          onWishlistToggle(propertyId, true, data);
        }
      } else {
        // Guest mode - localStorage only
        const savedWishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
        localStorage.setItem("wishlist", JSON.stringify([...savedWishlist, propertyId]));
        toast.success("Added to wishlist!");
      }
    } catch (error) {
      // Revert optimistic update
      setWishlist((prev) => prev.filter((id) => id !== propertyId));
      toast.error("Failed to add to wishlist");
      console.error("Error adding to wishlist:", error);
    } finally {
      setIsWishlistLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (propertyId) => {
    setIsWishlistLoading(true);
    try {
      // Optimistic update
      setWishlist((prev) => prev.filter((id) => id !== propertyId));

      if (userId) {
        // API call
        const response = await fetch("/api/wishlist", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ propertyId, userId }),
        });

        if (!response.ok) throw new Error("Failed to remove from wishlist");
        const data = await response.json();
        
        // Update localStorage
        const savedWishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
        localStorage.setItem(
          "wishlist",
          JSON.stringify(savedWishlist.filter((id) => id !== propertyId))
        );
        
        toast.success("Removed from wishlist!");
        
        if (onWishlistToggle) {
          onWishlistToggle(propertyId, false, data);
        }
      } else {
        // Guest mode - localStorage only
        const savedWishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
        localStorage.setItem(
          "wishlist",
          JSON.stringify(savedWishlist.filter((id) => id !== propertyId))
        );
        toast.success("Removed from wishlist!");
      }
    } catch (error) {
      // Revert optimistic update
      setWishlist((prev) => [...prev, propertyId]);
      toast.error("Failed to remove from wishlist");
      console.error("Error removing from wishlist:", error);
    } finally {
      setIsWishlistLoading(false);
    }
  };

  const toggleWishlist = (propertyId) => {
    if (!isLoggedIn) {
      toast.info("Please login to add to wishlist");
      router.push(`/auth/login?redirect=${window.location.pathname}`);
      return;
    }
    
    const isWishlisted = wishlist.includes(propertyId);
    if (isWishlisted) {
      handleRemoveFromWishlist(propertyId);
    } else {
      handleAddToWishlist(propertyId);
    }
  };

  // ========== VIEW DETAILS HANDLER ==========
  const handleViewDetails = (propertyId, e) => {
    if (!isLoggedIn) {
      e.preventDefault();
      toast.info("Please login to view property details");
      router.push(`/auth/login?redirect=/properties/${propertyId}`);
    }
  };

  // ========== STATUS BADGE ==========
  const getStatusBadge = (status) => {
    const statusMap = {
      available: {
        label: "Available",
        className: "bg-emerald-50 text-emerald-700 border-emerald-200",
        icon: <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />,
      },
      approved: {
        label: "Available",
        className: "bg-emerald-50 text-emerald-700 border-emerald-200",
        icon: <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />,
      },
      featured: {
        label: "Featured",
        className: "bg-amber-50 text-amber-700 border-amber-200",
        icon: <Sparkles className="w-3 h-3" />,
      },
      pending: {
        label: "Pending",
        className: "bg-yellow-50 text-yellow-700 border-yellow-200",
        icon: <Clock className="w-3 h-3" />,
      },
      sold: {
        label: "Sold",
        className: "bg-rose-50 text-rose-700 border-rose-200",
        icon: <Clock className="w-3 h-3" />,
      },
    };
    return statusMap[status] || statusMap.available;
  };

  // ========== FORMAT PRICE ==========
  const formatPrice = (price) => {
    return `$${price.toLocaleString()}`;
  };

  // ========== RENDER STARS ==========
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

  // Split title into two parts for gradient effect
  const titleParts = title.split(' ');

  return (
    <section className="py-20 bg-white">
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
              Featured Listings
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-2">
            {titleParts.slice(0, Math.ceil(titleParts.length / 2)).join(' ')}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-700">
              {titleParts.slice(Math.ceil(titleParts.length / 2)).join(' ')}
            </span>
          </h2>
          <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </motion.div>

        {/* Property Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property, index) => {
            const statusInfo = getStatusBadge(property.status || "approved");
            const isHovered = hoveredCard === property._id;
            const isWishlisted = wishlist.includes(property._id);
            const isFeatured = property.isFeatured === "true" || property.isFeatured === true;
            const rating = property.rating || 0;
            const reviewCount = property.reviewCount || 0;

            return (
              <motion.div
                key={property._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                onMouseEnter={() => setHoveredCard(property._id)}
                onMouseLeave={() => setHoveredCard(null)}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all duration-400 border-2 border-gray-100/60 hover:border-blue-200/70 hover:-translate-y-2"
              >
                {/* Image Container */}
                <div className="relative overflow-hidden">
                  <div className="relative h-56 w-full">
                    <Image
                      src={property.mainImage}
                      alt={property.title}
                      fill
                      className={`object-cover transition-transform duration-700 ${
                        isHovered ? "scale-110" : "scale-100"
                      }`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent" />
                  </div>

                  {/* Status Badge */}
                  <div
                    className={`absolute top-4 left-4 flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium border backdrop-blur-sm ${statusInfo.className}`}
                  >
                    {statusInfo.icon}
                    <span>{statusInfo.label}</span>
                  </div>

                  {/* Wishlist Button */}
                  <button
                    onClick={() => toggleWishlist(property._id)}
                    disabled={isWishlistLoading}
                    className={`absolute cursor-pointer top-4 right-4 p-2.5 rounded-full transition-all duration-300 ${
                      isWishlisted
                        ? "bg-rose-500 shadow-[0_4px_16px_rgba(244,63,94,0.3)]"
                        : "bg-white/90 backdrop-blur-sm hover:bg-white shadow-md hover:shadow-lg"
                    } ${isWishlistLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                    aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    <Heart
                      className={`w-4 h-4 transition-all duration-300 ${
                        isWishlisted
                          ? "fill-white text-white"
                          : "text-gray-600 group-hover:text-rose-500"
                      }`}
                      strokeWidth={2}
                    />
                  </button>

                  {/* Price Badge */}
                  <div className="absolute bottom-4 right-4 px-4 py-2 bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50">
                    <span className="text-lg font-bold text-blue-600">
                      {formatPrice(property.price)}
                    </span>
                    <span className="text-xs text-gray-500 ml-1">/{property.rentType || "mo"}</span>
                  </div>

                  {/* Rating Badge */}
                  {reviewCount > 0 ? (
                    <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-black/40 backdrop-blur-sm rounded-full border border-white/10">
                      <div className="flex items-center gap-0.5">{renderStars(rating)}</div>
                      <span className="text-white text-sm font-medium">{rating.toFixed(1)}</span>
                      <span className="text-white/60 text-xs">({reviewCount})</span>
                    </div>
                  ) : (
                    <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-black/40 backdrop-blur-sm rounded-full border border-white/10">
                      <span className="text-white/60 text-xs">No reviews yet</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="relative p-5">
                  {/* Title & Location */}
                  <div className="mb-3">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 line-clamp-1">
                      {property.title}
                    </h3>
                    <p className="text-gray-500 text-sm flex items-center gap-1.5 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-blue-400" strokeWidth={2} />
                      {property.location}
                    </p>
                  </div>

                  {/* Property Details */}
                  <div className="flex items-center gap-4 py-3 border-t border-b border-gray-100/60">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="p-1.5 bg-blue-50 rounded-lg">
                        <Bed className="w-3.5 h-3.5 text-blue-500" strokeWidth={2} />
                      </div>
                      <span>{property.bedrooms} Beds</span>
                    </div>
                    <div className="w-px h-6 bg-gray-200" />
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="p-1.5 bg-blue-50 rounded-lg">
                        <Bath className="w-3.5 h-3.5 text-blue-500" strokeWidth={2} />
                      </div>
                      <span>{property.bathrooms} Baths</span>
                    </div>
                    <div className="w-px h-6 bg-gray-200" />
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="p-1.5 bg-blue-50 rounded-lg">
                        <Ruler className="w-3.5 h-3.5 text-blue-500" strokeWidth={2} />
                      </div>
                      <span>{property.propertySize || "N/A"} sqft</span>
                    </div>
                  </div>

                  {/* Amenities Preview */}
                  {property.amenities && property.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {property.amenities.slice(0, 3).map((amenity) => (
                        <span
                          key={amenity}
                          className="px-2.5 py-1 bg-blue-50 text-blue-600 text-xs rounded-full border border-blue-100"
                        >
                          {amenity}
                        </span>
                      ))}
                      {property.amenities.length > 3 && (
                        <span className="px-2.5 py-1 bg-gray-50 text-gray-500 text-xs rounded-full border border-gray-200">
                          +{property.amenities.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* View Details Button */}
                  <div className="mt-4">
                    <Link
                      href={isLoggedIn ? `/properties/${property._id}` : "#"}
                      onClick={(e) => handleViewDetails(property._id, e)}
                      className={`w-full flex items-center justify-between px-5 py-3 bg-gradient-to-r from-blue-50 to-transparent text-blue-700 font-semibold rounded-xl transition-all duration-300 border border-blue-100/50 ${
                        isHovered
                          ? "from-blue-600 to-blue-700 text-white border-blue-600 shadow-[0_4px_16px_rgba(37,99,235,0.25)]"
                          : "hover:from-blue-100/50 hover:to-transparent"
                      }`}
                    >
                      <span>
                        {isLoggedIn ? "View Details" : "Login to View Details"}
                      </span>
                      <ChevronRight
                        className={`w-4 h-4 transition-transform duration-300 ${
                          isHovered ? "translate-x-1" : ""
                        }`}
                        strokeWidth={2.5}
                      />
                    </Link>
                  </div>

                  {/* Featured HOT tag */}
                  {isFeatured && (
                    <div className="absolute -top-2 -right-2">
                      <div className="relative">
                        <div className="absolute inset-0 bg-amber-400 blur-md opacity-30 rounded-full" />
                        <div className="relative flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full shadow-lg">
                          <TrendingUp className="w-3 h-3 text-white" />
                          <span className="text-white text-xs font-bold">HOT</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-12"
        >
          <Link
            href={isLoggedIn ? viewAllLink : "/auth/login?redirect=/properties"}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-blue-600 font-semibold rounded-2xl border-2 border-blue-100 hover:border-blue-400 shadow-sm hover:shadow-[0_8px_24px_rgba(37,99,235,0.12)] transition-all duration-300 hover:-translate-y-1 group"
          >
            <span>
              {isLoggedIn ? viewAllText : "Login to View All Properties"}
            </span>
            <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2.5} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}