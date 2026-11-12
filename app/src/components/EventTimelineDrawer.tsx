/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { TIMELINE_EVENTS } from "../data";
import { Yacht, TacticalEvent } from "../types";
import {
  X,
  AlertTriangle,
  Wind,
  Sparkles,
  Flag,
  Calendar,
  AlertCircle
} from "lucide-react";

interface EventTimelineDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  yachts: Yacht[];
  initialTeamCode: string;
}

export default function EventTimelineDrawer({
  isOpen,
  onClose,
  yachts,
  initialTeamCode
}: EventTimelineDrawerProps) {
  const [selectedYachtCode, setSelectedYachtCode] = useState(initialTeamCode || "CAN");

  if (!isOpen) return null;

  const currentYacht = yachts.find((y) => y.code === selectedYachtCode) || yachts[0];
  const events = TIMELINE_EVENTS[selectedYachtCode] || TIMELINE_EVENTS.CAN;

  // Render colored icons depending on event type
  const getEventIcon = (type: TacticalEvent["type"]) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-[#ffb3b0]" />;
      case "wind":
        return <Wind className="w-4 h-4 text-[#a8e8ff]" />;
      case "prediction":
        return <Sparkles className="w-4 h-4 text-[#feb528]" />;
      case "rank":
        return <Flag className="w-4 h-4 text-[#ffb3b0]" />;
      default:
        return <AlertCircle className="w-4 h-4 text-[#dde3e7]/60" />;
    }
  };

  const getBorderColor = (type: TacticalEvent["type"]) => {
    switch (type) {
      case "warning":
        return "border-l-4 border-l-[#ffb3b0]";
      case "wind":
        return "border-l-4 border-l-[#00d4ff]";
      case "prediction":
        return "border-l-4 border-l-[#feb528]";
      case "rank":
        return "border-l-4 border-l-[#ffb3b0]/50";
      default:
        return "border-l-4 border-l-white/10";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex flex-col justify-end">
      {/* Click outside to close drawer */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Main Drawer Shell */}
      <div className="relative bg-[#161d1f] border-t border-t-white/12 rounded-t-[20px] w-full max-w-lg mx-auto py-5 px-6 max-h-[85vh] flex flex-col justify-between shadow-2xl animate-slide-up z-10">
        {/* Horizontal Slide Grab Indicator */}
        <div className="w-12 h-1 bg-white/15 rounded-full mx-auto mb-4" />

        {/* Header precisely as Screen 5 */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center">
              Race Vessel Timeline
            </h2>
            <p className="text-xs text-[#bbc9cf] mt-0.5 uppercase tracking-wide">
              Logged America's Cup Event Sequences
            </p>
          </div>
          <button
            id="btn-close-timeline"
            className="p-1 px-1.5 text-white/40 hover:text-white rounded-full hover:bg-white/10"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Horizontal filter capsule button list precisely as Screen 5 */}
        <div className="flex space-x-2 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-white/10 select-none">
          {yachts.map((yacht) => {
            const Selected = yacht.code === selectedYachtCode;
            return (
              <button
                id={`btn-filter-timeline-${yacht.code}`}
                key={yacht.code}
                className={`py-1.5 px-4 rounded-full text-xs font-bold uppercase shrink-0 transition-all cursor-pointer flex items-center space-x-1 border ${
                  Selected
                    ? "bg-[#00d4ff]/10 border-[#00d4ff] text-[#00d4ff]"
                    : "bg-[#1e2528] border-white/5 hover:border-white/12 text-[#bbc9cf]"
                }`}
                onClick={() => setSelectedYachtCode(yacht.code)}
              >
                <span>{yacht.code}</span>
                <span className="text-[10px] shrink-0">{yacht.flag}</span>
              </button>
            );
          })}
        </div>

        {/* Vertical Event Sequence timeline nodes (Chronological) */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-3 pr-1 py-1 max-h-[50vh]">
          {events.length === 0 ? (
            <div className="text-center text-[#bbc9cf]/50 text-xs py-8 font-mono">
              No tactical events logged for {currentYacht.name} on Leg 3.
            </div>
          ) : (
            events.map((evt, idx) => (
              <div key={idx} className="flex space-x-4 items-start select-all">
                {/* Time Indicator column */}
                <div className="w-14 pt-1 font-mono text-[11px] text-[#00d4ff]/80 font-bold text-right shrink-0">
                  {evt.timeCode}
                  {/* Decorative dot line connecter */}
                  {idx < events.length - 1 && (
                    <div className="w-0.5 bg-white/10 mx-auto h-16 mt-2 relative left-5" />
                  )}
                </div>

                {/* Tactical Card styled precisely as Screen 5 */}
                <div
                  className={`flex-1 p-3.5 bg-[#1e2528]/80 rounded-xl border border-white/6 ${getBorderColor(
                    evt.type
                  )} flex items-start justify-between hover:bg-black/40 transition-colors duration-200`}
                >
                  <div className="space-y-1">
                    <h4 className="text-xs font-mono tracking-widest uppercase font-extrabold text-[#dde3e7]/80">
                      {evt.title}
                    </h4>
                    <p className="text-xs text-white/70 leading-relaxed font-sans font-medium">
                      {evt.description}
                    </p>
                  </div>
                  <div className="p-1.5 bg-black/35 rounded-lg border border-white/6 shrink-0 ml-3">
                    {getEventIcon(evt.type)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Quick Footer */}
        <div className="border-t border-white/6 pt-4 text-center">
          <p className="text-[10px] font-mono text-[#bbc9cf]/40 uppercase tracking-widest leading-none">
            Yacht sensor history updated every 5 seconds
          </p>
        </div>
      </div>
    </div>
  );
}
