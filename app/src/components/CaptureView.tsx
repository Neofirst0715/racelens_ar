/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Camera, Video, Maximize2, Share2, Layers, Compass, Image as ImageIcon, Check } from "lucide-react";

interface CaptureViewProps {
  activeBoatCode: string;
  activeBoatSpeed: string;
}

export default function CaptureView({ activeBoatCode, activeBoatSpeed }: CaptureViewProps) {
  const [mode, setMode] = useState<"photo" | "video">("photo");
  const [zoom, setZoom] = useState<0.5 | 1 | 2>(1);
  const [labelsOn, setLabelsOn] = useState(true);
  const [flash, setFlash] = useState(false);
  const [galleryCount, setGalleryCount] = useState(1);
  const [snaps, setSnaps] = useState<string[]>([
    "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=300"
  ]);
  const [showToast, setShowToast] = useState(false);

  // Background images matching the selected zoom level
  const oceanBackgrounds = {
    0.5: "https://images.unsplash.com/photo-1605281317010-fe590f440ca7?auto=format&fit=crop&q=80&w=1200", // Wide fleet
    1: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=1200",   // Standard superyacht
    2: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&q=80&w=1200"    // Close-up details
  };

  const currentBg = oceanBackgrounds[zoom];

  const handleCapture = () => {
    // Trigger flash
    setFlash(true);
    setTimeout(() => setFlash(false), 200);

    // Save snap
    setGalleryCount((prev) => prev + 1);
    setSnaps((prev) => [currentBg, ...prev.slice(0, 2)]);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <div className="w-full h-full bg-black text-[#dde3e7] font-sans flex flex-col justify-between p-4 relative overflow-hidden select-none">
      {/* Visual shutter flash state */}
      {flash && (
        <div className="absolute inset-0 bg-white z-40 animate-fade-out" />
      )}

      {/* Floating Mode Toggle segmented control at top-center */}
      <div className="absolute top-5 left-1/2 -translate-x-1/2 z-20 bg-[#161d1f]/95 backdrop-blur-md px-1 py-1 rounded-full border border-white/10 flex items-center shadow-lg">
        <button
          id="btn-mode-photo"
          className={`px-5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center space-x-1.5 ${
            mode === "photo" ? "bg-white text-black font-extrabold shadow-sm" : "text-[#bbc9cf] hover:text-white"
          }`}
          onClick={() => setMode("photo")}
        >
          <Camera className="w-3.5 h-3.5" />
          <span>Photo</span>
        </button>
        <button
          id="btn-mode-video"
          className={`px-5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center space-x-1.5 ${
            mode === "video" ? "bg-red-500 text-white font-extrabold shadow-sm" : "text-[#bbc9cf] hover:text-white"
          }`}
          onClick={() => setMode("video")}
        >
          <Video className="w-3.5 h-3.5" />
          <span>Video</span>
        </button>
      </div>

      {/* Gallery Thumbnail Preview at top-right exactly as Screen 6 */}
      <div className="absolute top-4 right-4 z-20 flex flex-col items-end">
        <div className="relative w-11 h-11 rounded-lg border border-white/30 overflow-hidden bg-black/60 shadow-md">
          <img
            alt="Camera roll preview"
            className="w-full h-full object-cover"
            src={snaps[0]}
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-[10px] font-mono font-bold text-white leading-none">
            +{galleryCount}
          </div>
        </div>
      </div>

      {/* Camera frame preview boundary */}
      <div className="absolute inset-x-6 top-18 bottom-32 z-10 border border-white/15 pointer-events-none rounded-2xl flex items-center justify-center">
        {/* Focal box in the very screen center */}
        <div className="w-16 h-16 border border-[#00d4ff]/60 relative shrink-0">
          <div className="absolute top-0 left-0 w-3 h-0.5 bg-[#00d4ff]" />
          <div className="absolute top-0 left-0 w-0.5 h-3 bg-[#00d4ff]" />
          <div className="absolute top-0 right-0 w-3 h-0.5 bg-[#00d4ff]" />
          <div className="absolute top-0 right-0 w-0.5 h-3 bg-[#00d4ff]" />
          <div className="absolute bottom-0 left-0 w-3 h-0.5 bg-[#00d4ff]" />
          <div className="absolute bottom-0 left-0 w-0.5 h-3 bg-[#00d4ff]" />
          <div className="absolute bottom-0 right-0 w-3 h-0.5 bg-[#00d4ff]" />
          <div className="absolute bottom-0 right-0 w-0.5 h-3 bg-[#00d4ff]" />
        </div>

        {/* Framing tick marks on side */}
        <div className="absolute left-3 text-[10px] font-mono text-white/40 tracking-wider">
          <div className="mb-1">[- -]</div>
          <div>F2.4</div>
        </div>
        <div className="absolute right-3 text-[10px] font-mono text-white/40 tracking-wider text-right">
          <div className="mb-1">ISO 400</div>
          <div>1/250s</div>
        </div>
      </div>

      {/* Main viewport canvas background of Unsplash live yachting photos */}
      <div className="absolute inset-0 z-0 bg-[#0e1417]">
        <img
          alt="Live camera canvas feed preview"
          className="w-full h-full object-cover transition-all duration-500 transform"
          style={{
            transform: `scale(${zoom === 0.5 ? 0.95 : zoom === 2 ? 1.4 : 1.15})`,
            filter: "brightness(0.7) contrast(1.15)"
          }}
          referrerPolicy="no-referrer"
          src={currentBg}
        />
        {/* Subtle camera frame glass glare */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/2 to-transparent pointer-events-none" />
      </div>

      {/* Floating HUD Camera labels superimposed on Yachts (Screen 6) */}
      {labelsOn && (
        <div className="absolute inset-0 z-10 pointer-events-none select-none">
          {/* Target Yacht mark lock */}
          <div className="absolute top-1/3 left-1/3 flex flex-col items-center">
            <div className="bg-[#00d4ff]/80 backdrop-blur-md px-3 py-1 rounded-full text-black font-semibold text-[10px] tracking-wide flex items-center space-x-1 shadow-md">
              <span className="w-1.5 h-1.5 rounded-full bg-black animate-ping" />
              <span>{activeBoatCode}-142</span>
              <span className="opacity-75">{activeBoatSpeed}</span>
            </div>
          </div>

          {/* Mark Buoy lock */}
          <div className="absolute top-1/2 left-2/3 flex flex-col items-center">
            <div className="bg-[#ffb3b0]/75 backdrop-blur-md px-3 py-1 rounded-full text-black font-semibold text-[10px] tracking-wide flex items-center space-x-1 shadow-md">
              <span className="w-1.5 h-1.5 rounded-full bg-black animate-ping" />
              <span>Mark 2</span>
              <span className="opacity-75">450m</span>
            </div>
          </div>
        </div>
      )}

      {/* Toast Alert securing snaps */}
      {showToast && (
        <div className="absolute top-22 left-1/2 -translate-x-1/2 z-30 bg-[#00d4ff] text-black px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 shadow-md animate-bounce">
          <Check className="w-4 h-4 text-black stroke-[3]" />
          <span>Snapshot Saved to Ship Logs</span>
        </div>
      )}

      {/* Floating controller panel: Contains Labels toggle, central shutter, and zoom select */}
      <div className="absolute bottom-5 inset-x-4 z-20 max-w-sm mx-auto flex items-center justify-between bg-black/60 backdrop-blur-xl px-5 py-4 rounded-full border border-white/12 shadow-xl">
        {/* Toggle Overlays button exactly as Screen 6 */}
        <button
          id="btn-toggle-labels"
          className={`px-4 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-1.5 pointer-events-auto cursor-pointer ${
            labelsOn
              ? "bg-[#00d4ff]/15 text-[#00d4ff] border border-[#00d4ff]/30 shadow-md"
              : "bg-white/5 text-[#bbc9cf]/60 border border-transparent hover:text-white"
          }`}
          onClick={() => setLabelsOn(!labelsOn)}
        >
          <Layers className="w-4 h-4" />
          <span className="text-[10px]">{labelsOn ? "Labels On" : "Labels Off"}</span>
        </button>

        {/* Large central Capture Shutter exactly as Screen 6 */}
        <button
          id="btn-capture-shut"
          className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center p-1 bg-transparent hover:scale-105 active:scale-95 transition-all cursor-pointer pointer-events-auto"
          onClick={handleCapture}
          title="Snap Photo"
        >
          <div className="w-full h-full rounded-full bg-white flex items-center justify-center hover:bg-white/95">
            {mode === "photo" ? (
              <Camera className="w-6 h-6 text-black" />
            ) : (
              <div className="w-4.5 h-4.5 bg-red-600 rounded-sm animate-pulse" />
            )}
          </div>
        </button>

        {/* Compact Zoom Selector exactly as Screen 6 (.5x, 1x, 2x) */}
        <div className="bg-white/5 rounded-full border border-white/6 p-0.5 flex space-x-0.5 pointer-events-auto text-[10px] font-mono leading-none">
          {([0.5, 1, 2] as const).map((z) => {
            const Active = zoom === z;
            return (
              <button
                id={`btn-zoom-${z}x`}
                key={z}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] transition-all cursor-pointer font-bold ${
                  Active ? "bg-[#00d4ff] text-black font-extrabold" : "text-[#bbc9cf] hover:text-white"
                }`}
                onClick={() => setZoom(z)}
              >
                {z}x
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
