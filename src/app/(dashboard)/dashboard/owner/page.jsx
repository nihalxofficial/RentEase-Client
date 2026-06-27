// src/app/(dashboard)/dashboard/owner/page.js
import { getUserSession } from '@/lib/core/session';
import { getProperties } from '@/lib/api/properties';
import { getBookingsByOwner } from '@/lib/api/bookings';
import { getTransactionsByOwner } from '@/lib/api/transaction';
import OwnerDashboardClient from './OwnerDashboardClient';

export default async function OwnerDashboardPage() {
  const session = await getUserSession();
  
  if (!session?.id) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">Please log in to view your dashboard.</p>
      </div>
    );
  }

  // Fetch all data
  const { properties } = await getProperties(`ownerId=${session.id}`) || { properties: [] };
  const bookings = await getBookingsByOwner(session.id) || [];
  const transactions = await getTransactionsByOwner(session.id) || [];

  // ========== STATS CALCULATIONS ==========
  
  // Total Properties
  const totalProperties = properties.length;
  
  // Total Bookings - ONLY CONFIRMED/APPROVED bookings
  const totalBookings = bookings.filter(b => b.status === "approved" || b.status === "completed").length;
  
  // Pending Requests - bookings waiting for owner action
  const pendingBookings = bookings.filter(b => b.status === "pending").length;
  
  // Rejected Bookings
  const rejectedBookings = bookings.filter(b => b.status === "rejected").length;
  
  // Total Earnings - ONLY from confirmed bookings (approved/completed)
  // Get all booking IDs that are approved
  const approvedBookingIds = bookings
    .filter(b => b.status === "approved" || b.status === "completed")
    .map(b => b._id);
  
  // Filter transactions that match approved bookings
  const totalEarnings = transactions
    .filter(t => t.status === "completed" && approvedBookingIds.includes(t.bookingId))
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  // ========== CHART DATA ==========
  
  // Monthly Earnings Data (Last 12 months) - ONLY from confirmed bookings
  const monthlyData = [];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  for (let i = 11; i >= 0; i--) {
    const monthIndex = (currentMonth - i + 12) % 12;
    const year = currentYear - (currentMonth - i < 0 ? 1 : 0);
    const monthName = months[monthIndex];
    
    // Get confirmed booking IDs for this month
    const monthBookings = bookings.filter(b => {
      const bDate = new Date(b.createdAt);
      return bDate.getMonth() === monthIndex && 
             bDate.getFullYear() === year && 
             (b.status === "approved" || b.status === "completed");
    });
    
    const monthBookingIds = monthBookings.map(b => b._id);
    
    // Get transactions for confirmed bookings in this month
    const monthTransactions = transactions.filter(t => 
      t.status === "completed" && 
      monthBookingIds.includes(t.bookingId)
    );
    
    const monthAmount = monthTransactions.reduce((sum, t) => sum + (t.amount || 0), 0);
    
    monthlyData.push({
      month: monthName,
      earnings: monthAmount,
      bookings: monthBookings.length,
    });
  }

  // Booking Status Distribution
  const statusData = [
    { name: 'Approved', value: totalBookings, color: '#10b981' },
    { name: 'Pending', value: pendingBookings, color: '#f59e0b' },
    { name: 'Rejected', value: rejectedBookings, color: '#ef4444' },
  ].filter(item => item.value > 0);

  // Property Type Distribution
  const propertyTypes = {};
  properties.forEach(p => {
    const type = p.propertyType || 'other';
    propertyTypes[type] = (propertyTypes[type] || 0) + 1;
  });
  
  const propertyTypeData = Object.entries(propertyTypes).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
  }));

  // Monthly Bookings Trend - ONLY confirmed bookings
  const monthlyBookingsData = monthlyData.map(item => ({
    month: item.month,
    bookings: item.bookings,
    amount: item.earnings,
  }));

  return (
    <OwnerDashboardClient 
      stats={{
        totalEarnings,
        totalProperties,
        totalBookings,
        pendingBookings,
        rejectedBookings,
      }}
      chartData={{
        monthlyData,
        statusData,
        propertyTypeData,
        monthlyBookingsData,
      }}
      properties={properties}
      bookings={bookings}
      userId={session.id}
    />
  );
}