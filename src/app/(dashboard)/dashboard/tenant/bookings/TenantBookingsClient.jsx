"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  CalendarCheck,
  Search,
  MapPin,
  Eye,
  ArrowRight,
  Sparkles,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  Filter,
  ChevronDown,
  TrendingUp,
  Bed,
  Bath,
  Ruler,
  Home,
} from "lucide-react";
import { toast } from "react-toastify";

// ==================== TENANT BOOKINGS CLIENT ====================
export default function TenantBookingsClient({ bookings: initialBookings = [], transactions = [], userId }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [bookings] = useState(initialBookings);

  // ========== STATS ==========
  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === "pending").length,
    approved: bookings.filter(b => b.status === "approved" || b.status === "completed").length,
    rejected: bookings.filter(b => b.status === "rejected").length,
    totalSpent: transactions
      .filter(t => t.status === "completed")
      .reduce((sum, t) => sum + (t.amount || 0), 0),
  };

  // ========== FILTERED BOOKINGS ==========
  const filteredBookings = bookings.filter((booking) => {
    const propertyTitle = booking.propertyDetails?.title || booking.title || "";
    const propertyLocation = booking.propertyDetails?.location || booking.location || "";
    
    const matchesSearch = propertyTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      propertyLocation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || booking.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // ========== GET STATUS BADGE ==========
  const getStatusBadge = (status) => {
    const statusMap = {
      pending: {
        label: "Pending",
        className: "bg-amber-50 text-amber-700 border-amber-200",
        icon: <Clock className="w-3.5 h-3.5" strokeWidth={2} />,
      },
      approved: {
        label: "Approved",
        className: "bg-emerald-50 text-emerald-700 border-emerald-200",
        icon: <CheckCircle className="w-3.5 h-3.5" strokeWidth={2} />,
      },
      completed: {
        label: "Completed",
        className: "bg-blue-50 text-blue-700 border-blue-200",
        icon: <CheckCircle className="w-3.5 h-3.5" strokeWidth={2} />,
      },
      rejected: {
        label: "Rejected",
        className: "bg-rose-50 text-rose-700 border-rose-200",
        icon: <XCircle className="w-3.5 h-3.5" strokeWidth={2} />,
      },
      cancelled: {
        label: "Cancelled",
        className: "bg-gray-50 text-gray-700 border-gray-200",
        icon: <XCircle className="w-3.5 h-3.5" strokeWidth={2} />,
      },
    };
    return statusMap[status] || statusMap.pending;
  };

  // ========== GET PAYMENT STATUS ==========
  const getPaymentStatus = (bookingId) => {
    const transaction = transactions.find(t => t.bookingId === bookingId);
    if (!transaction) return { label: "N/A", className: "bg-gray-50 text-gray-700 border-gray-200" };
    
    const statusMap = {
      completed: { label: "Paid", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
      pending: { label: "Pending", className: "bg-amber-50 text-amber-700 border-amber-200" },
      failed: { label: "Failed", className: "bg-rose-50 text-rose-700 border-rose-200" },
      refunded: { label: "Refunded", className: "bg-blue-50 text-blue-700 border-blue-200" },
    };
    return statusMap[transaction.status] || statusMap.pending;
  };

  // ========== FORMAT DATE ==========
  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // ========== FORMAT PRICE ==========
  const formatPrice = (price) => {
    return `$${price?.toLocaleString() || 0}`;
  };

  // ========== HANDLE DOWNLOAD ==========
  const handleDownload = (booking) => {
    // const propertyTitle = booking.propertyDetails?.title || booking.title || "Booking";
    toast.success(`Downloading invoice`);
    // Implement actual download logic here
  };

  // ========== STATS CARDS ==========
  const statsCards = [
    {
      title: "Total Bookings",
      value: stats.total,
      icon: CalendarCheck,
      color: "blue",
    },
    {
      title: "Pending",
      value: stats.pending,
      icon: Clock,
      color: "amber",
    },
    {
      title: "Approved",
      value: stats.approved,
      icon: CheckCircle,
      color: "emerald",
    },
    {
      title: "Total Spent",
      value: formatPrice(stats.totalSpent),
      icon: DollarSign,
      color: "purple",
    },
  ];

  // ========== GET COLOR STYLES ==========
  const getColorStyles = (color) => {
    const colors = {
      blue: { bg: "bg-blue-50", iconBg: "bg-blue-100", icon: "text-blue-600", border: "border-blue-200/60" },
      amber: { bg: "bg-amber-50", iconBg: "bg-amber-100", icon: "text-amber-600", border: "border-amber-200/60" },
      emerald: { bg: "bg-emerald-50", iconBg: "bg-emerald-100", icon: "text-emerald-600", border: "border-emerald-200/60" },
      purple: { bg: "bg-purple-50", iconBg: "bg-purple-100", icon: "text-purple-600", border: "border-purple-200/60" },
      rose: { bg: "bg-rose-50", iconBg: "bg-rose-100", icon: "text-rose-600", border: "border-rose-200/60" },
    };
    return colors[color] || colors.blue;
  };

  // ========== GET PROPERTY DETAILS ==========
  const getPropertyDetails = (booking) => {
    const property = booking.propertyDetails;
    if (!property) {
      return {
        title: booking.title || "Unknown Property",
        location: booking.location || "Unknown Location",
        image: null,
        beds: booking.beds || 0,
        baths: booking.baths || 0,
        sqft: booking.sqft || 0,
      };
    }
    return {
      title: property.title,
      location: property.location,
      image: property.mainImage || property.images?.[0] || null,
      beds: property.bedrooms || 0,
      baths: property.bathrooms || 0,
      sqft: property.propertySize || 0,
    };
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
            My <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-700">Bookings</span>
          </h1>
          <p className="text-gray-500 mt-1">View and manage all your property bookings</p>
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

      {/* Bookings Table */}
      <div className="bg-white rounded-2xl border-2 border-blue-100/50 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_40px_rgba(37,99,235,0.06)] transition-all duration-300 overflow-hidden">
        {/* Table Header with Filters */}
        <div className="p-6 pb-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">All Bookings</h3>
              <p className="text-sm text-gray-500">
                {filteredBookings.length} booking{filteredBookings.length !== 1 ? 's' : ''} found
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" strokeWidth={2} />
                <input
                  type="text"
                  placeholder="Search bookings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-sm w-full sm:w-48"
                />
              </div>
              
              {/* Filter Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-50 border-2 border-gray-200 rounded-xl hover:bg-gray-100 transition-colors text-sm text-gray-600"
                >
                  <Filter className="w-4 h-4" strokeWidth={2} />
                  <span>Filter</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} strokeWidth={2} />
                </button>
                
                {showFilters && (
                  <div className="absolute right-0 top-full mt-2 z-10 bg-white rounded-xl border-2 border-gray-100 shadow-lg p-2 min-w-[160px]">
                    {["all", "pending", "approved", "completed", "rejected", "cancelled"].map((status) => (
                      <button
                        key={status}
                        onClick={() => {
                          setFilterStatus(status);
                          setShowFilters(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          filterStatus === status
                            ? "bg-blue-50 text-blue-600 font-medium"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto mt-4">
          <table className="w-full">
            <thead>
              <tr className="border-y border-gray-100 bg-gray-50/50">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Property</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Booking Date</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount Paid</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Booking Status</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Payment Status</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking, index) => {
                const statusBadge = getStatusBadge(booking.status);
                const paymentStatus = getPaymentStatus(booking._id);
                const property = getPropertyDetails(booking);

                return (
                  <motion.tr
                    key={booking._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.03 }}
                    className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                          {property.image ? (
                            <Image src={property.image} alt={property.title} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <Home className="w-5 h-5" strokeWidth={2} />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm line-clamp-1">{property.title}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <MapPin className="w-3 h-3" strokeWidth={2} />
                            {property.location}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                            <Bed className="w-3 h-3" strokeWidth={2} />
                            {property.beds}
                            <Bath className="w-3 h-3 ml-1" strokeWidth={2} />
                            {property.baths}
                            <Ruler className="w-3 h-3 ml-1" strokeWidth={2} />
                            {property.sqft} sqft
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500 hidden md:table-cell">
                      {formatDate(booking.createdAt)}
                    </td>
                    <td className="py-3 px-4 text-sm font-semibold text-gray-900">
                      {formatPrice(booking.price)}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusBadge.className}`}>
                        {statusBadge.icon}
                        {statusBadge.label}
                      </span>
                    </td>
                    <td className="py-3 px-4 hidden sm:table-cell">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${paymentStatus.className}`}>
                        {paymentStatus.label}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <Link
                          href={`/properties/${booking.propertyId}`}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="View Property"
                        >
                          <Eye className="w-4 h-4" strokeWidth={2} />
                        </Link>
                        <button
                          onClick={() => handleDownload(booking)}
                          className="p-2 cursor-pointer text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                          title="Download Invoice"
                        >
                          <Download className="w-4 h-4" strokeWidth={2} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredBookings.length === 0 && (
          <div className="text-center py-12 px-4">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CalendarCheck className="w-8 h-8 text-gray-400" strokeWidth={2} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-500 text-sm">
              {searchTerm || filterStatus !== "all" 
                ? "Try adjusting your search or filter criteria" 
                : "You haven't made any bookings yet. Start exploring properties!"}
            </p>
            {!searchTerm && filterStatus === "all" && (
              <Link
                href="/properties"
                className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
              >
                <span>Browse Properties</span>
                <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
              </Link>
            )}
          </div>
        )}

        {/* Table Footer */}
        {filteredBookings.length > 0 && (
          <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
            <span>Showing {filteredBookings.length} of {bookings.length} bookings</span>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Approved: {stats.approved}
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                Pending: {stats.pending}
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-400" />
                Rejected: {stats.rejected}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}