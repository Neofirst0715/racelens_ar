/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Compass, Camera, Sparkles, Navigation, ShieldCheck, AlertCircle } from "lucide-react";

interface SplashOnboardingProps {
  onComplete: (locationGranted: boolean, cameraGranted: boolean) => void;
}

export default function SplashOnboarding({ onComplete }: SplashOnboardingProps) {
  const [step, setStep] = useState<"splash" | "permissions">("splash");
  const [locAllowed, setLocAllowed] = useState(true);
  const [camAllowed, setCamAllowed] = useState(true);
  const [loading, setLoading] = useState(false);
  const [percent, setPercent] = useState(0);

  // Auto redirect timer or simple button click
  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setPercent((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setLoading(false);
            if (step === "splash") {
              setStep("permissions");
            } else {
              onComplete(locAllowed, camAllowed);
            }
            return 100;
          }
          return prev + 5;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [loading, step, locAllowed, camAllowed, onComplete]);

  const handleStartBoot = () => {
    setLoading(true);
    setPercent(0);
  };

  const handleAllowAccess = () => {
    setLoading(true);
    setPercent(0);
  };

  return (
    <div className="fixed inset-0 bg-[#0e1417] text-[#dde3e7] overflow-hidden flex flex-col justify-center items-center z-50 font-sans">
      {/* Cinematic Grain Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0 mix-blend-overlay bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')]" />

      {/* Cyber ambient glow bubbles */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00d4ff]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#ffb3b0]/5 rounded-full blur-[120px] pointer-events-none" />

      {step === "splash" ? (
        <main className="flex flex-col items-center justify-center z-10 p-6 text-center max-w-md w-full animate-fade-in">
          {/* Logo Lockup */}
          <div className="relative w-52 h-52 mb-8 select-none">
            {/* Animated outer spinning HUD ring */}
            <svg
              className="absolute inset-0 w-full h-full text-[#00d4ff] animate-[spin_12s_linear_infinite] opacity-60"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 100 100"
            >
              <circle cx="50" cy="50" r="46" stroke="rgba(255,255,255,0.06)" />
              <path
                d="M 50 4 A 46 46 0 0 1 96 50 M 50 96 A 46 46 0 0 1 4 50"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="25 60"
              />
            </svg>

            {/* Inner secondary telemetry orbit ring */}
            <svg
              className="absolute inset-2 w-[calc(100%-16px)] h-[calc(100%-16px)] text-[#ffb3b0] animate-[spin_6s_linear_infinite_reverse] opacity-40"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              viewBox="0 0 100 100"
            >
              <circle cx="50" cy="50" r="42" strokeDasharray="5 30 15 10" />
            </svg>

            {/* Central Logo Image */}
            <div className="absolute inset-6 rounded-full overflow-hidden shadow-[0_0_40px_rgba(0,212,255,0.25)] border border-[#00d4ff]/20 bg-black/40">
              <img
                alt="RaceLens AR Logo"
                className="w-full h-full object-cover select-none pointer-events-none scale-105"
                referrerPolicy="no-referrer"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdOe-l2phL3KJG5p20BwcFeF_dG0Fy8m-1g5E3E4KGDHsZnWSlxc7lAI3Yyfoe6Gx3ru4wxMGoTARZjdrwyqXcvKCBGzp3suka2pCVxgdgFGMpR9Hvbf_-jRiwHboNb68C7M-czYaSxT3Us6z_IIK7VXKUAlC3uLjKkUsxi5PDNEg9O2QmgjxB8lzePUanR4RPAMeEKB6OCsNUmpzJN7-iNCUjGmf4JR6wQeNDCfmB-Cr0eV4GonBfjcslq5R8pum-4vt-mkIUO20"
              />
            </div>
          </div>

          {/* Typography Lockup */}
          <div className="flex flex-col items-center space-y-2 mb-10">
            <h1 className="font-sans font-bold text-4xl tracking-tight text-[#dde3e7] flex items-center">
              RaceLens <span className="text-[#00d4ff] ml-2 font-mono font-semibold">AR</span>
            </h1>
            <p className="font-sans text-[#bbc9cf] text-sm font-medium tracking-widest uppercase">
              See the Race. Feel the Speed.
            </p>
          </div>

          {/* Loading status or Boot button */}
          <div className="w-full px-6 min-h-[72px]">
            {loading ? (
              <div className="space-y-3">
                <div className="text-xs font-mono text-[#00d4ff] tracking-widest uppercase">
                  Initializing tactical telemetry {percent}%
                </div>
                <div className="h-1.5 w-full bg-[#161d1f] rounded-full overflow-hidden border border-white/5 p-[1px]">
                  <div
                    className="h-full bg-gradient-to-r from-[#00d4ff] to-[#3cd7ff] rounded-full transition-all duration-75"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            ) : (
              <button
                id="btn-boot-interface"
                className="w-full h-14 bg-gradient-to-r from-[#00d4ff] to-[#00586b] hover:from-[#3cd7ff] hover:to-[#00677e] text-black font-bold tracking-widest uppercase text-sm rounded-lg transition-all duration-300 shadow-[0_0_20px_rgba(0,212,255,0.3)] hover:shadow-[0_0_30px_rgba(0,212,255,0.5)] transform hover:scale-[1.02]"
                onClick={handleStartBoot}
              >
                Launch HUD Receiver
              </button>
            )}
          </div>

          <div className="mt-8 text-[11px] font-mono text-[#bbc9cf]/40 uppercase tracking-widest">
            Licensed for Pro-America's Cup Telemetric Overlays
          </div>
        </main>
      ) : (
        <main className="flex flex-col items-center justify-center z-10 p-6 text-center max-w-sm w-full animate-fade-in">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-[#dde3e7]">
              Enable Features
            </h2>
            <p className="text-sm text-[#bbc9cf] mt-1.5">
              Allow access to fully utilize the HUD environment.
            </p>
          </div>

          {/* Feature List */}
          <div className="w-full space-y-4 mb-10 text-left">
            {/* Location Tile */}
            <button
              id="tile-location-access"
              className={`w-full p-4 rounded-xl border transition-all duration-300 flex items-start space-x-4 bg-[#161d1f]/40 ${
                locAllowed
                  ? "border-[#00d4ff]/20 shadow-[0_0_15px_rgba(0,212,255,0.05)] text-[#dde3e7]"
                  : "border-white/5 text-[#dde3e7]/50"
              }`}
              onClick={() => setLocAllowed(!locAllowed)}
            >
              <div
                className={`p-2.5 rounded-lg shrink-0 transition-colors duration-300 ${
                  locAllowed ? "bg-[#00d4ff]/10 text-[#00d4ff]" : "bg-white/5 text-[#bbc9cf]/40"
                }`}
              >
                <Navigation className="w-5 h-5 shrink-0" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center text-[13px] font-bold uppercase tracking-wider">
                  Location Access
                  {locAllowed && (
                    <span className="ml-2 text-[10px] bg-[#00d4ff]/10 text-[#00d4ff] px-2 py-0.5 rounded-full lowercase font-mono">
                      linked
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#bbc9cf] leading-relaxed">
                  Required for tactical map coordinate grids and local true wind vector calculation arrays.
                </p>
              </div>
            </button>

            {/* Camera Tile */}
            <button
              id="tile-camera-access"
              className={`w-full p-4 rounded-xl border transition-all duration-300 flex items-start space-x-4 bg-[#161d1f]/40 ${
                camAllowed
                  ? "border-[#ffb3b0]/20 shadow-[0_0_15px_rgba(255,179,176,0.05)] text-[#dde3e7]"
                  : "border-white/5 text-[#dde3e7]/50"
              }`}
              onClick={() => setCamAllowed(!camAllowed)}
            >
              <div
                className={`p-2.5 rounded-lg shrink-0 transition-colors duration-300 ${
                  camAllowed ? "bg-[#ffb3b0]/10 text-[#ffb3b0]" : "bg-white/5 text-[#bbc9cf]/40"
                }`}
              >
                <Camera className="w-5 h-5 shrink-0" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center text-[13px] font-bold uppercase tracking-wider">
                  Camera Access
                  {camAllowed && (
                    <span className="ml-2 text-[10px] bg-[#ffb3b0]/10 text-[#ffb3b0] px-2 py-0.5 rounded-full lowercase font-mono">
                      linked
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#bbc9cf] leading-relaxed">
                  Required for superimposing live Augmented Reality overlay lines directly on vessel sails.
                </p>
              </div>
            </button>
          </div>

          {/* Confirmation panel */}
          <div className="w-full px-2 min-h-[96px]">
            {loading ? (
              <div className="space-y-3">
                <div className="text-xs font-mono text-[#00d4ff] tracking-widest uppercase text-center">
                  Linking physical hardware sensors...
                </div>
                <div className="h-1.5 w-full bg-[#161d1f] rounded-full overflow-hidden border border-white/5 p-[1px]">
                  <div
                    className="h-full bg-gradient-to-r from-[#00d4ff] to-[#ffb3b0] rounded-full transition-all duration-75"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  id="btn-allow-access"
                  className="w-full h-12 bg-gradient-to-r from-[#00d4ff] to-[#3cd7ff] hover:opacity-90 text-black font-bold tracking-wider uppercase text-xs rounded-lg transition-all duration-300 shadow-[0_0_20px_rgba(0,212,255,0.25)] transform active:scale-95"
                  onClick={handleAllowAccess}
                >
                  Verify and Connect
                </button>
                <button
                  id="btn-deny-access"
                  className="w-full h-10 hover:text-white text-[#bbc9cf]/60 text-xs font-semibold uppercase tracking-wider transition-all duration-200"
                  onClick={() => onComplete(false, false)}
                >
                  Skip for Now
                </button>
              </div>
            )}
          </div>

          {/* Secure disclaimer */}
          <div className="mt-8 flex items-center justify-center space-x-2 text-[11px] text-[#bbc9cf]/40 tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="uppercase font-mono">Telemetry Safe Encryption Enabled</span>
          </div>
        </main>
      )}
    </div>
  );
}
