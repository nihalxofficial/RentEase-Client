// src/app/(dashboard)/dashboard/tenant/favorites/FavoritesClient.jsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Heart,
  Search,
  MapPin,
  Eye,
  ArrowRight,
  DollarSign,
  Bed,
  Bath,
  Ruler,
  Trash2,
  Home,
  Star,
  TrendingUp,
  Building2,
  Warehouse,
  Trees,
} from "lucide-react";
import { toast } from "react-toastify";
import { removeWishlist } from "@/lib/action/wishlist";

// ==================== FAVORITES CLIENT ====================
export default function FavoritesClient({ 
  properties: initialProperties = [], 
  wishlistIds = [], 
  userId 
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [properties, setProperties] = useState(initialProperties);
  const [removingId, setRemovingId] = useState(null);

  // Debug log
  console.log("FavoritesClient received properties:", properties);

  // ========== FILTERED PROPERTIES ==========
  const filteredProperties = properties.filter((property) => {
    const matchesSearch = property.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // ========== FORMAT PRICE ==========
  const formatPrice = (price) => {
    return `$${price?.toLocaleString() || 0}`;
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

  // ========== HANDLE REMOVE FAVORITE ==========
  const handleRemoveFavorite = async (propertyId) => {
    setRemovingId(propertyId);
    try {
      await removeWishlist(propertyId, userId);
      setProperties((prev) => prev.filter((p) => p._id !== propertyId));
      toast.success("Removed from wishlist!");
    } catch (error) {
      console.error("Error removing favorite:", error);
      toast.error("Failed to remove from favorites. Please try again.");
    } finally {
      setRemovingId(null);
    }
  };

  // ========== STATS ==========
  const totalFavorites = properties.length;
  const totalValue = properties.reduce((sum, p) => sum + (p.price || 0), 0);
  const avgPrice = totalFavorites > 0 ? totalValue / totalFavorites : 0;
  const uniqueLocations = new Set(properties.map(p => p.location)).size;

  const statsCards = [
    {
      title: "Total Favorites",
      value: totalFavorites,
      icon: Heart,
      color: "rose",
    },
    {
      title: "Total Value",
      value: formatPrice(totalValue),
      icon: DollarSign,
      color: "emerald",
    },
    {
      title: "Avg. Price",
      value: formatPrice(avgPrice),
      icon: TrendingUp,
      color: "blue",
    },
    {
      title: "Locations",
      value: uniqueLocations,
      icon: MapPin,
      color: "purple",
    },
  ];

  // ========== GET COLOR STYLES ==========
  const getColorStyles = (color) => {
    const colors = {
      rose: { bg: "bg-rose-50", iconBg: "bg-rose-100", icon: "text-rose-600", border: "border-rose-200/60" },
      emerald: { bg: "bg-emerald-50", iconBg: "bg-emerald-100", icon: "text-emerald-600", border: "border-emerald-200/60" },
      blue: { bg: "bg-blue-50", iconBg: "bg-blue-100", icon: "text-blue-600", border: "border-blue-200/60" },
      purple: { bg: "bg-purple-50", iconBg: "bg-purple-100", icon: "text-purple-600", border: "border-purple-200/60" },
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
            My <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-rose-600">Favorites</span>
          </h1>
          <p className="text-gray-500 mt-1">Properties you've saved for later</p>
        </div>
        <Link
          href="/properties"
          className="mt-4 md:mt-0 inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl shadow-[0_4px_14px_rgba(37,99,235,0.3)] hover:shadow-[0_8px_24px_rgba(37,99,235,0.4)] transition-all duration-200 hover:-translate-y-0.5"
        >
          <Search className="w-4 h-4" strokeWidth={2.2} />
          <span>Browse Properties</span>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          const colors = getColorStyles(stat.color);

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className={`bg-white rounded-2xl p-5 border-2 ${colors.border} shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">{stat.title}</p>
                  <p className="text-2xl font-extrabold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`w-11 h-11 ${colors.iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-5 h-5 ${colors.icon}`} strokeWidth={2.2} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Favorites Grid */}
      {filteredProperties.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border-2 border-blue-100/50 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <div className="w-20 h-20 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Heart className="w-10 h-10 text-rose-300" strokeWidth={1.5} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No favorites yet</h3>
          <p className="text-gray-500 max-w-sm mx-auto">
            {searchTerm 
              ? "No properties match your search. Try adjusting your search terms."
              : "Start exploring properties and save your favorites for later!"}
          </p>
          {!searchTerm && (
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 mt-4 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
            >
              <span>Browse Properties</span>
              <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
            </Link>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property, index) => {
              const rating = property.rating || 0;
              const reviewCount = property.reviewCount || 0;
              const isRemoving = removingId === property._id;

              return (
                <motion.div
                  key={property._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  whileHover={{ y: -4 }}
                  className="group bg-white rounded-2xl overflow-hidden border-2 border-blue-100/50 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_40px_rgba(37,99,235,0.08)] transition-all duration-300"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={property.mainImage || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop"}
                      alt={property.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                    
                    {/* Rating Badge */}
                    {reviewCount > 0 && (
                      <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1.5 bg-black/50 backdrop-blur-sm rounded-full border border-white/10">
                        <div className="flex items-center gap-0.5">
                          {renderStars(rating)}
                        </div>
                        <span className="text-white text-xs font-medium">{rating.toFixed(1)}</span>
                        <span className="text-white/60 text-[10px]">({reviewCount})</span>
                      </div>
                    )}

                    {/* Price Badge */}
                    <div className="absolute bottom-3 right-3 px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-white/50">
                      <span className="text-sm font-bold text-blue-600">{formatPrice(property.price)}</span>
                      <span className="text-[10px] text-gray-500 ml-1">/{property.rentType || "mo"}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    {/* Title & Location */}
                    <div className="mb-2">
                      <h3 className="text-sm font-bold text-gray-900 group-hover:text-rose-600 transition-colors line-clamp-1">
                        {property.title}
                      </h3>
                      <p className="text-gray-500 text-xs flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-gray-400" strokeWidth={2} />
                        {property.location}
                      </p>
                    </div>

                    {/* Property Details */}
                    <div className="flex items-center gap-3 py-2 border-t border-b border-gray-100/60 text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <Bed className="w-3.5 h-3.5 text-blue-400" strokeWidth={2} />
                        <span>{property.bedrooms || 0}</span>
                      </div>
                      <div className="w-px h-4 bg-gray-200" />
                      <div className="flex items-center gap-1">
                        <Bath className="w-3.5 h-3.5 text-blue-400" strokeWidth={2} />
                        <span>{property.bathrooms || 0}</span>
                      </div>
                      <div className="w-px h-4 bg-gray-200" />
                      <div className="flex items-center gap-1">
                        <Ruler className="w-3.5 h-3.5 text-blue-400" strokeWidth={2} />
                        <span>{property.propertySize || 0} sqft</span>
                      </div>
                    </div>

                    {/* Amenities Preview */}
                    {property.amenities && property.amenities.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {property.amenities.slice(0, 2).map((amenity) => (
                          <span
                            key={amenity}
                            className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] rounded-full border border-blue-100"
                          >
                            {amenity}
                          </span>
                        ))}
                        {property.amenities.length > 2 && (
                          <span className="px-2 py-0.5 bg-gray-50 text-gray-500 text-[10px] rounded-full border border-gray-200">
                            +{property.amenities.length - 2} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 mt-3">
                      <Link
                        href={`/properties/${property._id}`}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs font-semibold rounded-xl shadow-[0_4px_14px_rgba(37,99,235,0.25)] hover:shadow-[0_8px_24px_rgba(37,99,235,0.35)] transition-all duration-200 hover:-translate-y-0.5"
                      >
                        <Eye className="w-3.5 h-3.5" strokeWidth={2} />
                        <span>View Details</span>
                      </Link>
                      <button
                        onClick={() => handleRemoveFavorite(property._id)}
                        disabled={isRemoving}
                        className={`px-3 py-2 cursor-pointer bg-rose-50 text-rose-600 text-xs font-semibold rounded-xl border border-rose-200 hover:bg-rose-100 transition-all duration-200 flex items-center gap-1.5 ${
                          isRemoving ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        {isRemoving ? (
                          <div className="w-3.5 h-3.5 border-2 border-rose-600 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" strokeWidth={2} />
                        )}
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Footer Stats */}
          <div className="mt-6 flex items-center justify-between text-xs text-gray-400 px-1">
            <span>Showing {filteredProperties.length} of {properties.length} favorites</span>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1">
                <Heart className="w-3 h-3 text-rose-400" fill="#f43f5e" strokeWidth={0} />
                {properties.length} total
              </span>
              <span className="inline-flex items-center gap-1">
                <DollarSign className="w-3 h-3 text-emerald-400" strokeWidth={2} />
                {formatPrice(totalValue)}
              </span>
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-3 h-3 text-purple-400" strokeWidth={2} />
                {uniqueLocations} locations
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}