'use client';

import React from 'react';
import { MinimalNav } from '@/components/marketing/MinimalNav';
import { MinimalFooter } from '@/components/marketing/MinimalFooter';
import { TemplateGrid } from '@/components/marketing/TemplateGrid';

export default function TemplatesPage() {
  return (
    <div className="min-h-screen bg-[#F8F7F3] text-[#111111]">
      <MinimalNav />
      <div className="pt-12">
        <TemplateGrid />
      </div>
      <MinimalFooter />
    </div>
  );
}
