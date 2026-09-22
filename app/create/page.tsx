'use client';

import React, { useState, useRef, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MinimalNav } from '@/components/marketing/MinimalNav';
import { MinimalFooter } from '@/components/marketing/MinimalFooter';
import { getAllTemplates, getAllPackages, getPackageById, createDraftInvitation } from '@/lib/store';
import { ArrowRight, Check, Lock } from 'lucide-react';
import { TemplateDeviceMockup } from '@/components/marketing/TemplateDeviceMockup';
import { Template } from '@/types';

function CreateForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPkgParam = searchParams.get('package');
  const initialTemplateParam = searchParams.get('template');

  const packages = getAllPackages();
  const templates = getAllTemplates();

  const matchedTemplate = initialTemplateParam
    ? templates.find((t) => t.id === initialTemplateParam)
    : null;

  const [selectedPackageId, setSelectedPackageId] = useState<string>(() => {
    if (matchedTemplate) {
      return matchedTemplate.basePrice === 199000 ? 'pkg-premium' : (initialPkgParam || 'pkg-essential');
    }
    return initialPkgParam === 'pkg-premium' ? 'pkg-premium' : 'pkg-essential';
  });

  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(() => {
    if (matchedTemplate) {
      return matchedTemplate.id;
    }
    const pkg = getPackageById(initialPkgParam === 'pkg-premium' ? 'pkg-premium' : 'pkg-essential');
    return pkg.allowedTemplateIds[0] || 'aurelia-minimal';
  });

  const selectedPkg = getPackageById(selectedPackageId);
  const currentTemplate = templates.find((t) => t.id === selectedTemplateId) || templates[0];

  const [groomName, setGroomName] = useState('');
  const [brideName, setBrideName] = useState('');

  const step3Ref = useRef<HTMLDivElement>(null);
  const groomInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll directly to Step 3 (Gambar 2) if template param or hash is present
  useEffect(() => {
    if (initialTemplateParam || (typeof window !== 'undefined' && window.location.hash === '#step-names')) {
      const timer = setTimeout(() => {
        if (step3Ref.current) {
          step3Ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
          setTimeout(() => {
            groomInputRef.current?.focus({ preventScroll: true });
          }, 450);
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [initialTemplateParam]);

  const handlePackageChange = (pkgId: string) => {
    setSelectedPackageId(pkgId);
    const newPkg = getPackageById(pkgId);
    // If currently selected template is not allowed in the new package, auto-select the first allowed template
    if (!newPkg.allowedTemplateIds.includes(selectedTemplateId)) {
      setSelectedTemplateId(newPkg.allowedTemplateIds[0]);
    }
  };

  const handleSelectTemplate = (tmpl: Template) => {
    const targetPkgId = tmpl.basePrice === 199000 ? 'pkg-premium' : 'pkg-essential';
    setSelectedPackageId(targetPkgId);
    setSelectedTemplateId(tmpl.id);

    setTimeout(() => {
      if (step3Ref.current) {
        step3Ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTimeout(() => {
          groomInputRef.current?.focus({ preventScroll: true });
        }, 350);
      }
    }, 100);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const draft = createDraftInvitation(selectedTemplateId, selectedPackageId, 'diy');

    // Update with names if provided
    if (groomName.trim() || brideName.trim()) {
      draft.couple.groomNickname = groomName.trim() || draft.couple.groomNickname;
      draft.couple.groomName = groomName.trim() || draft.couple.groomName;
      draft.couple.brideNickname = brideName.trim() || draft.couple.brideNickname;
      draft.couple.brideName = brideName.trim() || draft.couple.brideName;
      draft.title = `The Wedding of ${draft.couple.groomNickname} & ${draft.couple.brideNickname}`;
    }

    router.push(`/builder/${draft.id}`);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="inline-block px-3.5 py-1 text-[10px] uppercase tracking-ultra text-neutral-600 border border-neutral-300 rounded-full mb-3 bg-white/70">
          <span>BUAT SENDIRI (DIY)</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-6xl uppercase tracking-tight">
          Buat Undangan Sendiri
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 font-light mt-3 max-w-lg mx-auto leading-relaxed">
          Pilih paket fondasi dan template desain Anda. Anda dapat menyesuaikan konten, foto, dan memilih add-on secara leluasa di dalam Interactive Builder.
        </p>
      </div>

      <form onSubmit={handleCreate} className="space-y-16">
        {/* STEP 1: PILIH PAKET */}
        <div>
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-neutral-200">
            <div>
              <span className="text-[10px] uppercase tracking-ultra text-neutral-400">LANGKAH 01</span>
              <h2 className="font-serif text-2xl uppercase tracking-wide">Pilih Paket Undangan</h2>
            </div>
            <span className="text-xs text-neutral-400 font-light">Harga dasar ditentukan dari paket</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {packages.map((pkg) => {
              const isSelected = selectedPackageId === pkg.id;
              const isPremium = pkg.tier === 'premium';
              return (
                <div
                  key={pkg.id}
                  onClick={() => handlePackageChange(pkg.id)}
                  className={`border cursor-pointer transition-all duration-300 p-6 sm:p-8 relative flex flex-col justify-between ${
                    isSelected
                      ? 'ring-2 ring-black border-black bg-white shadow-lg'
                      : 'border-neutral-200 bg-white/70 hover:border-neutral-400'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-4 right-4 z-10 w-6 h-6 rounded-full bg-black text-white flex items-center justify-center">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] uppercase tracking-widest px-2 py-0.5 border border-neutral-200 text-neutral-500">
                        {pkg.tier.toUpperCase()}
                      </span>
                      {isPremium && (
                        <span className="text-[9px] uppercase tracking-widest px-2 py-0.5 bg-neutral-900 text-white">
                          RECOMMENDED
                        </span>
                      )}
                    </div>

                    <h3 className="font-serif text-3xl uppercase tracking-wide mt-3">{pkg.name}</h3>
                    <p className="font-serif text-2xl font-medium mt-1">
                      Rp {pkg.price.toLocaleString('id-ID')}
                    </p>
                    <p className="text-xs text-neutral-500 font-light mt-3 leading-relaxed">
                      {pkg.description}
                    </p>

                    <div className="mt-6 space-y-2 text-[11px] text-neutral-600 border-t border-neutral-100 pt-4">
                      {isPremium ? (
                        <>
                          <p className="flex items-center gap-1.5 font-medium text-neutral-900">
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>Akses Semua Template (Termasuk Mahadewi, Nocturne & Élodie)</span>
                          </p>
                          <p className="flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>Premium Animation Preset Included</span>
                          </p>
                          <p className="flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>Love Story Timeline & RSVP System Included</span>
                          </p>
                          <p className="flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>Expanded 30+ Photos Gallery Included</span>
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="flex items-center gap-1.5 font-medium text-neutral-900">
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>Template Essential (Aurelia, Céline, Clara)</span>
                          </p>
                          <p className="flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>Galeri Foto Standar (10 Foto)</span>
                          </p>
                          <p className="flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>Maps, Countdown & Musik Standar</span>
                          </p>
                          <p className="flex items-center gap-1.5 text-neutral-400">
                            <span>+ Opsi Add-on dapat dibeli terpisah di builder</span>
                          </p>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="mt-8 pt-4 border-t border-neutral-100">
                    <span
                      className={`text-xs uppercase tracking-widest font-medium ${
                        isSelected ? 'text-black font-semibold' : 'text-neutral-400'
                      }`}
                    >
                      {isSelected ? '✓ Paket Dipilih' : 'Pilih Paket Ini'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* STEP 2: PILIH TEMPLATE */}
        <div id="step-templates" className="scroll-mt-24">
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-neutral-200">
            <div>
              <span className="text-[10px] uppercase tracking-ultra text-neutral-400">LANGKAH 02</span>
              <h2 className="font-serif text-2xl uppercase tracking-wide">Pilih Template Awal</h2>
            </div>
            <span className="text-xs text-neutral-400 font-light">
              Menampilkan koleksi untuk Paket {selectedPkg.name}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {templates.map((tmpl) => {
              const isAllowed = selectedPkg.allowedTemplateIds.includes(tmpl.id);
              const isSelected = selectedTemplateId === tmpl.id && isAllowed;

              return (
                <div key={tmpl.id} className="flex flex-col">
                  <TemplateDeviceMockup
                    template={tmpl}
                    isSelectable={true}
                    isSelected={isSelected}
                    isAllowed={isAllowed}
                    showActions={false}
                    onSelect={() => handleSelectTemplate(tmpl)}
                  />
                  <button
                    type="button"
                    onClick={() => handleSelectTemplate(tmpl)}
                    className={`mt-2.5 py-3 px-4 text-center text-[10px] uppercase tracking-widest font-medium transition-all flex items-center justify-center gap-2 ${
                      isSelected
                        ? 'bg-black text-white shadow-md'
                        : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Template Dipilih (Lanjut ke Nama ↓)</span>
                      </>
                    ) : (
                      <>
                        <span>Pilih Template Ini</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* STEP 3: NAMA MEMPELAI (GAMBAR 2) */}
        <div
          id="step-names"
          ref={step3Ref}
          className="scroll-mt-24 p-8 sm:p-10 border border-neutral-200 bg-white max-w-xl mx-auto space-y-6 shadow-sm"
        >
          {/* Chosen Template Notification Bar */}
          {currentTemplate && (
            <div className="p-3.5 sm:p-4 bg-[#FAF9F6] border border-neutral-200 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={currentTemplate.coverImageUrl}
                  alt={currentTemplate.name}
                  className="w-12 h-16 object-cover border border-neutral-300 shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[9px] uppercase tracking-widest px-1.5 py-0.5 bg-black text-white font-medium">
                      Template Terpilih
                    </span>
                    <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-medium">
                      Paket {selectedPkg.name} (Rp {selectedPkg.price.toLocaleString('id-ID')})
                    </span>
                  </div>
                  <p className="font-serif text-lg uppercase tracking-wide font-medium truncate mt-1">
                    {currentTemplate.name}
                  </p>
                  <p className="text-[10px] text-neutral-400 uppercase tracking-widest truncate">
                    {currentTemplate.subtitle}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  document.getElementById('step-templates')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-[10px] uppercase tracking-widest text-neutral-500 hover:text-black font-medium shrink-0 underline underline-offset-4"
              >
                Ganti
              </button>
            </div>
          )}

          <div className="text-center pb-2">
            <span className="text-[10px] uppercase tracking-ultra text-neutral-400">LANGKAH 03</span>
            <h3 className="font-serif text-2xl uppercase tracking-wide mt-1">
              Nama Panggilan Mempelai
            </h3>
            <p className="text-[11px] text-neutral-400 font-light mt-1">
              Nama lengkap, foto, tanggal, dan detail acara dapat Anda isi dan lengkapi secara detail di dalam Interactive Builder.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1.5">
                Panggilan Pria
              </label>
              <input
                ref={groomInputRef}
                type="text"
                value={groomName}
                onChange={(e) => setGroomName(e.target.value)}
                placeholder="Contoh: Julian"
                className="w-full px-4 py-3 text-xs border border-neutral-300 outline-none focus:border-black transition-colors"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1.5">
                Panggilan Wanita
              </label>
              <input
                type="text"
                value={brideName}
                onChange={(e) => setBrideName(e.target.value)}
                placeholder="Contoh: Nadia"
                className="w-full px-4 py-3 text-xs border border-neutral-300 outline-none focus:border-black transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 text-xs uppercase tracking-widest bg-black text-white hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <span>Buka Interactive Builder</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
}

export default function CreatePage() {
  return (
    <div className="min-h-screen bg-[#F8F7F3] text-[#111111]">
      <MinimalNav />
      <Suspense fallback={<div className="py-20 text-center text-xs text-neutral-400">Memuat...</div>}>
        <CreateForm />
      </Suspense>
      <MinimalFooter />
    </div>
  );
}
