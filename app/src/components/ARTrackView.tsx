/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Yacht, TacticalEvent } from "../types";
import { TIMELINE_EVENTS } from "../data";
import {
  Compass,
  ArrowUp,
  Award,
  Sparkles,
  ChevronDown,
  ChevronUp,
  X,
  Target,
  AlertTriangle,
  History,
  CheckCircle,
  TrendingUp,
  Gauge,
  Navigation
} from "lucide-react";

interface ARTrackViewProps {
  yachts: Yacht[];
  useKmh: boolean;
  activeBoat: Yacht;
  onSelectBoat: (yacht: Yacht) => void;
  backgroundUrl: string;
  onOpenTimeline: (teamCode: string) => void;
}

export default function ARTrackView({
  yachts,
  useKmh,
  activeBoat,
  onSelectBoat,
  backgroundUrl,
  onOpenTimeline
}: ARTrackViewProps) {
  const [showStatsPanel, setShowStatsPanel] = useState(true);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [loadingAi, setLoadingAi] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isRealGemini, setIsRealGemini] = useState(false);
  const [radarDegree, setRadarDegree] = useState(0);

  // Convert speed
  const formatSpeed = (kts: number) => {
    if (useKmh) {
      return `${(kts * 1.852).toFixed(1)} km/h`;
    }
    return `${kts.toFixed(1)} kts`;
  };

  const getSpeedLabel = () => (useKmh ? "KM/H" : "KTS");

  // Spin radar sweeps
  useEffect(() => {
    const handle = setInterval(() => {
      setRadarDegree((prev) => (prev + 3) % 360);
    }, 40);
    return () => clearInterval(handle);
  }, []);

  // Update AI commentary cache when boat changes
  useEffect(() => {
    setAiResponse(null);
  }, [activeBoat]);

  // Request Gemini API Commentary from Express backend
  const handleGenerateAiPredict = async () => {
    setLoadingAi(true);
    setAiResponse(null);

    const speedVal = formatSpeed(activeBoat.speedKts);
    const vmgVal = formatSpeed(activeBoat.vmgKts);

    try {
      const response = await fetch("/api/ai-commentary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamCode: activeBoat.code,
          teamName: activeBoat.name,
          speed: speedVal,
          heading: `${activeBoat.headingDeg}°`,
          vmg: vmgVal,
          distToLeader: `${activeBoat.distToLeaderMeters}m`,
          situation: activeBoat.activeSituation
        })
      });
      const data = await response.json();
      setAiResponse(data.commentary);
      setIsRealGemini(data.isRealAI || false);
    } catch (e) {
      console.error("Failed to query Express API server:", e);
      // Fallback
      setAiResponse(activeBoat.activeSituation);
      setIsRealGemini(false);
    } finally {
      setLoadingAi(false);
    }
  };

  // Coordinates of boats on Screen AR viewport
  // Simulated visual scaling depending on who is focused
  const getCoordinates = (code: string) => {
    switch (code) {
      case "CAN":
        return { top: "45%", left: "50%", scale: "scale-105" };
      case "GBR":
        return { top: "28%", left: "20%", scale: "scale-90" };
      case "FRA":
        return { top: "37%", left: "80%", scale: "scale-95" };
      case "GER":
        return { top: "25%", left: "68%", scale: "scale-85" };
      case "ESP":
        return { top: "58%", left: "32%", scale: "scale-95" };
      case "DEN":
        return { top: "62%", left: "15%", scale: "scale-90" };
      default:
        return { top: "40%", left: "40%", scale: "scale-100" };
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden text-[#dde3e7] bg-[#0e1417]">
      {/* Background Live feed / ocean scene */}
      <div className="absolute inset-0 z-0">
        <img
          alt="AR Yacht Canvas"
          className="w-full h-full object-cover select-none pointer-events-none transition-all duration-700 filter brightness-[0.7] contrast-[1.05]"
          referrerPolicy="no-referrer"
          src={backgroundUrl}
        />
        {/* Deep Overlay Grid matching tactical overlays */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-[#0e1417]/30 via-transparent to-[#0e1417]/80" />

        {/* Dynamic Horizon Line indicator overlay */}
        <div className="absolute left-0 right-0 top-1/2 border-t border-[#00d4ff]/10 h-0.5 pointer-events-none flex justify-between px-6 text-[10px] font-mono text-[#00d4ff]/30 -translate-y-1/2 select-none">
          <span>TILT: -1.4°</span>
          <span>ROLL: +0.2°</span>
        </div>
      </div>

      {/* Floating Target Buoys HUD Icons */}
      <div className="absolute top-[48%] left-[72%] pointer-events-none flex flex-col items-center select-none animate-pulse">
        <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#ffb3b0]/30 text-[10px] uppercase font-mono tracking-wider flex items-center space-x-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ffb3b0] animate-ping" />
          <span className="text-[#ffb3b0] font-bold">Mark 2</span>
          <span className="text-white/60">450m</span>
        </div>
        <div className="w-0.5 h-8 bg-gradient-to-b from-[#ffb3b0]/50 to-transparent" />
      </div>

      <div className="absolute top-[32%] left-[42%] pointer-events-none flex flex-col items-center select-none">
        <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 text-[10px] uppercase font-mono tracking-wider flex items-center space-x-1">
          <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
          <span className="text-white">Gate 3</span>
          <span className="text-white/40">1.2km</span>
        </div>
        <div className="w-0.5 h-6 bg-gradient-to-b from-white/30 to-transparent" />
      </div>

      {/* Floating Yacht HUD Tags */}
      {yachts.map((boat) => {
        const Focused = activeBoat.code === boat.code;
        const coords = getCoordinates(boat.code);

        return (
          <button
            id={`hud-tag-${boat.code}`}
            key={boat.code}
            className={`absolute transition-all duration-500 cursor-pointer ${coords.scale} transform -translate-x-1/2 -translate-y-1/2 group`}
            style={{ top: coords.top, left: coords.left }}
            onClick={() => {
              onSelectBoat(boat);
              setShowStatsPanel(true);
            }}
          >
            {/* Visual alignment line */}
            <div className={`w-0.5 mx-auto transition-all duration-300 ${
              Focused ? "h-12 bg-gradient-to-b from-[#00d4ff] to-transparent/10" : "h-6 bg-white/20 group-hover:bg-white/40"
            }`} />

            {/* Custom styled Pill design directly referencing standard styles */}
            <div
              className={`px-4 py-1.5 rounded-full backdrop-blur-xl flex items-center space-x-2 transition-all duration-300 shadow-lg ${
                Focused
                  ? "bg-black/80 border-2 border-[#00d4ff] text-white scale-110 shadow-[0_0_20px_rgba(0,212,255,0.4)]"
                  : "bg-black/65 border border-white/12 text-[#bbc9cf] group-hover:bg-black/85 group-hover:border-white/30"
              }`}
            >
              <span className="text-xs shrink-0 select-none">{boat.flag}</span>
              <span className="text-[11px] font-bold tracking-wider font-mono shrink-0 uppercase">
                #{boat.code === "CAN" ? "3 CAN" : boat.code === "GBR" ? "1 GBR" : boat.code === "FRA" ? "4 FRA" : ` ${boat.code}`}
              </span>
              <span className={`text-[10px] font-mono shrink-0 opacity-60 ${Focused ? "text-[#00d4ff] opacity-100" : ""}`}>
                {formatSpeed(boat.speedKts)}
              </span>
            </div>

            {/* Visual target pointer */}
            {Focused && (
              <div className="absolute -inset-1 rounded-full border border-[#00d4ff]/30 animate-pulse pointer-events-none scale-105" />
            )}
          </button>
        );
      })}

      {/* Top Header metrics */}
      <div className="absolute top-5 left-5 right-5 z-10 flex items-start justify-between pointer-events-none select-none">
        {/* CURRENT LEG Pill */}
        <div className="bg-[#161d1f]/80 backdrop-blur-md px-4 py-3 rounded-xl border border-white/6 flex items-center space-x-3 shadow-md pointer-events-auto">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#00d4ff]/10 text-[#00d4ff]">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[9px] text-[#bbc9cf] font-mono tracking-widest uppercase">
              Current Leg
            </div>
            <div className="text-sm font-bold tracking-wider font-sans uppercase">
              Leg 3 / 5
            </div>
          </div>
        </div>

        {/* Floating Mini Precision Radar Compass */}
        <div className="relative w-22 h-22 bg-[#161d1f]/80 backdrop-blur-md rounded-xl border border-white/6 flex items-center justify-center shadow-lg pointer-events-auto">
          {/* Rotating sweep */}
          <div
            className="absolute inset-1 rounded-full border border-[#00d4ff]/10"
            style={{
              background: `conic-gradient(from ${radarDegree}deg, rgba(0, 212, 255, 0.15) 0deg, rgba(0, 212, 255, 0.1) 40deg, transparent 180deg)`
            }}
          />

          {/* Compass layout vectors */}
          <div className="absolute text-[8px] font-mono text-white/30 top-1">N</div>
          <div className="absolute text-[8px] font-mono text-white/30 bottom-1">S</div>
          <div className="absolute text-[8px] font-mono text-white/30 left-1">W</div>
          <div className="absolute text-[8px] font-mono text-white/30 right-1">E</div>

          {/* Center target dot representing user */}
          <div className="w-2 h-2 rounded-full bg-[#00d4ff] shadow-[0_0_8px_rgba(0,212,255,0.8)] z-10 animate-pulse" />

          {/* Floating blips for yachts */}
          {yachts.map((boat, idx) => {
            const isFocus = activeBoat.code === boat.code;
            // Spatially represent them around center
            const angles = [45, 120, 210, 310, 90, 160];
            const radius = [20, 32, 18, 28, 24, 34];
            const r = radius[idx] || 20;
            const a = angles[idx] || 0;
            const x = Math.round(50 + r * Math.cos((a * Math.PI) / 180)) - 50;
            const y = Math.round(50 + r * Math.sin((a * Math.PI) / 180)) - 50;
            return (
              <div
                key={boat.code}
                className={`absolute w-1 h-1 rounded-full transition-all duration-300 ${
                  isFocus ? "bg-[#00d4ff] w-1.5 h-1.5 shadow-[0_0_6px_#00d4ff]" : "bg-white/40"
                }`}
                style={{
                  transform: `translate(${x}px, ${y}px)`
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Main Stats Bottom Panel (Visible if Yacht Focused) */}
      {showStatsPanel && activeBoat && (
        <div className="absolute left-4 right-4 bottom-5 z-20 max-w-lg mx-auto bg-black/75 backdrop-blur-xl rounded-[18px] border border-white/12 px-5 py-4 shadow-2xl animate-slide-up">
          {/* Title Header */}
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/6">
            <div className="flex items-center space-x-2.5">
              <span className="text-lg leading-none shrink-0 select-none">{activeBoat.flag}</span>
              <h3 className="font-sans font-bold text-lg tracking-tight text-white uppercase select-all">
                {activeBoat.name} <span className="text-white/45 font-mono font-medium">({activeBoat.code})</span>
              </h3>
            </div>
            <button
              className="p-1 text-[#bbc9cf]/60 hover:text-white transition-colors duration-150 rounded-full hover:bg-white/10"
              onClick={() => setShowStatsPanel(false)}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Metrics Grid exact referencing Screen 3 */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            {/* Speed card */}
            <div className="bg-[#161d1f]/80 border border-white/6 rounded-xl p-2.5 text-center flex flex-col justify-between min-h-[76px] transition-all hover:bg-black/55 hover:border-[#00d4ff]/20">
              <div className="mx-auto text-[#00d4ff] opacity-80 mb-1">
                <Gauge className="w-4 h-4 stroke-[2]" />
              </div>
              <div className="font-mono text-[15px] font-bold text-white tracking-tight break-all">
                {formatSpeed(activeBoat.speedKts)}
              </div>
              <div className="text-[9px] text-[#bbc9cf]/60 font-mono tracking-wider font-semibold uppercase mt-1">
                Speed
              </div>
            </div>

            {/* Heading card */}
            <div className="bg-[#161d1f]/80 border border-white/6 rounded-xl p-2.5 text-center flex flex-col justify-between min-h-[76px] transition-all hover:bg-black/55 hover:border-[#00d4ff]/20">
              <div className="mx-auto text-[#00d4ff] opacity-80 mb-1">
                <Navigation className="w-4 h-4 stroke-[1.5]" />
              </div>
              <div className="font-mono text-[16px] font-bold text-white tracking-tight">
                {activeBoat.headingDeg}°
              </div>
              <div className="text-[9px] text-[#bbc9cf]/60 font-mono tracking-wider font-semibold uppercase mt-1">
                Heading
              </div>
            </div>

            {/* VMG card */}
            <div className="bg-[#161d1f]/80 border border-white/6 rounded-xl p-2.5 text-center flex flex-col justify-between min-h-[76px] transition-all hover:bg-black/55 hover:border-[#00d4ff]/20">
              <div className="mx-auto text-[#00d4ff] opacity-80 mb-1">
                <ArrowUp className="w-4 h-4 stroke-[2]" />
              </div>
              <div className="font-mono text-[15px] font-bold text-white tracking-tight">
                {formatSpeed(activeBoat.vmgKts * (activeBoat.code === "CAN" ? 0.74 : 0.85))}
              </div>
              <div className="text-[9px] text-[#bbc9cf]/60 font-mono tracking-wider font-semibold uppercase mt-1">
                VMG
              </div>
            </div>

            {/* Distance to Leader card */}
            <div className="bg-[#161d1f]/80 border border-white/6 rounded-xl p-2.5 text-center flex flex-col justify-between min-h-[76px] transition-all hover:bg-black/55 hover:border-[#00d4ff]/20">
              <div className="mx-auto text-[#00d4ff] opacity-80 mb-1 animate-pulse">
                <Award className="w-4 h-4 stroke-[1.5]" />
              </div>
              <div className="font-mono text-[15px] font-bold text-white tracking-tight">
                {activeBoat.distToLeaderMeters === 0 ? "LEADER" : `${activeBoat.distToLeaderMeters}m`}
              </div>
              <div className="text-[9px] text-[#bbc9cf]/60 font-mono tracking-wider font-semibold uppercase mt-1">
                Dist To Leader
              </div>
            </div>
          </div>

          {/* AI Commentary Container */}
          <div className="bg-[#161d1f]/90 border border-white/5 rounded-xl px-4 py-3.5 space-y-2 select-all shadow-inner relative overflow-hidden">
            {/* Background shimmer if querying */}
            {loadingAi && (
              <div className="absolute inset-0 bg-[#00d4ff]/5 animate-pulse pointer-events-none" />
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5 text-[10px] text-[#bbc9cf] font-mono tracking-widest uppercase font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-[#00d4ff]/80" />
                <span>AI Commentary</span>
              </div>

              {/* Predict button triggers express server */}
              <button
                id="btn-ai-predict"
                disabled={loadingAi}
                className="bg-[#00d4ff]/10 hover:bg-[#00d4ff]/20 text-[#00d4ff] border border-[#00d4ff]/30 text-[9px] font-mono tracking-widest uppercase font-extrabold px-3 py-1 rounded-full flex items-center space-x-1 hover:border-[#00d4ff]/60 transition-all cursor-pointer select-none"
                onClick={handleGenerateAiPredict}
              >
                <Sparkles className="w-3 h-3 animate-pulse" />
                <span>{loadingAi ? "Analyzing Model..." : "AI Predict"}</span>
              </button>
            </div>

            {/* Live commentary body */}
            <div className="text-xs text-white/90 leading-relaxed font-sans font-medium">
              {loadingAi ? (
                <span className="text-[#bbc9cf]/60 font-mono text-[11px] uppercase tracking-wide flex items-center">
                  <span className="w-2 h-2 rounded-full bg-[#00d4ff] animate-ping mr-2" />
                  Interpreting yacht sensor draft arrays & tactical wind lines...
                </span>
              ) : aiResponse ? (
                <div>
                  <p>{aiResponse}</p>
                  <div className="mt-2 text-[8px] font-mono text-[#00d4ff]/60 uppercase tracking-widest flex items-center space-x-1 select-none">
                    <CheckCircle className="w-3 h-3" />
                    <span>
                      {isRealGemini
                        ? "Generated Live by Gemini 3.5-Flash"
                        : "Smart Telemetry Engine Response (Full-Aesthetic Cache)"}
                    </span>
                  </div>
                </div>
              ) : (
                <p>
                  {activeBoat.flag} {activeBoat.activeSituation}
                </p>
              )}
            </div>
          </div>

          {/* VIEW TIMELINE Action Trigger */}
          <button
            id="btn-view-timeline"
            className="w-full mt-3 h-10 bg-white/5 hover:bg-white/10 active:bg-white/7 border border-white/6 hover:border-white/12 text-white font-sans font-bold text-xs tracking-wider uppercase rounded-xl flex items-center justify-center space-x-2 transition-all cursor-pointer"
            onClick={() => onOpenTimeline(activeBoat.code)}
          >
            <History className="w-4 h-4 opacity-75" />
            <span>View Vessel History & Timeline</span>
          </button>
        </div>
      )}

      {/* Mini warning if stats panel collapsed */}
      {!showStatsPanel && (
        <button
          className="absolute left-1/2 bottom-5 -translate-x-1/2 z-20 bg-black/85 backdrop-blur-md px-5 py-2.5 rounded-full border border-[#00d4ff]/30 text-xs font-bold tracking-wider text-[#00d4ff] uppercase hover:scale-105 active:scale-95 shadow-lg flex items-center space-x-2 cursor-pointer"
          onClick={() => setShowStatsPanel(true)}
        >
          <Compass className="w-4 h-4 animate-spin-slow" />
          <span>Show Telemetry Dashboard ({activeBoat.code})</span>
        </button>
      )}

      {/* Floating Leaderboard Bottom Sheet Trigger */}
      <div className="absolute right-4 bottom-5 z-20">
        <button
          id="btn-toggle-leaderboard"
          className="bg-black/80 backdrop-blur-md p-3 rounded-full border border-white/12 text-[#bbc9cf] hover:text-white hover:border-[#00d4ff]/40 transition-all shadow-md cursor-pointer"
          onClick={() => setShowLeaderboard(!showLeaderboard)}
          title="Toggle Fleet Leaderboard"
        >
          <Award className="w-5 h-5 text-[#00d4ff]" />
        </button>
      </div>

      {/* Collapsible Fleet Leaderboard Sheet overlay */}
      {showLeaderboard && (
        <div className="absolute inset-x-4 bottom-1 z-30 max-w-md mx-auto bg-[#161d1f]/95 backdrop-blur-xl border border-white/12 rounded-t-2xl p-4 shadow-2xl animate-slide-up">
          <div className="flex items-center justify-between pb-3 border-b border-white/6 mb-3">
            <div className="flex items-center space-x-2">
              <Award className="w-4 h-4 text-[#00d4ff]" />
              <span className="text-xs font-mono tracking-widest uppercase font-extrabold text-[#dde3e7]">
                Fleet Positions & VMG
              </span>
            </div>
            <button
              className="text-white/40 hover:text-white transition-colors"
              onClick={() => setShowLeaderboard(false)}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1.5 max-h-[180px] overflow-y-auto pr-1">
            {yachts.map((boat, index) => {
              const isFocused = activeBoat.code === boat.code;
              return (
                <button
                  id={`leaderboard-row-${boat.code}`}
                  key={boat.code}
                  className={`w-full text-left p-2 rounded-lg flex items-center justify-between transition-all duration-150 cursor-pointer ${
                    isFocused ? "bg-[#00d4ff]/10 border border-[#00d4ff]/30 font-semibold" : "border border-transparent hover:bg-white/5"
                  }`}
                  onClick={() => {
                    onSelectBoat(boat);
                    setShowStatsPanel(true);
                  }}
                >
                  <div className="flex items-center space-x-3 text-xs">
                    <span className="font-mono text-white/40 font-bold w-4 text-center">
                      {index + 1}
                    </span>
                    <span className="text-sm shrink-0 leading-none select-none">{boat.flag}</span>
                    <span className="text-white font-sans uppercase font-medium">{boat.name}</span>
                  </div>

                  <div className="flex items-center space-x-4 text-xs font-mono">
                    <span className="text-white/65">{formatSpeed(boat.speedKts)}</span>
                    <span className="text-white/35 w-14 text-right">
                      {boat.distToLeaderMeters === 0 ? "leader" : `+${boat.distToLeaderMeters}m`}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
