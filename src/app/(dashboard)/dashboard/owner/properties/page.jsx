// src/app/(dashboard)/dashboard/owner/properties/page.js
import { getUserSession } from '@/lib/core/session';
import { getProperties } from '@/lib/api/properties';
import OwnerPropertiesClient from './OwnerPropertiesClient';

export default async function OwnerPropertiesPage() {
  const session = await getUserSession();
  
  if (!session?.id) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">Please log in to view your properties.</p>
      </div>
    );
  }

  // Fetch properties for the owner
  const { properties, total } = await getProperties(`ownerId=${session.id}`);

  return (
    <OwnerPropertiesClient 
      properties={properties || []} 
      total={total || 0}
      userId={session.id}
    />
  );
}