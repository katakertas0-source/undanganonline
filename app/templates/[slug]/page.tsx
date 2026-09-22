'use client';

import React, { use, useState } from 'react';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { MinimalNav } from '@/components/marketing/MinimalNav';
import { MinimalFooter } from '@/components/marketing/MinimalFooter';
import { getTemplateById, getAllAddons, getAllInvitations, getSampleInvitationForTemplate } from '@/lib/store';
import { InvitationEngine } from '@/components/engine/InvitationEngine';
import { DeviceFrame } from '@/components/ui/DeviceFrame';
import { Smartphone, Monitor, ArrowRight, Eye, Check } from 'lucide-react';

export default function TemplateDetailPage() {
  const routeParams = useParams();
  const slug = (routeParams?.slug as string) || '';
  const template = getTemplateById(slug);
  const [viewMode, setViewMode] = useState<'mobile' | 'desktop'>('mobile');

  if (!template) {
    notFound();
  }

  // Find dedicated sample invitation matching this template
  const sampleInvitation = getSampleInvitationForTemplate(template.id);

  const allAddons = getAllAddons();
  const compatibleAddons = allAddons.filter((a) =>
    template.compatibleAddonIds.includes(a.id)
  );

  return (
    <div className="min-h-screen bg-[#F8F7F3] text-[#111111]">
      <MinimalNav />

      {/* Header Info */}
      <section className="py-12 px-6 sm:px-8 border-b border-neutral-200 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-ultra text-neutral-400 mb-2">
              <span>TEMPLATE ARCHIVE</span>
              <span>·</span>
              <span className="text-black font-medium">{template.category}</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl uppercase tracking-wide">
              {template.name}
            </h1>
            <p className="text-xs text-neutral-500 font-light max-w-xl mt-2 leading-relaxed">
              {template.description}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="text-right sm:text-left">
              <span className="text-[10px] uppercase tracking-widest text-neutral-400 block">
                BASE PRICE
              </span>
              <span className="font-serif text-2xl font-light">
                Rp {template.basePrice.toLocaleString('id-ID')}
              </span>
            </div>

            <Link
              href={`/create?template=${template.id}#step-names`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs uppercase tracking-widest bg-black text-white hover:bg-neutral-800 transition-colors shadow-sm"
            >
              <span>Gunakan Template Ini</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Live Preview Arena with Device Switcher */}
      <section className="py-8 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4 border-b border-neutral-200 pb-3">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-500">
            <Eye className="w-3.5 h-3.5" />
            <span>INTERACTIVE LIVE PREVIEW</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('mobile')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] uppercase tracking-widest border transition-all ${
                viewMode === 'mobile'
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-neutral-600 border-neutral-300 hover:border-neutral-400'
              }`}
            >
              <Smartphone className="w-3 h-3" />
              <span>Mobile View</span>
            </button>

            <button
              onClick={() => setViewMode('desktop')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] uppercase tracking-widest border transition-all ${
                viewMode === 'desktop'
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-neutral-600 border-neutral-300 hover:border-neutral-400'
              }`}
            >
              <Monitor className="w-3 h-3" />
              <span>Desktop View</span>
            </button>
          </div>
        </div>

        {/* Frame Container */}
        <div className="flex justify-center items-center py-6">
          {viewMode === 'mobile' ? (
            <DeviceFrame isDark={template.theme.isDark}>
              <InvitationEngine
                invitation={{
                  ...sampleInvitation,
                  templateId: template.id,
                }}
                guestName={template.basePrice === 199000 ? "Bapak Budi Santoso" : undefined}
                isPreview={true}
                forceMobile={true}
              />
            </DeviceFrame>
          ) : (
            <div
              className={`w-full max-w-5xl h-[800px] rounded-lg overflow-y-auto shadow-2xl border ${
                template.theme.isDark ? 'border-neutral-800 bg-[#0C0C0C]' : 'border-neutral-300 bg-white'
              }`}
            >
              <InvitationEngine
                invitation={{
                  ...sampleInvitation,
                  templateId: template.id,
                }}
                guestName={template.basePrice === 199000 ? "Bapak Budi Santoso" : undefined}
                isPreview={true}
                forceMobile={false}
              />
            </div>
          )}
        </div>
      </section>

      {/* Add-on Compatibility Matrix */}
      <section className="py-16 px-6 sm:px-8 max-w-5xl mx-auto border-t border-neutral-200 mt-12">
        <h3 className="font-serif text-2xl uppercase tracking-wide mb-2">
          Kompatibilitas Add-on
        </h3>
        <p className="text-xs text-neutral-500 font-light mb-8">
          Template {template.name} telah diuji secara presisi untuk kompatibilitas penuh dengan fitur-fitur tambahan berikut:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {compatibleAddons.map((addon) => (
            <div
              key={addon.id}
              className="p-4 border border-neutral-200 bg-white flex items-start gap-3"
            >
              <div className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mt-0.5 shrink-0">
                <Check className="w-3 h-3" />
              </div>
              <div>
                <p className="font-medium text-xs text-neutral-900">{addon.name}</p>
                <p className="text-[10px] text-neutral-400 mt-0.5">{addon.category}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <MinimalFooter />
    </div>
  );
}
