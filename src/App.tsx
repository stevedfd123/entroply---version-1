import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Flame,
  Zap,
  Award,
  Activity,
  Eye,
  CheckSquare,
  Cpu,
  Layers,
  Play,
  Pause,
  SlidersHorizontal,
  RefreshCw,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  XCircle,
  Info,
  Link as LinkIcon,
  HelpCircle,
  FileText,
  Upload,
  ArrowDownCircle,
  LineChart,
  Palette
} from "lucide-react";
import { initialE3Nodes, initialE3Edges, FlowNode, FlowEdge } from "./data/e3Model";

// Premium Color Themes Configuration
const themes = {
  slate: {
    id: "slate",
    name: "Cosmic Slate",
    bg: "bg-slate-950 text-slate-100",
    header: "border-slate-900 bg-slate-950/80",
    panel: "bg-slate-900/40 border border-slate-900",
    panelInner: "bg-slate-950/80 border border-slate-900/60",
    box: "bg-slate-950 border border-slate-900/80",
    borderColor: "border-slate-800",
    textMuted: "text-slate-400",
    halos: (
      <>
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-red-950/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-emerald-950/10 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-yellow-950/10 rounded-full blur-[120px] pointer-events-none" />
      </>
    )
  },
  nebula: {
    id: "nebula",
    name: "Neon Nebula",
    bg: "bg-zinc-950 text-zinc-100",
    header: "border-zinc-900 bg-zinc-950/80",
    panel: "bg-zinc-900/40 border border-zinc-900",
    panelInner: "bg-zinc-950/80 border border-zinc-900/60",
    box: "bg-zinc-950 border border-zinc-900/80",
    borderColor: "border-zinc-800",
    textMuted: "text-zinc-400",
    halos: (
      <>
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-950/20 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-fuchsia-950/20 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-violet-950/20 rounded-full blur-[120px] pointer-events-none" />
      </>
    )
  },
  solar: {
    id: "solar",
    name: "Cyber Amber",
    bg: "bg-stone-950 text-stone-100",
    header: "border-stone-900 bg-stone-950/80",
    panel: "bg-stone-900/40 border border-stone-800",
    panelInner: "bg-stone-950/80 border border-stone-900/60",
    box: "bg-stone-950 border border-stone-900/80",
    borderColor: "border-stone-800",
    textMuted: "text-stone-400",
    halos: (
      <>
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-amber-950/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-orange-950/20 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-yellow-950/15 rounded-full blur-[120px] pointer-events-none" />
      </>
    )
  },
  glacier: {
    id: "glacier",
    name: "Arctic Mint",
    bg: "bg-slate-950 text-slate-100",
    header: "border-cyan-950 bg-slate-950/80",
    panel: "bg-cyan-950/10 border border-cyan-900/60",
    panelInner: "bg-slate-950/80 border border-cyan-950/40",
    box: "bg-slate-950 border border-cyan-950/35",
    borderColor: "border-cyan-900/40",
    textMuted: "text-cyan-500/80",
    halos: (
      <>
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-950/20 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-teal-950/20 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-sky-950/20 rounded-full blur-[120px] pointer-events-none" />
      </>
    )
  }
};

