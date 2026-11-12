/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Yacht } from "../types";
import {
  Settings,
  Wind,
  Gauge,
  Eye,
  Camera,
  MapPin,
  Compass,
  Radio,
  Check,
  AlertTriangle
} from "lucide-react";

interface SettingsViewProps {
  yachts: Yacht[];
  useKmh: boolean;
  onToggleUnits: (kmh: boolean) => void;
  onSelectBackground: (url: string) => void;
  backgroundUrl: string;
  activeBoatCode: string;
  onSelectBoatByCode: (code: string) => void;
  trueWindSpeed: number;
  onSetTrueWind: (speed: number) => void;
  waveHeight: number;
  onSetWaveHeight: (height: number) => void;
}

export default function SettingsView({
  yachts,
  useKmh,
  onToggleUnits,
  onSelectBackground,
  backgroundUrl,
  activeBoatCode,
  onSelectBoatByCode,
  trueWindSpeed,
  onSetTrueWind,
  waveHeight,
  onSetWaveHeight
}: SettingsViewProps) {
  const [lat, setLat] = useState("37.8193");
  const [lng, setLng] = useState("-122.4786");
  const [audioHook, setAudioHook] = useState(true);
  const [calibrationCheck, setCalibrationCheck] = useState(true);

  const backgroundPresets = [
    {
      id: "preset-yacht-zoom",
      name: "Superyacht reaching wave (Standard Close-up)",
      url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=1200"
    },
    {
      id: "preset-fleet-reach",
      name: "Fleet Racing group in Bay (Wide angle)",
      url: "https://images.unsplash.com/photo-1605281317010-fe590f440ca7?auto=format&fit=crop&q=80&w=1200"
    },
    {
      id: "preset-yacht-hull",
      name: "Dynamic Hull foil details (Technical macro)",
      url: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&q=80&w=1200"
    }
  ];

  return (
    <div className="w-full h-full bg-[#0e1417] text-[#dde3e7] font-sans p-5 overflow-y-auto space-y-6">
      {/* Settings Title */}
      <div className="flex items-center justify-between border-b border-white/6 pb-3">
        <h2 className="text-xl font-bold tracking-tight text-white flex items-center">
          <Settings className="w-4 h-4 text-[#00d4ff] mr-2 animate-spin-slow" />
          HUD Calibration & Settings
        </h2>
        <span className="text-[10px] font-mono text-[#00d4ff] uppercase tracking-wide">
          v2.4 Pro
        </span>
      </div>

      {/* Speed Metrics Units Control exactly as standard guides */}
      <section className="bg-[#161d1f] border border-white/6 rounded-xl p-4 space-y-3 shadow-md">
        <label className="text-xs font-mono text-[#bbc9cf] uppercase tracking-wider font-bold flex items-center space-x-1.5">
          <Gauge className="w-4 h-4 text-[#00d4ff]" />
          <span>Telemetry Units Selection</span>
        </label>
        <p className="text-xs text-[#bbc9cf]/60">
          Switches calculation pipelines across the map layers and leaderboards in real-time.
        </p>
        <div className="bg-[#1e2528] rounded-lg border border-white/6 p-0.5 flex">
          <button
            id="unit-toggle-knots"
            className={`flex-1 py-2 text-xs font-bold uppercase transition-all rounded-md cursor-pointer ${
              !useKmh ? "bg-[#00d4ff] text-black font-extrabold shadow-sm" : "text-[#bbc9cf] hover:text-white"
            }`}
            onClick={() => onToggleUnits(false)}
          >
            Knots (kts)
          </button>
          <button
            id="unit-toggle-kmh"
            className={`flex-1 py-2 text-xs font-bold uppercase transition-all rounded-md cursor-pointer ${
              useKmh ? "bg-[#00d4ff] text-black font-extrabold shadow-sm" : "text-[#bbc9cf] hover:text-white"
            }`}
            onClick={() => onToggleUnits(true)}
          >
            Metric (km/h)
          </button>
        </div>
      </section>

      {/* Simulator weather metrics station section */}
      <section className="bg-[#161d1f] border border-white/6 rounded-xl p-4 space-y-4 shadow-md">
        <label className="text-xs font-mono text-[#bbc9cf] uppercase tracking-wider font-bold flex items-center space-x-1.5">
          <Wind className="w-4 h-4 text-[#00d4ff]" />
          <span>Global Weather Station Simulation</span>
        </label>

        {/* Wind slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#bbc9cf]/65">True Wind Speed</span>
            <span className="font-mono text-[#00d4ff] font-bold">{trueWindSpeed} kts</span>
          </div>
          <input
            id="wind-slider"
            type="range"
            min="5"
            max="40"
            value={trueWindSpeed}
            className="w-full accent-[#00d4ff] h-1.5 bg-[#1e2528] rounded-lg appearance-none cursor-pointer border border-white/5"
            onChange={(e) => onSetTrueWind(parseInt(e.target.value))}
          />
        </div>

        {/* Wave details lock */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#bbc9cf]/65">Wave Height Amplitude</span>
            <span className="font-mono text-[#00d4ff] font-bold">{waveHeight} m</span>
          </div>
          <input
            id="wave-slider"
            type="range"
            min="0.2"
            max="4.5"
            step="0.1"
            value={waveHeight}
            className="w-full accent-[#00d4ff] h-1.5 bg-[#1e2528] rounded-lg appearance-none cursor-pointer border border-white/5"
            onChange={(e) => onSetWaveHeight(parseFloat(e.target.value))}
          />
        </div>
      </section>

      {/* Select active Vessel */}
      <section className="bg-[#161d1f] border border-white/6 rounded-xl p-4 space-y-3 shadow-md">
        <label className="text-xs font-mono text-[#bbc9cf] uppercase tracking-wider font-bold flex items-center space-x-1.5">
          <Radio className="w-4 h-4 text-[#00d4ff]" />
          <span>Focus Vessel Navigation</span>
        </label>
        <div className="grid grid-cols-3 gap-2">
          {yachts.map((boat) => {
            const isFocus = activeBoatCode === boat.code;
            return (
              <button
                id={`btn-set-focus-${boat.code}`}
                key={boat.code}
                className={`py-2 px-3 rounded-lg border flex flex-col items-center justify-center transition-all cursor-pointer ${
                  isFocus
                    ? "bg-[#00d4ff]/10 border-[#00d4ff] shadow-sm text-[#00d4ff]"
                    : "bg-[#1e2528] border-white/5 hover:border-white/12 text-[#bbc9cf]"
                }`}
                onClick={() => onSelectBoatByCode(boat.code)}
              >
                <span className="text-sm select-none">{boat.flag}</span>
                <span className="text-[11px] font-mono font-bold uppercase mt-1">
                  {boat.code}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Presets backgrounds feed selector */}
      <section className="bg-[#161d1f] border border-white/6 rounded-xl p-4 space-y-3 shadow-md">
        <label className="text-xs font-mono text-[#bbc9cf] uppercase tracking-wider font-bold flex items-center space-x-1.5">
          <Camera className="w-4 h-4 text-[#00d4ff]" />
          <span>HUD AR Camera Plates</span>
        </label>
        <div className="space-y-2">
          {backgroundPresets.map((preset) => {
            const Active = backgroundUrl === preset.url;
            return (
              <button
                id={`btn-select-${preset.id}`}
                key={preset.id}
                className={`w-full text-left p-3 rounded-lg border text-xs flex justify-between items-center transition-all cursor-pointer ${
                  Active
                    ? "bg-[#00d4ff]/10 border-[#00d4ff] text-[#00d4ff] font-semibold"
                    : "bg-[#1e2528] border-white/5 hover:border-white/12 text-[#bbc9cf]"
                }`}
                onClick={() => onSelectBackground(preset.url)}
              >
                <span className="uppercase tracking-wide">{preset.name}</span>
                {Active && <Check className="w-4 h-4 text-[#00d4ff] shrink-0" />}
              </button>
            );
          })}
        </div>
      </section>

      {/* Geographic Coordinates sensor adjustment simulation box */}
      <section className="bg-[#161d1f] border border-white/6 rounded-xl p-4 space-y-3 shadow-md">
        <label className="text-xs font-mono text-[#bbc9cf] uppercase tracking-wider font-bold flex items-center space-x-1.5">
          <MapPin className="w-4 h-4 text-[#00d4ff]" />
          <span>Simulated GPS Sensor coordinates</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-[#bbc9cf]/60 uppercase tracking-wider block">
              Reference Lat (N)
            </span>
            <input
              id="gps-lat"
              type="text"
              className="w-full bg-[#1e2528] border border-white/10 rounded-lg p-2 font-mono text-xs text-white uppercase tracking-wider focus:outline-none focus:border-[#00d4ff]"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-mono text-[#bbc9cf]/60 uppercase tracking-wider block">
              Reference Lng (W)
            </span>
            <input
              id="gps-lng"
              type="text"
              className="w-full bg-[#1e2528] border border-white/10 rounded-lg p-2 font-mono text-xs text-white uppercase tracking-wider focus:outline-none focus:border-[#00d4ff]"
              value={lng}
              onChange={(e) => setLng(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Miscellaneous Settings Checklist */}
      <section className="bg-[#161d1f] border border-white/6 rounded-xl p-4 space-y-3 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex flex-col text-xs space-y-0.5">
            <span className="font-bold text-white uppercase tracking-wide">
              Hardware Gyroscope Calibration
            </span>
            <span className="text-[#bbc9cf]/60 text-[11px]">
              Filters sea wave pitch vibrations on client camera
            </span>
          </div>
          <button
            id="toggle-hardware-gyro"
            className={`w-11 h-6 rounded-full p-1 transition-all duration-200 cursor-pointer ${
              calibrationCheck ? "bg-[#00d4ff]" : "bg-white/10"
            }`}
            onClick={() => setCalibrationCheck(!calibrationCheck)}
          >
            <div
              className={`w-4 h-4 rounded-full bg-black transition-all ${
                calibrationCheck ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between border-t border-white/6 pt-3">
          <div className="flex flex-col text-xs space-y-0.5">
            <span className="font-bold text-white uppercase tracking-wide">
              Audio Beep Feedback sound HUD
            </span>
            <span className="text-[#bbc9cf]/60 text-[11px]">
              Beeps on sudden velocity drops or wind shadows
            </span>
          </div>
          <button
            id="toggle-audio-alerts"
            className={`w-11 h-6 rounded-full p-1 transition-all duration-200 cursor-pointer ${
              audioHook ? "bg-[#00d4ff]" : "bg-white/10"
            }`}
            onClick={() => setAudioHook(!audioHook)}
          >
            <div
              className={`w-4 h-4 rounded-full bg-black transition-all ${
                audioHook ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </section>

      {/* Safety alert */}
      <div className="border border-white/5 rounded-xl px-4 py-3 bg-[#080f12] text-white/55 flex items-start space-x-3 text-xs leading-relaxed font-sans">
        <AlertTriangle className="w-5 h-5 text-[#ffb3b0] shrink-0" />
        <p>
          Settings are saved locally inside client memory. Real-world ocean telemetry connection
          is subject to regional America's Cup satellite coverage limits.
        </p>
      </div>
    </div>
  );
}
