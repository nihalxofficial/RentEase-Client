// src/app/dashboard/tenant/bookings/page.js
import { getUserSession } from '@/lib/core/session';
import TenantBookingsClient from './TenantBookingsClient';
import { getBookingsByTenant } from '@/lib/api/bookings';
import { getTransactionsByTenant } from '@/lib/api/transaction';
import { getPropertyById } from '@/lib/api/properties';

export default async function TenantBookingsPage() {
  const session = await getUserSession();

  // Fetch bookings and transactions
  const bookings = await getBookingsByTenant(session.id);
  const transactions = await getTransactionsByTenant(session.id, "bookingId");
  
  // Fetch property details for each booking
  const bookingsWithProperty = await Promise.all(
    bookings.map(async (booking) => {
      try {
        const property = await getPropertyById(booking.propertyId);
        return {
          ...booking,
          propertyDetails: property || null,
        };
      } catch (error) {
        console.error(`Failed to fetch property ${booking.propertyId}:`, error);
        return {
          ...booking,
          propertyDetails: null,
        };
      }
    })
  );

  return (
    <TenantBookingsClient 
      bookings={bookingsWithProperty} 
      transactions={transactions}
      userId={session.id}
    />
  );
}