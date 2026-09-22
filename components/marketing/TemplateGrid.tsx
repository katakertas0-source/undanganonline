'use client';

import React, { useState } from 'react';
import { getAllTemplates } from '@/lib/store';
import { TemplateDeviceMockup } from './TemplateDeviceMockup';
import { DIY_PACKAGES } from '@/lib/data/catalog';

export function TemplateGrid() {
  const templates = getAllTemplates();
  const [selectedFilter, setSelectedFilter] = useState<string>('All');

  const essentialPkg = DIY_PACKAGES.find((p) => p.tier === 'essential');
  const essentialAllowedIds = essentialPkg?.allowedTemplateIds || ['aurelia-minimal', 'celine-editorial', 'clara-classic'];

  const filters = ['All', 'Essential', 'Premium', 'Heritage'];

  const filteredTemplates = templates.filter((tmpl) => {
    if (selectedFilter === 'All') return true;
    if (selectedFilter === 'Essential') return essentialAllowedIds.includes(tmpl.id);
    if (selectedFilter === 'Premium') return !essentialAllowedIds.includes(tmpl.id);
    if (selectedFilter === 'Heritage') return tmpl.category === 'Heritage';
    return true;
  });

  return (
    <section id="templates" className="py-16 sm:py-24 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-16 gap-5 sm:gap-6">
        <div>
          <p className="text-[9px] sm:text-[10px] uppercase tracking-ultra text-neutral-400 font-medium">
            DIFFERENT EXPERIENCE FOR EVERY LOVE STORY
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight text-[#111111] mt-1.5 sm:mt-2">
            Template Collection
          </h2>
          <p className="text-[11px] sm:text-xs uppercase tracking-widest text-neutral-500 font-light mt-1.5 sm:mt-2">
            DISTINCT STORIES. ONE BEAUTIFUL LOVE.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-3.5 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs uppercase tracking-widest border transition-all ${
                selectedFilter === filter
                  ? 'bg-black text-white border-black shadow-sm'
                  : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Dual-Phone Mockups */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {filteredTemplates.map((tmpl) => (
          <TemplateDeviceMockup key={tmpl.id} template={tmpl} showActions={true} />
        ))}
      </div>

      {/* Section Footer Tagline */}
      <div className="mt-20 text-center border-t border-neutral-200/70 pt-10">
        <p className="font-serif italic text-lg text-neutral-600">
          &ldquo;More than a template. A different experience.&rdquo;
        </p>
        <p className="text-[10px] uppercase tracking-ultra text-neutral-400 mt-2">
          Setiap template dirancang dengan ritme visual, tipografi, dan pengalaman yang khas.
        </p>
      </div>
    </section>
  );
}
