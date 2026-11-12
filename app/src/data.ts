/**
 * Real SailGP Halifax 2024 Race 5 data
 */
import { Yacht, Race, TacticalEvent } from "./types";

export const INITIAL_YACHTS: Yacht[] = [
  {
    "code": "DEN",
    "name": "Denmark",
    "flag": "🇩🇰",
    "speedKts": 30.2,
    "headingDeg": 247,
    "vmgKts": 16.3,
    "distToLeaderMeters": 2.0,
    "color": "#EC4899",
    "activeSituation": "Denmark holding steady. Current trajectory maintains gap to leader."
  },
  {
    "code": "ESP",
    "name": "Spain",
    "flag": "🇪🇸",
    "speedKts": 34.7,
    "headingDeg": 247,
    "vmgKts": 20.1,
    "distToLeaderMeters": 9.0,
    "color": "#F59E0B",
    "activeSituation": "Spain recovering from wind shadow. VMG improving - expect a ranking push in 30 seconds."
  },
  {
    "code": "GBR",
    "name": "Great Britain",
    "flag": "🇬🇧",
    "speedKts": 30.8,
    "headingDeg": 247,
    "vmgKts": 24.3,
    "distToLeaderMeters": 10.0,
    "color": "#3B82F6",
    "activeSituation": "Great Britain holding the lead under pressure. Wind angle favours current heading."
  },
  {
    "code": "CAN",
    "name": "Canada",
    "flag": "🇨🇦",
    "speedKts": 32.2,
    "headingDeg": 247,
    "vmgKts": 20.3,
    "distToLeaderMeters": 27.0,
    "color": "#EF4444",
    "activeSituation": "Canada has just entered GBR wind shadow - speed dropping. Without a tack in 15 seconds, 2nd place is at risk."
  },
  {
    "code": "FRA",
    "name": "France",
    "flag": "🇫🇷",
    "speedKts": 29.8,
    "headingDeg": 247,
    "vmgKts": 19.4,
    "distToLeaderMeters": 43.0,
    "color": "#A855F7",
    "activeSituation": "France in a tactical battle. Speed variance suggests foil control adjustments in progress."
  },
  {
    "code": "GER",
    "name": "Germany",
    "flag": "🇩🇪",
    "speedKts": 31.0,
    "headingDeg": 247,
    "vmgKts": 19.3,
    "distToLeaderMeters": 115.0,
    "color": "#10B981",
    "activeSituation": "Germany accelerating on starboard tack. ML model flags overtaking opportunity near next mark."
  }
];

export const RACES: Race[] = [
  { id: "race-1", name: "Race 1", date: "June 1, 2024", currentLeg: 2, totalLegs: 5 },
  { id: "race-2", name: "Race 2", date: "June 1, 2024", currentLeg: 4, totalLegs: 5 },
  { id: "race-3", name: "Race 3", date: "June 2, 2024", currentLeg: 1, totalLegs: 5 },
  { id: "race-4", name: "Race 4", date: "June 2, 2024", currentLeg: 3, totalLegs: 5 },
  { id: "race-5", name: "Race 5", date: "June 2, 2024", currentLeg: 3, totalLegs: 5 },
  { id: "race-6", name: "Race 6", date: "June 2, 2024", currentLeg: 5, totalLegs: 5 }
];

