"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Home,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  MapPin,
  Bed,
  Bath,
  Ruler,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Sparkles,
  Building2,
  Warehouse,
  Trees,
  TrendingUp,
  TrendingDown,
  Info,
  X,
  Save,
  Upload,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  Modal,
  Button,
  Input,
  TextArea,
  Select,
  ListBox,
  Label,
} from "@heroui/react";
import { updateProperty, deleteProperty } from "@/lib/action/properties";

// ==================== OWNER PROPERTIES CLIENT ====================
export default function OwnerPropertiesClient({ properties: initialProperties = [], total = 0, userId }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [properties, setProperties] = useState(initialProperties);
  const [deletingId, setDeletingId] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);

  // Edit Form State
  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
    location: "",
    propertyType: "",
    price: "",
    rentType: "",
    bedrooms: "",
    bathrooms: "",
    propertySize: "",
    extraFeatures: "",
    amenities: [],
    status: "",
    mainImage: "",
    images: [],
  });

  // Property Types
  const propertyTypes = [
    { id: "apartment", label: "Apartment" },
    { id: "house", label: "House" },
    { id: "villa", label: "Villa" },
    { id: "studio", label: "Studio" },
    { id: "condo", label: "Condo" },
    { id: "townhouse", label: "Townhouse" },
  ];

  const rentTypes = [
    { id: "monthly", label: "Monthly" },
    { id: "weekly", label: "Weekly" },
    { id: "daily", label: "Daily" },
  ];

  const statusOptions = [
    { id: "all", label: "All Status" },
    { id: "pending", label: "Pending" },
    { id: "approved", label: "Approved" },
    { id: "rejected", label: "Rejected" },
  ];

  const amenityOptions = [
    { id: "wifi", label: "WiFi" },
    { id: "parking", label: "Parking" },
    { id: "gym", label: "Gym" },
    { id: "pool", label: "Pool" },
    { id: "kitchen", label: "Kitchen" },
    { id: "ac", label: "Air Conditioning" },
    { id: "heating", label: "Heating" },
    { id: "tv", label: "Smart TV" },
    { id: "security", label: "Security" },
    { id: "garden", label: "Garden" },
    { id: "pets", label: "Pet Friendly" },
    { id: "bike", label: "Bike Storage" },
    { id: "coffee", label: "Coffee Bar" },
    { id: "zap", label: "Fast Charging" },
  ];

  // ========== FILTERED PROPERTIES ==========
  const filteredProperties = properties.filter((property) => {
    const matchesSearch = property.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || property.status === filterStatus;
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

  // ========== GET PROPERTY TYPE ICON ==========
  const getPropertyTypeIcon = (type) => {
    const icons = {
      apartment: Building2,
      house: Home,
      villa: Warehouse,
      studio: Building2,
      condo: Home,
      townhouse: Trees,
    };
    return icons[type] || Building2;
  };

  // ========== HANDLE DELETE ==========
  const handleDelete = async (propertyId) => {
    setDeletingId(propertyId);
    try {
      await deleteProperty(propertyId);
      setProperties((prev) => prev.filter((p) => p._id !== propertyId));
      toast.success("Property deleted successfully!");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error?.message || "Failed to delete property");
    } finally {
      setDeletingId(null);
    }
  };

  // ========== HANDLE VIEW REJECTION REASON ==========
  const handleViewRejection = (property) => {
    setSelectedProperty(property);
    setShowRejectionModal(true);
  };

  // ========== HANDLE EDIT ==========
  const handleEdit = (property) => {
    setSelectedProperty(property);
    setEditFormData({
      title: property.title || "",
      description: property.description || "",
      location: property.location || "",
      propertyType: property.propertyType || "",
      price: property.price || "",
      rentType: property.rentType || "monthly",
      bedrooms: property.bedrooms || "",
      bathrooms: property.bathrooms || "",
      propertySize: property.propertySize || "",
      extraFeatures: property.extraFeatures || "",
      amenities: property.amenities || [],
      status: property.status || "pending",
      mainImage: property.mainImage || "",
      images: property.images || [],
    });
    setShowEditModal(true);
  };

  // ========== HANDLE EDIT FORM CHANGE ==========
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ========== HANDLE AMENITY TOGGLE ==========
  const handleAmenityToggle = (amenityId) => {
    setEditFormData((prev) => {
      const amenities = prev.amenities.includes(amenityId)
        ? prev.amenities.filter((a) => a !== amenityId)
        : [...prev.amenities, amenityId];
      return { ...prev, amenities };
    });
  };

  // ========== HANDLE IMAGE UPLOAD ==========
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditFormData((prev) => ({
          ...prev,
          mainImage: reader.result,
        }));
        toast.success("Image uploaded successfully!");
      };
      reader.readAsDataURL(file);
    }
  };

  // ========== HANDLE EDIT SUBMIT ==========
  const handleEditSubmit = async () => {
    setIsEditing(true);
    try {
      const updateData = {
        title: editFormData.title,
        description: editFormData.description,
        location: editFormData.location,
        propertyType: editFormData.propertyType,
        price: parseFloat(editFormData.price),
        rentType: editFormData.rentType,
        bedrooms: parseInt(editFormData.bedrooms),
        bathrooms: parseInt(editFormData.bathrooms),
        propertySize: parseInt(editFormData.propertySize),
        extraFeatures: editFormData.extraFeatures,
        amenities: editFormData.amenities,
        status: editFormData.status,
        mainImage: editFormData.mainImage,
        images: editFormData.images,
      };

      await updateProperty(selectedProperty._id, updateData);
      
      setProperties((prev) =>
        prev.map((p) =>
          p._id === selectedProperty._id
            ? { ...p, ...updateData }
            : p
        )
      );
      
      toast.success("Property updated successfully!");
      setShowEditModal(false);
      setIsEditing(false);
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error?.message || "Failed to update property");
      setIsEditing(false);
    }
  };

  // ========== HANDLE CLOSE EDIT MODAL ==========
  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setIsEditing(false);
  };

  // ========== HANDLE CLOSE REJECTION MODAL ==========
  const handleCloseRejectionModal = () => {
    setShowRejectionModal(false);
    setSelectedProperty(null);
  };

  // ========== STATS ==========
  const stats = {
    total: properties.length,
    pending: properties.filter(p => p.status === "pending").length,
    approved: properties.filter(p => p.status === "approved").length,
    rejected: properties.filter(p => p.status === "rejected").length,
    totalValue: properties.reduce((sum, p) => sum + (p.price || 0), 0),
  };

  // ========== STATS CARDS ==========
  const statsCards = [
    {
      title: "Total Properties",
      value: stats.total,
      icon: Home,
      color: "blue",
      change: `${stats.pending} pending`,
      trend: stats.pending > 0 ? "up" : "neutral",
    },
    {
      title: "Approved",
      value: stats.approved,
      icon: CheckCircle,
      color: "emerald",
      change: "Listed",
      trend: "up",
    },
    {
      title: "Pending",
      value: stats.pending,
      icon: Clock,
      color: "amber",
      change: "Awaiting review",
      trend: "neutral",
    },
    {
      title: "Total Value",
      value: formatPrice(stats.totalValue),
      icon: DollarSign,
      color: "purple",
      change: "Portfolio value",
      trend: "up",
    },
  ];

  // ========== GET COLOR STYLES ==========
  const getColorStyles = (color) => {
    const colors = {
      blue: { bg: "bg-blue-50", iconBg: "bg-blue-100", icon: "text-blue-600", border: "border-blue-200/60" },
      emerald: { bg: "bg-emerald-50", iconBg: "bg-emerald-100", icon: "text-emerald-600", border: "border-emerald-200/60" },
      amber: { bg: "bg-amber-50", iconBg: "bg-amber-100", icon: "text-amber-600", border: "border-amber-200/60" },
      purple: { bg: "bg-purple-50", iconBg: "bg-purple-100", icon: "text-purple-600", border: "border-purple-200/60" },
      rose: { bg: "bg-rose-50", iconBg: "bg-rose-100", icon: "text-rose-600", border: "border-rose-200/60" },
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
            My <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-700">Properties</span>
          </h1>
          <p className="text-gray-500 mt-1">Manage your property listings</p>
        </div>
        <Link
          href="/dashboard/owner/add-property"
          className="mt-4 md:mt-0 inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl shadow-[0_4px_14px_rgba(37,99,235,0.3)] hover:shadow-[0_8px_24px_rgba(37,99,235,0.4)] transition-all duration-200 hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4" strokeWidth={2.2} />
          <span>Add New Property</span>
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

      {/* Search & Filter - HeroUI Components */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex-1 max-w-md">
          <Input
            type="text"
            placeholder="Search properties..."
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

      {/* Properties Table */}
      <div className="bg-white rounded-2xl border-2 border-blue-100/50 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_40px_rgba(37,99,235,0.06)] transition-all duration-300 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Property</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Type</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Status</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Created</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProperties.map((property, index) => {
                const statusBadge = getStatusBadge(property.status);
                const TypeIcon = getPropertyTypeIcon(property.propertyType);

                return (
                  <motion.tr
                    key={property._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.03 }}
                    className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                          {property.mainImage ? (
                            <Image src={property.mainImage} alt={property.title} fill className="object-cover" />
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
                            {property.bedrooms}
                            <Bath className="w-3 h-3 ml-1" strokeWidth={2} />
                            {property.bathrooms}
                            <Ruler className="w-3 h-3 ml-1" strokeWidth={2} />
                            {property.propertySize} sqft
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      <div className="flex items-center gap-1.5 text-sm text-gray-600">
                        <TypeIcon className="w-4 h-4 text-blue-400" strokeWidth={2} />
                        <span className="capitalize">{property.propertyType}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm font-semibold text-gray-900">
                      {formatPrice(property.price)}
                      <span className="text-xs text-gray-400 ml-1">/{property.rentType}</span>
                    </td>
                    <td className="py-3 px-4 hidden sm:table-cell">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusBadge.className}`}>
                        {statusBadge.icon}
                        {statusBadge.label}
                      </span>
                      {property.status === "rejected" && (
                        <button
                          onClick={() => handleViewRejection(property)}
                          className="ml-1.5 p-1 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="View rejection reason"
                        >
                          <Info className="w-3.5 h-3.5" strokeWidth={2} />
                        </button>
                      )}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500 hidden lg:table-cell">
                      {formatDate(property.createdAt)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <Link
                          href={`/properties/${property._id}`}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all cursor-pointer"
                          title="View Property"
                        >
                          <Eye className="w-4 h-4" strokeWidth={2} />
                        </Link>
                        <button
                          onClick={() => handleEdit(property)}
                          className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all cursor-pointer"
                          title="Edit Property"
                        >
                          <Edit className="w-4 h-4" strokeWidth={2} />
                        </button>
                        <button
                          onClick={() => handleDelete(property._id)}
                          disabled={deletingId === property._id}
                          className={`p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer ${
                            deletingId === property._id ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                          title="Delete Property"
                        >
                          {deletingId === property._id ? (
                            <div className="w-4 h-4 border-2 border-rose-600 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" strokeWidth={2} />
                          )}
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredProperties.length === 0 && (
          <div className="text-center py-12 px-4">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Home className="w-8 h-8 text-gray-400" strokeWidth={2} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No properties found</h3>
            <p className="text-gray-500 text-sm">
              {searchTerm || filterStatus !== "all" 
                ? "Try adjusting your search or filter criteria" 
                : "You haven't added any properties yet. Start by adding your first property!"}
            </p>
            {!searchTerm && filterStatus === "all" && (
              <Link
                href="/dashboard/owner/add-property"
                className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
              >
                <Plus className="w-4 h-4" strokeWidth={2.5} />
                <span>Add New Property</span>
              </Link>
            )}
          </div>
        )}

        {/* Table Footer */}
        {filteredProperties.length > 0 && (
          <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
            <span>Showing {filteredProperties.length} of {properties.length} properties</span>
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

      {/* Rejection Reason Modal - HeroUI v3 Dialog */}
      <Modal isOpen={showRejectionModal} onClose={handleCloseRejectionModal} size="md" className="max-w-md">
        <Modal.Backdrop>
          <Modal.Container>
            <Modal.Dialog className="bg-white rounded-2xl border-2 border-rose-100/50 shadow-2xl">
              <Modal.Header className="px-6 pt-6 pb-4 border-b border-gray-100">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <AlertCircle className="w-5 h-5 text-rose-600" strokeWidth={2} />
                    </div>
                    <div>
                      <Modal.Heading className="text-lg font-bold text-gray-900">
                        Rejection Reason
                      </Modal.Heading>
                      <p className="text-sm text-gray-500">{selectedProperty?.title}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleCloseRejectionModal}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5 text-gray-400" strokeWidth={2} />
                  </button>
                </div>
              </Modal.Header>

              <Modal.Body className="px-6 py-6">
                <div className="bg-rose-50/50 rounded-xl p-4 border border-rose-200/50">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {selectedProperty?.rejectionReason || "No specific reason provided."}
                  </p>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-400 pt-2">
                  <span>Rejected on {formatDate(selectedProperty?.updatedAt)}</span>
                  <span className="inline-flex items-center gap-1 text-rose-600">
                    <XCircle className="w-3.5 h-3.5" strokeWidth={2} />
                    Rejected
                  </span>
                </div>
              </Modal.Body>

              <Modal.Footer className="px-6 pb-6 pt-4 border-t border-gray-100">
                <Button
                  onPress={handleCloseRejectionModal}
                  className="w-full py-2.5 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-all duration-300 cursor-pointer"
                >
                  Close
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>

      {/* Edit Modal - HeroUI v3 */}
      <Modal isOpen={showEditModal} onClose={handleCloseEditModal} size="lg" className="max-w-2xl">
        <Modal.Backdrop>
          <Modal.Container>
            <Modal.Dialog className="bg-white rounded-2xl border-2 border-blue-100/50 shadow-2xl max-h-[90vh] flex flex-col">
              <Modal.Header className="px-6 pt-6 pb-4 border-b border-gray-100 flex-shrink-0">
                <div className="flex items-center justify-between w-full">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Edit className="w-5 h-5 text-blue-600" strokeWidth={2} />
                      <Modal.Heading className="text-xl font-extrabold text-gray-900">
                        Edit Property
                      </Modal.Heading>
                    </div>
                    <p className="text-sm text-gray-500">Update your property details</p>
                  </div>
                  <button
                    onClick={handleCloseEditModal}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5 text-gray-400" strokeWidth={2} />
                  </button>
                </div>
              </Modal.Header>

              <Modal.Body className="px-6 py-6 overflow-y-auto flex-1">
                <div className="space-y-4">
                  {/* Image Upload */}
                  <div>
                    <Label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Property Image
                    </Label>
                    <div className="flex items-center gap-4">
                      <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-gray-100 border-2 border-blue-200/60 flex-shrink-0">
                        {editFormData.mainImage ? (
                          <Image src={editFormData.mainImage} alt="Property" fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <ImageIcon className="w-8 h-8" strokeWidth={1.5} />
                          </div>
                        )}
                      </div>
                      <div>
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleImageUpload}
                          accept="image/*"
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 font-medium rounded-xl border-2 border-blue-200/60 hover:bg-blue-100 transition-all duration-200 cursor-pointer"
                        >
                          <Upload className="w-4 h-4" strokeWidth={2} />
                          <span>Upload Image</span>
                        </button>
                        <p className="text-xs text-gray-400 mt-1">Recommended: 1200x800px</p>
                      </div>
                    </div>
                  </div>

                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Property Title *
                      </Label>
                      <Input
                        type="text"
                        name="title"
                        value={editFormData.title}
                        onChange={handleEditChange}
                        className="w-full"
                        classNames={{
                          input: "bg-transparent text-gray-800",
                          inputWrapper: "bg-white border-2 border-blue-200/60 rounded-xl focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all duration-200 shadow-sm hover:border-blue-300",
                        }}
                        required
                      />
                    </div>
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Location *
                      </Label>
                      <Input
                        type="text"
                        name="location"
                        value={editFormData.location}
                        onChange={handleEditChange}
                        className="w-full"
                        classNames={{
                          input: "bg-transparent text-gray-800",
                          inputWrapper: "bg-white border-2 border-blue-200/60 rounded-xl focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all duration-200 shadow-sm hover:border-blue-300",
                        }}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Description *
                    </Label>
                    <TextArea
                      name="description"
                      value={editFormData.description}
                      onChange={handleEditChange}
                      rows={3}
                      className="w-full"
                      classNames={{
                        input: "bg-transparent text-gray-800 resize-none",
                        inputWrapper: "bg-white border-2 border-blue-200/60 rounded-xl focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all duration-200 shadow-sm hover:border-blue-300",
                      }}
                      required
                    />
                  </div>

                  {/* Property Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Property Type *
                      </Label>
                      <Select
                        className="w-full"
                        value={editFormData.propertyType}
                        onChange={(val) => setEditFormData({ ...editFormData, propertyType: val })}
                        aria-label="Property Type"
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
                            {propertyTypes.map((type) => (
                              <ListBox.Item
                                key={type.id}
                                id={type.id}
                                textValue={type.label}
                                className="text-gray-700 hover:bg-blue-50 rounded-lg data-[selected=true]:bg-blue-100 data-[selected=true]:text-blue-700 transition-colors cursor-pointer px-3 py-2.5"
                              >
                                {type.label}
                                <ListBox.ItemIndicator />
                              </ListBox.Item>
                            ))}
                          </ListBox>
                        </Select.Popover>
                      </Select>
                    </div>
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Rent Type *
                      </Label>
                      <Select
                        className="w-full"
                        value={editFormData.rentType}
                        onChange={(val) => setEditFormData({ ...editFormData, rentType: val })}
                        aria-label="Rent Type"
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
                            {rentTypes.map((type) => (
                              <ListBox.Item
                                key={type.id}
                                id={type.id}
                                textValue={type.label}
                                className="text-gray-700 hover:bg-blue-50 rounded-lg data-[selected=true]:bg-blue-100 data-[selected=true]:text-blue-700 transition-colors cursor-pointer px-3 py-2.5"
                              >
                                {type.label}
                                <ListBox.ItemIndicator />
                              </ListBox.Item>
                            ))}
                          </ListBox>
                        </Select.Popover>
                      </Select>
                    </div>
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Price *
                      </Label>
                      <Input
                        type="number"
                        name="price"
                        value={editFormData.price}
                        onChange={handleEditChange}
                        className="w-full"
                        classNames={{
                          input: "bg-transparent text-gray-800",
                          inputWrapper: "bg-white border-2 border-blue-200/60 rounded-xl focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all duration-200 shadow-sm hover:border-blue-300",
                        }}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Bedrooms *
                      </Label>
                      <Input
                        type="number"
                        name="bedrooms"
                        value={editFormData.bedrooms}
                        onChange={handleEditChange}
                        className="w-full"
                        classNames={{
                          input: "bg-transparent text-gray-800",
                          inputWrapper: "bg-white border-2 border-blue-200/60 rounded-xl focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all duration-200 shadow-sm hover:border-blue-300",
                        }}
                        required
                      />
                    </div>
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Bathrooms *
                      </Label>
                      <Input
                        type="number"
                        name="bathrooms"
                        value={editFormData.bathrooms}
                        onChange={handleEditChange}
                        className="w-full"
                        classNames={{
                          input: "bg-transparent text-gray-800",
                          inputWrapper: "bg-white border-2 border-blue-200/60 rounded-xl focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all duration-200 shadow-sm hover:border-blue-300",
                        }}
                        required
                      />
                    </div>
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Size (sqft) *
                      </Label>
                      <Input
                        type="number"
                        name="propertySize"
                        value={editFormData.propertySize}
                        onChange={handleEditChange}
                        className="w-full"
                        classNames={{
                          input: "bg-transparent text-gray-800",
                          inputWrapper: "bg-white border-2 border-blue-200/60 rounded-xl focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all duration-200 shadow-sm hover:border-blue-300",
                        }}
                        required
                      />
                    </div>
                  </div>

                  {/* Extra Features */}
                  <div>
                    <Label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Extra Features
                    </Label>
                    <Input
                      type="text"
                      name="extraFeatures"
                      value={editFormData.extraFeatures}
                      onChange={handleEditChange}
                      placeholder="Balcony, Garden, Parking, etc."
                      className="w-full"
                      classNames={{
                        input: "bg-transparent text-gray-800 placeholder:text-gray-400",
                        inputWrapper: "bg-white border-2 border-blue-200/60 rounded-xl focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all duration-200 shadow-sm hover:border-blue-300",
                      }}
                    />
                  </div>

                  {/* Amenities */}
                  <div>
                    <Label className="block text-sm font-medium text-gray-700 mb-2">
                      Amenities
                    </Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {amenityOptions.map((amenity) => (
                        <label
                          key={amenity.id}
                          className={`flex items-center gap-2 px-3 py-2 rounded-xl border-2 cursor-pointer transition-all ${
                            editFormData.amenities.includes(amenity.id)
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={editFormData.amenities.includes(amenity.id)}
                            onChange={() => handleAmenityToggle(amenity.id)}
                            className="sr-only"
                          />
                          <span className="text-sm text-gray-700">{amenity.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Status - Commented out as requested */}
                  {/* <div>
                    <Label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Status
                    </Label>
                    <Select
                      className="w-full"
                      value={editFormData.status}
                      onChange={(val) => setEditFormData({ ...editFormData, status: val })}
                      aria-label="Status"
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
                  </div> */}
                </div>
              </Modal.Body>

              <Modal.Footer className="px-6 pb-6 pt-4 border-t border-gray-100 flex-shrink-0 flex gap-3">
                <Button
                  onPress={handleCloseEditModal}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-all duration-300 cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  onPress={handleEditSubmit}
                  isDisabled={isEditing}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl shadow-[0_4px_14px_rgba(37,99,235,0.35)] hover:shadow-[0_8px_24px_rgba(37,99,235,0.45)] transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isEditing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" strokeWidth={2} />
                      <span>Save Changes</span>
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