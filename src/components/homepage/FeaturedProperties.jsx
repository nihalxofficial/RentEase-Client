// src/components/sections/FeaturedProperties.jsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
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

// ==================== FEATURED PROPERTIES COMPONENT ====================
export default function FeaturedProperties({
  title = "Featured Properties",
  subtitle = "Discover our handpicked selection of premium rental properties",
  viewAllLink = "/properties",
  viewAllText = "View All Properties",
  initialProperties = [
    {
      id: 1,
      title: "Luxury Apartment",
      location: "Downtown, New York",
      price: 1200,
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop",
      beds: 3,
      baths: 2,
      sqft: 1200,
      status: "available",
      rating: 4.8,
      reviews: 24,
      featured: false,
    },
    {
      id: 2,
      title: "Modern Villa",
      location: "Beverly Hills, LA",
      price: 2500,
      image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&h=400&fit=crop",
      beds: 5,
      baths: 4,
      sqft: 3500,
      status: "featured",
      rating: 4.9,
      reviews: 18,
      featured: true,
    },
    {
      id: 3,
      title: "Studio Loft",
      location: "Arts District, Chicago",
      price: 850,
      image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&h=400&fit=crop",
      beds: 1,
      baths: 1,
      sqft: 650,
      status: "sold",
      rating: 4.5,
      reviews: 12,
      featured: false,
    },
    {
      id: 4,
      title: "Beachfront Condo",
      location: "Miami Beach, FL",
      price: 1800,
      image: "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=600&h=400&fit=crop",
      beds: 2,
      baths: 2,
      sqft: 1100,
      status: "available",
      rating: 4.7,
      reviews: 31,
      featured: false,
    },
    {
      id: 5,
      title: "Garden Cottage",
      location: "Portland, OR",
      price: 950,
      image: "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=600&h=400&fit=crop",
      beds: 2,
      baths: 1,
      sqft: 850,
      status: "available",
      rating: 4.6,
      reviews: 9,
      featured: false,
    },
    {
      id: 6,
      title: "Penthouse Suite",
      location: "Manhattan, NYC",
      price: 3200,
      image: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=600&h=400&fit=crop",
      beds: 4,
      baths: 3,
      sqft: 2800,
      status: "featured",
      rating: 4.9,
      reviews: 42,
      featured: true,
    },
  ],
  userId = null, // Pass user ID from parent for wishlist
  onWishlistToggle = null, // Optional callback for parent component
}) {
  const [properties, setProperties] = useState(initialProperties);
  const [wishlistItems, setWishlistItems] = useState([]); // Separate state for wishlist
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch user's wishlist on component mount
  useEffect(() => {
    if (userId) {
      fetchUserWishlist();
    }
  }, [userId]);

  /**
   * fetchUserWishlist - Get user's wishlisted property IDs from API
   */
  const fetchUserWishlist = async () => {
    try {
      // Replace with your actual API endpoint
      const response = await fetch(`/api/wishlist?userId=${userId}`);
      if (!response.ok) throw new Error("Failed to fetch wishlist");
      const data = await response.json();
      // data should be an array of property IDs
      setWishlistItems(data);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      // If API fails, use localStorage as fallback
      const savedWishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
      setWishlistItems(savedWishlist);
    }
  };

  /**
   * handleWishlist - Toggle property wishlist status
   * @param {string|number} propertyId - The ID of the property
   */
  const handleWishlist = async (propertyId) => {
    if (isLoading) return;

    const isWishlisted = wishlistItems.includes(propertyId);

    try {
      setIsLoading(true);

      // Optimistic update - update UI immediately
      setWishlistItems((prev) =>
        isWishlisted
          ? prev.filter((id) => id !== propertyId)
          : [...prev, propertyId]
      );

      // API Call
      const response = await fetch("/api/wishlist", {
        method: isWishlisted ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          propertyId: propertyId,
          userId: userId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update wishlist");
      }

      const data = await response.json();

      // Update localStorage as fallback
      const savedWishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
      if (isWishlisted) {
        localStorage.setItem(
          "wishlist",
          JSON.stringify(savedWishlist.filter((id) => id !== propertyId))
        );
      } else {
        localStorage.setItem(
          "wishlist",
          JSON.stringify([...savedWishlist, propertyId])
        );
      }

      // Call parent callback if provided
      if (onWishlistToggle) {
        onWishlistToggle(propertyId, !isWishlisted, data);
      }

      console.log(`Wishlist ${isWishlisted ? "removed" : "added"} for property ${propertyId}`);
    } catch (error) {
      console.error("Error updating wishlist:", error);

      // Rollback on error
      setWishlistItems((prev) =>
        isWishlisted
          ? [...prev, propertyId]
          : prev.filter((id) => id !== propertyId)
      );

      alert("Failed to update wishlist. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      available: {
        label: "Available",
        className: "bg-emerald-50 text-emerald-700 border-emerald-200",
        icon: <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />,
      },
      featured: {
        label: "Featured",
        className: "bg-amber-50 text-amber-700 border-amber-200",
        icon: <Sparkles className="w-3 h-3" />,
      },
      sold: {
        label: "Sold",
        className: "bg-rose-50 text-rose-700 border-rose-200",
        icon: <Clock className="w-3 h-3" />,
      },
    };
    return statusMap[status] || statusMap.available;
  };

  const formatPrice = (price) => {
    return `$${price.toLocaleString()}`;
  };

  return (
    <section className="py-20 bg-gradient-to-b from-white via-blue-50/20 to-white">
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
            {title}
          </h2>
          <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </motion.div>

        {/* Property Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property, index) => {
            const statusInfo = getStatusBadge(property.status);
            const isHovered = hoveredCard === property.id;
            const isWishlisted = wishlistItems.includes(property.id);

            return (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                onMouseEnter={() => setHoveredCard(property.id)}
                onMouseLeave={() => setHoveredCard(null)}
                className="group relative bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgba(37,99,235,0.08)] transition-all duration-500 border border-white/50 hover:border-blue-100/50"
              >
                {/* Glass effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent pointer-events-none" />
                
                {/* Image Container */}
                <div className="relative overflow-hidden">
                  <div className="relative h-60 w-full">
                    <Image
                      src={property.image}
                      alt={property.title}
                      fill
                      className={`object-cover transition-transform duration-700 ${
                        isHovered ? "scale-110" : "scale-100"
                      }`}
                    />
                    {/* Premium gradient overlay */}
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

                  {/* Wishlist Button - Uses separate wishlist state */}
                  <button
                    onClick={() => handleWishlist(property.id)}
                    disabled={isLoading}
                    className={`absolute cursor-pointer top-4 right-4 p-2.5 rounded-full transition-all duration-300 ${
                      isWishlisted
                        ? "bg-rose-500 shadow-[0_4px_16px_rgba(244,63,94,0.3)]"
                        : "bg-white/80 backdrop-blur-sm hover:bg-white shadow-md hover:shadow-lg"
                    } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
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
                    <span className="text-xs text-gray-500 ml-1">/mo</span>
                  </div>

                  {/* Rating Badge */}
                  <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-black/40 backdrop-blur-sm rounded-full border border-white/10">
                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    <span className="text-white text-sm font-medium">
                      {property.rating}
                    </span>
                    <span className="text-white/60 text-xs">
                      ({property.reviews})
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="relative p-5">
                  {/* Title & Location */}
                  <div className="mb-3">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
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
                      <span>{property.beds} Beds</span>
                    </div>
                    <div className="w-px h-6 bg-gray-200" />
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="p-1.5 bg-blue-50 rounded-lg">
                        <Bath className="w-3.5 h-3.5 text-blue-500" strokeWidth={2} />
                      </div>
                      <span>{property.baths} Baths</span>
                    </div>
                    <div className="w-px h-6 bg-gray-200" />
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="p-1.5 bg-blue-50 rounded-lg">
                        <Ruler className="w-3.5 h-3.5 text-blue-500" strokeWidth={2} />
                      </div>
                      <span>{property.sqft} sqft</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="mt-4">
                    <Link
                      href={`/properties/${property.id}`}
                      className={`w-full flex items-center justify-between px-5 py-3 bg-gradient-to-r from-blue-50 to-transparent text-blue-700 font-semibold rounded-xl transition-all duration-300 border border-blue-100/50 ${
                        isHovered
                          ? "from-blue-600 to-blue-700 text-white border-blue-600 shadow-[0_4px_16px_rgba(37,99,235,0.25)]"
                          : "hover:from-blue-100/50 hover:to-transparent"
                      }`}
                    >
                      <span>View Details</span>
                      <ChevronRight
                        className={`w-4 h-4 transition-transform duration-300 ${
                          isHovered ? "translate-x-1" : ""
                        }`}
                        strokeWidth={2.5}
                      />
                    </Link>
                  </div>

                  {/* Featured tag */}
                  {property.featured && (
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
            href={viewAllLink}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-blue-600 font-semibold rounded-2xl border-2 border-blue-100 hover:border-blue-400 shadow-sm hover:shadow-[0_8px_24px_rgba(37,99,235,0.12)] transition-all duration-300 hover:-translate-y-1 group"
          >
            <span>{viewAllText}</span>
            <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2.5} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}