export const TIMELINE_EVENTS: Record<string, TacticalEvent[]> = {
  "CAN": [
    {
      "timeCode": "19:48",
      "title": "Speed Anomaly",
      "description": "CAN velocity changed significantly over 15 seconds.",
      "type": "warning"
    },
    {
      "timeCode": "19:48",
      "title": "Speed Anomaly",
      "description": "CAN velocity changed significantly over 15 seconds.",
      "type": "warning"
    },
    {
      "timeCode": "19:49",
      "title": "Wind Shadow",
      "description": "CAN entered wind shadow zone, aerodynamic flow disrupted.",
      "type": "wind"
    },
    {
      "timeCode": "19:49",
      "title": "Wind Shadow",
      "description": "CAN entered wind shadow zone, aerodynamic flow disrupted.",
      "type": "wind"
    },
    {
      "timeCode": "19:49",
      "title": "Rank Change",
      "description": "CAN position gap changed by 50m vs nearest rival.",
      "type": "rank"
    }
  ],
  "GBR": [
    {
      "timeCode": "19:48",
      "title": "Speed Anomaly",
      "description": "GBR velocity changed significantly over 15 seconds.",
      "type": "warning"
    },
    {
      "timeCode": "19:48",
      "title": "Speed Anomaly",
      "description": "GBR velocity changed significantly over 15 seconds.",
      "type": "warning"
    },
    {
      "timeCode": "19:49",
      "title": "Wind Shadow",
      "description": "GBR entered wind shadow zone, aerodynamic flow disrupted.",
      "type": "wind"
    },
    {
      "timeCode": "19:49",
      "title": "Wind Shadow",
      "description": "GBR entered wind shadow zone, aerodynamic flow disrupted.",
      "type": "wind"
    },
    {
      "timeCode": "19:49",
      "title": "Rank Change",
      "description": "GBR position gap changed by 50m vs nearest rival.",
      "type": "rank"
    }
  ],
  "GER": [
    {
      "timeCode": "19:48",
      "title": "Speed Anomaly",
      "description": "GER velocity changed significantly over 15 seconds.",
      "type": "warning"
    },
    {
      "timeCode": "19:48",
      "title": "Rank Change",
      "description": "GER position gap changed by 61m vs nearest rival.",
      "type": "rank"
    },
    {
      "timeCode": "19:48",
      "title": "Speed Anomaly",
      "description": "GER velocity changed significantly over 15 seconds.",
      "type": "warning"
    },
    {
      "timeCode": "19:48",
      "title": "Rank Change",
      "description": "GER position gap changed by 64m vs nearest rival.",
      "type": "rank"
    },
    {
      "timeCode": "19:49",
      "title": "Wind Shadow",
      "description": "GER entered wind shadow zone, aerodynamic flow disrupted.",
      "type": "wind"
    }
  ],
  "FRA": [
    {
      "timeCode": "19:48",
      "title": "Speed Anomaly",
      "description": "FRA velocity changed significantly over 15 seconds.",
      "type": "warning"
    },
    {
      "timeCode": "19:48",
      "title": "Speed Anomaly",
      "description": "FRA velocity changed significantly over 15 seconds.",
      "type": "warning"
    },
    {
      "timeCode": "19:49",
      "title": "Rank Change",
      "description": "FRA position gap changed by 52m vs nearest rival.",
      "type": "rank"
    },
    {
      "timeCode": "19:49",
      "title": "Rank Change",
      "description": "FRA position gap changed by 60m vs nearest rival.",
      "type": "rank"
    },
    {
      "timeCode": "19:49",
      "title": "Wind Shadow",
      "description": "FRA entered wind shadow zone, aerodynamic flow disrupted.",
      "type": "wind"
    }
  ],
  "ESP": [
    {
      "timeCode": "19:48",
      "title": "Speed Anomaly",
      "description": "ESP velocity changed significantly over 15 seconds.",
      "type": "warning"
    },
    {
      "timeCode": "19:48",
      "title": "Speed Anomaly",
      "description": "ESP velocity changed significantly over 15 seconds.",
      "type": "warning"
    },
    {
      "timeCode": "19:49",
      "title": "Wind Shadow",
      "description": "ESP entered wind shadow zone, aerodynamic flow disrupted.",
      "type": "wind"
    },
    {
      "timeCode": "19:49",
      "title": "Wind Shadow",
      "description": "ESP entered wind shadow zone, aerodynamic flow disrupted.",
      "type": "wind"
    },
    {
      "timeCode": "19:49",
      "title": "Rank Change",
      "description": "ESP position gap changed by 52m vs nearest rival.",
      "type": "rank"
    }
  ],
  "DEN": [
    {
      "timeCode": "19:48",
      "title": "Speed Anomaly",
      "description": "DEN velocity changed significantly over 15 seconds.",
      "type": "warning"
    },
    {
      "timeCode": "19:48",
      "title": "Wind Shadow",
      "description": "DEN entered wind shadow zone, aerodynamic flow disrupted.",
      "type": "wind"
    },
    {
      "timeCode": "19:48",
      "title": "Speed Anomaly",
      "description": "DEN velocity changed significantly over 15 seconds.",
      "type": "warning"
    },
    {
      "timeCode": "19:48",
      "title": "Wind Shadow",
      "description": "DEN entered wind shadow zone, aerodynamic flow disrupted.",
      "type": "wind"
    },
    {
      "timeCode": "19:49",
      "title": "Rank Change",
      "description": "DEN position gap changed by 53m vs nearest rival.",
      "type": "rank"
    }
  ]
};
