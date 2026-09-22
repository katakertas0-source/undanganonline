'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAllInvitations, createDraftInvitation } from '@/lib/store';

export default function BuilderIndexPage() {
  const router = useRouter();

  useEffect(() => {
    const list = getAllInvitations();
    if (list && list.length > 0) {
      router.replace(`/builder/${list[0].id}`);
    } else {
      const draft = createDraftInvitation('tmpl-clara', 'pkg-premium');
      router.replace(`/builder/${draft.id}`);
    }
  }, [router]);

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-[#FAF7F2] text-xs font-mono tracking-widest text-[#8C6D3B]">
      MEMUAT BUILDER...
    </div>
  );
}
