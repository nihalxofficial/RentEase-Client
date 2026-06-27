// src/app/(dashboard)/dashboard/owner/OwnerDashboardClient.jsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  DollarSign,
  Building2,
  CalendarCheck,
  TrendingUp,
  TrendingDown,
  Home,
  Bed,
  Bath,
  MapPin,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Sparkles,
  ArrowRight,
  PlusCircle,
  Users,
  PieChart as PieChartIcon,
  BarChart3,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
  ComposedChart,
} from "recharts";
import { toast } from "react-toastify";

// ==================== OWNER DASHBOARD CLIENT ====================
export default function OwnerDashboardClient({ 
  stats = {},
  chartData = {},
  properties = [],
  bookings = [],
  userId 
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [chartType, setChartType] = useState("area");

  // ========== FILTERED PROPERTIES ==========
  const filteredProperties = properties.filter((property) => {
    const matchesSearch = property.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || property.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // ========== STATS CARDS ==========
  const statsCards = [
    {
      title: "Total Earnings",
      value: `$${stats.totalEarnings?.toLocaleString() || 0}`,
      icon: DollarSign,
      color: "blue",
      change: "Lifetime earnings",
      trend: "up",
    },
    {
      title: "Total Properties",
      value: stats.totalProperties || 0,
      icon: Building2,
      color: "emerald",
      change: "Listed properties",
      trend: "up",
    },
    {
      title: "Total Bookings",
      value: stats.totalBookings || 0,
      icon: CalendarCheck,
      color: "purple",
      change: "Confirmed bookings",
      trend: "up",
    },
    {
      title: "Pending Requests",
      value: stats.pendingBookings || 0,
      icon: Users,
      color: "amber",
      change: `${stats.pendingBookings || 0} awaiting action`,
      trend: stats.pendingBookings > 0 ? "up" : "down",
    },
  ];

  // ========== GET COLOR STYLES ==========
  const getColorStyles = (color) => {
    const colors = {
      blue: { bg: "bg-blue-50", iconBg: "bg-blue-100", icon: "text-blue-600", border: "border-blue-200/60" },
      emerald: { bg: "bg-emerald-50", iconBg: "bg-emerald-100", icon: "text-emerald-600", border: "border-emerald-200/60" },
      purple: { bg: "bg-purple-50", iconBg: "bg-purple-100", icon: "text-purple-600", border: "border-purple-200/60" },
      amber: { bg: "bg-amber-50", iconBg: "bg-amber-100", icon: "text-amber-600", border: "border-amber-200/60" },
      rose: { bg: "bg-rose-50", iconBg: "bg-rose-100", icon: "text-rose-600", border: "border-rose-200/60" },
    };
    return colors[color] || colors.blue;
  };

  // ========== GET STATUS BADGE ==========
  const getStatusBadge = (status) => {
    const statusMap = {
      approved: { label: "Approved", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
      pending: { label: "Pending", className: "bg-amber-50 text-amber-700 border-amber-200" },
      rejected: { label: "Rejected", className: "bg-rose-50 text-rose-700 border-rose-200" },
    };
    return statusMap[status] || statusMap.pending;
  };

  // ========== CUSTOM TOOLTIP ==========
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100">
          <p className="text-sm font-semibold text-gray-900">{label}</p>
          <p className="text-sm text-blue-600">
            Earnings: ${payload[0]?.value?.toLocaleString() || 0}
          </p>
          {payload[1] && (
            <p className="text-sm text-emerald-600">
              Bookings: {payload[1]?.value || 0}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  // ========== PIE CHART COLORS ==========
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

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

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
            Owner <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-700">Dashboard</span>
          </h1>
          <p className="text-gray-500 mt-1">Welcome back! Here's what's happening with your properties.</p>
        </div>
        <Link
          href="/dashboard/owner/add-property"
          className="mt-4 md:mt-0 inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl shadow-[0_4px_14px_rgba(37,99,235,0.3)] hover:shadow-[0_8px_24px_rgba(37,99,235,0.4)] transition-all duration-200 hover:-translate-y-0.5"
        >
          <PlusCircle className="w-4 h-4" strokeWidth={2.2} />
          <span>Add Property</span>
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
                  <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${stat.trend === "up" ? "text-emerald-600" : "text-rose-600"}`}>
                    {stat.trend === "up" ? (
                      <TrendingUp className="w-3 h-3" strokeWidth={2.5} />
                    ) : (
                      <TrendingDown className="w-3 h-3" strokeWidth={2.5} />
                    )}
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

      {/* Charts Grid - Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Monthly Earnings Chart */}
        <div className="bg-white rounded-2xl p-6 border-2 border-blue-100/50 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_40px_rgba(37,99,235,0.06)] transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Monthly Earnings</h3>
              <p className="text-sm text-gray-500">Last 12 months</p>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => setChartType("area")}
                className={`cursor-pointer px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                  chartType === "area"
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Area
              </button>
              <button
                onClick={() => setChartType("bar")}
                className={`cursor-pointer px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                  chartType === "bar"
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Bar
              </button>
              <button
                onClick={() => setChartType("composed")}
                className={`cursor-pointer px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                  chartType === "composed"
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Composed
              </button>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === "area" ? (
                <AreaChart data={chartData.monthlyData || []}>
                  <defs>
                    <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="earnings"
                    stroke="#3b82f6"
                    strokeWidth={2.5}
                    fill="url(#earningsGradient)"
                    dot={{ fill: '#3b82f6', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </AreaChart>
              ) : chartType === "bar" ? (
                <BarChart data={chartData.monthlyData || []}>
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                      <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.8} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="earnings" fill="url(#barGradient)" radius={[4, 4, 0, 0]} />
                </BarChart>
              ) : (
                <ComposedChart data={chartData.monthlyData || []}>
                  <defs>
                    <linearGradient id="composedGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="earnings"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    fill="url(#composedGradient)"
                  />
                  <Bar dataKey="earnings" fill="#a78bfa" radius={[4, 4, 0, 0]} opacity={0.3} />
                </ComposedChart>
              )}
            </ResponsiveContainer>
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-3 pt-3 border-t border-gray-100">
            <span>Total: ${chartData.monthlyData?.reduce((sum, d) => sum + d.earnings, 0)?.toLocaleString() || 0}</span>
            <span>Last 12 months</span>
          </div>
        </div>

        {/* Booking Status Distribution - Pie Chart */}
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
      </div>

      {/* Charts Grid - Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Property Type Distribution */}
        <div className="bg-white rounded-2xl p-6 border-2 border-blue-100/50 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_40px_rgba(37,99,235,0.06)] transition-all duration-300">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-900">Property Types</h3>
            <p className="text-sm text-gray-500">Distribution of your properties</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData.propertyTypeData || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {(chartData.propertyTypeData || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value} properties`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Bookings Trend */}
        <div className="bg-white rounded-2xl p-6 border-2 border-blue-100/50 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_40px_rgba(37,99,235,0.06)] transition-all duration-300">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-900">Monthly Bookings Trend</h3>
            <p className="text-sm text-gray-500">Last 12 months</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.monthlyBookingsData || []}>
                <defs>
                  <linearGradient id="bookingsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                    <stop offset="100%" stopColor="#34d399" stopOpacity={0.8} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="bookings" fill="url(#bookingsGradient)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-3 pt-3 border-t border-gray-100">
            <span>Total: {chartData.monthlyBookingsData?.reduce((sum, d) => sum + d.bookings, 0) || 0} bookings</span>
            <span>Last 12 months</span>
          </div>
        </div>
      </div>

      {/* My Properties Section */}
      <div className="bg-white rounded-2xl p-6 border-2 border-blue-100/50 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_40px_rgba(37,99,235,0.06)] transition-all duration-300 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">My Properties</h3>
            <p className="text-sm text-gray-500">Manage your property listings</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" strokeWidth={2} />
              <input
                type="text"
                placeholder="Search properties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-sm w-full sm:w-48"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-sm"
            >
              <option value="all">All Status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Property</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Location</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Status</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProperties.map((property) => {
                const statusBadge = getStatusBadge(property.status);
                return (
                  <tr key={property._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                          {property.mainImage ? (
                            <Image
                              src={property.mainImage}
                              alt={property.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <Home className="w-5 h-5" strokeWidth={2} />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{property.title}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <span className="flex items-center gap-0.5"><Bed className="w-3 h-3" />{property.bedrooms || 0}</span>
                            <span className="flex items-center gap-0.5"><Bath className="w-3 h-3" />{property.bathrooms || 0}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500 hidden md:table-cell">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" strokeWidth={2} />
                        {property.location}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm font-semibold text-gray-900">${property.price}</td>
                    <td className="py-3 px-4 hidden sm:table-cell">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${statusBadge.className}`}>
                        {statusBadge.label}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <Link
                          href={`/properties/${property._id}`}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all cursor-pointer"
                        >
                          <Eye className="w-4 h-4" strokeWidth={2} />
                        </Link>
                        <Link
                          href={`/dashboard/owner/properties/${property._id}/edit`}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all cursor-pointer"
                        >
                          <Edit className="w-4 h-4" strokeWidth={2} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filteredProperties.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No properties found. Add your first property!
          </div>
        )}
        {properties.length > 0 && (
          <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
            <span>Showing {filteredProperties.length} of {properties.length} properties</span>
          </div>
        )}
      </div>
    </div>
  );
}