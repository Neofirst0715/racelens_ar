/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { RACES } from "../data";
import { Yacht } from "../types";
import { Play, Pause, ChevronRight, RotateCcw, Clock, Sparkles } from "lucide-react";

interface ReplayViewProps {
  yachts: Yacht[];
  useKmh: boolean;
}

export default function ReplayView({ yachts, useKmh }: ReplayViewProps) {
  const [selectedRaceId, setSelectedRaceId] = useState("race-1");
  const [progress, setProgress] = useState(15); // Out of 100
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 2 | 4>(1);

  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(Date.now());

  const activeRace = RACES.find((r) => r.id === selectedRaceId) || RACES[0];

  // Tick the play animation
  useEffect(() => {
    if (isPlaying) {
      const tick = () => {
        const now = Date.now();
        const delta = now - lastTimeRef.current;
        lastTimeRef.current = now;

        setProgress((prev) => {
          // Increment progress based on speed
          const step = (delta / 1000) * 1.5 * playbackSpeed;
          const next = prev + step;
          if (next >= 100) {
            setIsPlaying(false);
            return 100;
          }
          return next;
        });

        animationRef.current = requestAnimationFrame(tick);
      };

      lastTimeRef.current = Date.now();
      animationRef.current = requestAnimationFrame(tick);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, playbackSpeed]);

  // Handle manual race selections
  const handleSelectRace = (id: string) => {
    setSelectedRaceId(id);
    setProgress(5);
    setIsPlaying(true);
  };

  // Convert progress (0-100) to clean, readable race timestamps
  // Max race is 1 hour 45 minutes = 105 minutes.
  const formatTime = (p: number) => {
    const totalSeconds = (p / 100) * 105 * 60;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);

    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  };

  // Compute boat coordinates on SVG arena viewbox (600x400)
  // Yachts: CAN, GBR, GER, FRA, ESP, DEN
  const getSplineCoordinates = (idx: number, t: number) => {
    const fract = t / 100;

    // We define customized curved path trajectories for the teams
    // Starting at left (x = 50) and crossing towards top-right (x = 550, y = 50)
    // idx influences start parameters, curves and intercepts
    const startY = 320 + idx * 8;
    const endY = 80 + idx * 10;

    // Interpolate curves
    // e.g., Bezier-style cubic spline simulation
    const x = 60 + fract * 480;

    // Compute y with waves and bends
    let wave = Math.sin(fract * Math.PI * 1.2) * 80;
    if (idx % 2 === 0) {
      wave = Math.sin(fract * Math.PI * 1.5) * -70; // Opposite bend
    }

    // Overtake cross points:
    // CAN starts in #4, but at fract > 0.4 starts closing in and climbs to #1
    let overlayOffset = 0;
    if (idx === 0) {
      // CAN (Red)
      overlayOffset = fract > 0.5 ? -15 * (fract - 0.5) * 5 : 5 * fract;
    }

    let y = startY + fract * (endY - startY) + wave + overlayOffset;

    // Check boundaries
    if (y < 40) y = 40;
    if (y > 360) y = 360;

    return { x, y };
  };

  return (
    <div className="w-full h-full flex flex-col justify-between bg-black text-[#dde3e7] font-sans p-4 relative">
      <div>
        {/* Header Title */}
        <div className="flex items-center justify-between mb-3 border-b border-white/6 pb-2.5">
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center">
            <Clock className="w-4 h-4 text-[#00d4ff] mr-2" />
            Select Race Track
          </h2>
          <span className="text-[10px] font-mono text-[#00d4ff] bg-[#00d4ff]/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider font-semibold animate-pulse">
            Live Replay Engine
          </span>
        </div>

        {/* Horizontal Scrollable Race selector exactly as Screen 4 */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {RACES.map((race) => {
            const Active = race.id === selectedRaceId;
            return (
              <button
                id={`race-card-${race.id}`}
                key={race.id}
                className={`p-3 rounded-lg border-2 text-left transition-all duration-300 relative ${
                  Active
                    ? "bg-[#161d1f] border-[#00d4ff] shadow-[0_0_15px_rgba(0,212,255,0.1)] text-white"
                    : "bg-[#161d1f]/40 border-white/5 hover:border-white/12 text-[#bbc9cf]"
                }`}
                onClick={() => handleSelectRace(race.id)}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider font-mono">
                    {race.name}
                  </span>
                  <ChevronRight className={`w-3.5 h-3.5 ${Active ? "text-[#00d4ff]" : "text-white/25"}`} />
                </div>
                <div className="text-[10px] text-white/50 mt-1">{race.date}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* SVG Path Tracker Arena representing yacht spline crossings */}
      <div className="relative flex-1 min-h-[180px] bg-[#0c1012] border border-white/8 rounded-xl overflow-hidden flex items-center justify-center p-2 mb-4 shadow-inner">
        {/* Horizon grid line markings */}
        <div className="absolute inset-0 bg-[radial-gradient(#161d1f_1px,transparent_1px)] [background-size:16px_16px] opacity-45 pointer-events-none" />

        {/* Spline rendering inside dynamic responsive SVG container */}
        <svg
          className="w-full h-full max-h-[350px]"
          viewBox="0 0 600 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Base tactical grid indicators */}
          <line x1="50" y1="200" x2="550" y2="200" stroke="rgba(255, 255, 255, 0.04)" strokeDasharray="4 4" />
          <line x1="150" y1="50" x2="150" y2="350" stroke="rgba(255, 255, 255, 0.04)" strokeDasharray="4 4" />
          <line x1="300" y1="50" x2="300" y2="350" stroke="rgba(255, 255, 255, 0.04)" strokeDasharray="4 4" />
          <line x1="450" y1="50" x2="450" y2="350" stroke="rgba(255, 255, 255, 0.04)" strokeDasharray="4 4" />

          {/* SVG curves for all 6 yachts */}
          {yachts.map((boat, idx) => {
            // Draw spline segments
            let pointsStr = "";
            for (let t = 0; t <= 100; t += 5) {
              const pt = getSplineCoordinates(idx, t);
              pointsStr += `${t === 0 ? "M" : "L"} ${pt.x} ${pt.y} `;
            }

            return (
              <g key={boat.code}>
                {/* Drawn path curve */}
                <path
                  d={pointsStr}
                  stroke={boat.color}
                  strokeWidth="2.5"
                  strokeOpacity={isPlaying ? "0.85" : "0.55"}
                  fill="none"
                />

                {/* Subdued shadow line */}
                <path
                  d={pointsStr}
                  stroke={boat.color}
                  strokeWidth="8"
                  strokeOpacity="0.06"
                  fill="none"
                />
              </g>
            );
          })}

          {/* Live boat tracking Dots */}
          {yachts.map((boat, idx) => {
            const pt = getSplineCoordinates(idx, progress);
            return (
              <g key={`dot-${boat.code}`}>
                {/* Neon outer glow circle */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="7"
                  fill="black"
                  stroke={boat.color}
                  strokeWidth="2.5"
                  className="transition-all duration-100 shadow-md"
                />
                {/* Solid inner core dot */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="3.5"
                  fill={boat.color}
                  className="transition-all duration-100"
                />
                {/* Text tag if progress is near active dots */}
                {progress > 5 && (
                  <text
                    x={pt.x + 8}
                    y={pt.y + 4}
                    fill={boat.color}
                    fontSize="9"
                    fontWeight="bold"
                    fontFamily="monospace"
                    className="select-none text-shadow pointer-events-none opacity-85"
                  >
                    {boat.code}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Legend color-pills precisely as Screen 4 */}
        <div className="absolute top-3 left-3 bg-black/75 px-3 py-2 rounded-lg border border-white/8 flex flex-wrap gap-x-3 gap-y-1.5 max-w-[calc(100%-24px)] pointer-events-none">
          {yachts.map((boat) => (
            <div key={boat.code} className="flex items-center space-x-1.5">
              <span
                className="w-2 h-2 rounded-full inline-block"
                style={{ backgroundColor: boat.color }}
              />
              <span className="text-[10px] font-mono font-bold uppercase text-white/70">
                {boat.code}
              </span>
            </div>
          ))}
        </div>

        {/* Play/Pause center overlay (on pause status) */}
        {!isPlaying && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center pointer-events-none">
            <div className="bg-black/85 backdrop-blur-md p-4 rounded-full border border-white/10 animate-fade-in shadow-xl select-none">
              <Pause className="w-6 h-6 text-[#00d4ff] animate-pulse" />
            </div>
          </div>
        )}
      </div>

      {/* Control Area: Progress Bar Slider precisely as Screen 4 */}
      <div className="bg-[#111618] border border-white/6 rounded-xl p-3.5 space-y-3 shadow-md">
        {/* Time code display */}
        <div className="flex justify-between items-center text-xs font-mono select-none">
          <div className="flex items-center text-[#00d4ff] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00d4ff] animate-ping mr-2" />
            <span>{formatTime(progress)}</span>
          </div>

          <div className="flex items-center space-x-2 text-white/50">
            <span>TOTAL:</span>
            <span className="font-bold text-white">01:45:00</span>
          </div>
        </div>

        {/* Native range slider representing physical race chronological scrubbing */}
        <div className="flex items-center space-x-3">
          <input
            id="replay-time-slider"
            type="range"
            min="0"
            max="100"
            step="0.1"
            value={progress}
            className="flex-1 accent-[#00d4ff] h-1.5 bg-[#1e2528] rounded-lg appearance-none cursor-pointer border border-white/5"
            onChange={(e) => {
              setProgress(parseFloat(e.target.value));
              setIsPlaying(false); // Stop playback on grab
            }}
          />
        </div>

        {/* Speed selectors, Reset, and Action Controllers at bottom */}
        <div className="flex items-center justify-between pt-1 font-mono">
          {/* Restart button */}
          <button
            id="btn-replay-reset"
            className="p-2 bg-white/5 hover:bg-white/10 text-[#bbc9cf] hover:text-white rounded-lg border border-white/6 transition-colors duration-150 flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider cursor-pointer font-sans"
            onClick={() => {
              setProgress(0);
              setIsPlaying(true);
            }}
          >
            <RotateCcw className="w-4 h-4" />
            <span>Restart</span>
          </button>

          {/* Large Main Play controller */}
          <button
            id="btn-replay-play-pause"
            className={`w-12 h-12 rounded-full border flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all text-black cursor-pointer bg-[#00d4ff] border-[#00d4ff] hover:shadow-[0_0_15px_rgba(0,212,255,0.4)]`}
            onClick={() => {
              if (progress >= 100) {
                setProgress(0);
                setIsPlaying(true);
              } else {
                setIsPlaying(!isPlaying);
              }
            }}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 stroke-[2.5]" />
            ) : (
              <Play className="w-5 h-5 ml-0.5 stroke-[2.5]" />
            )}
          </button>

          {/* Speed multiplier segment pill pills */}
          <div className="bg-[#1e2528] rounded-lg border border-white/6 p-0.5 flex">
            {([1, 2, 4] as const).map((spd) => {
              const Selected = playbackSpeed === spd;
              return (
                <button
                  id={`btn-speed-${spd}x`}
                  key={spd}
                  className={`px-3 py-1.5 rounded-md text-[11px] font-extrabold uppercase transition-all cursor-pointer ${
                    Selected
                      ? "bg-[#00d4ff] text-black font-extrabold shadow-sm"
                      : "text-[#bbc9cf] hover:text-white"
                  }`}
                  onClick={() => setPlaybackSpeed(spd)}
                >
                  {spd}x
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
