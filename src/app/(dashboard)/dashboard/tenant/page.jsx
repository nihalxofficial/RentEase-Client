// src/app/(dashboard)/dashboard/tenant/page.js
import { getUserSession } from '@/lib/core/session';
import { getBookingsByTenant } from '@/lib/api/bookings';
import { getWishlistByTenant } from '@/lib/api/wishlist';
import { getTransactionsByTenant } from '@/lib/api/transaction';
import { getPropertyById } from '@/lib/api/properties';
import TenantDashboardClient from './TenantDashboardClient';

export default async function TenantDashboardPage() {
  const session = await getUserSession();
  
  if (!session?.id) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">Please log in to view your dashboard.</p>
      </div>
    );
  }

  // Fetch all data
  let bookings = await getBookingsByTenant(session.id) || [];
  const wishlistIds = await getWishlistByTenant(session.id) || [];
  const transactions = await getTransactionsByTenant(session.id) || [];
  
  // Fetch property details for each booking
  const bookingsWithProperty = await Promise.all(
    bookings.map(async (booking) => {
      try {
        const property = await getPropertyById(booking.propertyId);
        return {
          ...booking,
          propertyDetails: property || null,
          title: booking.title || property?.title || "Property",
          location: property?.location || "N/A",
          mainImage: property?.mainImage || null,
          bedrooms: property?.bedrooms || 0,
          bathrooms: property?.bathrooms || 0,
          propertySize: property?.propertySize || 0,
          price: booking.price || property?.price || 0,
        };
      } catch (error) {
        console.error(`Failed to fetch property ${booking.propertyId}:`, error);
        return {
          ...booking,
          location: "N/A",
          mainImage: null,
        };
      }
    })
  );

  bookings = bookingsWithProperty;

  // Fetch property details for wishlist - using the same pattern as favorites page
  const favoriteProperties = [];
  for (const propertyId of wishlistIds) {
    try {
      const property = await getPropertyById(propertyId);
      if (property) {
        favoriteProperties.push(property);
      }
    } catch (error) {
      console.error(`Failed to fetch wishlist property ${propertyId}:`, error);
    }
  }

  // Calculate stats
  const totalBookings = bookings.length;
  const activeBookings = bookings.filter(b => b.status === "approved" || b.status === "completed").length;
  const pendingBookings = bookings.filter(b => b.status === "pending").length;
  const rejectedBookings = bookings.filter(b => b.status === "rejected").length;
  const totalSpent = transactions
    .filter(t => t.status === "completed")
    .reduce((sum, t) => sum + (t.amount || 0), 0);
  const totalFavorites = favoriteProperties.length;

  // Chart data - Last 7 days bookings
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dayStr = date.toISOString().split('T')[0];
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    
    const dayBookings = bookings.filter(b => {
      const bDate = new Date(b.createdAt).toISOString().split('T')[0];
      return bDate === dayStr;
    });
    
    const dayAmount = dayBookings.reduce((sum, b) => sum + (b.price || 0), 0);
    
    last7Days.push({
      day: dayName,
      bookings: dayBookings.length,
      amount: dayAmount,
      date: dayStr,
    });
  }

  // Monthly trend data (last 6 months)
  const monthlyData = [];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonth = new Date().getMonth();
  
  for (let i = 5; i >= 0; i--) {
    const monthIndex = (currentMonth - i + 12) % 12;
    const monthName = months[monthIndex];
    const year = new Date().getFullYear();
    
    const monthBookings = bookings.filter(b => {
      const bDate = new Date(b.createdAt);
      return bDate.getMonth() === monthIndex && bDate.getFullYear() === year;
    });
    
    const monthAmount = monthBookings.reduce((sum, b) => sum + (b.price || 0), 0);
    
    monthlyData.push({
      month: monthName,
      bookings: monthBookings.length,
      amount: monthAmount,
    });
  }

  // Booking status distribution
  const statusData = [
    { name: 'Approved', value: activeBookings, color: '#10b981' },
    { name: 'Pending', value: pendingBookings, color: '#f59e0b' },
    { name: 'Rejected', value: rejectedBookings, color: '#ef4444' },
  ].filter(item => item.value > 0);

  return (
    <TenantDashboardClient 
      bookings={bookings}
      favoriteProperties={favoriteProperties}
      transactions={transactions}
      stats={{
        totalBookings,
        activeBookings,
        pendingBookings,
        rejectedBookings,
        totalSpent,
        totalFavorites,
      }}
      chartData={{
        last7Days,
        monthlyData,
        statusData,
      }}
      userId={session.id}
    />
  );
}