// src/app/(dashboard)/dashboard/admin/bookings/AdminBookingsClient.jsx
"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Calendar,
  Search,
  MapPin,
  Eye,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Sparkles,
  Home,
  User,
  TrendingUp,
  TrendingDown,
  Phone,
  Mail,
  MessageSquare,
  X,
  Info,
} from "lucide-react";
import {
  Modal,
  Button,
  Input,
  Select,
  ListBox,
  Label,
} from "@heroui/react";

// ==================== ADMIN BOOKINGS CLIENT ====================
export default function AdminBookingsClient({ bookings: initialBookings = [], total = 0, stats = {}, adminId }) {
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // ========== SEARCH, FILTER, SORT STATE ==========
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("default");

  // ========== FILTERED & SORTED BOOKINGS (Client-side) ==========
  const filteredAndSortedBookings = useMemo(() => {
    let result = [...initialBookings];

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter((booking) =>
        booking.propertyTitle?.toLowerCase().includes(lowerSearch) ||
        booking.tenantName?.toLowerCase().includes(lowerSearch) ||
        booking.propertyLocation?.toLowerCase().includes(lowerSearch)
      );
    }

    if (filterStatus !== "all") {
      result = result.filter((booking) => booking.status === filterStatus);
    }

    if (sortBy === "low-to-high") {
      result.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === "high-to-low") {
      result.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return result;
  }, [initialBookings, searchTerm, filterStatus, sortBy]);

  // ========== STATS ==========
  const statsCards = [
    {
      title: "Total Bookings",
      value: stats.total || 0,
      icon: Calendar,
      color: "blue",
      change: `${stats.pending || 0} pending`,
      trend: stats.pending > 0 ? "up" : "neutral",
    },
    {
      title: "Approved",
      value: stats.approved || 0,
      icon: CheckCircle,
      color: "emerald",
      change: "Confirmed",
      trend: "up",
    },
    {
      title: "Pending",
      value: stats.pending || 0,
      icon: Clock,
      color: "amber",
      change: "Awaiting action",
      trend: "neutral",
    },
    {
      title: "Total Revenue",
      value: `$${stats.totalRevenue?.toLocaleString() || 0}`,
      icon: DollarSign,
      color: "purple",
      change: "Earned",
      trend: "up",
    },
  ];

  // ========== GET COLOR STYLES ==========
  const getColorStyles = (color) => {
    const colors = {
      blue: { bg: "bg-blue-50", iconBg: "bg-blue-100", icon: "text-blue-600", border: "border-blue-200/60" },
      emerald: { bg: "bg-emerald-50", iconBg: "bg-emerald-100", icon: "text-emerald-600", border: "border-emerald-200/60" },
      amber: { bg: "bg-amber-50", iconBg: "bg-amber-100", icon: "text-amber-600", border: "border-amber-200/60" },
      rose: { bg: "bg-rose-50", iconBg: "bg-rose-100", icon: "text-rose-600", border: "border-rose-200/60" },
      purple: { bg: "bg-purple-50", iconBg: "bg-purple-100", icon: "text-purple-600", border: "border-purple-200/60" },
    };
    return colors[color] || colors.blue;
  };

  // ========== STATUS BADGE ==========
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
    };
    return statusMap[status] || statusMap.pending;
  };

  // ========== PAYMENT BADGE ==========
  const getPaymentBadge = (booking) => {
    const statusMap = {
      completed: { label: "Paid", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
      pending: { label: "Pending", className: "bg-amber-50 text-amber-700 border-amber-200" },
      failed: { label: "Failed", className: "bg-rose-50 text-rose-700 border-rose-200" },
      refunded: { label: "Refunded", className: "bg-blue-50 text-blue-700 border-blue-200" },
    };
    return statusMap[booking.transactionStatus] || statusMap.pending;
  };

  // ========== HELPERS ==========
  const formatPrice = (price) => {
    return `$${price?.toLocaleString() || 0}`;
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // ========== HANDLE VIEW DETAILS ==========
  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setShowDetailsModal(true);
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedBooking(null);
  };

  // ========== STATUS OPTIONS ==========
  const statusOptions = [
    { id: "all", label: "All Status" },
    { id: "pending", label: "Pending" },
    { id: "approved", label: "Approved" },
    { id: "completed", label: "Completed" },
    { id: "rejected", label: "Rejected" },
  ];

  const sortOptions = [
    { id: "default", label: "Default (Newest)" },
    { id: "low-to-high", label: "Price: Low → High" },
    { id: "high-to-low", label: "Price: High → Low" },
  ];

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
            All <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-700">Bookings</span>
          </h1>
          <p className="text-gray-500 mt-1 text-sm">Monitor platform-wide booking activity</p>
        </div>
        <div className="flex items-center gap-2 mt-2 md:mt-0">
          <span className="text-sm text-gray-500">{total} total bookings</span>
        </div>
      </div>

      {/* Stats Grid - Responsive */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6 mb-6 md:mb-8">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          const colors = getColorStyles(stat.color);
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className={`bg-white rounded-2xl p-4 md:p-5 border-2 ${colors.border} shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-xs md:text-sm text-gray-500 font-medium truncate">{stat.title}</p>
                  <p className="text-lg md:text-2xl font-extrabold text-gray-900 mt-1">{stat.value}</p>
                  <div className={`flex items-center gap-1 mt-1 md:mt-2 text-[10px] md:text-xs font-medium ${
                    stat.trend === "up" ? "text-emerald-600" :
                    stat.trend === "down" ? "text-rose-600" : "text-gray-400"
                  }`}>
                    {stat.trend === "up" && <TrendingUp className="w-3 h-3 md:w-3.5 md:h-3.5" strokeWidth={2.5} />}
                    {stat.trend === "down" && <TrendingDown className="w-3 h-3 md:w-3.5 md:h-3.5" strokeWidth={2.5} />}
                    <span className="truncate">{stat.change}</span>
                  </div>
                </div>
                <div className={`w-8 h-8 md:w-11 md:h-11 ${colors.iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-4 h-4 md:w-5 md:h-5 ${colors.icon}`} strokeWidth={2.2} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Search & Filter - Responsive */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4 mb-4 md:mb-6">
        <div className="flex-1 w-full sm:max-w-md">
          <Input
            type="text"
            placeholder="Search by property or tenant..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
            classNames={{
              input: "bg-transparent text-gray-800 placeholder:text-gray-400 text-sm",
              inputWrapper: "bg-white border-2 border-blue-200/60 rounded-xl focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all duration-200 shadow-sm hover:border-blue-300",
            }}
            startContent={<Search className="w-4 h-4 text-gray-400" strokeWidth={2} />}
          />
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <div className="flex-1 sm:flex-none min-w-[120px] sm:w-44">
            <Select
              className="w-full"
              value={filterStatus !== "all" ? filterStatus : null}
              onChange={(val) => setFilterStatus(val || "all")}
              aria-label="Filter by status"
              classNames={{
                trigger: "bg-white border-2 border-blue-200/60 rounded-xl focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all duration-200 shadow-sm hover:border-blue-300 data-[open=true]:border-blue-500",
                value: "text-gray-800 text-sm", 
                placeholder: "text-gray-400 text-sm",
                indicator: "text-blue-400",
                popover: "bg-white rounded-xl shadow-lg border border-blue-100/50 mt-1",
                listBox: "p-1",
              }}
            >
              <Select.Trigger><Select.Value /><Select.Indicator /></Select.Trigger>
              <Select.Popover>
                <ListBox>
                  {statusOptions.map((status) => (
                    <ListBox.Item key={status.id} id={status.id} textValue={status.label} className="text-gray-700 hover:bg-blue-50 rounded-lg data-[selected=true]:bg-blue-100 data-[selected=true]:text-blue-700 transition-colors cursor-pointer px-3 py-2.5 text-sm">
                      {status.label}<ListBox.ItemIndicator />
                    </ListBox.Item>
                  ))}
                </ListBox>
              </Select.Popover>
            </Select>
          </div>
          <div className="flex-1 sm:flex-none min-w-[120px] sm:w-44">
            <Select
              className="w-full"
              value={sortBy !== "default" ? sortBy : null}
              onChange={(val) => setSortBy(val || "default")}
              aria-label="Sort By"
              classNames={{
                trigger: "bg-white border-2 border-blue-200/60 rounded-xl focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all duration-200 shadow-sm hover:border-blue-300 data-[open=true]:border-blue-500",
                value: "text-gray-800 text-sm",
                placeholder: "text-gray-400 text-sm",
                indicator: "text-blue-400",
                popover: "bg-white rounded-xl shadow-lg border border-blue-100/50 mt-1",
                listBox: "p-1",
              }}
            >
              <Select.Trigger><Select.Value /><Select.Indicator /></Select.Trigger>
              <Select.Popover>
                <ListBox>
                  {sortOptions.map((option) => (
                    <ListBox.Item key={option.id} id={option.id} textValue={option.label} className="text-gray-700 hover:bg-blue-50 rounded-lg data-[selected=true]:bg-blue-100 data-[selected=true]:text-blue-700 transition-colors cursor-pointer px-3 py-2.5 text-sm">
                      {option.label}<ListBox.ItemIndicator />
                    </ListBox.Item>
                  ))}
                </ListBox>
              </Select.Popover>
            </Select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-3 md:mb-4">
        <p className="text-xs md:text-sm text-gray-500">
          Showing <span className="font-semibold text-gray-700">{filteredAndSortedBookings.length}</span> bookings
          {filteredAndSortedBookings.length !== total && (
            <span className="text-gray-400"> (filtered from {total})</span>
          )}
        </p>
      </div>

      {/* Bookings Table - Responsive */}
      <div className="bg-white rounded-2xl border-2 border-blue-100/50 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_40px_rgba(37,99,235,0.06)] transition-all duration-300 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left py-2 md:py-3 px-3 md:px-4 text-[10px] md:text-xs font-semibold text-gray-500 uppercase tracking-wider">Tenant</th>
                <th className="text-left py-2 md:py-3 px-3 md:px-4 text-[10px] md:text-xs font-semibold text-gray-500 uppercase tracking-wider">Property</th>
                <th className="text-left py-2 md:py-3 px-3 md:px-4 text-[10px] md:text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Booking Date</th>
                <th className="text-left py-2 md:py-3 px-3 md:px-4 text-[10px] md:text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="text-left py-2 md:py-3 px-3 md:px-4 text-[10px] md:text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Status</th>
                <th className="text-left py-2 md:py-3 px-3 md:px-4 text-[10px] md:text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedBookings.map((booking, index) => {
                const statusBadge = getStatusBadge(booking.status);
                const paymentBadge = getPaymentBadge(booking);

                return (
                  <motion.tr
                    key={booking._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.03 }}
                    className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                  >
                    {/* Tenant */}
                    <td className="py-2 md:py-3 px-3 md:px-4">
                      <div className="flex items-center gap-2 md:gap-3">
                        <div className="relative w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-[10px] md:text-sm">
                          {booking.tenantImage ? (
                            <Image src={booking.tenantImage} alt={booking.tenantName} fill className="object-cover" />
                          ) : (
                            (booking.tenantName || "U").charAt(0).toUpperCase()
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 text-xs md:text-sm truncate max-w-[80px] sm:max-w-[120px] md:max-w-none">
                            {booking.tenantName || "Unknown"}
                          </p>
                          <p className="text-[10px] md:text-xs text-gray-400 truncate max-w-[80px] sm:max-w-[120px] md:max-w-none">
                            {booking.tenantEmail || ""}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Property */}
                    <td className="py-2 md:py-3 px-3 md:px-4">
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 text-xs md:text-sm truncate max-w-[100px] sm:max-w-[150px] md:max-w-none">
                          {booking.propertyTitle || booking.title || "Property"}
                        </p>
                        <div className="flex items-center gap-0.5 md:gap-1 text-[10px] md:text-xs text-gray-400">
                          <MapPin className="w-3 h-3 md:w-3.5 md:h-3.5 flex-shrink-0" strokeWidth={2} />
                          <span className="truncate max-w-[80px] sm:max-w-[120px] md:max-w-none">
                            {booking.propertyLocation || "N/A"}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Booking Date */}
                    <td className="py-2 md:py-3 px-3 md:px-4 text-xs md:text-sm text-gray-500 hidden md:table-cell">
                      {formatDate(booking.createdAt)}
                    </td>

                    {/* Amount */}
                    <td className="py-2 md:py-3 px-3 md:px-4">
                      <div>
                        <p className="text-xs md:text-sm font-semibold text-gray-900">
                          {formatPrice(booking.price || booking.amount)}
                        </p>
                        <span className={`text-[8px] md:text-[10px] px-1.5 md:px-2 py-0.5 rounded-full border ${paymentBadge.className} whitespace-nowrap`}>
                          {paymentBadge.label}
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-2 md:py-3 px-3 md:px-4 hidden sm:table-cell">
                      <span className={`inline-flex items-center gap-1 md:gap-1.5 px-2 md:px-2.5 py-0.5 md:py-1 rounded-full text-[8px] md:text-xs font-medium border ${statusBadge.className} whitespace-nowrap`}>
                        {statusBadge.icon}
                        {statusBadge.label}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-2 md:py-3 px-3 md:px-4">
                      <button
                        onClick={() => handleViewDetails(booking)}
                        className="p-1.5 md:p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all cursor-pointer"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4 md:w-5 md:h-5" strokeWidth={2} />
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredAndSortedBookings.length === 0 && (
          <div className="text-center py-8 md:py-12 px-4">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4">
              <Calendar className="w-6 h-6 md:w-8 md:h-8 text-gray-400" strokeWidth={2} />
            </div>
            <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1 md:mb-2">No bookings found</h3>
            <p className="text-xs md:text-sm text-gray-500">
              {searchTerm || filterStatus !== "all"
                ? "Try adjusting your search or filter criteria"
                : "No bookings have been made yet."}
            </p>
          </div>
        )}

        {/* Table Footer */}
        {filteredAndSortedBookings.length > 0 && (
          <div className="px-3 md:px-6 py-2 md:py-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2 text-[10px] md:text-xs text-gray-400">
            <span>Showing {filteredAndSortedBookings.length} of {total} bookings</span>
            <div className="flex flex-wrap items-center gap-2 md:gap-3">
              <span className="inline-flex items-center gap-1">
                <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-emerald-400" />
                Approved: {stats.approved || 0}
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-amber-400" />
                Pending: {stats.pending || 0}
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-rose-400" />
                Rejected: {stats.rejected || 0}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ========== BOOKING DETAILS MODAL ========== */}
      <Modal isOpen={showDetailsModal} onClose={handleCloseDetailsModal} size="lg" className="max-w-2xl">
        <Modal.Backdrop>
          <Modal.Container>
            <Modal.Dialog className="bg-white rounded-2xl border-2 border-blue-100/50 shadow-2xl max-h-[90vh] flex flex-col">
              <Modal.Header className="px-4 md:px-6 pt-4 md:pt-6 pb-3 md:pb-4 border-b border-gray-100 flex-shrink-0">
                <div className="flex items-center justify-between w-full">
                  <div>
                    <div className="flex items-center gap-2">
                      <Info className="w-5 h-5 text-blue-600" strokeWidth={2} />
                      <Modal.Heading className="text-lg md:text-xl font-extrabold text-gray-900">
                        Booking Details
                      </Modal.Heading>
                    </div>
                    <p className="text-xs md:text-sm text-gray-500 mt-0.5">View complete booking information</p>
                  </div>
                  <button
                    onClick={handleCloseDetailsModal}
                    className="p-1.5 md:p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer flex-shrink-0"
                  >
                    <X className="w-5 h-5 text-gray-400" strokeWidth={2} />
                  </button>
                </div>
              </Modal.Header>

              <Modal.Body className="px-4 md:px-6 py-4 md:py-6 overflow-y-auto flex-1">
                {selectedBooking && (
                  <div className="space-y-4 md:space-y-6">
                    {/* Tenant Info */}
                    <div className="bg-gray-50/80 rounded-xl p-3 md:p-4 border border-gray-100">
                      <h4 className="text-xs md:text-sm font-semibold text-gray-700 mb-2 md:mb-3 flex items-center gap-2">
                        <User className="w-4 h-4 text-blue-600" strokeWidth={2} />
                        Tenant Information
                      </h4>
                      <div className="flex items-center gap-3 md:gap-4">
                        <div className="relative w-10 h-10 md:w-14 md:h-14 rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm md:text-lg">
                          {selectedBooking.tenantImage ? (
                            <Image src={selectedBooking.tenantImage} alt={selectedBooking.tenantName} fill className="object-cover" />
                          ) : (
                            (selectedBooking.tenantName || "U").charAt(0).toUpperCase()
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 text-sm md:text-base truncate">{selectedBooking.tenantName || "Unknown"}</p>
                          <p className="text-xs md:text-sm text-gray-500 truncate">{selectedBooking.tenantEmail || "No email"}</p>
                          <p className="text-xs md:text-sm text-gray-500 flex items-center gap-1 truncate">
                            <Phone className="w-3 h-3 md:w-3.5 md:h-3.5 flex-shrink-0" strokeWidth={2} />
                            <span className="truncate">{selectedBooking.contactNumber || "N/A"}</span>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Property Info */}
                    <div className="bg-gray-50/80 rounded-xl p-3 md:p-4 border border-gray-100">
                      <h4 className="text-xs md:text-sm font-semibold text-gray-700 mb-2 md:mb-3 flex items-center gap-2">
                        <Home className="w-4 h-4 text-blue-600" strokeWidth={2} />
                        Property Information
                      </h4>
                      <div className="space-y-1 md:space-y-2">
                        <p className="font-semibold text-gray-900 text-sm md:text-base truncate">{selectedBooking.propertyTitle || selectedBooking.title}</p>
                        <p className="text-xs md:text-sm text-gray-500 flex items-center gap-1 truncate">
                          <MapPin className="w-3 h-3 md:w-3.5 md:h-3.5 flex-shrink-0" strokeWidth={2} />
                          <span className="truncate">{selectedBooking.propertyLocation || "N/A"}</span>
                        </p>
                        <p className="text-xs md:text-sm text-gray-500">
                          <span className="font-medium">Price:</span> {formatPrice(selectedBooking.price)}
                        </p>
                      </div>
                    </div>

                    {/* Booking Details */}
                    <div className="bg-gray-50/80 rounded-xl p-3 md:p-4 border border-gray-100">
                      <h4 className="text-xs md:text-sm font-semibold text-gray-700 mb-2 md:mb-3 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-600" strokeWidth={2} />
                        Booking Details
                      </h4>
                      <div className="grid grid-cols-2 gap-2 md:gap-3">
                        <div>
                          <p className="text-[10px] md:text-xs text-gray-400">Booking Date</p>
                          <p className="text-xs md:text-sm font-medium text-gray-900 truncate">{formatDate(selectedBooking.createdAt)}</p>
                        </div>
                        <div>
                          <p className="text-[10px] md:text-xs text-gray-400">Move-in Date</p>
                          <p className="text-xs md:text-sm font-medium text-gray-900 truncate">{formatDate(selectedBooking.moveInDate)}</p>
                        </div>
                        <div>
                          <p className="text-[10px] md:text-xs text-gray-400">Status</p>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] md:text-xs font-medium border ${getStatusBadge(selectedBooking.status).className} truncate`}>
                            {getStatusBadge(selectedBooking.status).icon}
                            {getStatusBadge(selectedBooking.status).label}
                          </span>
                        </div>
                        <div>
                          <p className="text-[10px] md:text-xs text-gray-400">Payment</p>
                          <span className={`text-[10px] md:text-xs px-2 py-0.5 rounded-full border ${getPaymentBadge(selectedBooking).className} truncate`}>
                            {getPaymentBadge(selectedBooking).label}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Additional Notes */}
                    {selectedBooking.additionalNotes && (
                      <div className="bg-gray-50/80 rounded-xl p-3 md:p-4 border border-gray-100">
                        <h4 className="text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2 flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-blue-600" strokeWidth={2} />
                          Additional Notes
                        </h4>
                        <p className="text-xs md:text-sm text-gray-600 break-words">{selectedBooking.additionalNotes}</p>
                      </div>
                    )}

                    {/* Booking ID */}
                    <div className="bg-amber-50/50 rounded-xl p-2 md:p-3 border border-amber-200/50">
                      <p className="text-[10px] md:text-xs text-amber-700 flex items-center gap-2">
                        <AlertCircle className="w-3.5 h-3.5 md:w-4 md:h-4 flex-shrink-0" strokeWidth={2} />
                        <span className="break-all">Booking ID: {selectedBooking._id}</span>
                      </p>
                    </div>
                  </div>
                )}
              </Modal.Body>

              <Modal.Footer className="px-4 md:px-6 pb-4 md:pb-6 pt-3 md:pt-4 border-t border-gray-100 flex-shrink-0">
                <Button
                  onPress={handleCloseDetailsModal}
                  className="w-full py-2.5 md:py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-all duration-300 cursor-pointer text-sm"
                >
                  Close
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </div>
  );
}