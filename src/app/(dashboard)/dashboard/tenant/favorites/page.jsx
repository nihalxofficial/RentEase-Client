// src/app/(dashboard)/dashboard/tenant/favorites/page.js
import { getUserSession } from '@/lib/core/session';
import { getWishlistByTenant } from '@/lib/api/wishlist';
import { getPropertyById } from '@/lib/api/properties';
import FavoritesClient from './FavoritesClient';

export default async function FavoritesPage() {
  const session = await getUserSession();
  
  if (!session?.id) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">Please log in to view your favorites.</p>
      </div>
    );
  }

  // getWishlistByTenant returns an array of property ID strings
  const wishlistIds = await getWishlistByTenant(session.id) || [];
    
  // Fetch property details for each wishlist ID
  const properties = [];
  for (const propertyId of wishlistIds) {
    try {
      const property = await getPropertyById(propertyId);
      if (property) {
        properties.push(property);
      }
    } catch (error) {
      console.error(`Failed to fetch property ${propertyId}:`, error);
    }
  }
  

  return (
    <FavoritesClient 
      properties={properties} 
      wishlistIds={wishlistIds}
      userId={session.id}
    />
  );
}