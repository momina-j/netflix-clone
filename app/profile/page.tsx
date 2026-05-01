'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { FaLock } from 'react-icons/fa';

export default function ProfilePage() {
  const session = { user: { name: 'Demo User' } };
  const status = 'authenticated';
  const router = useRouter();
  const [loadingProfile, setLoadingProfile] = useState<number | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth');
    }
  }, [status, router]);

  const selectProfile = (index: number) => {
    setLoadingProfile(index);
    setTimeout(() => {
      router.push('/');
    }, 800);
  };

  if (status === 'loading') {
    return (
      <main className="min-h-screen bg-[#141414] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#E50914] border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  if (!session) return null;

  // Mock profiles
  const profiles = [
    { name: session.user?.name || 'User', color: 'bg-blue-600', isKids: false },
    { name: 'Spouse', color: 'bg-red-600', isKids: false },
    { name: 'Guest', color: 'bg-green-600', isKids: false },
    { name: 'Kids', color: 'bg-yellow-500', isKids: true },
  ];

  return (
    <main className="min-h-screen bg-[#141414] flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-4 animate-fade-in">
        <h1 className="text-3xl md:text-5xl text-white font-medium mb-8 tracking-wide">
          Who&apos;s watching?
        </h1>

        <div className="flex flex-wrap justify-center gap-4 md:gap-8 max-w-4xl">
          {profiles.map((profile, index) => (
            <div
              key={index}
              onClick={() => selectProfile(index)}
              className="flex flex-col items-center group cursor-pointer w-24 md:w-36"
            >
              <div className={`relative w-24 h-24 md:w-36 md:h-36 rounded-md mb-4 overflow-hidden transition-all duration-300 ${
                loadingProfile === index ? 'scale-90 opacity-50' : 'group-hover:border-[3px] group-hover:border-white group-hover:shadow-[0_0_15px_rgba(255,255,255,0.3)]'
              }`}>
                {/* Profile Avatar Box */}
                <div className={`w-full h-full ${profile.color} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
                  <span className="text-4xl md:text-6xl text-white font-black opacity-90 drop-shadow-md">
                    {profile.name[0]?.toUpperCase()}
                  </span>
                </div>
                
                {/* Spinner Overlay */}
                {loadingProfile === index && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1.5 text-gray-400 group-hover:text-white transition-colors duration-300 text-sm md:text-lg">
                <span>{profile.name}</span>
                {profile.isKids && <FaLock size={12} className="opacity-70 mt-0.5" />}
              </div>
            </div>
          ))}
        </div>

        <button className="mt-16 border border-gray-500 text-gray-500 px-6 py-2 uppercase tracking-widest text-[1vw] md:text-[14px] hover:text-white hover:border-white transition-colors">
          Manage Profiles
        </button>
      </div>
    </main>
  );
}
