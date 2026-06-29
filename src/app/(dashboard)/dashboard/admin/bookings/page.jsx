// src/app/(dashboard)/dashboard/admin/bookings/page.js
import { getUserSession } from '@/lib/core/session';
import { getBookings } from '@/lib/api/bookings';
import { getTransactions } from '@/lib/api/transaction';
import { getProperties } from '@/lib/api/properties';
import { getUsers } from '@/lib/api/users';
import AdminBookingsClient from './AdminBookingsClient';

export default async function AdminBookingsPage({ searchParams }) {
  const filter = await searchParams;
  const session = await getUserSession();

  // Fetch all bookings (no filters from backend)
  const bookings = await getBookings() || [];
  
  // Fetch all transactions
  const transactions = await getTransactions() || [];
  
  // Fetch all properties and users for enrichment
  const { properties } = await getProperties('perPage=all') || { properties: [] };
  const users = await getUsers() || [];

  // Enrich bookings with property and user details
  const enrichedBookings = bookings.map((booking) => {
    const property = properties.find(p => p._id === booking.propertyId);
    const user = users.find(u => u._id === booking.userId);
    const transaction = transactions.find(t => t.bookingId === booking._id);
    
    return {
      ...booking,
      propertyTitle: property?.title || booking.title || "Unknown Property",
      propertyLocation: property?.location || "N/A",
      propertyImage: property?.mainImage || null,
      propertyType: property?.propertyType || null,
      tenantName: user?.name || "Unknown",
      tenantEmail: user?.email || "",
      tenantImage: user?.image || null,
      transactionStatus: transaction?.status || "pending",
      transactionAmount: transaction?.amount || booking.price || 0,
    };
  });

  // Calculate stats
  const stats = {
    total: enrichedBookings.length,
    pending: enrichedBookings.filter(b => b.status === "pending").length,
    approved: enrichedBookings.filter(b => b.status === "approved" || b.status === "completed").length,
    rejected: enrichedBookings.filter(b => b.status === "rejected").length,
    totalRevenue: enrichedBookings
      .filter(b => b.status === "approved" || b.status === "completed")
      .reduce((sum, b) => sum + (b.price || 0), 0),
  };

  if (!session?.id) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">Please log in to view bookings.</p>
      </div>
    );
  }

  return (
    <AdminBookingsClient 
      bookings={enrichedBookings}
      total={enrichedBookings.length}
      stats={stats}
      adminId={session.id}
    />
  );
}