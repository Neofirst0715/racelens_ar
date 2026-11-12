/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Yacht {
  code: string;
  name: string;
  flag: string;
  speedKts: number;
  headingDeg: number;
  vmgKts: number;
  distToLeaderMeters: number;
  color: string;
  activeSituation: string;
}

export interface Race {
  id: string;
  name: string;
  date: string;
  currentLeg: number;
  totalLegs: number;
}

export interface TacticalEvent {
  timeCode: string;
  title: string;
  description: string;
  type: "warning" | "wind" | "prediction" | "rank" | "general";
}

export type ActiveTab = "ar_track" | "replay" | "capture" | "settings";
export type OnboardingStep = "splash" | "permissions" | "hud";
