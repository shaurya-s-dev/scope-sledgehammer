"use client";
import { useState, useEffect, useCallback } from "react";
import { Terminal, ChevronDown, ChevronUp } from "lucide-react";

interface PEvent { type: string; name: string; t: string; meta?: string }

// Helper so the panel can be used for screenshot proof
export default function PendoDebug() {
  const [open, setOpen]     = useState(false);
  const [ready, setReady]   = useState(false);
  const [vid,   setVid]     = useState("");
  const [evts,  setEvts]    = useState<PEvent[]>([]);

  const push = useCallback((e: PEvent) =>
    setEvts(p => [e, ...p].slice(0, 8)), []);

  useEffect(() => {
    const check = () => {
      const p = (window as any).pendo;
      if (p?.isReady?.()) {
        setReady(true);
        setVid(p.getVisitorId?.() ?? "—");
        push({ type: "INIT", name: "pendo.initialize", t: new Date().toLocaleTimeString(),
               meta: `visitor=${p.getVisitorId?.()}` });
      }
    };
    const t = setTimeout(check, 1800);   // wait for async load
    return () => clearTimeout(t);
  }, [push]);

  // Intercept pendo.track after it's available
  useEffect(() => {
    if (!ready) return;
    const p = (window as any).pendo;
    if (!p?.track) return;
    const orig = p.track.bind(p);
    p.track = (name: string, props?: object) => {
      push({ type: "TRACK", name, t: new Date().toLocaleTimeString(),
             meta: props ? JSON.stringify(props).slice(0, 60) : undefined });
      return orig(name, props);
    };
  }, [ready, push]);

  const fireTest = () => {
    const p = (window as any).pendo;
    p?.track?.("sledgehammer_debug_test", { ts: Date.now() });
  };

  const dotColor = ready ? "#00FFFF" : "#FF2D2D";

  return (
    <div style={{ position:"fixed", bottom:20, right:20, zIndex:9900,
                  fontFamily:"'JetBrains Mono',monospace", fontSize:10 }}>

      {/* toggle */}
      <button onClick={() => setOpen(o => !o)}
        style={{ display:"flex", alignItems:"center", gap:6,
                 background:"rgba(0,0,0,0.88)", backdropFilter:"blur(8px)",
                 border:`1px solid ${dotColor}44`, color:dotColor,
                 padding:"5px 11px", cursor:"pointer",
                 letterSpacing:"0.14em", textTransform:"uppercase" }}>
        <Terminal size={11} />
        PENDO {ready ? "LIVE" : "OFFLINE"}
        <span style={{ width:6,height:6,borderRadius:"50%",background:dotColor,
                       boxShadow:ready?`0 0 6px ${dotColor}`:"none",
                       animation:ready?"blink 1.4s ease-in-out infinite":"none" }} />
        {open ? <ChevronDown size={10}/> : <ChevronUp size={10}/>}
      </button>

      {/* panel */}
      {open && (
        <div style={{ position:"absolute", bottom:"calc(100% + 6px)", right:0,
                      width:370, background:"rgba(4,4,6,0.97)",
                      border:"1px solid rgba(0,255,255,0.18)",
                      boxShadow:"0 0 28px rgba(0,255,255,0.08)",
                      backdropFilter:"blur(16px)", padding:16 }}>

          {/* header */}
          <div style={{ display:"flex", justifyContent:"space-between",
                        marginBottom:10, color:"#00FFFF",
                        letterSpacing:"0.2em", textTransform:"uppercase" }}>
            <span>◈ Novus / Pendo Debug</span>
            <span style={{ color:"#3F3F46", fontSize:9 }}>
              key …{" "}50394957-2dad
            </span>
          </div>

          {/* status row */}
          <div style={{ padding:"8px 10px", marginBottom:10,
                        background: ready?"rgba(0,255,255,0.05)":"rgba(255,45,45,0.06)",
                        border:`1px solid ${dotColor}33`,
                        color: ready ? "#00FFFF" : "#FF5555",
                        letterSpacing:"0.06em" }}>
            {ready
              ? `✓  SDK INITIALIZED  ·  visitor: ${vid.slice(0,26)}…`
              : "✗  SDK not ready yet — check network"}
          </div>

          {/* events */}
          <div style={{ color:"#3F3F46", letterSpacing:"0.1em",
                        textTransform:"uppercase", marginBottom:6, fontSize:9 }}>
            recent events ({evts.length})
          </div>
          <div style={{ maxHeight:180, overflowY:"auto", display:"flex",
                        flexDirection:"column", gap:3 }}>
            {evts.length === 0
              ? <span style={{ color:"#3F3F46", fontStyle:"italic" }}>
                  No events yet — use the app or click Test below.
                </span>
              : evts.map((e, i) => (
                <div key={i} style={{ padding:"5px 8px",
                                      background:"rgba(255,255,255,0.025)",
                                      border:"1px solid rgba(255,255,255,0.05)" }}>
                  <div style={{ display:"flex", justifyContent:"space-between" }}>
                    <span style={{ color: e.type==="TRACK"?"#FF00FF":"#00FFFF",
                                   fontWeight:700 }}>
                      [{e.type}] {e.name}
                    </span>
                    <span style={{ color:"#3F3F46" }}>{e.t}</span>
                  </div>
                  {e.meta && <div style={{ color:"#52525B", fontSize:9,
                                           marginTop:2 }}>{e.meta}</div>}
                </div>
              ))}
          </div>

          {/* test fire */}
          <button onClick={fireTest}
            style={{ marginTop:10, width:"100%", padding:"7px",
                     background:"rgba(0,255,255,0.07)",
                     border:"1px solid rgba(0,255,255,0.18)", color:"#00FFFF",
                     cursor:"pointer", letterSpacing:"0.14em",
                     textTransform:"uppercase",
                     fontFamily:"'JetBrains Mono',monospace", fontSize:9 }}>
            ▶ FIRE TEST TRACK EVENT
          </button>
        </div>
      )}
    </div>
  );
}