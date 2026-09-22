'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, ZoomIn, ZoomOut, RotateCw, RotateCcw, Check, Move, Crop } from 'lucide-react';

export type CropAspectRatio = '4:5' | '1:1' | '16:9' | 'free';

interface ImageCropperModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  initialAspectRatio?: CropAspectRatio;
  title?: string;
  onCropComplete: (croppedDataUrl: string, appliedAspectRatio: '4:5' | '1:1' | '16:9') => void;
}

export function ImageCropperModal({
  isOpen,
  onClose,
  imageUrl,
  initialAspectRatio = '4:5',
  title = 'Atur Angle & Area Crop Foto',
  onCropComplete,
}: ImageCropperModalProps) {
  const [aspectRatio, setAspectRatio] = useState<CropAspectRatio>(initialAspectRatio);
  const [zoom, setZoom] = useState(1.0);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [naturalSize, setNaturalSize] = useState({ width: 800, height: 600 });
  const [activeSrc, setActiveSrc] = useState(imageUrl);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  // Sync initial aspect ratio when modal opens
  useEffect(() => {
    if (isOpen) {
      setAspectRatio(initialAspectRatio);
      setZoom(1.0);
      setPan({ x: 0, y: 0 });
      setRotation(0);
      setIsDragging(false);
    }
  }, [isOpen, initialAspectRatio, imageUrl]);

  // Load image safely (using blob url where possible to prevent tainted canvas SecurityError)
  useEffect(() => {
    if (!imageUrl) return;
    setImageLoaded(false);

    let isMounted = true;
    let objectUrlToRevoke = '';

    if (imageUrl.startsWith('data:') || imageUrl.startsWith('blob:')) {
      setActiveSrc(imageUrl);
      const img = new Image();
      img.onload = () => {
        if (!isMounted) return;
        setNaturalSize({ width: img.naturalWidth, height: img.naturalHeight });
        setImageLoaded(true);
      };
      img.src = imageUrl;
    } else {
      // Attempt fetching as blob to ensure same-origin canvas processing
      fetch(imageUrl, { mode: 'cors' })
        .then((res) => {
          if (!res.ok) throw new Error('Fetch failed');
          return res.blob();
        })
        .then((blob) => {
          if (!isMounted) return;
          const blobUrl = URL.createObjectURL(blob);
          objectUrlToRevoke = blobUrl;
          setActiveSrc(blobUrl);

          const img = new Image();
          img.onload = () => {
            if (!isMounted) return;
            setNaturalSize({ width: img.naturalWidth, height: img.naturalHeight });
            setImageLoaded(true);
          };
          img.src = blobUrl;
        })
        .catch(() => {
          if (!isMounted) return;
          setActiveSrc(imageUrl);
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => {
            if (!isMounted) return;
            setNaturalSize({ width: img.naturalWidth, height: img.naturalHeight });
            setImageLoaded(true);
          };
          img.src = imageUrl;
        });
    }

    return () => {
      isMounted = false;
      if (objectUrlToRevoke) {
        URL.revokeObjectURL(objectUrlToRevoke);
      }
    };
  }, [imageUrl]);

  // Calculate crop window dimensions (in CSS px) based on chosen aspect ratio
  const getCropDimensions = useCallback(() => {
    // Max bounding container for crop area
    const maxW = 340;
    const maxH = 340;

    let targetRatio = 4 / 5;
    if (aspectRatio === '1:1') targetRatio = 1;
    if (aspectRatio === '16:9') targetRatio = 16 / 9;
    if (aspectRatio === 'free') {
      targetRatio = naturalSize.width / naturalSize.height || 1;
    }

    let w = maxW;
    let h = w / targetRatio;

    if (h > maxH) {
      h = maxH;
      w = h * targetRatio;
    }

    return { cropW: Math.round(w), cropH: Math.round(h) };
  }, [aspectRatio, naturalSize]);

  // Handle Drag / Pan Events
  const handlePointerDown = (clientX: number, clientY: number) => {
    setIsDragging(true);
    setDragStart({ x: clientX - pan.x, y: clientY - pan.y });
  };

  const handlePointerMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    setPan({
      x: clientX - dragStart.x,
      y: clientY - dragStart.y,
    });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  // Keyboard navigation & wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.05 : 0.05;
    setZoom((prev) => Math.min(3.0, Math.max(0.8, Number((prev + delta).toFixed(2)))));
  };

  // Execute Canvas Crop & Export
  const handleApplyCrop = () => {
    if (!imageRef.current || !imageLoaded) return;

    const { cropW, cropH } = getCropDimensions();

    // Determine target canvas pixel resolution
    let targetW = 1080;
    let targetH = Math.round(targetW * (cropH / cropW));

    if (targetH > 1400) {
      targetH = 1400;
      targetW = Math.round(targetH * (cropW / cropH));
    }

    const canvas = document.createElement('canvas');
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fill background with clean white for safety
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, targetW, targetH);

    // Calculate scaling factor from screen crop box to output canvas
    const scaleFactor = targetW / cropW;

    // Center canvas coordinate system
    ctx.translate(targetW / 2, targetH / 2);

    // Apply rotation
    ctx.rotate((rotation * Math.PI) / 180);

    // Apply pan offset
    ctx.translate(pan.x * scaleFactor, pan.y * scaleFactor);

    // Base dimensions of the displayed image inside crop container
    // When rotation is 90 or 270, swap dimensions
    const isRotated90 = rotation % 180 !== 0;
    const imgAspect = naturalSize.width / naturalSize.height;

    let baseDisplayedW = cropW;
    let baseDisplayedH = baseDisplayedW / imgAspect;

    if (baseDisplayedH < cropH) {
      baseDisplayedH = cropH;
      baseDisplayedW = baseDisplayedH * imgAspect;
    }

    const drawW = baseDisplayedW * zoom * scaleFactor;
    const drawH = baseDisplayedH * zoom * scaleFactor;

    ctx.drawImage(
      imageRef.current,
      -drawW / 2,
      -drawH / 2,
      drawW,
      drawH
    );

    // Export high-quality compressed JPEG Data URL with safe fallback
    let croppedDataUrl = imageUrl;
    try {
      croppedDataUrl = canvas.toDataURL('image/jpeg', 0.88);
    } catch (err) {
      console.warn('Canvas toDataURL security restriction caught safely:', err);
      // Fallback to existing imageUrl if canvas was tainted by cross-origin
      croppedDataUrl = imageUrl;
    }

    const appliedRatio: '4:5' | '1:1' | '16:9' =
      aspectRatio === 'free'
        ? cropW / cropH >= 1.25
          ? '16:9'
          : cropW / cropH <= 0.85
          ? '4:5'
          : '1:1'
        : (aspectRatio as '4:5' | '1:1' | '16:9');

    onCropComplete(croppedDataUrl, appliedRatio);
    onClose();
  };

  if (!isOpen) return null;

  const { cropW, cropH } = getCropDimensions();

  // Compute base rendered size of the preview image
  const imgAspect = naturalSize.width / naturalSize.height || 1;
  let basePreviewW = cropW;
  let basePreviewH = basePreviewW / imgAspect;
  if (basePreviewH < cropH) {
    basePreviewH = cropH;
    basePreviewW = basePreviewH * imgAspect;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-fade-in select-none">
      {/* Modal Container */}
      <div className="bg-[#FAF8F5] text-[#111111] border border-[#DDD5C7] w-full max-w-lg shadow-2xl overflow-hidden relative flex flex-col max-h-[95vh]">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-[#E8E2D7] flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-2">
            <Crop className="w-4 h-4 text-[#8C6D3B]" />
            <div>
              <h3 className="font-serif text-base uppercase tracking-wider font-semibold text-[#2A2522]">
                {title}
              </h3>
              <p className="text-[10px] text-[#7C756E]">
                Geser & atur perbesaran untuk menentukan sudut pandang (*safe angle*) yang pas.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-black transition-colors rounded-full hover:bg-neutral-100"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Interactive Viewport Stage */}
        <div
          ref={containerRef}
          onWheel={handleWheel}
          onMouseDown={(e) => handlePointerDown(e.clientX, e.clientY)}
          onMouseMove={(e) => handlePointerMove(e.clientX, e.clientY)}
          onMouseUp={handlePointerUp}
          onMouseLeave={handlePointerUp}
          onTouchStart={(e) => handlePointerDown(e.touches[0].clientX, e.touches[0].clientY)}
          onTouchMove={(e) => handlePointerMove(e.touches[0].clientX, e.touches[0].clientY)}
          onTouchEnd={handlePointerUp}
          className="relative w-full h-[370px] sm:h-[400px] bg-[#121214] flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing shrink-0"
        >
          {/* Background image preview transformed with pan, zoom, and rotation */}
          <div
            className="absolute transition-transform duration-75 pointer-events-none"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) rotate(${rotation}deg) scale(${zoom})`,
              width: `${basePreviewW}px`,
              height: `${basePreviewH}px`,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imageRef}
              src={activeSrc}
              crossOrigin="anonymous"
              alt="Crop target"
              className="w-full h-full object-cover pointer-events-none select-none shadow-2xl"
              draggable={false}
            />
          </div>

          {/* Dark Mask Overlay with Cutout for Crop Window */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            {/* Bounded Crop Window Frame */}
            <div
              style={{ width: `${cropW}px`, height: `${cropH}px` }}
              className="relative shadow-[0_0_0_9999px_rgba(0,0,0,0.65)] border-2 border-white/95 rounded-2xs"
            >
              {/* Corner Framing Brackets */}
              <div className="absolute -top-1 -left-1 w-3.5 h-3.5 border-t-2 border-l-2 border-[#8C6D3B]" />
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 border-t-2 border-r-2 border-[#8C6D3B]" />
              <div className="absolute -bottom-1 -left-1 w-3.5 h-3.5 border-b-2 border-l-2 border-[#8C6D3B]" />
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 border-b-2 border-r-2 border-[#8C6D3B]" />

              {/* Rule of Thirds Grid Guidelines (Garis Panduan Komposisi) */}
              <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
                <div className="border-r border-b border-white/20" />
                <div className="border-r border-b border-white/20" />
                <div className="border-b border-white/20" />
                <div className="border-r border-b border-white/20" />
                <div className="border-r border-b border-white/20" />
                <div className="border-b border-white/20" />
                <div className="border-r border-white/20" />
                <div className="border-r border-white/20" />
                <div />
              </div>

              {/* Center Safe Zone Indicator */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                <div className="w-2 h-2 border border-white rounded-full" />
              </div>

              {/* Angle Helper Badge */}
              <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/70 backdrop-blur-xs text-[8.5px] font-mono text-white/90 rounded-2xs uppercase tracking-wider">
                {aspectRatio === '4:5'
                  ? 'Portrait 4:5'
                  : aspectRatio === '1:1'
                  ? 'Persegi 1:1'
                  : aspectRatio === '16:9'
                  ? 'Landscape 16:9'
                  : 'Free'}
              </div>

              {/* Drag Hint at center when not zoomed */}
              {pan.x === 0 && pan.y === 0 && zoom === 1.0 && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="px-2.5 py-1 bg-black/60 backdrop-blur-xs text-white/80 text-[10px] tracking-wide rounded-full flex items-center gap-1">
                    <Move className="w-3 h-3" />
                    <span>Geser foto untuk sesuaikan sudut</span>
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Controls Bar */}
        <div className="p-4 bg-[#FAF8F5] border-t border-[#E8E2D7] space-y-3 shrink-0 overflow-y-auto">
          {/* Aspect Ratio Presets */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="text-[10px] uppercase tracking-wider text-[#7C756E] font-medium">
              Bentuk Potongan:
            </span>
            <div className="flex items-center gap-1.5">
              {(
                [
                  { id: '4:5', label: 'Portrait 4:5' },
                  { id: '1:1', label: 'Persegi 1:1' },
                  { id: '16:9', label: 'Wide 16:9' },
                ] as const
              ).map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => {
                    setAspectRatio(preset.id);
                    setPan({ x: 0, y: 0 });
                  }}
                  className={`px-2.5 py-1 text-[10px] font-medium border rounded-xs transition-colors ${
                    aspectRatio === preset.id
                      ? 'bg-[#2A2522] text-white border-[#2A2522]'
                      : 'bg-white text-neutral-600 border-[#DDD5C7] hover:border-neutral-400'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Zoom Slider & Actions */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-1">
              <ZoomOut
                className="w-3.5 h-3.5 text-neutral-400 cursor-pointer hover:text-black"
                onClick={() => setZoom((prev) => Math.max(0.8, Number((prev - 0.2).toFixed(2))))}
              />
              <input
                type="range"
                min="0.8"
                max="2.8"
                step="0.05"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-[#E2DDD5] rounded-lg appearance-none cursor-pointer accent-[#8C6D3B]"
              />
              <ZoomIn
                className="w-3.5 h-3.5 text-neutral-400 cursor-pointer hover:text-black"
                onClick={() => setZoom((prev) => Math.min(2.8, Number((prev + 0.2).toFixed(2))))}
              />
              <span className="text-[10px] font-mono text-[#7C756E] w-10 text-right">
                {Math.round(zoom * 100)}%
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setRotation((prev) => (prev + 90) % 360)}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] bg-white border border-[#DDD5C7] hover:border-neutral-400 text-neutral-700 rounded-xs transition-colors"
                title="Putar 90 Derajat"
              >
                <RotateCw className="w-3 h-3" />
                <span>Putar</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setZoom(1.0);
                  setPan({ x: 0, y: 0 });
                  setRotation(0);
                }}
                className="px-2 py-1 text-[10px] text-neutral-400 hover:text-neutral-700 underline underline-offset-2"
                title="Reset Posisi & Zoom"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="px-5 py-3 border-t border-[#E8E2D7] bg-white flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs text-[#7C756E] hover:text-[#2A2522] font-medium transition-colors"
          >
            Batal
          </button>

          <button
            type="button"
            onClick={handleApplyCrop}
            className="inline-flex items-center gap-1.5 px-5 py-2 bg-[#2A2522] text-[#FAF8F5] hover:bg-black text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs"
          >
            <Check className="w-3.5 h-3.5 text-[#E6C687]" />
            <span>Terapkan & Simpan Crop</span>
          </button>
        </div>
      </div>
    </div>
  );
}
