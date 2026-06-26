// src/app/(dashboard)/dashboard/tenant/TenantDashboardClient.jsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  CalendarCheck,
  Heart,
  TrendingUp,
  TrendingDown,
  Bed,
  Bath,
  MapPin,
  Trash2,
  Eye,
  Search,
  Home,
  DollarSign,
  CheckCircle,
  XCircle,
  ArrowRight,
  Sparkles,
  Clock,
  AlertCircle,
  Star,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
  ComposedChart,
} from "recharts";
import { toast } from "react-toastify";
import { removeWishlist } from "@/lib/action/wishlist";

// ==================== TENANT DASHBOARD CLIENT ====================
export default function TenantDashboardClient({
  bookings = [],
  favoriteProperties = [],
  transactions = [],
  stats = {},
  chartData = {},
  userId,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [chartType, setChartType] = useState("bar");
  const [favorites, setFavorites] = useState(favoriteProperties);
  const [removingId, setRemovingId] = useState(null);

  // ========== FILTERED BOOKINGS ==========
  const filteredBookings = bookings.filter((booking) => {
    const propertyTitle = booking.title || "";
    const propertyLocation = booking.location || "";
    const matchesSearch = propertyTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      propertyLocation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || booking.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // ========== GET COLOR STYLES ==========
  const getColorStyles = (color) => {
    const colors = {
      blue: { bg: "bg-blue-50", iconBg: "bg-blue-100", icon: "text-blue-600", border: "border-blue-200/60" },
      rose: { bg: "bg-rose-50", iconBg: "bg-rose-100", icon: "text-rose-600", border: "border-rose-200/60" },
      emerald: { bg: "bg-emerald-50", iconBg: "bg-emerald-100", icon: "text-emerald-600", border: "border-emerald-200/60" },
      purple: { bg: "bg-purple-50", iconBg: "bg-purple-100", icon: "text-purple-600", border: "border-purple-200/60" },
      amber: { bg: "bg-amber-50", iconBg: "bg-amber-100", icon: "text-amber-600", border: "border-amber-200/60" },
    };
    return colors[color] || colors.blue;
  };

  // ========== GET STATUS BADGE ==========
  const getStatusBadge = (status) => {
    const statusMap = {
      approved: { label: "Approved", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
      completed: { label: "Completed", className: "bg-blue-50 text-blue-700 border-blue-200" },
      pending: { label: "Pending", className: "bg-amber-50 text-amber-700 border-amber-200" },
      rejected: { label: "Rejected", className: "bg-rose-50 text-rose-700 border-rose-200" },
      cancelled: { label: "Cancelled", className: "bg-gray-50 text-gray-700 border-gray-200" },
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

  // ========== HANDLE REMOVE FAVORITE ==========
  const handleRemoveFavorite = async (propertyId) => {
    setRemovingId(propertyId);
    try {
      await removeWishlist(propertyId, userId);
      setFavorites((prev) => prev.filter((p) => p._id !== propertyId));
      toast.success("Removed from wishlist!");
    } catch (error) {
      toast.error("Failed to remove from favorites");
    } finally {
      setRemovingId(null);
    }
  };

  // ========== RENDER STARS ==========
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const stars = [];
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="w-3 h-3 fill-yellow-400 text-yellow-400" />);
    }
    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star className="w-3 h-3 text-yellow-400" />
          <div className="absolute inset-0 w-1/2 overflow-hidden">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          </div>
        </div>
      );
    }
    return stars;
  };

  // ========== STATS CARDS ==========
  const statsCards = [
    {
      title: "Total Bookings",
      value: stats.totalBookings || 0,
      icon: CalendarCheck,
      color: "blue",
      change: `${stats.pendingBookings || 0} pending`,
      trend: stats.pendingBookings > 0 ? "up" : "neutral",
    },
    {
      title: "Favorites",
      value: stats.totalFavorites || 0,
      icon: Heart,
      color: "rose",
      change: "Saved properties",
      trend: "up",
    },
    {
      title: "Total Spent",
      value: formatPrice(stats.totalSpent || 0),
      icon: DollarSign,
      color: "emerald",
      change: "Lifetime spending",
      trend: "up",
    },
    {
      title: "Active Bookings",
      value: stats.activeBookings || 0,
      icon: Home,
      color: "purple",
      change: "Currently active",
      trend: "up",
    },
  ];

  // ========== CUSTOM TOOLTIP ==========
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100">
          <p className="text-sm font-semibold text-gray-900">{label}</p>
          <p className="text-sm text-blue-600">
            Bookings: {payload[0]?.value || 0}
          </p>
          {payload[1] && (
            <p className="text-sm text-emerald-600">
              Amount: {formatPrice(payload[1]?.value || 0)}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  // ========== PIE CHART COLORS ==========
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
            Tenant <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-700">Dashboard</span>
          </h1>
          <p className="text-gray-500 mt-1">Welcome back! Here's an overview of your activity.</p>
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
                  <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${stat.trend === "up" ? "text-emerald-600" :
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

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Bookings Chart - Last 7 Days */}
        <div className="bg-white rounded-2xl p-6 border-2 border-blue-100/50 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_40px_rgba(37,99,235,0.06)] transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Weekly Bookings</h3>
              <p className="text-sm text-gray-500">Last 7 days activity</p>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => setChartType("bar")}
                className={`cursor-pointer px-3 py-1 text-xs font-medium rounded-lg transition-all ${chartType === "bar"
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
              >
                Bar
              </button>
              <button
                onClick={() => setChartType("area")}
                className={`cursor-pointer px-3 py-1 text-xs font-medium rounded-lg transition-all ${chartType === "area"
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
              >
                Area
              </button>
              <button
                onClick={() => setChartType("line")}
                className={`cursor-pointer px-3 py-1 text-xs font-medium rounded-lg transition-all ${chartType === "line"
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
              >
                Line
              </button>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === "bar" ? (
                <ComposedChart data={chartData.last7Days || []}>
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                      <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.8} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="bookings" fill="url(#barGradient)" radius={[4, 4, 0, 0]} />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ fill: '#10b981', r: 3 }}
                  />
                </ComposedChart>
              ) : chartType === "area" ? (
                <AreaChart data={chartData.last7Days || []}>
                  <defs>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="bookings"
                    stroke="#3b82f6"
                    strokeWidth={2.5}
                    fill="url(#areaGradient)"
                    dot={{ fill: '#3b82f6', r: 4 }}
                  />
                </AreaChart>
              ) : (
                <LineChart data={chartData.last7Days || []}>
                  <defs>
                    <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#60a5fa" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="bookings"
                    stroke="url(#lineGradient)"
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-3 pt-3 border-t border-gray-100">
            <span>Total: {chartData.last7Days?.reduce((sum, d) => sum + d.bookings, 0) || 0} bookings</span>
            <span>Avg: {Math.round((chartData.last7Days?.reduce((sum, d) => sum + d.bookings, 0) || 0) / 7)} / day</span>
            <span>Last 7 days</span>
          </div>
        </div>

        {/* Monthly Trend Chart */}
        <div className="bg-white rounded-2xl p-6 border-2 border-blue-100/50 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_40px_rgba(37,99,235,0.06)] transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Monthly Trend</h3>
              <p className="text-sm text-gray-500">Last 6 months</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.monthlyData || []}>
                <defs>
                  <linearGradient id="monthlyGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={1} />
                    <stop offset="100%" stopColor="#a78bfa" stopOpacity={0.8} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="bookings" fill="url(#monthlyGradient)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-3 pt-3 border-t border-gray-100">
            <span>Total: {chartData.monthlyData?.reduce((sum, d) => sum + d.bookings, 0) || 0} bookings</span>
            <span>Last 6 months</span>
          </div>
        </div>
      </div>

      {/* Status Distribution & Spending Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Booking Status Distribution */}
        <div className="bg-white rounded-2xl p-6 border-2 border-blue-100/50 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_40px_rgba(37,99,235,0.06)] transition-all duration-300">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-900">Booking Status</h3>
            <p className="text-sm text-gray-500">Distribution of your bookings</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData.statusData || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {(chartData.statusData || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value} bookings`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Spending Overview */}
        <div className="bg-white rounded-2xl p-6 border-2 border-blue-100/50 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_40px_rgba(37,99,235,0.06)] transition-all duration-300">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-900">Spending Overview</h3>
            <p className="text-sm text-gray-500">Monthly spending trend</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData.monthlyData || []}>
                <defs>
                  <linearGradient id="spendingGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <Tooltip formatter={(value) => formatPrice(value)} />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fill="url(#spendingGradient)"
                  dot={{ fill: '#10b981', r: 4 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* My Bookings Table */}
      <div className="bg-white rounded-2xl p-6 border-2 border-blue-100/50 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_40px_rgba(37,99,235,0.06)] transition-all duration-300 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">My Bookings</h3>
            <p className="text-sm text-gray-500">View and manage your booking history</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/properties"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
            >
              Browse more
              <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
            </Link>
            {/* <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" strokeWidth={2} />
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-sm w-full sm:w-40"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-sm"
            >
              <option value="all">All Status</option>
              <option value="approved">Approved</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
              <option value="cancelled">Cancelled</option>
            </select> */}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Property</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Date</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Status</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => {
                const statusBadge = getStatusBadge(booking.status);
                const paymentBadge = getPaymentBadge(booking._id);
                return (
                  <tr key={booking._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                          {booking.mainImage ? (
                            <Image src={booking.mainImage} alt={booking.title} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <Home className="w-5 h-5" strokeWidth={2} />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{booking.title || "Property"}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <MapPin className="w-3 h-3" strokeWidth={2} />
                            {booking.location || "N/A"}
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
                    <td className="py-3 px-4 hidden sm:table-cell">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${statusBadge.className}`}>
                        {statusBadge.label}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${paymentBadge.className}`}>
                        {paymentBadge.label}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Link
                        href={`/properties/${booking.propertyId}`}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all inline-block"
                      >
                        <Eye className="w-4 h-4" strokeWidth={2} />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filteredBookings.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No bookings found. Start exploring properties!
          </div>
        )}
      </div>

      {/* Favorites Section */}
      <div className="bg-white rounded-2xl p-6 border-2 border-blue-100/50 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_40px_rgba(37,99,235,0.06)] transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Favorites</h3>
            <p className="text-sm text-gray-500">Properties you've saved for later</p>
          </div>
          <Link
            href="/properties"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
          >
            Browse more
            <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Property</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Location</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Details</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody>
              {favorites.map((favorite) => (
                <tr key={favorite._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                        {favorite.mainImage ? (
                          <Image src={favorite.mainImage} alt={favorite.title} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <Home className="w-5 h-5" strokeWidth={2} />
                          </div>
                        )}
                      </div>
                      <p className="font-medium text-gray-900 text-sm">{favorite.title}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" strokeWidth={2} />
                      {favorite.location}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm font-semibold text-gray-900">{formatPrice(favorite.price)}</td>
                  <td className="py-3 px-4 hidden sm:table-cell">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span className="flex items-center gap-0.5"><Bed className="w-3 h-3" />{favorite.bedrooms || 0}</span>
                      <span className="flex items-center gap-0.5"><Bath className="w-3 h-3" />{favorite.bathrooms || 0}</span>
                      <span className="flex items-center gap-0.5">{favorite.propertySize || 0} sqft</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleRemoveFavorite(favorite._id)}
                      disabled={removingId === favorite._id}
                      className={`p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer ${removingId === favorite._id ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    >
                      {removingId === favorite._id ? (
                        <div className="w-4 h-4 border-2 border-rose-600 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" strokeWidth={2} />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {favorites.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No favorites yet. Start saving properties you love!
          </div>
        )}
      </div>
    </div>
  );
}