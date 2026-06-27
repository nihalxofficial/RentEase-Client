// src/app/(dashboard)/dashboard/owner/bookings/OwnerBookingsClient.jsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
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
  CalendarDays,
  Mail,
  MessageSquare,
  X,
  RefreshCw,
  Info,
  UserCheck,
  UserX,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  Modal,
  Button,
  Input,
  Select,
  ListBox,
  Label,
  Textarea,
} from "@heroui/react";
import { approveBooking, rejectBooking } from "@/lib/action/bookings";

// ==================== OWNER BOOKINGS CLIENT ====================
export default function OwnerBookingsClient({ bookings: initialBookings = [], transactions = [], userId }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [bookings, setBookings] = useState(initialBookings);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmBookingId, setConfirmBookingId] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Status options for filter
  const statusOptions = [
    { id: "all", label: "All Status" },
    { id: "pending", label: "Pending" },
    { id: "approved", label: "Approved" },
    { id: "rejected", label: "Rejected" },
  ];

  // ========== FILTERED BOOKINGS ==========
  const filteredBookings = bookings.filter((booking) => {
    const propertyTitle = booking.propertyTitle || booking.title || "";
    const tenantName = booking.tenantName || "";
    const matchesSearch = propertyTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenantName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || booking.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // ========== FORMAT PRICE ==========
  const formatPrice = (price) => {
    return `$${price?.toLocaleString() || 0}`;
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
      rejected: {
        label: "Rejected",
        className: "bg-rose-50 text-rose-700 border-rose-200",
        icon: <XCircle className="w-3.5 h-3.5" strokeWidth={2} />,
      },
    };
    return statusMap[status] || statusMap.pending;
  };

  // ========== GET PAYMENT BADGE ==========
  const getPaymentBadge = (bookingId) => {
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

  // ========== HANDLE APPROVE CONFIRMATION ==========
  const handleApproveClick = (bookingId) => {
    const booking = bookings.find(b => b._id === bookingId);
    const otherPending = bookings.filter(b => 
      b.propertyId === booking?.propertyId && 
      b.status === "pending" && 
      b._id !== bookingId
    );
    
    let message = "Are you sure you want to approve this booking?";
    if (otherPending.length > 0) {
      message = `This will approve the booking and automatically reject ${otherPending.length} other pending booking(s) for this property.`;
    }
    
    setConfirmBookingId(bookingId);
    setConfirmAction("approve");
    setConfirmMessage(message);
    setShowConfirmModal(true);
  };

  // ========== HANDLE REJECT CONFIRMATION ==========
  const handleRejectClick = (bookingId) => {
    setConfirmBookingId(bookingId);
    setConfirmAction("reject");
    setConfirmMessage("Are you sure you want to reject this booking?");
    setShowConfirmModal(true);
  };

  // ========== HANDLE CONFIRM ==========
  const handleConfirm = async () => {
    setIsProcessing(true);
    try {
      if (confirmAction === "approve") {
        const result = await approveBooking(confirmBookingId, { status: "approved" });
        console.log("Approve result:", result);
        
        const updatedBookings = await fetchBookings();
        setBookings(updatedBookings);
        
        toast.success("Booking approved successfully!");
      } else if (confirmAction === "reject") {
        const result = await rejectBooking(confirmBookingId, { status: "rejected" });
        console.log("Reject result:", result);
        
        setBookings((prev) =>
          prev.map((b) =>
            b._id === confirmBookingId
              ? { ...b, status: "rejected" }
              : b
          )
        );
        toast.success("Booking rejected successfully!");
      }
      setShowConfirmModal(false);
    } catch (error) {
      console.error("Action error:", error);
      toast.error(error?.message || "Failed to process request");
    } finally {
      setIsProcessing(false);
      setConfirmBookingId(null);
      setConfirmAction(null);
    }
  };

  // ========== FETCH UPDATED BOOKINGS ==========
  const fetchBookings = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch(`/api/bookings?ownerId=${userId}`);
      const data = await response.json();
      
      const enriched = await Promise.all(
        data.map(async (booking) => {
          try {
            const propertyRes = await fetch(`/api/properties/${booking.propertyId}`);
            const property = await propertyRes.json();
            
            const userRes = await fetch(`/api/users/${booking.userId}`);
            const user = await userRes.json();
            
            return {
              ...booking,
              propertyTitle: property?.title || booking.title,
              propertyLocation: property?.location || "N/A",
              propertyImage: property?.mainImage || null,
              tenantName: user?.name || "Unknown",
              tenantEmail: user?.email || "",
              tenantImage: user?.image || null,
            };
          } catch {
            return booking;
          }
        })
      );
      
      return enriched;
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
      return bookings;
    } finally {
      setIsRefreshing(false);
    }
  };

  // ========== HANDLE VIEW DETAILS ==========
  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setShowDetailsModal(true);
  };

  // ========== STATS ==========
  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === "pending").length,
    approved: bookings.filter(b => b.status === "approved").length,
    rejected: bookings.filter(b => b.status === "rejected").length,
  };

  // ========== STATS CARDS ==========
  const statsCards = [
    {
      title: "Total Bookings",
      value: stats.total,
      icon: Calendar,
      color: "blue",
      change: `${stats.pending} pending`,
      trend: stats.pending > 0 ? "up" : "neutral",
    },
    {
      title: "Approved",
      value: stats.approved,
      icon: CheckCircle,
      color: "emerald",
      change: "Confirmed",
      trend: "up",
    },
    {
      title: "Pending",
      value: stats.pending,
      icon: Clock,
      color: "amber",
      change: "Awaiting action",
      trend: "neutral",
    },
    {
      title: "Rejected",
      value: stats.rejected,
      icon: XCircle,
      color: "rose",
      change: "Declined",
      trend: "down",
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

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
            Booking <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-700">Requests</span>
          </h1>
          <p className="text-gray-500 mt-1">Manage booking requests for your properties</p>
        </div>
        <button
          onClick={() => fetchBookings()}
          disabled={isRefreshing}
          className="mt-4 md:mt-0 inline-flex items-center gap-2 px-4 py-2.5 bg-white text-blue-600 font-medium rounded-xl border-2 border-blue-100 hover:border-blue-400 shadow-sm hover:shadow-[0_8px_24px_rgba(37,99,235,0.12)] transition-all duration-300 hover:-translate-y-1 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} strokeWidth={2.2} />
          <span>Refresh</span>
        </button>
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
                  <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${
                    stat.trend === "up" ? "text-emerald-600" : 
                    stat.trend === "down" ? "text-rose-600" : "text-gray-400"
                  }`}>
                    {stat.trend === "up" && <TrendingUp className="w-3 h-3" strokeWidth={2.5} />}
                    {stat.trend === "down" && <TrendingDown className="w-3 h-3" strokeWidth={2.5} />}
                    <span>{stat.change}</span>
                  </div>
                </div>
                <div className={`w-11 h-11 ${colors.iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-5 h-5 ${colors.icon}`} strokeWidth={2.2} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex-1 max-w-md">
          <Input
            type="text"
            placeholder="Search by property or tenant..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
            classNames={{
              input: "bg-transparent text-gray-800 placeholder:text-gray-400",
              inputWrapper: "bg-white border-2 border-blue-200/60 rounded-xl focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all duration-200 shadow-sm hover:border-blue-300",
            }}
            startContent={<Search className="w-4 h-4 text-gray-400" strokeWidth={2} />}
          />
        </div>
        <div className="w-full sm:w-48">
          <Select
            className="w-full"
            value={filterStatus}
            onChange={(val) => setFilterStatus(val || "all")}
            aria-label="Filter by status"
            classNames={{
              trigger: "bg-white border-2 border-blue-200/60 rounded-xl focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all duration-200 shadow-sm hover:border-blue-300 data-[open=true]:border-blue-500",
              value: "text-gray-800",
              placeholder: "text-gray-400",
              indicator: "text-blue-400",
              popover: "bg-white rounded-xl shadow-lg border border-blue-100/50 mt-1",
              listBox: "p-1",
            }}
          >
            <Select.Trigger>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                {statusOptions.map((status) => (
                  <ListBox.Item
                    key={status.id}
                    id={status.id}
                    textValue={status.label}
                    className="text-gray-700 hover:bg-blue-50 rounded-lg data-[selected=true]:bg-blue-100 data-[selected=true]:text-blue-700 transition-colors cursor-pointer px-3 py-2.5"
                  >
                    {status.label}
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>
        </div>
      </div>

      {/* Info Banner */}
      {stats.pending > 1 && (
        <div className="bg-blue-50/80 rounded-xl p-4 border border-blue-200/50 mb-6">
          <div className="flex items-center gap-2 text-sm text-blue-700">
            <AlertCircle className="w-4 h-4 flex-shrink-0" strokeWidth={2} />
            <span>
              <strong>{stats.pending}</strong> pending booking(s) across your properties. 
              When you approve one booking, all other pending bookings for that property will be automatically rejected.
            </span>
          </div>
        </div>
      )}

      {/* Bookings Table */}
      <div className="bg-white rounded-2xl border-2 border-blue-100/50 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_40px_rgba(37,99,235,0.06)] transition-all duration-300 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tenant</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Property</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Booking Date</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Status</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking, index) => {
                const statusBadge = getStatusBadge(booking.status);
                const paymentBadge = getPaymentBadge(booking._id);
                const isPending = booking.status === "pending";

                return (
                  <motion.tr
                    key={booking._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.03 }}
                    className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                  >
                    {/* Tenant */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                          {booking.tenantImage ? (
                            <Image src={booking.tenantImage} alt={booking.tenantName} fill className="object-cover" />
                          ) : (
                            (booking.tenantName || "U").charAt(0).toUpperCase()
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">
                            {booking.tenantName || "Unknown"}
                          </p>
                          <p className="text-xs text-gray-400">{booking.tenantEmail || ""}</p>
                        </div>
                      </div>
                    </td>

                    {/* Property */}
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900 text-sm">
                          {booking.propertyTitle || booking.title || "Property"}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <MapPin className="w-3 h-3" strokeWidth={2} />
                          {booking.propertyLocation || "N/A"}
                        </div>
                        {isPending && (
                          <div className="flex items-center gap-1 mt-1">
                            {bookings.filter(b => 
                              b.propertyId === booking.propertyId && 
                              b.status === "pending" && 
                              b._id !== booking._id
                            ).length > 0 && (
                              <span className="text-[10px] text-amber-600 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {bookings.filter(b => 
                                  b.propertyId === booking.propertyId && 
                                  b.status === "pending" && 
                                  b._id !== booking._id
                                ).length} other pending
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Booking Date */}
                    <td className="py-3 px-4 text-sm text-gray-500 hidden md:table-cell">
                      {formatDate(booking.createdAt)}
                    </td>

                    {/* Amount */}
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {formatPrice(booking.price)}
                        </p>
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${paymentBadge.className}`}>
                          {paymentBadge.label}
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 hidden sm:table-cell">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusBadge.className}`}>
                        {statusBadge.icon}
                        {statusBadge.label}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleViewDetails(booking)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" strokeWidth={2} />
                        </button>
                        {isPending ? (
                          <>
                            <button
                              onClick={() => handleApproveClick(booking._id)}
                              disabled={isProcessing}
                              className="p-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-all cursor-pointer"
                              title="Approve Booking"
                            >
                              <CheckCircle className="w-4 h-4" strokeWidth={2} />
                            </button>
                            <button
                              onClick={() => handleRejectClick(booking._id)}
                              disabled={isProcessing}
                              className="p-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                              title="Reject Booking"
                            >
                              <XCircle className="w-4 h-4" strokeWidth={2} />
                            </button>
                          </>
                        ) : (
                          <span className="text-xs whitespace-nowrap text-gray-400 italic">No actions</span>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredBookings.length === 0 && (
          <div className="text-center py-12 px-4">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-gray-400" strokeWidth={2} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-500 text-sm">
              {searchTerm || filterStatus !== "all" 
                ? "Try adjusting your search or filter criteria" 
                : "You haven't received any booking requests yet."}
            </p>
          </div>
        )}

        {/* Table Footer */}
        {filteredBookings.length > 0 && (
          <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
            <span>Showing {filteredBookings.length} of {bookings.length} bookings</span>
            <div className="flex items-center gap-3">
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

      {/* ========== BOOKING DETAILS MODAL ========== */}
      <Modal isOpen={showDetailsModal} onClose={() => setShowDetailsModal(false)} size="lg" className="max-w-2xl">
        <Modal.Backdrop>
          <Modal.Container>
            <Modal.Dialog className="bg-white rounded-2xl border-2 border-blue-100/50 shadow-2xl max-h-[90vh] flex flex-col">
              <Modal.Header className="px-6 pt-6 pb-4 border-b border-gray-100 flex-shrink-0">
                <div className="flex items-center justify-between w-full">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Info className="w-5 h-5 text-blue-600" strokeWidth={2} />
                      <Modal.Heading className="text-xl font-extrabold text-gray-900">
                        Booking Details
                      </Modal.Heading>
                    </div>
                    <p className="text-sm text-gray-500">View complete booking information</p>
                  </div>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5 text-gray-400" strokeWidth={2} />
                  </button>
                </div>
              </Modal.Header>

              <Modal.Body className="px-6 py-6 overflow-y-auto flex-1">
                {selectedBooking && (
                  <div className="space-y-6">
                    {/* Tenant Info */}
                    <div className="bg-gray-50/80 rounded-xl p-4 border border-gray-100">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <User className="w-4 h-4 text-blue-600" strokeWidth={2} />
                        Tenant Information
                      </h4>
                      <div className="flex items-center gap-4">
                        <div className="relative w-14 h-14 rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                          {selectedBooking.tenantImage ? (
                            <Image src={selectedBooking.tenantImage} alt={selectedBooking.tenantName} fill className="object-cover" />
                          ) : (
                            (selectedBooking.tenantName || "U").charAt(0).toUpperCase()
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{selectedBooking.tenantName || "Unknown"}</p>
                          <p className="text-sm text-gray-500">{selectedBooking.tenantEmail || "No email"}</p>
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5" strokeWidth={2} />
                            {selectedBooking.contactNumber || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Property Info */}
                    <div className="bg-gray-50/80 rounded-xl p-4 border border-gray-100">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <Home className="w-4 h-4 text-blue-600" strokeWidth={2} />
                        Property Information
                      </h4>
                      <div className="space-y-2">
                        <p className="font-semibold text-gray-900">{selectedBooking.propertyTitle || selectedBooking.title}</p>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" strokeWidth={2} />
                          {selectedBooking.propertyLocation || "N/A"}
                        </p>
                        <p className="text-sm text-gray-500">
                          <span className="font-medium">Price:</span> {formatPrice(selectedBooking.price)}
                        </p>
                      </div>
                    </div>

                    {/* Booking Details */}
                    <div className="bg-gray-50/80 rounded-xl p-4 border border-gray-100">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-600" strokeWidth={2} />
                        Booking Details
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-gray-400">Booking Date</p>
                          <p className="text-sm font-medium text-gray-900">{formatDate(selectedBooking.createdAt)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Move-in Date</p>
                          <p className="text-sm font-medium text-gray-900">{formatDate(selectedBooking.moveInDate)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Status</p>
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusBadge(selectedBooking.status).className}`}>
                            {getStatusBadge(selectedBooking.status).icon}
                            {getStatusBadge(selectedBooking.status).label}
                          </span>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Payment</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full border ${getPaymentBadge(selectedBooking._id).className}`}>
                            {getPaymentBadge(selectedBooking._id).label}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Additional Notes */}
                    {selectedBooking.additionalNotes && (
                      <div className="bg-gray-50/80 rounded-xl p-4 border border-gray-100">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-blue-600" strokeWidth={2} />
                          Additional Notes
                        </h4>
                        <p className="text-sm text-gray-600">{selectedBooking.additionalNotes}</p>
                      </div>
                    )}

                    {/* Status Badge */}
                    <div className="bg-amber-50/50 rounded-xl p-3 border border-amber-200/50">
                      <p className="text-xs text-amber-700 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" strokeWidth={2} />
                        <span>Booking ID: {selectedBooking._id}</span>
                      </p>
                    </div>
                  </div>
                )}
              </Modal.Body>

              <Modal.Footer className="px-6 pb-6 pt-4 border-t border-gray-100 flex-shrink-0 flex gap-3">
                <Button
                  onPress={() => setShowDetailsModal(false)}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-all duration-300 cursor-pointer"
                >
                  Close
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>

      {/* ========== CONFIRMATION MODAL ========== */}
      <Modal isOpen={showConfirmModal} onClose={() => setShowConfirmModal(false)} size="md" className="max-w-md">
        <Modal.Backdrop>
          <Modal.Container>
            <Modal.Dialog className={`bg-white rounded-2xl border-2 ${confirmAction === "approve" ? "border-emerald-100/50" : "border-rose-100/50"} shadow-2xl`}>
              <Modal.Header className="px-6 pt-6 pb-4 border-b border-gray-100">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${confirmAction === "approve" ? "bg-emerald-100" : "bg-rose-100"} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      {confirmAction === "approve" ? (
                        <CheckCircle className="w-5 h-5 text-emerald-600" strokeWidth={2} />
                      ) : (
                        <XCircle className="w-5 h-5 text-rose-600" strokeWidth={2} />
                      )}
                    </div>
                    <div>
                      <Modal.Heading className="text-lg font-bold text-gray-900">
                        {confirmAction === "approve" ? "Approve Booking" : "Reject Booking"}
                      </Modal.Heading>
                      <p className="text-sm text-gray-500">Confirm your action</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowConfirmModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5 text-gray-400" strokeWidth={2} />
                  </button>
                </div>
              </Modal.Header>

              <Modal.Body className="px-6 py-6">
                <div className="space-y-4">
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {confirmMessage}
                  </p>
                  
                  {confirmAction === "approve" && (
                    <div className="bg-emerald-50/50 rounded-xl p-3 border border-emerald-200/50">
                      <p className="text-xs text-emerald-700 flex items-center gap-2">
                        <UserCheck className="w-4 h-4" strokeWidth={2} />
                        <span>This action will confirm the booking and make it official.</span>
                      </p>
                    </div>
                  )}
                  
                  {confirmAction === "reject" && (
                    <div className="bg-rose-50/50 rounded-xl p-3 border border-rose-200/50">
                      <p className="text-xs text-rose-700 flex items-center gap-2">
                        <UserX className="w-4 h-4" strokeWidth={2} />
                        <span>This action will decline the booking request.</span>
                      </p>
                    </div>
                  )}
                </div>
              </Modal.Body>

              <Modal.Footer className="px-6 pb-6 pt-4 border-t border-gray-100 flex gap-3">
                <Button
                  onPress={() => setShowConfirmModal(false)}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-all duration-300 cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  onPress={handleConfirm}
                  isDisabled={isProcessing}
                  className={`flex-1 py-3 ${
                    confirmAction === "approve" 
                      ? "bg-gradient-to-r from-emerald-500 to-emerald-600" 
                      : "bg-gradient-to-r from-rose-500 to-rose-600"
                  } text-white font-semibold rounded-xl shadow-[0_4px_14px_rgba(37,99,235,0.35)] hover:shadow-[0_8px_24px_rgba(37,99,235,0.45)] transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer`}
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      {confirmAction === "approve" ? (
                        <CheckCircle className="w-4 h-4" strokeWidth={2} />
                      ) : (
                        <XCircle className="w-4 h-4" strokeWidth={2} />
                      )}
                      <span>{confirmAction === "approve" ? "Approve" : "Reject"}</span>
                    </>
                  )}
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </div>
  );
}