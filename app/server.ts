import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini client
let ai: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!ai) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
      return null;
    }
    try {
      ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          }
        }
      });
    } catch (e) {
      console.error("Failed to initialize GoogleGenAI client:", e);
      return null;
    }
  }
  return ai;
}

// Fallback high-fidelity local commentaries for sailing teams
const LOCAL_COMMENTARIES: Record<string, string[]> = {
  CAN: [
    "Canada has just entered GBR's wind shadow — speed is dropping fast. Without a quick tack in the next 15 seconds, 2nd place is at risk.",
    "CAN is executing a perfect high-VMG angle to head off FRA. Wind shifts look favorable on the left side of the course.",
    "Canada holds a tight line near the boundary. They are clawing back distance to GBR, exploiting a minor swell difference."
  ],
  GBR: [
    "Great Britain is holding a dominant position at the windward gate. Their lead sits at 280 meters, but the crew must guard the left lane.",
    "GBR is struggling with a slight pressure drop. VMG decreased by 0.8 knots. CAN is closing the margin quickly.",
    "Spectacular gybe from GBR! They found a 3-knot gust and accelerated downwind to defend their leading margin."
  ],
  GER: [
    "Germany is squeezing every fraction of a knot, maintaining a 30.0 km/h average. However, their drift angle is slightly wide.",
    "GER is approaching the layline for buoy Mark 2. They have a narrow window to sneak past FRA if they execute the tack perfectly.",
    "Excellent tactical coverage by GER. They have positioned themselves directly stream-ward of ESP to block clean air."
  ],
  FRA: [
    "France is currently experiencing turbulent air behind GBR's wake. They need to find clean lanes to avoid falling into the pack.",
    "FRA just logged a 14.2 knot speed surge. Foil trim adjustments seem to have corrected their nose-down pitch in the chop.",
    "A conservative leg for France. They are minimizing risk, playing the shifts aggressively up the center section."
  ],
  ESP: [
    "Spain is making an aggressive play on the right boundary. They've found extra heel pressure, bringing speed up to 28.0 km/h.",
    "ESP is tacking repeatedly to stay clear of GER's dirty wind. While exhausting for the grinders, it preserves speed.",
    "ESP has stabilized their VMG. Distances are locking in as Leg 3 reaches its final stretch near buoy Mark 3."
  ],
  DEN: [
    "Denmark is currently bringing up the rear, but their foil lift coefficients look steady. Clean air will assist their recovery.",
    "DEN has made a bold split from the fleet, seeking pressure on the far left. If the forecasted shift hits, they will gain heavily.",
    "Stable sailing from DEN. They are sailing the boat extremely flat, optimizing true wind angle down deep."
  ]
};

// Tactical Commentary Generator API endpoint
app.post("/api/ai-commentary", async (req, res) => {
  const { teamCode, teamName, speed, heading, vmg, distToLeader, situation } = req.body;
  const targetCode = (teamCode || "CAN").toUpperCase();

  const client = getGeminiClient();

  if (client) {
    try {
      const prompt = `Provide a professional America's Cup sailing tactical commentary.
Yacht: ${teamName || "Canada"} (${targetCode})
Telemetry: Speed is ${speed || "12.4 kts"}, Heading is ${heading || "247°"}, VMG of ${vmg || "9.1 kts"}. Distance to leader is ${distToLeader || "280m"}.
Situation details to analyze: ${situation || "Entering wind shadow / draft zone near buoy"}.
Explain the tactical consequences (e.g., wind shadows, foil drag, gybe timing, VMG tradeoffs). Keep your response under 45 words, highly technical, intense, and dramatic!`;

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are an elite Yacht Racing AI commentator providing ultra-realistic live telemetry tactical summaries for a marine AR HUD.",
          temperature: 0.85,
        }
      });

      const text = response.text?.trim() || "";
      if (text) {
        return res.json({ commentary: text, isRealAI: true });
      }
    } catch (e) {
      console.warn("Gemini API call failed, falling back to cached tactical analytics:", e);
    }
  }

  // Fallback to high-quality local commentary
  const commentaries = LOCAL_COMMENTARIES[targetCode] || LOCAL_COMMENTARIES.CAN;
  // Pick one randomly or based on situation
  let commentary = commentaries[0];
  if (situation && situation.toLowerCase().includes("wind shadow")) {
    commentary = commentaries[0] || commentaries[0];
  } else if (situation && situation.toLowerCase().includes("vmg")) {
    commentary = commentaries[1] || commentaries[0];
  } else {
    const idx = Math.floor(Math.random() * commentaries.length);
    commentary = commentaries[idx];
  }

  return res.json({
    commentary,
    isRealAI: false,
    notice: "Running in Smart Simulation Mode (add GEMINI_API_KEY to AI Studio Secrets for live full-spectrum AI analyses)"
  });
});

async function startServer() {
  // Vite dev server support
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production static files
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`RaceLens AR server running on port ${PORT}`);
  });
}

startServer();
