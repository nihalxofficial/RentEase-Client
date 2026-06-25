// app/profile/page.js
import { getUserSession } from '@/lib/core/session';
import { getUserById } from '@/lib/api/users';
import ProfileClient from './ProfileClient';
import { ArrowRight, User } from 'lucide-react';
import Link from "next/link";

export default async function ProfilePage() {
  const session = await getUserSession();
  
  if (!session?.id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50/50 via-white to-white">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <User className="w-10 h-10 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Not Logged In</h2>
          <p className="text-gray-500 mb-6">Please log in to view your profile</p>
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl shadow-[0_4px_14px_rgba(37,99,235,0.35)] hover:shadow-[0_8px_24px_rgba(37,99,235,0.45)] transition-all duration-300 hover:-translate-y-1"
          >
            <span>Log In</span>
            <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
          </Link>
        </div>
      </div>
    );
  }

  const user = await getUserById(session?.id);

  return <ProfileClient user={user} />;
}