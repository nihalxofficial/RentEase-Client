// src/app/(dashboard)/dashboard/tenant/settings/page.js
import { getUserSession } from '@/lib/core/session';
import SettingsClient from './SettingsClient';

export default async function SettingsPage() {
  const session = await getUserSession();
  
  if (!session?.id) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">Please log in to view your settings.</p>
      </div>
    );
  }

  return (
    <SettingsClient userId={session.id} />
  );
}