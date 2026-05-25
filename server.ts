import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

// Initialize server-side Gemini client as per guidelines
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
} else {
  console.warn("WARNING: GEMINI_API_KEY environment variable is not set. Dynamic analysis will fall back to simulated processing.");
}

app.use(express.json({ limit: "20mb" }));

// Helper function to resolve Imgur indirect page URLs to direct image URLs
function resolveImageUrl(url: string): string {
  let Cleaned = url.trim();
  // If it's a standard imgur post link e.g., https://imgur.com/UEhDBCv
  const imgurMatch = Cleaned.match(/https?:\/\/(?:www\.)?imgur\.com\/([a-zA-Z0-9]+)(?:\.[a-zA-Z]+)?/);
  if (imgurMatch && !Cleaned.includes("i.imgur.com")) {
    const id = imgurMatch[1];
    return `https://i.imgur.com/${id}.jpeg`;
  }
  return Cleaned;
}

// API endpoint to analyze a flowchart image from URL
app.post("/api/analyze-flowchart", async (req, res) => {
  const { url, textPrompt } = req.body;

  if (!url && !textPrompt) {
    return res.status(400).json({ error: "Missing 'url' or 'textPrompt' in request body." });
  }

  // Simulate parsing in case Gemini is not configured
  if (!ai || !apiKey) {
    console.log("No API Key. Returning simulated successful response based on the prompt.");
    return res.status(200).json({
      simulated: true,
      message: "This is a simulated AI analysis because the GEMINI_API_KEY is not configured yet. The visualizer is fully active with interactive state simulations!",
      data: {
        title: textPrompt ? `Custom Process: ${textPrompt.slice(0, 30)}` : "RESOLVED IMGUR E3 MODEL",
        description: "Process extracted successfully (Mock Sandbox mode)",
        nodes: [
          {
            id: "node_1",
            label: "START PROCESS",
            type: "process",
            approximateLocation: { x: 20, y: 50 },
            description: "Initial input state. Unstable parameters are gathered."
          },
          {
            id: "node_2",
            label: "INJECT STABILIZERS",
            type: "process",
            approximateLocation: { x: 50, y: 50 },
            description: "Structured interventions applied. Real-time balance is calculated."
          },
          {
            id: "node_3",
            label: "STEADY STATE",
            type: "end",
            approximateLocation: { x: 80, y: 50 },
            description: "Achieved ideal outputs through engineering controls."
          }
        ],
        edges: [
          { from: "node_1", to: "node_2", label: "Analyze metrics" },
          { from: "node_2", to: "node_3", label: "Verify criteria achieved" }
        ]
      }
    });
  }

  try {
    let contents: any[] = [];

    if (url) {
      const resolvedUrl = resolveImageUrl(url);
      console.log(`Resolving URL: ${url} -> ${resolvedUrl}`);
      
      const imgRes = await fetch(resolvedUrl);
      if (!imgRes.ok) {
        throw new Error(`Failed to download flowchart image from resolved URL: ${resolvedUrl} (${imgRes.statusText})`);
      }
      
      const imageBuffer = Buffer.from(await imgRes.arrayBuffer());
      const base64Data = imageBuffer.toString("base64");

      contents.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: base64Data,
        },
      });
      
      contents.push(
        "Analyze this flowchart/process map image in detail. Extract its core title, a description, and represent all stages, boxes, or steps as a clean list of connected nodes. Identify step types ('start', 'process', 'decision', 'end', or 'input_output'), their textual descriptions, any inner details, and correct linking edge connections (including any decision labels like 'Yes' or 'No'). Provide a visual grid location estimation (x from 10 to 90, y from 10 to 90) to space them beautifully across a standard horizontal flow canvas."
      );
    } else if (textPrompt) {
      contents.push(
        `Generate a realistic, logical flowchart for the following process: "${textPrompt}". Identify logical workflow stages as nodes with appropriate types ('start', 'process', 'decision', 'end'), text, descriptions, and structural connectors (edges) that define the flow. Align them nicely on a coordinate layout (x from 15 to 85, y from 15 to 85) that progresses horizontally or logically.`
      );
    }

    console.log("Calling Gemini API to parse flowchart...");
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "Flowchart / Process Map Title" },
            description: { type: Type.STRING, description: "Brief overview of what this process achieves" },
            nodes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING, description: "Unique letter/number code (e.g. n1, n2, n3)" },
                  label: { type: Type.STRING, description: "Primary label or step name" },
                  type: { type: Type.STRING, description: "Node type: start, process, decision, or end" },
                  description: { type: Type.STRING, description: "Further subtext or operational rules" },
                  approximateLocation: {
                    type: Type.OBJECT,
                    description: "Relative coordinate layout for beautiful centering",
                    properties: {
                      x: { type: Type.NUMBER, description: "relative coordinate horizontally 0-100" },
                      y: { type: Type.NUMBER, description: "relative coordinate vertically 0-100" }
                    },
                    required: ["x", "y"]
                  }
                },
                required: ["id", "label", "type"]
              }
            },
            edges: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  from: { type: Type.STRING, description: "Source node ID" },
                  to: { type: Type.STRING, description: "Destination node ID" },
                  label: { type: Type.STRING, description: "Decision path label, e.g. Yes/No, or transition details" }
                },
                required: ["from", "to"]
              }
            }
          },
          required: ["title", "description", "nodes", "edges"]
        }
      }
    });

    const parsedJson = JSON.parse(response.text || "{}");
    console.log("Gemini process parsed successfully!");
    res.json({ success: true, data: parsedJson });
  } catch (error: any) {
    console.error("Error running server-side flowchart extraction:", error);
    res.status(500).json({ error: error.message || "Failed to process image flowchart model." });
  }
});

// Configure Vite dynamic serving overlay
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in DEVELOPMENT mode with Vite integration...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in PRODUCTION mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express custom server running at http://0.0.0.0:${PORT}/`);
  });
}

startServer();