export default function App() {
  // Model state configurations
  const [nodes, setNodes] = useState<FlowNode[]>(initialE3Nodes);
  const [edges, setEdges] = useState<FlowEdge[]>(initialE3Edges);
  const [selectedNodeId, setSelectedNodeId] = useState<string>("e2_lean_energy");

  // Premium interactive theme state loader
  const [themeId, setThemeId] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("namal_e3_theme") || "slate";
    }
    return "slate";
  });

  useEffect(() => {
    localStorage.setItem("namal_e3_theme", themeId);
  }, [themeId]);

  const theme = themes[themeId as keyof typeof themes] || themes.slate;
  
  // Custom theme or link URL loader state
  const [inputUrl, setInputUrl] = useState<string>("https://imgur.com/UEhDBCv");
  const [customText, setCustomText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [apiSuccess, setApiSuccess] = useState<boolean | null>(null);
  const [isSimulated, setIsSimulated] = useState<boolean>(false);

  // Original view togglestates
  const [showOriginalImage, setShowOriginalImage] = useState<boolean>(false);

  // Simulator values
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [energyLevel, setEnergyLevel] = useState<number>(65); // 0% to 100%
  const [activePillars, setActivePillars] = useState<string[]>([
    "discipline",
    "visibility",
    "structure",
    "flow",
    "intelligence"
  ]);

  // Dynamic simulation outcome calculations
  const [entropyLevel, setEntropyLevel] = useState<number>(15);
  const [excellenceScore, setExcellenceScore] = useState<number>(85);
  const [systemStability, setSystemStability] = useState<string>("Stable Peak");

  // Re-calculate simulation values in real-time based on active pillars & energy slider
  useEffect(() => {
    // Each missing pillar adds 16% to entropy. E1's base baseline is high.
    const maxPillarsCount = 5;
    const inactiveCount = maxPillarsCount - activePillars.length;
    
    // Calculate raw entropy from missing standard pillars
    let calculatedEntropy = inactiveCount * 17;
    
    // Energy level reduces entropy (more structured anti-entropy thrust)
    const energyFactor = (100 - energyLevel) * 0.35;
    calculatedEntropy = Math.min(100, Math.max(0, Math.round(calculatedEntropy + energyFactor)));

    // Excellence is the logical inversed offset
    const calculatedExcellence = Math.round(Math.max(0, 100 - calculatedEntropy));

    setEntropyLevel(calculatedEntropy);
    setExcellenceScore(calculatedExcellence);

    // Set textual stability diagnoses
    if (calculatedEntropy > 75) {
      setSystemStability("Extreme Decay (Entropy Drift)");
    } else if (calculatedEntropy > 45) {
      setSystemStability("Vulnerable & Volatile");
    } else if (calculatedEntropy > 20) {
      setSystemStability("Controlled & Managed");
    } else {
      setSystemStability("Excellence Managed");
    }
  }, [activePillars, energyLevel]);

  // Helper dictionary to match Icon Names to components
  const iconMap: Record<string, any> = {
    Flame: Flame,
    Zap: Zap,
    Award: Award,
    Layers: Layers,
    Eye: Eye,
    Activity: Activity,
    CheckSquare: CheckSquare,
    Cpu: Cpu
  };

  // Switch pillartoggle
  const handleTogglePillar = (id: string) => {
    if (activePillars.includes(id)) {
      setActivePillars(prev => prev.filter(p => p !== id));
    } else {
      setActivePillars(prev => [...prev, id]);
    }
  };

  // Submit custom flowchart process or link evaluation
  const handleAnalyzeProcess = async (type: "url" | "text") => {
    setIsLoading(true);
    setErrorMessage(null);
    setApiSuccess(null);
    setIsSimulated(false);

    const payload: any = {};
    if (type === "url") {
      if (!inputUrl) {
        setErrorMessage("Please supply an image or Imgur flowchart URL.");
        setIsLoading(false);
        return;
      }
      payload.url = inputUrl;
    } else {
      if (!customText) {
        setErrorMessage("Please write a workflow prompt.");
        setIsLoading(false);
        return;
      }
      payload.textPrompt = customText;
    }

    try {
      const response = await fetch("/api/analyze-flowchart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Server failed to analyze the process.");
      }

      const result = await response.json();
      
      if (result.success && result.data) {
        const newNodes: FlowNode[] = result.data.nodes.map((node: any, idx: number) => ({
          ...node,
          gradient: idx === 0 
            ? "from-orange-600 via-red-500 to-red-600" 
            : idx === result.data.nodes.length - 1
              ? "from-amber-500 via-yellow-400 to-amber-600"
              : "from-emerald-600 via-teal-500 to-emerald-500",
          borderColor: idx === 0 
            ? "border-red-400" 
            : idx === result.data.nodes.length - 1
              ? "border-yellow-400"
              : "border-emerald-400",
          glowColor: idx === 0 
            ? "rgba(239, 68, 68, 0.4)" 
            : idx === result.data.nodes.length - 1
              ? "rgba(245, 158, 11, 0.4)"
              : "rgba(16, 185, 129, 0.4)",
          iconName: idx === 0 ? "Flame" : idx === result.data.nodes.length - 1 ? "Award" : "Zap",
          title: node.label,
          subtitle: node.type.toUpperCase() + " State",
          concept: node.description || "Parsed flowchart step",
          items: [
            { text: node.description || "Active Node Process Status", status: "info" }
          ]
        }));

        const newEdges: FlowEdge[] = result.data.edges.map((edge: any) => ({
          from: edge.from,
          to: edge.to,
          label: edge.label || "Leads to",
          color: "from-teal-500 to-emerald-500",
          animated: true
        }));

        setNodes(newNodes);
        setEdges(newEdges);
        setApiSuccess(true);
        if (newNodes.length > 0) {
          setSelectedNodeId(newNodes[0].id);
        }
        if (result.simulated) {
          setIsSimulated(true);
        }
      } else if (result.simulated) {
        setIsSimulated(true);
        // Load simulated nodes
        const demoNodes = result.data.nodes.map((node: any, idx: number) => ({
          ...node,
          gradient: "from-teal-600 to-cyan-500",
          borderColor: "border-cyan-300",
          glowColor: "rgba(6, 182, 212, 0.3)",
          iconName: "Zap",
          title: node.label,
          subtitle: "Simulated Step",
          concept: node.description,
          items: [{ text: "Evaluation criteria processed", status: "info" }]
        }));
        setNodes(demoNodes);
        setEdges(result.data.edges);
        setSelectedNodeId(demoNodes[0].id);
      } else {
        throw new Error("Invalid output received from the server.");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "An error occurred while connecting to the Gemini backend.");
      setApiSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset/Reset to original E3 flow
  const handleResetToE3 = () => {
    setNodes(initialE3Nodes);
    setEdges(initialE3Edges);
    setSelectedNodeId("e2_lean_energy");
    setIsSimulated(false);
    setErrorMessage(null);
    setApiSuccess(null);
  };

  const selectedNode = nodes.find(n => n.id === selectedNodeId) || nodes[0];

  return (
    <div className={`min-h-screen ${theme.bg} font-sans selection:bg-emerald-500 selection:text-slate-900 pb-16 transition-colors duration-300`}>
      
      {/* Decorative Atmosphere Halos */}
      {theme.halos}

      {/* Main Structural Layout Header */}
      <header className={`border-b ${theme.header} backdrop-blur-md sticky top-0 z-40 px-6 py-4 transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo & Headline */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg ring-1 ring-emerald-400/20">
              <Zap className="w-6 h-6 text-emerald-950 fill-emerald-100 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display font-bold text-xl tracking-tight text-white">
                  Namal's E3 Model Suite
                </h1>
                <span className="text-xs bg-emerald-500/15 text-emerald-400 font-mono px-2 py-0.5 rounded-full border border-emerald-500/20">
                  Interactive V2
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                The Process Purifier & Strategy Suite
              </p>
            </div>
          </div>

          {/* Quick-action Header Controls */}
          <div className="flex flex-wrap items-center gap-4">
            
            {/* Interactive Theme Palette Buttons */}
            <div className="flex items-center gap-2 bg-slate-950/60 border border-slate-850 p-1.5 rounded-xl shadow-inner">
              <span className="flex items-center gap-1 text-[10px] font-mono text-slate-400 uppercase tracking-wider pl-2 pr-1 select-none">
                <Palette className="w-3.5 h-3.5 text-indigo-400 animate-pulse" /> Theme:
              </span>
              {(Object.keys(themes) as Array<keyof typeof themes>).map((tId) => {
                const themeItem = themes[tId];
                const isSelected = themeId === tId;
                let btnColor = "from-slate-600 to-slate-500";
                if (tId === "slate") btnColor = "from-cyan-500 via-teal-500 to-emerald-500";
                else if (tId === "nebula") btnColor = "from-indigo-500 via-fuchsia-500 to-pink-500";
                else if (tId === "solar") btnColor = "from-amber-600 via-orange-500 to-yellow-500";
                else if (tId === "glacier") btnColor = "from-sky-450 via-teal-400 to-emerald-400";

                return (
                  <button
                    key={tId}
                    onClick={() => setThemeId(tId)}
                    title={themeItem.name}
                    className={`w-5 h-5 rounded-full bg-gradient-to-tr ${btnColor} transition-all relative flex items-center justify-center ${
                      isSelected ? "ring-2 ring-white scale-110 shadow-lg" : "opacity-60 hover:opacity-100 hover:scale-105"
                    }`}
                  >
                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white block" />}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setShowOriginalImage(!showOriginalImage)}
              className="flex items-center gap-2 text-xs font-medium px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg border border-slate-800 transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-orange-400" />
              {showOriginalImage ? "Hide Original Image" : "View Original Map URL"}
            </button>
            
            <button
              onClick={handleResetToE3}
              className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 rounded-lg shadow-md hover:shadow-emerald-500/15 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset base E3 Model
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 mt-8 space-y-8">
        
        {/* original image thumbnail link overlay panel if enabled */}
        <AnimatePresence>
          {showOriginalImage && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-12 bg-slate-950 rounded border border-slate-800 overflow-hidden flex items-center justify-center">
                    <img
                      src="https://i.imgur.com/UEhDBCv.jpeg"
                      alt="Source Namal Flow"
                      className="object-cover w-full h-full opacity-60 hover:opacity-100 transition-opacity"
                    />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Original Imgur Flowchart Asset</h4>
                    <p className="text-xs text-slate-400">View or download the raw user-provided target diagram at imgur.</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <a
                    href="https://imgur.com/UEhDBCv"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded border border-slate-700 flex items-center gap-1 transition-colors"
                  >
                    View Imgur Album <LinkIcon className="w-3 h-3 text-slate-400" />
                  </a>
                  <a
                    href="https://i.imgur.com/UEhDBCv.jpeg"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded border border-emerald-500/20 flex items-center gap-1 transition-colors"
                  >
                    Direct HQ Image Source
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* TOP LEVEL: The interactive, animated Process Flow chart Map */}
        <section id="flowchart-map" className={`relative ${theme.panel} rounded-2xl p-6 md:p-8 overflow-hidden shadow-2xl transition-all duration-300`}>
          
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
              <h3 className="font-display font-semibold text-lg text-white">
                Active System Process Grid
              </h3>
            </div>
            
            {/* Legend indicators */}
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block shadow shadow-orange-500/50" /> E1: Entropy state
              </span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block shadow shadow-emerald-400/50 animate-pulse" /> E2: Anti-Entropy Force
              </span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 inline-block shadow shadow-yellow-400/50" /> E3: Excellence state
              </span>
            </div>
          </div>

          {/* Interactive Flow Grid Container */}
          <div className={`relative min-h-[460px] w-full rounded-xl ${theme.panelInner} overflow-hidden flex flex-col md:flex-row items-stretch justify-between p-4 px-10 gap-12 md:gap-4 transition-all duration-300`}>
            
            {/* Flow grid lines drawing - absolute positioned SVG underneath nodes */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none hidden md:block" style={{ minHeight: "400px" }}>
              <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="15" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#1e293b" />
                </marker>
                <marker id="arrow-active" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#10b981" />
                </marker>
                {/* Gradients for animated paths */}
                <linearGradient id="flow-e1-e2" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f97316" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.8" />
                </linearGradient>
                <linearGradient id="flow-e2-e3" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#eab308" stopOpacity="0.8" />
                </linearGradient>
              </defs>

              {/* Dynamic responsive grid connection paths based on loaded edges */}
              {edges.map((edge, index) => {
                const source = nodes.find(n => n.id === edge.from);
                const target = nodes.find(n => n.id === edge.to);
                
                if (!source || !target) return null;

                // Find index to calculate standard horizontal fallbacks if coordinates are missing
                const sourceIdx = nodes.findIndex(n => n.id === edge.from);
                const targetIdx = nodes.findIndex(n => n.id === edge.to);

                const getCoordinates = (node: FlowNode, idx: number) => {
                  if (node.approximateLocation) {
                    return node.approximateLocation;
                  }
                  // Fallbacks based on ID
                  if (node.id === "e1_entropy") return { x: 15, y: 50 };
                  if (node.id === "e2_lean_energy") return { x: 50, y: 50 };
                  if (node.id === "e3_excellence") return { x: 85, y: 50 };
                  // Dynamic spread fallback based on list index
                  const fraction = nodes.length > 1 ? idx / (nodes.length - 1) : 0.5;
                  return { x: Math.round(15 + fraction * 70), y: 50 };
                };

                const sourceLoc = getCoordinates(source, sourceIdx);
                const targetLoc = getCoordinates(target, targetIdx);

                // Scale grid (approximateLocation 0-100) to actual viewbox ranges
                const sx = sourceLoc.x;
                const sy = sourceLoc.y;
                const tx = targetLoc.x;
                const ty = targetLoc.y;

                // Midpoints to introduce attractive curved bezels to make it look like a flow chart
                const mx = (sx + tx) / 2;
                const pathD = `M ${sx}% ${sy}% C ${mx}% ${sy}%, ${mx}% ${ty}%, ${tx}% ${ty}%`;

                // Calculate dash properties
                const isE2ActiveFlow = edge.from === "e2_lean_energy" || edge.to === "e2_lean_energy";
                const isFlowing = isPlaying && (activePillars.length > 0 || !isE2ActiveFlow);
                const pathColor = edge.from === "e1_entropy" ? "url(#flow-e1-e2)" : "url(#flow-e2-e3)";

                return (
                  <g key={`edge-${index}`}>
                    {/* Underlying thick structural path background */}
                    <path
                      d={pathD}
                      fill="none"
                      stroke="#0f172a"
                      strokeWidth="6"
                      className="transition-all duration-300"
                    />
                    
                    {/* Glowing outer aura path */}
                    <path
                      d={pathD}
                      fill="none"
                      stroke={edge.from === "e1_entropy" ? "#f97316" : "#10b981"}
                      strokeWidth="2"
                      strokeOpacity="0.25"
                      className="transition-all duration-300"
                    />

                    {/* Animated energy movement path */}
                    <path
                      d={pathD}
                      fill="none"
                      stroke={pathColor}
                      strokeWidth="3.5"
                      className={`transition-all duration-300 ${
                        isFlowing ? "animate-dash-flow" : ""
                      }`}
                      style={{
                        // Flow speed correlates to the Lean Energy Slider settings!
                        animationDuration: `${Math.max(0.4, 2.5 - (energyLevel / 45))}s`,
                        strokeDasharray: "8, 12",
                        opacity: isFlowing ? 0.95 : 0.4
                      }}
                      markerEnd="url(#arrow-active)"
                    />
                  </g>
                );
              })}
            </svg>

            {/* NODES PRESENTATION GRID */}
            <div className="relative w-full z-10 flex flex-col md:flex-row items-center justify-between gap-12 md:gap-4 my-auto py-6">
              
              {nodes.map((node, index) => {
                const IsActiveSelected = selectedNodeId === node.id;
                const NodeIcon = iconMap[node.iconName] || Zap;
                
                // Color formatting configurations
                let hoverBorderColor = "hover:border-emerald-300";
                let shadowGlowClass = "";
                let indicatorBulletColor = "bg-slate-400";

                if (node.id === "e1_entropy") {
                  hoverBorderColor = "hover:border-orange-400";
                  shadowGlowClass = IsActiveSelected ? "shadow-neon-orange" : "";
                  indicatorBulletColor = "bg-orange-500 animate-pulse";
                } else if (node.id === "e2_lean_energy") {
                  hoverBorderColor = "hover:border-emerald-400";
                  shadowGlowClass = IsActiveSelected ? "shadow-neon-emerald" : "";
                  indicatorBulletColor = "bg-emerald-400";
                } else if (node.id === "e3_excellence") {
                  hoverBorderColor = "hover:border-yellow-400";
                  shadowGlowClass = IsActiveSelected ? "shadow-neon-yellow" : "";
                  indicatorBulletColor = "bg-yellow-400";
                }

                return (
                  <motion.div
                    key={node.id}
                    onClick={() => setSelectedNodeId(node.id)}
                    className={`cursor-pointer w-full md:w-[30%] min-h-[170px] rounded-xl border p-4 text-left transition-all relative ${
                      IsActiveSelected
                        ? `bg-slate-900 border-2 border-slate-100 ${shadowGlowClass}`
                        : `${theme.id === "solar" ? "bg-stone-900/90 border-stone-800/80" : theme.id === "nebula" ? "bg-zinc-900/90 border-zinc-800/80" : theme.id === "glacier" ? "bg-slate-900/95 border-cyan-950/60" : "bg-slate-900/90 border-slate-800/80"} ${hoverBorderColor}`
                    }`}
                    whileHover={{ scale: IsActiveSelected ? 1 : 1.02, y: -4 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    {/* Badge state indicator */}
                    <div className="absolute top-2 right-2.5 flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${indicatorBulletColor}`} />
                      {node.badge && (
                        <span className="text-[9px] font-mono text-slate-400 tracking-tight bg-slate-950 px-1.5 py-0.5 rounded">
                          {node.badge}
                        </span>
                      )}
                    </div>

                    {/* Step Name Segment */}
                    <div className="flex items-center gap-3.5 mb-3">
                      <div className={`p-2.5 bg-gradient-to-br ${node.gradient} rounded-lg text-slate-950 shadow-md`}>
                        <NodeIcon className="w-5 h-5 text-slate-950 fill-white/10" />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-slate-400 tracking-widest uppercase block">
                          Stage {index + 1}
                        </span>
                        <h4 className="font-display font-bold text-sm tracking-tight text-white uppercase mt-0.5">
                          {node.label}
                        </h4>
                      </div>
                    </div>

                    {/* Short Description */}
                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                      {node.concept}
                    </p>

                    {/* Render visual pillar accelerator symbols inside E2 block directly as a micro-interactive map */}
                    {node.id === "e2_lean_energy" && (
                      <div className="mt-4 pt-4 border-t border-slate-800/60">
                        <div className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-2 flex items-center justify-between">
                          <span>Operational Pillars (Active: {activePillars.length}/5)</span>
                          <span className="text-emerald-400 text-xs">⚡</span>
                        </div>
                        <div className="grid grid-cols-5 gap-1.5">
                          {node.pillars?.map(pil => {
                            const PilIcon = iconMap[pil.icon] || Layers;
                            const isActive = activePillars.includes(pil.id);
                            return (
                              <button
                                key={pil.id}
                                title={`${pil.label}: ${pil.subLabel}`}
                                onClick={(e) => {
                                  e.stopPropagation(); // Avoid selecting E2 node trigger
                                  handleTogglePillar(pil.id);
                                }}
                                className={`p-2 rounded-lg flex flex-col items-center justify-center transition-all ${
                                  isActive
                                    ? "bg-emerald-500/20 border border-emerald-500/60 text-emerald-300 scale-105"
                                    : "bg-slate-950/80 border border-slate-800 text-slate-500 hover:text-slate-300"
                                }`}
                              >
                                <PilIcon className="w-4 h-4" />
                                <span className="text-[8px] font-mono mt-1 font-bold">
                                  {pil.id[0].toUpperCase() + pil.id.slice(1, 4)}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Click details indicator tag */}
                    <div className="mt-4 flex items-center justify-between text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-850">
                      <span>Click node to inspect</span>
                      {IsActiveSelected ? (
                        <span className="text-emerald-400 flex items-center gap-0.5">Inspecting <ArrowRight className="w-2.5 h-2.5" /></span>
                      ) : (
                        <span>Select Node</span>
                      )}
                    </div>
                  </motion.div>
                );
              })}

            </div>

            {/* Grid overlay background pixels */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000010_1px,transparent_1px),linear-gradient(to_bottom,#00000010_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none opacity-40" />
          </div>

          <div className={`mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs ${theme.textMuted} bg-slate-950/40 p-4 border ${theme.borderColor} rounded-xl transition-all duration-300`}>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>
                <strong>Interaction:</strong> Click the E2 pillars directly above to power the <strong>Anti-Entropy Shield</strong>!
              </span>
            </div>
            
            {/* Play pause controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-md border border-slate-700 font-semibold"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5 text-orange-400" /> Pause Path flow
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 text-emerald-400" /> Play Path flow
                  </>
                )}
              </button>
            </div>
          </div>
        </section>


        {/* MIDDLE LEVEL: Sandbox Simulation Panel & Node Detailed Inspector */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* COLUMN LEFT (7 cols): Simulation sandbox metrics & sliders */}
          <div className={`lg:col-span-7 ${theme.panel} p-6 rounded-2xl flex flex-col justify-between space-y-6 transition-all duration-300`}>
            
            <div>
              <div className="flex items-center gap-2 mb-2">
                <LineChart className="w-5 h-5 text-emerald-400" />
                <h3 className="font-display font-semibold text-lg text-white">
                  Operational Simulator Control Center
                </h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Test the durability of the process flow under stress. Slide the structured energy output and turn standard pillars on and off to verify the decline into Entropy or ascent into excellence.
              </p>
            </div>

            {/* Dynamic Gauges & Multi-bars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Box 1: Entropy Level */}
              <div className={`${theme.box} p-4 rounded-xl relative overflow-hidden transition-all duration-300`}>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-2">
                  <span>System Entropy Drifts</span>
                  <Flame className="w-4 h-4 text-orange-500" />
                </div>
                <div className="text-2xl font-mono font-bold text-orange-400">
                  {entropyLevel}%
                </div>
                <div className="w-full bg-slate-900 h-2.5 rounded-full mt-3.5 overflow-hidden">
                  <motion.div
                    className="bg-gradient-to-r from-orange-500 to-red-600 h-full rounded-full"
                    animate={{ width: `${entropyLevel}%` }}
                    transition={{ type: "spring", stiffness: 80 }}
                  />
                </div>
                <span className="text-[10px] text-slate-500 mt-2 block">
                  Natural decline vector index
                </span>
                {entropyLevel > 60 && (
                  <div className="absolute inset-x-0 bottom-0 py-0.5 bg-red-500/10 border-t border-red-500/20 text-center">
                    <span className="text-[8px] font-mono font-bold text-red-400 animate-pulse uppercase tracking-wider">⚠️ Critical Disorder Drift</span>
                  </div>
                )}
              </div>

              {/* Box 2: Lean Anti-Entropy force */}
              <div className={`${theme.box} p-4 rounded-xl relative overflow-hidden transition-all duration-300`}>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-2">
                  <span>Anti-Entropy Output</span>
                  <Zap className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-mono font-bold text-emerald-400">
                  {Math.round((activePillars.length * 15) + (energyLevel * 0.25))}%
                </div>
                <div className="w-full bg-slate-900 h-2.5 rounded-full mt-3.5 overflow-hidden">
                  <motion.div
                    className="bg-gradient-to-r from-teal-500 to-emerald-400 h-full rounded-full"
                    animate={{ width: `${Math.min(100, Math.round((activePillars.length * 15) + (energyLevel * 0.25)))}%` }}
                    transition={{ type: "spring", stiffness: 80 }}
                  />
                </div>
                <span className="text-[10px] text-slate-500 mt-2 block">
                  Focused alignment thrust
                </span>
              </div>

              {/* Box 3: Excellence Score */}
              <div className={`${theme.box} p-4 rounded-xl relative transition-all duration-300`}>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-2">
                  <span>Excellence Score</span>
                  <Award className="w-4 h-4 text-yellow-400" />
                </div>
                <div className="text-2xl font-mono font-bold text-yellow-400">
                  {excellenceScore}%
                </div>
                <div className="w-full bg-slate-900 h-2.5 rounded-full mt-3.5 overflow-hidden">
                  <motion.div
                    className="bg-gradient-to-r from-yellow-500 to-amber-500 h-full rounded-full"
                    animate={{ width: `${excellenceScore}%` }}
                    transition={{ type: "spring", stiffness: 80 }}
                  />
                </div>
                <span className="text-[10px] text-slate-500 mt-2 block font-mono uppercase tracking-widest">
                  {systemStability}
                </span>
                
                {excellenceScore >= 95 && (
                  <div className="absolute -top-1.5 -right-1.5">
                    <span className="flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-yellow-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
                    </span>
                  </div>
                )}
              </div>

            </div>

            {/* Slide control levers */}
            <div className={`space-y-4 ${theme.panelInner} p-5 rounded-xl transition-all duration-300`}>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
                Structured Energy Control Levers
              </h4>

              {/* Slider Option 1 */}
              <div>
                <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Activity className="w-3.5 h-3.5 text-emerald-400" /> Active Applied Energy (Focus & Alignment)
                  </span>
                  <span className="font-mono text-emerald-400 font-bold">{energyLevel}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={energyLevel}
                  onChange={(e) => setEnergyLevel(Number(e.target.value))}
                  className="w-full accent-emerald-500 h-1.5 bg-slate-900 rounded-lg cursor-pointer"
                />
                <span className="text-[9px] text-slate-500">
                  Slide right to amplify process flow particle speeds and counteract random background noise.
                </span>
              </div>

              {/* Quick toggle presets */}
              <div className="pt-2 border-t border-slate-900/60 flex flex-wrap items-center justify-between gap-3 text-xs">
                <span className="font-bold text-slate-400 uppercase text-[10px]">Operational Presets:</span>
                <div className="flex gap-1.5 flex-wrap">
                  <button
                    onClick={() => {
                      setActivePillars([]);
                      setEnergyLevel(10);
                    }}
                    className="px-2.5 py-1 bg-red-950/30 hover:bg-red-950/50 text-red-400 rounded border border-red-900/40 font-medium transition-all"
                  >
                    Unmanaged Drift (Entropy Max)
                  </button>
                  <button
                    onClick={() => {
                      setActivePillars(["structure", "visibility", "flow"]);
                      setEnergyLevel(50);
                    }}
                    className="px-2.5 py-1 bg-amber-950/30 hover:bg-amber-950/50 text-amber-300 rounded border border-amber-900/40 font-medium transition-all"
                  >
                    Intermediate Controls
                  </button>
                  <button
                    onClick={() => {
                      setActivePillars([
                        "structure",
                        "visibility",
                        "flow",
                        "discipline",
                        "intelligence"
                      ]);
                      setEnergyLevel(100);
                    }}
                    className="px-2.5 py-1 bg-emerald-950/30 hover:bg-emerald-900/25 text-emerald-400 rounded border border-emerald-900/40 font-medium transition-all"
                  >
                    Namal's Engineered state (E3 Spark)
                  </button>
                </div>
              </div>

            </div>

            {/* Diagnose Report alerts container */}
            <div className={`${theme.id === "solar" ? "bg-stone-900/90" : theme.id === "nebula" ? "bg-zinc-900/90" : "bg-slate-900/90"} rounded-xl p-4 border ${theme.borderColor} transition-all duration-300`}>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Operational Diagnosis Report & Feedback
              </span>
              <div className="space-y-2">
                {activePillars.length === 5 && energyLevel > 60 ? (
                  <div className="flex items-start gap-2.5 text-emerald-400 text-xs">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>
                      <strong>Ideal Operations Achieved:</strong> All anti-entropy stabilizers are online. Process waste is systematically eliminated, resulting in highly stable operations, predictable productivity and profitable growth.
                    </span>
                  </div>
                ) : activePillars.length === 0 ? (
                  <div className="flex items-start gap-2.5 text-red-400 text-xs animate-pulse">
                    <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>
                      <strong>Severe Process Entropy:</strong> Systems are in manual unmanaged decay. Process standards are absent, lead times are unpredictable, and costs will rise exponentially if unmanaged. Apply Lean Energy instantly!
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-start gap-2.5 text-amber-400 text-xs">
                      <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                      <span>
                        <strong>Vulnerable System Gaps Detected:</strong>
                        {activePillars.length < 5 && " Some process pillars remain unmanaged. "}
                        {energyLevel < 50 && " Active applied force/leadership energy is insufficient. "}
                      </span>
                    </div>
                    
                    {/* List specific threats which relates to inactive pillars */}
                    <div className="ml-6 flex flex-col gap-1 text-[11px] text-slate-300">
                      {!activePillars.includes("structure") && (
                        <span>• <strong>Structure is missing:</strong> Ad-hoc workflows introduce chaotic quality handoffs.</span>
                      )}
                      {!activePillars.includes("visibility") && (
                        <span>• <strong>Visibility is offline:</strong> Process breakdowns remain hidden until client-facing failures.</span>
                      )}
                      {!activePillars.includes("flow") && (
                        <span>• <strong>Flow is neglected:</strong> Severe lead time queuing and work backlog congestion.</span>
                      )}
                      {!activePillars.includes("discipline") && (
                        <span>• <strong>Discipline is lacking:</strong> Short-term fixes decay back into chaos within weeks.</span>
                      )}
                      {!activePillars.includes("intelligence") && (
                        <span>• <strong>Intelligence is missing:</strong> Root-cause guesswork overrides analytical problem solving.</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>


          {/* COLUMN RIGHT (5 cols): Node detailed checklist inspector */}
          <div className={`lg:col-span-5 ${theme.panel} rounded-2xl overflow-hidden shadow-xl flex flex-col transition-all duration-300`}>
            
            {/* Inspector Header */}
            <div className={`p-5 bg-gradient-to-br ${selectedNode.gradient} text-slate-950 flex items-center justify-between`}>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-950/10 rounded-lg">
                  {React.createElement(iconMap[selectedNode.iconName] || Zap, { className: "w-5 h-5 text-slate-950" })}
                </div>
                <div>
                  <span className="text-[9px] font-mono font-bold tracking-widest uppercase opacity-75">
                    Step Inspector Panel
                  </span>
                  <h3 className="font-display font-semibold tracking-tight text-base uppercase">
                    {selectedNode.label}
                  </h3>
                </div>
              </div>
              <span className="text-[10px] bg-slate-950/20 text-slate-950 font-bold px-2 py-0.5 rounded-full">
                Active View
              </span>
            </div>

            {/* Inspector Body Details */}
            <div className="p-5 flex-1 space-y-5">
              
              {/* Concept Section */}
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                  The Core Philosophy & Concept
                </span>
                <p className={`text-xs text-slate-200 leading-relaxed bg-slate-950/60 p-3.5 border ${theme.borderColor} rounded-xl`}>
                  {selectedNode.concept}
                </p>
              </div>

              {/* Sub-Pillars list render (Special case for E2) */}
              {selectedNode.id === "e2_lean_energy" && selectedNode.pillars && (
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2.5">
                    Anti-Entropy Pillar Audits (Click to preview risk)
                  </span>
                  
                  <div className="space-y-2">
                    {selectedNode.pillars.map(pillar => {
                      const isActive = activePillars.includes(pillar.id);
                      return (
                        <div
                          key={pillar.id}
                          className={`p-2.5 rounded-xl border text-xs transition-colors ${
                            isActive
                              ? `bg-slate-950/60 ${theme.borderColor}`
                              : "bg-red-500/5 border-red-950/30 opacity-70"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className={`font-semibold ${isActive ? "text-emerald-400" : "text-red-400"}`}>
                              {pillar.label} — {pillar.subLabel}
                            </span>
                            <span className={`text-[9px] px-1.5 rounded font-bold ${
                              isActive ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                            }`}>
                              {isActive ? "Managed" : "Risk of Entropy"}
                            </span>
                          </div>
                          
                          <p className="text-[11px] text-slate-300 leading-normal">
                            {isActive ? pillar.detail : `⚠️ Unmanaged Risk: ${pillar.unmanagedRisk}`}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step Checklist Items Bullet Points */}
              {selectedNode.items && selectedNode.items.length > 0 && (
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2.5">
                    Status Indicators & Operational Checklist
                  </span>
                  <div className="space-y-2 max-h-[290px] overflow-y-auto pr-1">
                    {selectedNode.items.map((it, idx) => {
                      let tagColor = "bg-slate-500/15 text-slate-400 border-slate-800";
                      if (it.status === "negative") {
                        tagColor = "bg-red-500/10 text-red-400 border-red-500/10";
                      } else if (it.status === "warning") {
                        tagColor = "bg-yellow-500/10 text-yellow-400 border-yellow-500/15";
                      } else if (it.status === "positive") {
                        tagColor = "bg-emerald-500/10 text-emerald-300 border-emerald-500/15";
                      } else if (it.status === "info") {
                        tagColor = "bg-cyan-500/10 text-cyan-300 border-cyan-500/15";
                      }

                      return (
                        <div key={idx} className={`p-2.5 border rounded-lg text-xs leading-normal flex items-start gap-2 bg-slate-950/50 ${tagColor}`}>
                          <span className="text-base mt-px scale-100 font-bold leading-none shrink-0">•</span>
                          <div>
                            <strong className="text-slate-100 block">{it.text}</strong>
                            {it.subtext && <span className="text-[11px] text-slate-400 block mt-0.5">{it.subtext}</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Bottom Quote statement */}
              {selectedNode.statement && (
                <div className="pt-3 border-t border-slate-850">
                  <div className="text-[11px] italic text-slate-300 bg-slate-950 p-3 rounded-lg border border-slate-900 font-mono text-center">
                    {selectedNode.statement}
                  </div>
                </div>
              )}

            </div>
          </div>

        </section>


        {/* BOTTOM LEVEL: Dynamic AI Flowchart Analyzer & URL link parsing hub */}
        <section className={`${theme.panel} p-6 md:p-8 rounded-2xl shadow-xl transition-all duration-300`}>
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                <h3 className="font-display font-semibold text-lg text-white">
                  Dynamic API Flowchart Analyzer & Translator
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Paste any flowchart picture link, or type down a custom procedural recipe to query Gemini. It reads the elements to instantly map out an animated flowchart map on your screen!
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Option A: Image URL Analyzer (e.g. paste imgur link) */}
            <div className={`${theme.box} p-5 rounded-xl flex flex-col justify-between transition-all duration-300`}>
              <div>
                <span className="text-xs font-mono text-emerald-400 font-bold block mb-1">METHOD 1</span>
                <label className="text-xs font-bold text-white block mb-2">
                  Image URL / Link Reader
                </label>
                <p className="text-[11px] text-slate-400 leading-relaxed mb-4">
                  Provide an image URL of any flowchart (such as imgur links). The server accesses the canvas, parses elements, and formats them instantly.
                </p>
                <div className="relative">
                  <input
                    type="url"
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    placeholder="https://imgur.com/your-flowchart-id"
                    className="w-full bg-slate-900 text-slate-100 text-xs px-3 py-2.5 rounded-lg border border-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                  />
                  <div className="absolute right-2 top-2 text-slate-500">
                    <LinkIcon className="w-4 h-4 text-slate-500" />
                  </div>
                </div>
                
                {/* Imgur original link hint block */}
                <div className="mt-3 text-[10px] text-slate-500 flex gap-1 items-center">
                  <span>Try:</span>
                  <button
                    onClick={() => setInputUrl("https://imgur.com/UEhDBCv")}
                    className="text-slate-300 hover:text-emerald-400 font-mono underline cursor-pointer"
                  >
                    https://imgur.com/UEhDBCv
                  </button>
                  <span>(Namal's image from template instructions)</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-900/60">
                <button
                  onClick={() => handleAnalyzeProcess("url")}
                  disabled={isLoading}
                  className="w-full text-xs font-bold bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-100 px-4 py-2.5 rounded-lg border border-slate-700 transition-colors flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" /> Mining diagram...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 text-emerald-400" /> Parse & Render Image Flow
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Option B: Natural Language Prompt Process Flowmaker */}
            <div className={`${theme.box} p-5 rounded-xl flex flex-col justify-between transition-all duration-300`}>
              <div>
                <span className="text-xs font-mono text-emerald-400 font-bold block mb-1">METHOD 2</span>
                <label className="text-xs font-bold text-white block mb-2">
                  Describe a Custom Process
                </label>
                <p className="text-[11px] text-slate-400 leading-relaxed mb-4">
                  Don't have an image? Type a process (e.g. software QA check, order lifecycle, barista brewing coffees) and let Gemini frame the flowchart steps dynamically.
                </p>
                <textarea
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="How to bake sourdough bread step-by-step; or order processing workflow..."
                  rows={2}
                  className="w-full bg-slate-900 text-slate-100 text-xs p-3 rounded-lg border border-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
                />
                
                <div className="mt-3 flex flex-wrap gap-1.5 items-center">
                  <span className="text-[10px] text-slate-500">Fast examples:</span>
                  <button
                    onClick={() => setCustomText("Toyota Clean Production Pull System with Kanban checks")}
                    className="text-[9px] bg-slate-900 hover:bg-slate-850 border border-slate-800 px-2 py-0.5 rounded text-slate-300"
                  >
                    Toyota Lean
                  </button>
                  <button
                    onClick={() => setCustomText("Customer support triage process from email intake to ticket resolution")}
                    className="text-[9px] bg-slate-900 hover:bg-slate-850 border border-slate-800 px-2 py-0.5 rounded text-slate-300"
                  >
                    CS Triage
                  </button>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-900/60">
                <button
                  onClick={() => handleAnalyzeProcess("text")}
                  disabled={isLoading}
                  className="w-full text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-slate-950 disabled:opacity-50 px-4 py-2.5 rounded-lg shadow-md transition-all flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" /> Framing process chart...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-slate-950 fill-slate-950" /> Generate AI Workflow Map
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>

          {/* Feedback/Error overlay notifier */}
          {errorMessage && (
            <div className="mt-4 p-3 bg-red-950/20 text-red-400 border border-red-900/40 rounded-xl text-xs flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-500 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {apiSuccess && (
            <div className="mt-4 p-3 bg-emerald-950/20 text-emerald-400 border border-emerald-900/40 rounded-xl text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  {isSimulated 
                    ? "Evaluating in simulation sandbox! Injected fallback data successfully."
                    : "Diagram fetched, analyzed and visual mappings calibrated successfully from Gemini API!"}
                </span>
              </div>
              <button
                onClick={handleResetToE3}
                className="text-[10px] uppercase font-bold text-slate-400 hover:text-white underline cursor-pointer"
              >
                Go back to E3
              </button>
            </div>
          )}

        </section>

      </main>

      {/* Humble Footer */}
      <footer className={`mt-20 max-w-7xl mx-auto px-6 pt-8 border-t ${theme.borderColor} text-center transition-all duration-300`}>
        <p className="text-xs text-slate-500">
          Namal's E3 Model Suite interactive visualizer. Powered by Google AI Studio, React, Tailwind, and Gemini.
        </p>
        <p className="text-[10px] text-slate-600 font-mono mt-1">
          UTC Time context: 2026-05-22 • Workspace verified.
        </p>
      </footer>

    </div>
  );
}
