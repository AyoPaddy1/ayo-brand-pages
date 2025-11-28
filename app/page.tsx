'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/brands');
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-500 via-emerald-400 to-yellow-400 flex items-center justify-center">
      <div className="text-white text-2xl font-bold">Loading AYO...</div>
    </div>
  );
}
