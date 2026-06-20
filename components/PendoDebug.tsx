"use client";
import { useEffect, useState } from "react";

export default function PendoDebug() {
  const [isOpen, setIsOpen] = useState(false);
  const [events, setEvents] = useState<Array<{ name: string; props?: any; timestamp: string }>>([]);
  const [pendoActive, setPendoActive] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const pendo = (window as any).pendo;
      if (pendo && !pendo._isIntercepted) {
        setPendoActive(true);
        const originalTrack = pendo.track;
        pendo.track = function (name: string, props?: any) {
          const newEvent = {
            name,
            props,
            timestamp: new Date().toLocaleTimeString(),
          };
          setEvents((prev) => [newEvent, ...prev].slice(0, 8));
          if (typeof originalTrack === "function") {
            originalTrack.apply(pendo, [name, props]);
          }
        };
        pendo._isIntercepted = true;
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const handleTestFire = () => {
    const pendo = (window as any).pendo;
    if (pendo && typeof pendo.track === "function") {
      pendo.track("test_event", { clicked: "test_fire_button", timestamp: Date.now() });
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        zIndex: 99999,
        background: "var(--glass-bg-panel)",
        border: "var(--card-border-width, 1px) solid var(--glass-border)",
        color: "#fff",
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 11,
        width: isOpen ? 320 : 180,
        maxHeight: isOpen ? 400 : 40,
        display: "flex",
        flexDirection: "column",
        transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
        boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
      }}
    >
      {/* Header */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: "10px 12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          borderBottom: isOpen ? "1px solid rgba(255, 255, 255, 0.08)" : "none",
          userSelect: "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: pendoActive ? "#00FF88" : "#FF3366",
              boxShadow: pendoActive ? "0 0 8px #00FF88" : "0 0 8px #FF3366",
            }}
          />
          <span>PENDO DEBUGGER</span>
        </div>
        <span>{isOpen ? "[ - ]" : "[ + ]"}</span>
      </div>

      {/* Body */}
      {isOpen && (
        <div style={{ padding: 12, flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{ color: "#71717A" }}>Status: {pendoActive ? "Active" : "Inactive"}</span>
            <button
              onClick={handleTestFire}
              style={{
                background: "rgba(0, 255, 255, 0.1)",
                border: "1px solid #00FFFF",
                color: "#00FFFF",
                padding: "3px 8px",
                cursor: "pointer",
                fontSize: 9.5,
                textTransform: "uppercase",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(0, 255, 255, 0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(0, 255, 255, 0.1)";
              }}
            >
              Test Fire Event
            </button>
          </div>

          <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8, scrollbarWidth: "none" }}>
            <span style={{ fontSize: 9.5, textTransform: "uppercase", color: "#FF00FF" }}>Last 8 Events:</span>
            {events.length === 0 ? (
              <span style={{ color: "#3F3F46", fontStyle: "italic", fontSize: 10 }}>No events tracked yet.</span>
            ) : (
              events.map((e, idx) => (
                <div
                  key={idx}
                  style={{
                    background: "rgba(255, 255, 255, 0.02)",
                    borderLeft: "2px solid #FF00FF",
                    padding: "6px 8px",
                    fontSize: 10,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", color: "#00FFFF", marginBottom: 2 }}>
                    <span style={{ fontWeight: "bold" }}>{e.name}</span>
                    <span style={{ color: "#3f3f46", fontSize: 9 }}>{e.timestamp}</span>
                  </div>
                  {e.props && (
                    <pre style={{ margin: 0, fontSize: 8.5, color: "#A1A1AA", overflowX: "auto" }}>
                      {JSON.stringify(e.props, null, 2)}
                    </pre>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}