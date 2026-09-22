'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import jsQR from 'jsqr';
import { X, Camera, RefreshCw, Volume2, VolumeX, CheckCircle2, AlertCircle } from 'lucide-react';
import { playSuccessChime } from '@/lib/audio-chime';

interface QrCameraScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (payload: string) => { success: boolean; guestName?: string; category?: string; message?: string };
}

export function QrCameraScannerModal({
  isOpen,
  onClose,
  onScan,
}: QrCameraScannerModalProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameId = useRef<number | null>(null);

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [isMuted, setIsMuted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [recentScanResult, setRecentScanResult] = useState<{
    success: boolean;
    guestName?: string;
    category?: string;
    message?: string;
  } | null>(null);
  const [isScanningPaused, setIsScanningPaused] = useState(false);

  // Stop camera media tracks
  const stopCamera = useCallback(() => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((t) => t.stop());
      videoRef.current.srcObject = null;
    }
  }, []);

  // Start camera stream
  const startCamera = useCallback(async () => {
    stopCamera();
    setErrorMessage(null);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setHasPermission(false);
      setErrorMessage('Browser tidak mendukung akses kamera langsung. Silakan gunakan input manual.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true'); // Required for iOS Safari
        await videoRef.current.play();
        setHasPermission(true);
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      setHasPermission(false);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setErrorMessage('Izin kamera ditolak. Silakan berikan izin kamera di browser Anda.');
      } else {
        setErrorMessage('Gagal membuka kamera: ' + (err.message || 'Kamera tidak ditemukan.'));
      }
    }
  }, [facingMode, stopCamera]);

  // Main QR detection frame loop
  const tick = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || isScanningPaused) {
      animationFrameId.current = requestAnimationFrame(tick);
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });

      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'dontInvert',
        });

        if (code && code.data) {
          // Found QR Code!
          setIsScanningPaused(true);
          if (!isMuted) {
            playSuccessChime();
          }

          if (typeof navigator !== 'undefined' && navigator.vibrate) {
            try {
              navigator.vibrate([100, 50, 100]);
            } catch {
              // Ignore vibrate error
            }
          }

          const result = onScan(code.data);
          setRecentScanResult(result);

          // Auto resume scanning after 2.2 seconds for smooth reception queue
          setTimeout(() => {
            setRecentScanResult(null);
            setIsScanningPaused(false);
          }, 2400);
        }
      }
    }

    animationFrameId.current = requestAnimationFrame(tick);
  }, [isScanningPaused, isMuted, onScan]);

  // Lifecycle
  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
      setRecentScanResult(null);
      setIsScanningPaused(false);
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, startCamera, stopCamera]);

  useEffect(() => {
    if (isOpen && hasPermission) {
      animationFrameId.current = requestAnimationFrame(tick);
    }
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isOpen, hasPermission, tick]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#141414] border border-neutral-800 text-white rounded-lg overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-800 bg-[#1A1A1A]">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-[#E5C378]" />
            <span className="text-xs uppercase tracking-widest font-medium">
              Live QR Scanner · Meja Resepsi
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-1.5 rounded-full border transition-colors ${
                isMuted
                  ? 'border-neutral-700 text-neutral-500 hover:text-neutral-300'
                  : 'border-[#E5C378]/40 text-[#E5C378] bg-[#E5C378]/10'
              }`}
              title={isMuted ? 'Aktifkan Suara Bel' : 'Bisukan Suara Bel'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'))}
              className="p-1.5 rounded-full border border-neutral-700 text-neutral-400 hover:text-white hover:border-neutral-500 transition-colors"
              title="Ganti Kamera (Depan / Belakang)"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full border border-neutral-700 text-neutral-400 hover:text-white hover:border-neutral-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Video Viewport Area */}
        <div className="relative aspect-[4/3] bg-black overflow-hidden flex items-center justify-center">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            playsInline
            muted
          />
          {/* Offscreen hidden canvas for jsQR image decoding */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Scanner Overlay Guide */}
          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-6">
            {/* Darkened mask cutout */}
            <div className="relative w-64 h-64 border-2 border-white/40 rounded-lg overflow-hidden shadow-[0_0_0_9999px_rgba(0,0,0,0.55)]">
              {/* Corner brackets */}
              <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-[#E5C378]" />
              <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-[#E5C378]" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-[#E5C378]" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-[#E5C378]" />

              {/* Laser animation bar */}
              {!isScanningPaused && (
                <div className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#E5C378] to-transparent animate-pulse shadow-[0_0_8px_#E5C378]" />
              )}
            </div>

            <p className="text-[11px] uppercase tracking-widest text-white/80 font-light mt-4 bg-black/60 px-3 py-1 rounded-full backdrop-blur-sm">
              Arahkan QR Code Tamu ke Dalam Kotak
            </p>
          </div>

          {/* Success / Error Notification Toast overlay */}
          {recentScanResult && (
            <div className="absolute inset-0 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-fade-in z-20">
              {recentScanResult.success ? (
                <div className="space-y-3">
                  <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center animate-bounce">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase tracking-ultra text-emerald-400 font-semibold block">
                      CHECK-IN BERHASIL · AKSES DITERIMA
                    </span>
                    <h3 className="font-serif text-2xl uppercase tracking-wide text-white">
                      {recentScanResult.guestName}
                    </h3>
                    {recentScanResult.category && (
                      <span className="inline-block mt-1 px-2.5 py-0.5 text-[9px] uppercase tracking-widest font-semibold border border-[#E5C378]/50 bg-[#E5C378]/10 text-[#E5C378]">
                        {recentScanResult.category}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-white/60 font-light pt-2">
                    Kehadiran tercatat resmi di sistem resepsi.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="w-14 h-14 mx-auto rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center">
                    <AlertCircle className="w-8 h-8" />
                  </div>
                  <h3 className="font-serif text-lg uppercase tracking-wide text-white">
                    Kode Tidak Dikenali
                  </h3>
                  <p className="text-xs text-white/70 font-light max-w-xs">
                    {recentScanResult.message || 'QR code ini bukan milik daftar tamu undangan ini.'}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Error Message if permission denied */}
          {errorMessage && (
            <div className="absolute inset-0 bg-neutral-950 flex flex-col items-center justify-center p-6 text-center space-y-3 z-10">
              <AlertCircle className="w-10 h-10 text-amber-500" />
              <p className="text-xs text-white/80 max-w-sm">{errorMessage}</p>
              <button
                onClick={startCamera}
                className="mt-2 px-4 py-2 text-xs uppercase tracking-widest bg-white text-black hover:bg-neutral-200 transition-colors"
              >
                Coba Buka Kamera Lagi
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#1A1A1A] border-t border-neutral-800 flex items-center justify-between text-[11px] text-neutral-400">
          <div className="flex items-center gap-1.5">
            <Camera className="w-3.5 h-3.5 text-[#E5C378]" />
            <span>Kamera {facingMode === 'environment' ? 'Belakang' : 'Depan'} Aktif</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 uppercase tracking-widest text-[10px] border border-neutral-700 hover:border-neutral-500 text-white transition-colors"
          >
            Tutup Scanner
          </button>
        </div>
      </div>
    </div>
  );
}
