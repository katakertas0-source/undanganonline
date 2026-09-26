'use client';

import React, { useState, useRef, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MinimalNav } from '@/components/marketing/MinimalNav';
import { MinimalFooter } from '@/components/marketing/MinimalFooter';
import { getAllTemplates, createDraftInvitation } from '@/lib/store';
import { ArrowRight, Check } from 'lucide-react';
import { TemplateDeviceMockup } from '@/components/marketing/TemplateDeviceMockup';
import { Template } from '@/types';
import { TEMPLATES } from '@/lib/data/catalog';

function CreateForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTemplateParam = searchParams.get('template');

  const [templates, setTemplates] = useState<Template[]>(TEMPLATES);

  useEffect(() => {
    setTemplates(getAllTemplates());
  }, []);

  const matchedTemplate = initialTemplateParam
    ? templates.find((t) => t.id === initialTemplateParam || t.slug === initialTemplateParam)
    : null;

  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(() => {
    if (matchedTemplate) {
      return matchedTemplate.id;
    }
    return 'jawa-living-heritage';
  });

  useEffect(() => {
    if (initialTemplateParam) {
      const found = templates.find((t) => t.id === initialTemplateParam || t.slug === initialTemplateParam);
      if (found) {
        setSelectedTemplateId(found.id);
      }
    }
  }, [initialTemplateParam, templates]);

  const currentTemplate = templates.find((t) => t.id === selectedTemplateId) || templates[0];

  const [groomName, setGroomName] = useState('');
  const [brideName, setBrideName] = useState('');

  const stepNamesRef = useRef<HTMLDivElement>(null);
  const groomInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll directly to Step 2 (Nama Mempelai) if template param or hash is present
  useEffect(() => {
    if (initialTemplateParam || (typeof window !== 'undefined' && window.location.hash === '#step-names')) {
      const timer = setTimeout(() => {
        if (stepNamesRef.current) {
          stepNamesRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
          setTimeout(() => {
            groomInputRef.current?.focus({ preventScroll: true });
          }, 450);
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [initialTemplateParam]);

  const handleSelectTemplate = (tmpl: Template) => {
    setSelectedTemplateId(tmpl.id);

    setTimeout(() => {
      if (stepNamesRef.current) {
        stepNamesRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTimeout(() => {
          groomInputRef.current?.focus({ preventScroll: true });
        }, 350);
      }
    }, 100);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const draft = createDraftInvitation(selectedTemplateId, 'pkg-premium', 'diy');

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
          Pilih template desain editorial favorit Anda, lalu masukkan nama panggilan mempelai untuk langsung mulai menyusun di dalam Interactive Builder.
        </p>
      </div>

      <form onSubmit={handleCreate} className="space-y-16">
        {/* STEP 1: PILIH TEMPLATE */}
        <div id="step-templates" className="scroll-mt-24">
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-neutral-200">
            <div>
              <span className="text-[10px] uppercase tracking-ultra text-neutral-400">LANGKAH 01</span>
              <h2 className="font-serif text-2xl uppercase tracking-wide">Pilih Template Desain</h2>
            </div>
            <span className="text-xs text-neutral-400 font-light">
              Koleksi Eksklusif Kertas.Kata
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {templates.map((tmpl) => {
              const isSelected = selectedTemplateId === tmpl.id;

              return (
                <div key={tmpl.id} className="flex flex-col">
                  <TemplateDeviceMockup
                    template={tmpl}
                    isSelectable={true}
                    isSelected={isSelected}
                    isAllowed={true}
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

        {/* STEP 2: NAMA MEMPELAI */}
        <div
          id="step-names"
          ref={stepNamesRef}
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
            <span className="text-[10px] uppercase tracking-ultra text-neutral-400">LANGKAH 02</span>
            <h3 className="font-serif text-2xl uppercase tracking-wide mt-1">
              Nama Panggilan Mempelai
            </h3>
            <p className="text-[11px] text-neutral-400 font-light mt-1">
              Nama lengkap, foto, tanggal, dan detail acara dapat Anda lengkapi di dalam Interactive Builder.
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
