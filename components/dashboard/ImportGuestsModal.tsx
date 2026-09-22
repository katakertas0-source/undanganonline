'use client';

import React, { useState } from 'react';
import { X, Upload, FileText, CheckCircle2, AlertCircle, Loader2, Users } from 'lucide-react';
import { addGuestLinkAsync } from '@/lib/store';
import { GuestLink } from '@/types';

interface ImportGuestsModalProps {
  isOpen: boolean;
  invitationId: string;
  onClose: () => void;
  onImportComplete: () => void;
}

interface ParsedGuest {
  name: string;
  category: GuestLink['category'];
  whatsapp?: string;
}

export function ImportGuestsModal({
  isOpen,
  invitationId,
  onClose,
  onImportComplete,
}: ImportGuestsModalProps) {
  const [tab, setTab] = useState<'paste' | 'csv'>('paste');
  const [rawText, setRawText] = useState('');
  const [parsedList, setParsedList] = useState<ParsedGuest[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  // Parser for pasted multi-line text
  const parsePastedText = (text: string): ParsedGuest[] => {
    const lines = text.split('\n');
    const result: ParsedGuest[] = [];

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      let name = trimmed;
      let category: GuestLink['category'] = 'Umum';
      let whatsapp: string | undefined = undefined;

      // Extract phone number if present at the end (e.g. "Budi - 08123456789" or "Budi, 0812...")
      const phoneMatch = name.match(/[-,\t]\s*(\+?62|0)8[0-9]{8,12}\b/);
      if (phoneMatch) {
        whatsapp = phoneMatch[0].replace(/[-,\t\s]/g, '');
        name = name.replace(phoneMatch[0], '').trim();
      }

      // Check category keywords in brackets or text
      const lower = name.toLowerCase();
      if (lower.includes('(vip)') || lower.includes('[vip]')) {
        category = 'VIP';
        name = name.replace(/\(vip\)|\[vip\]/gi, '').trim();
      } else if (lower.includes('(keluarga)') || lower.includes('[keluarga]')) {
        category = 'Keluarga';
        name = name.replace(/\(keluarga\)|\[keluarga\]/gi, '').trim();
      } else if (lower.includes('(teman)') || lower.includes('[teman]')) {
        category = 'Teman';
        name = name.replace(/\(teman\)|\[teman\]/gi, '').trim();
      }

      if (name) {
        result.push({ name, category, whatsapp });
      }
    }

    return result;
  };

  const handleTextChange = (val: string) => {
    setRawText(val);
    setParsedList(parsePastedText(val));
    setErrorMsg(null);
  };

  const handleCsvFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        if (!text) return;

        const lines = text.split(/\r\n|\n/);
        const parsed: ParsedGuest[] = [];

        // Check if first row is header
        let startIndex = 0;
        const firstLine = lines[0].toLowerCase();
        if (firstLine.includes('nama') || firstLine.includes('name') || firstLine.includes('guest')) {
          startIndex = 1;
        }

        for (let i = startIndex; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;

          // Simple CSV splitter respecting quotes
          const cols = line.split(',').map((c) => c.replace(/^["']|["']$/g, '').trim());
          const name = cols[0];
          if (!name) continue;

          let category: GuestLink['category'] = 'Umum';
          const catRaw = (cols[1] || '').toLowerCase();
          if (catRaw.includes('vip')) category = 'VIP';
          else if (catRaw.includes('keluarga')) category = 'Keluarga';
          else if (catRaw.includes('teman')) category = 'Teman';

          const whatsapp = cols[2] ? cols[2].replace(/[^0-9+]/g, '') : undefined;
          parsed.push({ name, category, whatsapp });
        }

        setParsedList(parsed);
      } catch (err: any) {
        setErrorMsg('Gagal membaca file CSV. Pastikan format file valid.');
      }
    };
    reader.readAsText(file);
  };

  const handleStartImport = async () => {
    if (parsedList.length === 0 || isProcessing) return;

    setIsProcessing(true);
    setProgress(0);
    setErrorMsg(null);

    try {
      const total = parsedList.length;
      for (let i = 0; i < total; i++) {
        const item = parsedList[i];
        await addGuestLinkAsync(invitationId, item.name, item.category, item.whatsapp);
        setProgress(Math.round(((i + 1) / total) * 100));
      }

      onImportComplete();
      onClose();
    } catch (err: any) {
      console.error('Import error:', err);
      setErrorMsg('Terjadi kendala saat menyimpan sebagian data tamu.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl bg-[#F8F7F3] border border-neutral-200 text-[#111111] shadow-2xl p-6 sm:p-8 max-h-[90vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isProcessing}
          className="absolute top-5 right-5 p-1.5 text-neutral-400 hover:text-black transition-colors"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <p className="text-[10px] uppercase tracking-ultra text-neutral-400">
            BATCH GUEST MANAGER
          </p>
          <h3 className="font-serif text-2xl sm:text-3xl uppercase tracking-wide mt-1">
            Import Tamu Massal
          </h3>
          <p className="text-xs text-neutral-500 font-light mt-1">
            Tambahkan puluhan hingga ratusan tamu sekaligus dalam hitungan detik.
          </p>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-2 border-b border-neutral-200 mb-6 text-xs uppercase tracking-widest text-center">
          <button
            type="button"
            onClick={() => setTab('paste')}
            className={`pb-3 font-medium transition-colors border-b-2 ${
              tab === 'paste' ? 'border-black text-black' : 'border-transparent text-neutral-400 hover:text-neutral-700'
            }`}
          >
            Copy-Paste Daftar Nama
          </button>
          <button
            type="button"
            onClick={() => setTab('csv')}
            className={`pb-3 font-medium transition-colors border-b-2 ${
              tab === 'csv' ? 'border-black text-black' : 'border-transparent text-neutral-400 hover:text-neutral-700'
            }`}
          >
            Upload File CSV
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 mb-4 text-xs bg-red-50 border border-red-200 text-red-700 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Tab 1: Paste */}
        <div className="flex-1 overflow-y-auto space-y-4">
          {tab === 'paste' ? (
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1.5">
                Tempel daftar nama tamu di bawah (satu nama per baris):
              </label>
              <textarea
                rows={7}
                value={rawText}
                onChange={(e) => handleTextChange(e.target.value)}
                placeholder="Contoh:&#10;Bapak Budi Santoso & Keluarga&#10;dr. Hendra Wijaya (VIP) - 08123456789&#10;Ibu Ratna Sari (Keluarga)&#10;Dimas & Pasangan"
                className="w-full p-3.5 text-xs bg-white border border-neutral-300 text-[#111111] font-mono outline-none focus:border-black transition-colors resize-none leading-relaxed"
              />
              <p className="text-[10px] text-neutral-400 mt-1">
                Tip: Anda dapat menambahkan tag <code>(VIP)</code> atau <code>(Keluarga)</code> dan nomor WhatsApp secara otomatis.
              </p>
            </div>
          ) : (
            <div className="p-8 border-2 border-dashed border-neutral-300 bg-white text-center hover:border-black transition-colors">
              <Upload className="w-8 h-8 text-neutral-400 mx-auto mb-3" />
              <label className="cursor-pointer">
                <span className="text-xs uppercase tracking-widest font-medium text-black underline">
                  Pilih Berkas CSV
                </span>
                <input
                  type="file"
                  accept=".csv,text/csv"
                  onChange={handleCsvFileUpload}
                  className="hidden"
                />
              </label>
              <p className="text-[10px] text-neutral-400 mt-2">
                Format kolom file CSV: <code>Nama Tamu, Kategori, Nomor WhatsApp</code>
              </p>
            </div>
          )}

          {/* Preview Parsed */}
          {parsedList.length > 0 && (
            <div className="mt-4 p-4 border border-neutral-200 bg-white">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase tracking-widest font-medium flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  <span>Ditemukan {parsedList.length} Tamu Siap Diimport</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setParsedList([]);
                    setRawText('');
                  }}
                  className="text-[10px] uppercase tracking-wider text-neutral-400 hover:text-red-600"
                >
                  Reset
                </button>
              </div>

              <div className="max-h-36 overflow-y-auto space-y-1.5 divide-y divide-neutral-100 text-xs">
                {parsedList.slice(0, 10).map((p, idx) => (
                  <div key={idx} className="pt-1.5 flex items-center justify-between text-neutral-700">
                    <span className="truncate max-w-[240px] font-medium">{p.name}</span>
                    <div className="flex items-center gap-2 shrink-0 text-[10px]">
                      <span className="px-1.5 py-0.5 bg-neutral-100 border border-neutral-200 text-neutral-600 uppercase">
                        {p.category}
                      </span>
                      {p.whatsapp && <span className="text-neutral-400">{p.whatsapp}</span>}
                    </div>
                  </div>
                ))}
                {parsedList.length > 10 && (
                  <p className="text-[10px] text-neutral-400 text-center pt-2 italic">
                    ...dan {parsedList.length - 10} tamu lainnya
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Progress bar */}
          {isProcessing && (
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-xs text-neutral-600">
                <span>Mengimport tamu ke database cloud...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full h-2 bg-neutral-200 overflow-hidden">
                <div
                  className="h-full bg-black transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-6 border-t border-neutral-200 mt-4 flex items-center justify-end gap-3">
          <button
            type="button"
            disabled={isProcessing}
            onClick={onClose}
            className="px-4 py-2.5 text-xs uppercase tracking-widest text-neutral-500 hover:text-black transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            disabled={parsedList.length === 0 || isProcessing}
            onClick={handleStartImport}
            className="px-6 py-2.5 text-xs uppercase tracking-widest bg-black text-white hover:bg-neutral-800 disabled:opacity-50 transition-all flex items-center gap-2"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Memproses ({progress}%)...</span>
              </>
            ) : (
              `Import ${parsedList.length > 0 ? parsedList.length : ''} Tamu Sekarang`
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
