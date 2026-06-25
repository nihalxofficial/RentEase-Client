"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Building2,
  Users,
  LogOut,
  Edit2,
  CheckCircle,
  Camera,
  Package,
  BadgeCheck,
  ArrowRight,
  Clock,
} from "lucide-react";
import { toast } from "react-toastify";

// ==================== PROFILE CLIENT ====================
export default function ProfileClient({ user }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    location: user?.location || "",
    bio: user?.bio || "",
  });

  const getRoleIcon = (role) => {
    const icons = {
      owner: <Building2 className="w-4 h-4" />,
      tenant: <Users className="w-4 h-4" />,
      admin: <Shield className="w-4 h-4" />,
    };
    return icons[role] || <User className="w-4 h-4" />;
  };

  const getRoleColor = (role) => {
    const colors = {
      owner: "bg-blue-100 text-blue-700 border-blue-200",
      tenant: "bg-emerald-100 text-emerald-700 border-emerald-200",
      admin: "bg-purple-100 text-purple-700 border-purple-200",
    };
    return colors[role] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  const getRoleLabel = (role) => {
    const labels = {
      owner: "Property Owner",
      tenant: "Tenant",
      admin: "Administrator",
    };
    return labels[role] || role;
  };

  const getPlanColor = (plan) => {
    const colors = {
      free: "bg-gray-100 text-gray-600 border-gray-200",
      premium: "bg-amber-100 text-amber-700 border-amber-200",
      pro: "bg-purple-100 text-purple-700 border-purple-200",
      enterprise: "bg-blue-100 text-blue-700 border-blue-200",
    };
    return colors[plan] || colors.free;
  };

  const getStatusColor = (status) => {
    const colors = {
      active: "bg-emerald-100 text-emerald-700 border-emerald-200",
      inactive: "bg-gray-100 text-gray-600 border-gray-200",
      suspended: "bg-rose-100 text-rose-700 border-rose-200",
      pending: "bg-amber-100 text-amber-700 border-amber-200",
    };
    return colors[status] || colors.active;
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile");
      console.error("Error saving profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    // Logout logic
    router.push("/auth/logout");
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50/50 via-white to-white">
        <div className="text-center">
          <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <User className="w-10 h-10 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">User Not Found</h2>
          <p className="text-gray-500">Unable to load profile data.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/50 via-white to-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-12 bg-gradient-to-b from-blue-50/50 via-white to-white overflow-hidden">
        <div className="absolute top-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50/80 backdrop-blur-sm rounded-full border border-blue-100/50 mb-4">
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span className="text-blue-600 font-semibold text-xs uppercase tracking-widest">
                Profile
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-2">
              My <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-700">Profile</span>
            </h1>
            <p className="text-gray-500 mt-3 text-sm">
              View and manage your account information
            </p>
          </div>
        </div>
      </section>

      {/* Profile Content */}
      <section className="py-8 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-3xl border-2 border-blue-100/50 shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden"
          >
            {/* Profile Header */}
            <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 px-6 py-8 md:px-8 md:py-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
              
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                {/* Avatar */}
                <div className="relative w-28 h-28 rounded-2xl overflow-hidden border-4 border-white/30 shadow-xl flex-shrink-0">
                  <Image
                    src={user.image || "https://static.vecteezy.com/system/resources/thumbnails/068/072/141/small_2x/flat-avatar-of-young-man-with-short-brown-hair-and-casual-outfit-ideal-for-profile-icons-web-avatars-male-characters-app-design-and-branding-illustrations-free-vector.jpg"}
                    alt={user.name}
                    fill
                    className="object-cover"
                  />
                  <button className="absolute bottom-2 right-2 p-1.5 bg-white/90 rounded-full hover:bg-white transition-colors shadow-lg">
                    <Camera className="w-3.5 h-3.5 text-blue-600" strokeWidth={2} />
                  </button>
                </div>

                {/* User Info */}
                <div className="text-center md:text-left flex-1">
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
                    <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border border-white/30 bg-white/10 text-white`}>
                      {getRoleIcon(user.role)}
                      {getRoleLabel(user.role)}
                    </span>
                  </div>
                  <p className="text-blue-100/80 text-sm mt-1">{user.email}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-2 justify-center md:justify-start">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border border-white/30 bg-white/10 text-white`}>
                      <Package className="w-3 h-3" strokeWidth={2} />
                      {user.plan || "Free"} Plan
                    </span>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border border-white/30 bg-white/10 text-white`}>
                      <BadgeCheck className="w-3 h-3" strokeWidth={2} />
                      {user.status || "Active"}
                    </span>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border border-white/30 bg-white/10 text-white`}>
                      <Clock className="w-3 h-3" strokeWidth={2} />
                      Joined {formatDate(user.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Edit Button */}
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center cursor-pointer gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white font-medium rounded-xl border border-white/30 hover:bg-white/30 transition-all duration-300 hover:-translate-y-0.5"
                >
                  <Edit2 className="w-4 h-4" strokeWidth={2} />
                  <span className="text-sm">{isEditing ? "Cancel" : "Edit Profile"}</span>
                </button>
              </div>
            </div>

            {/* Profile Details */}
            <div className="p-6 md:p-8">
              {isEditing ? (
                // Edit Mode
                <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-gray-50/80 border-2 border-blue-100/50 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-gray-800 placeholder:text-gray-400 shadow-sm hover:border-blue-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-gray-50/80 border-2 border-blue-100/50 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-gray-800 placeholder:text-gray-400 shadow-sm hover:border-blue-300"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+1 (555) 123-4567"
                        className="w-full px-4 py-3 bg-gray-50/80 border-2 border-blue-100/50 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-gray-800 placeholder:text-gray-400 shadow-sm hover:border-blue-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Location
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="City, Country"
                        className="w-full px-4 py-3 bg-gray-50/80 border-2 border-blue-100/50 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-gray-800 placeholder:text-gray-400 shadow-sm hover:border-blue-300"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows="3"
                      placeholder="Tell us about yourself..."
                      className="w-full px-4 py-3 bg-gray-50/80 border-2 border-blue-100/50 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-gray-800 placeholder:text-gray-400 shadow-sm hover:border-blue-300 resize-none"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="px-6 py-3 cursor-pointer bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl shadow-[0_4px_14px_rgba(37,99,235,0.35)] hover:shadow-[0_8px_24px_rgba(37,99,235,0.45)] transition-all duration-300 hover:-translate-y-1 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isSaving ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4" strokeWidth={2} />
                          <span>Save Changes</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-3 cursor-pointer bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-300"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                // View Mode
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-start gap-4 p-4 bg-gray-50/80 rounded-xl border border-gray-100/50">
                      <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-blue-600" strokeWidth={2} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-medium">Full Name</p>
                        <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 bg-gray-50/80 rounded-xl border border-gray-100/50">
                      <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Mail className="w-5 h-5 text-blue-600" strokeWidth={2} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-medium">Email Address</p>
                        <p className="text-sm font-semibold text-gray-900">{user.email}</p>
                        {user.emailVerified ? (
                          <span className="inline-flex items-center gap-1 text-xs text-emerald-600">
                            <CheckCircle className="w-3 h-3" strokeWidth={2} />
                            Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs text-amber-600">
                            <Clock className="w-3 h-3" strokeWidth={2} />
                            Not Verified
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 bg-gray-50/80 rounded-xl border border-gray-100/50">
                      <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Phone className="w-5 h-5 text-blue-600" strokeWidth={2} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-medium">Phone Number</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {user.phone || "Not provided"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 bg-gray-50/80 rounded-xl border border-gray-100/50">
                      <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-blue-600" strokeWidth={2} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-medium">Location</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {user.location || "Not provided"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  {user.bio && (
                    <div className="p-4 bg-gray-50/80 rounded-xl border border-gray-100/50">
                      <p className="text-xs text-gray-400 font-medium mb-1">Bio</p>
                      <p className="text-sm text-gray-700">{user.bio}</p>
                    </div>
                  )}

                  {/* Account Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                    <div className="text-center p-3 bg-gray-50/80 rounded-xl border border-gray-100/50">
                      <p className="text-xs text-gray-400 font-medium">Role</p>
                      <p className="text-sm font-semibold text-gray-900 flex items-center justify-center gap-1">
                        {getRoleIcon(user.role)}
                        {getRoleLabel(user.role)}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-gray-50/80 rounded-xl border border-gray-100/50">
                      <p className="text-xs text-gray-400 font-medium">Plan</p>
                      <p className="text-sm font-semibold text-gray-900 capitalize">{user.plan || "Free"}</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50/80 rounded-xl border border-gray-100/50">
                      <p className="text-xs text-gray-400 font-medium">Status</p>
                      <p className={`text-sm font-semibold capitalize ${user.status === 'active' ? 'text-emerald-600' : 'text-gray-600'}`}>
                        {user.status || "Active"}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-gray-50/80 rounded-xl border border-gray-100/50">
                      <p className="text-xs text-gray-400 font-medium">Joined</p>
                      <p className="text-sm font-semibold text-gray-900">{formatDate(user.createdAt)}</p>
                    </div>
                  </div>

                  {/* Logout Button */}
                  <div className="pt-4 border-t border-gray-100">
                    <button
                      onClick={handleLogout}
                      className="flex items-center cursor-pointer gap-2 px-4 py-2.5 bg-rose-50 text-rose-600 font-medium rounded-xl hover:bg-rose-100 transition-all duration-300"
                    >
                      <LogOut className="w-4 h-4" strokeWidth={2} />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}