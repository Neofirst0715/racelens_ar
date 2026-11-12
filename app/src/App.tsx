/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { INITIAL_YACHTS } from "./data";
import { Yacht, ActiveTab, OnboardingStep } from "./types";
import SplashOnboarding from "./components/SplashOnboarding";
import ARTrackView from "./components/ARTrackView";
import ReplayView from "./components/ReplayView";
import CaptureView from "./components/CaptureView";
import SettingsView from "./components/SettingsView";
import EventTimelineDrawer from "./components/EventTimelineDrawer";
import { Compass, Clock, Camera, Settings as Gear, ShieldCheck, Flag } from "lucide-react";

export default function App() {
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>("splash");
  const [activeTab, setActiveTab] = useState<ActiveTab>("ar_track");
  const [useKmh, setUseKmh] = useState(false);
  const [yachts, setYachts] = useState<Yacht[]>(INITIAL_YACHTS);
  const [activeBoatCode, setActiveBoatCode] = useState("CAN");
  const [backgroundUrl, setBackgroundUrl] = useState(
    "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=1200"
  );
  const [trueWindSpeed, setTrueWindSpeed] = useState(16);
  const [waveHeight, setWaveHeight] = useState(1.2);

  // Timeline Drawer parameters
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);
  const [timelineBoatCode, setTimelineBoatCode] = useState("CAN");

  const activeBoat = yachts.find((y) => y.code === activeBoatCode) || yachts[0];

  const handleOnboardingComplete = (locGranted: boolean, camGranted: boolean) => {
    setOnboardingStep("hud");
    // Optionally trigger alerts or adjust layouts depending on permissions granted
  };

  const handleSelectBoat = (boat: Yacht) => {
    setActiveBoatCode(boat.code);
  };

  const handleSelectBoatByCode = (code: string) => {
    setActiveBoatCode(code);
  };

  const handleOpenTimeline = (code: string) => {
    setTimelineBoatCode(code);
    setIsTimelineOpen(true);
  };

  if (onboardingStep !== "hud") {
    return <SplashOnboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="relative w-screen h-screen flex flex-col justify-between bg-[#0e1417] text-[#dde3e7] font-sans overflow-hidden">
      {/* Top Header Row exactly as in standard maritime layouts */}
      <header className="z-30 bg-[#0e1417]/95 border-b border-white/6 px-5 py-3.5 flex items-center justify-between shadow-sm select-none shrink-0">
        <div className="flex items-center space-x-2">
          {/* Decorative small wind banner */}
          <div className="w-2.5 h-2.5 rounded-full bg-[#00d4ff] animate-pulse" />
          <h1 className="font-sans font-extrabold text-base tracking-tight text-[#dde3e7] leading-none">
            RaceLens <span className="text-[#00d4ff] font-mono font-medium text-sm">AR</span>
          </h1>
        </div>

        {/* Global True Wind Status display overlay */}
        <div className="flex items-center space-x-4 text-[10px] font-mono uppercase tracking-wider text-[#bbc9cf]/80">
          <div className="flex items-center space-x-1.5 border-r border-white/10 pr-3.5">
            <span className="text-[#00d4ff] font-semibold">TRUE WIND:</span>
            <span className="text-white font-bold">{trueWindSpeed} KTS</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="text-[#00d4ff] font-semibold">WAVE HEIGHT:</span>
            <span className="text-white font-bold">{waveHeight} M</span>
          </div>
        </div>
      </header>

      {/* Primary Dashboard Central Scroll Arena */}
      <main className="flex-1 relative overflow-hidden bg-[#0c1012] shrink-0 min-h-0">
        {activeTab === "ar_track" && (
          <ARTrackView
            yachts={yachts}
            useKmh={useKmh}
            activeBoat={activeBoat}
            onSelectBoat={handleSelectBoat}
            backgroundUrl={backgroundUrl}
            onOpenTimeline={handleOpenTimeline}
          />
        )}

        {activeTab === "replay" && <ReplayView yachts={yachts} useKmh={useKmh} />}

        {activeTab === "capture" && (
          <CaptureView
            activeBoatCode={activeBoat.code}
            activeBoatSpeed={useKmh ? `${(activeBoat.speedKts * 1.852).toFixed(1)}km/h` : `${activeBoat.speedKts.toFixed(1)}kts`}
          />
        )}

        {activeTab === "settings" && (
          <SettingsView
            yachts={yachts}
            useKmh={useKmh}
            onToggleUnits={setUseKmh}
            onSelectBackground={setBackgroundUrl}
            backgroundUrl={backgroundUrl}
            activeBoatCode={activeBoatCode}
            onSelectBoatByCode={handleSelectBoatByCode}
            trueWindSpeed={trueWindSpeed}
            onSetTrueWind={setTrueWindSpeed}
            waveHeight={waveHeight}
            onSetWaveHeight={setWaveHeight}
          />
        )}
      </main>

      {/* Global Slide-Up Event Timeline Drawer overlay */}
      <EventTimelineDrawer
        isOpen={isTimelineOpen}
        onClose={() => setIsTimelineOpen(false)}
        yachts={yachts}
        initialTeamCode={timelineBoatCode}
      />

      {/* Bottom Navigation System (Screens 3, 4, 6, 7) */}
      <nav className="z-30 bg-[#0e1417]/95 border-t border-white/6 px-4 py-2 shrink-0 select-none">
        <div className="max-w-md mx-auto grid grid-cols-4 gap-1">
          {/* AR Track button */}
          <button
            id="nav-btn-ar-track"
            className={`py-1.5 flex flex-col items-center space-y-1 rounded-xl transition-all cursor-pointer ${
              activeTab === "ar_track"
                ? "text-[#00d4ff] bg-[#00d4ff]/5 font-semibold"
                : "text-[#bbc9cf] hover:text-white"
            }`}
            onClick={() => setActiveTab("ar_track")}
          >
            <Compass className={`w-4.5 h-4.5 ${activeTab === "ar_track" ? "animate-spin-slow stroke-[2.2]" : ""}`} />
            <span className="text-[10px] uppercase font-mono tracking-wider">AR Track</span>
          </button>

          {/* Replay button */}
          <button
            id="nav-btn-replay"
            className={`py-1.5 flex flex-col items-center space-y-1 rounded-xl transition-all cursor-pointer ${
              activeTab === "replay"
                ? "text-[#00d4ff] bg-[#00d4ff]/5 font-semibold"
                : "text-[#bbc9cf] hover:text-white"
            }`}
            onClick={() => setActiveTab("replay")}
          >
            <Clock className="w-4.5 h-4.5" />
            <span className="text-[10px] uppercase font-mono tracking-wider">Replay</span>
          </button>

          {/* Capture button */}
          <button
            id="nav-btn-capture"
            className={`py-1.5 flex flex-col items-center space-y-1 rounded-xl transition-all cursor-pointer ${
              activeTab === "capture"
                ? "text-[#00d4ff] bg-[#00d4ff]/5 font-semibold"
                : "text-[#bbc9cf] hover:text-white"
            }`}
            onClick={() => setActiveTab("capture")}
          >
            <Camera className="w-4.5 h-4.5" />
            <span className="text-[10px] uppercase font-mono tracking-wider">Capture</span>
          </button>

          {/* Settings button */}
          <button
            id="nav-btn-settings"
            className={`py-1.5 flex flex-col items-center space-y-1 rounded-xl transition-all cursor-pointer ${
              activeTab === "settings"
                ? "text-[#00d4ff] bg-[#00d4ff]/5 font-semibold"
                : "text-[#bbc9cf] hover:text-white"
            }`}
            onClick={() => setActiveTab("settings")}
          >
            <Gear className={`w-4.5 h-4.5 ${activeTab === "settings" ? "animate-spin-slow" : ""}`} />
            <span className="text-[10px] uppercase font-mono tracking-wider">Settings</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
