'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useMyList } from '@/store/useMyList';
import { FaSignOutAlt, FaList, FaFilm } from 'react-icons/fa';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { myList } = useMyList();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <main className="min-h-screen bg-zinc-950 pt-24">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </main>
    );
  }

  if (!session) return null;

  return (
    <main className="min-h-screen bg-zinc-950 pt-24">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 pb-16">
        <h1 className="text-3xl font-bold text-white mb-8">Account</h1>

        {/* Profile Card */}
        <div className="bg-zinc-900 rounded-xl p-6 mb-6 border border-zinc-800">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center text-2xl font-black text-white">
              {session.user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{session.user?.name}</h2>
              <p className="text-gray-400">{session.user?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-zinc-800 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-400 mb-1">
                <FaList size={14} />
                <span className="text-sm">My List</span>
              </div>
              <p className="text-white text-2xl font-bold">{myList.length}</p>
              <p className="text-gray-500 text-xs">titles saved</p>
            </div>
            <div className="bg-zinc-800 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-400 mb-1">
                <FaFilm size={14} />
                <span className="text-sm">Plan</span>
              </div>
              <p className="text-white text-lg font-bold">Standard</p>
              <p className="text-gray-500 text-xs">with Ads</p>
            </div>
          </div>
        </div>

        {/* Membership */}
        <div className="bg-zinc-900 rounded-xl p-6 mb-6 border border-zinc-800">
          <h3 className="text-white font-bold mb-4">Membership & Billing</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Email</span>
              <span className="text-white">{session.user?.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Password</span>
              <span className="text-white">••••••••</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Phone</span>
              <span className="text-gray-500">Not set</span>
            </div>
          </div>
        </div>

        {/* Sign Out */}
        <button
          onClick={() => signOut({ callbackUrl: '/auth' })}
          className="w-full flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white py-3 rounded-lg font-semibold transition-colors border border-zinc-700"
        >
          <FaSignOutAlt size={16} />
          Sign out of Netflix Clone
        </button>
      </div>

      <Footer />
    </main>
  );
}
