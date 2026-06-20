"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { Zap, Target, HelpCircle, Terminal, RotateCcw, Copy, Check, AlertTriangle } from "lucide-react";
import NovusDashboard from "@/components/NovusDashboard";
import NetworkBackground from "@/components/NetworkBackground";
import PendoDebug from "@/components/PendoDebug";

const LOADING_MESSAGES = [
  "Shredding roadmaps...",
  "Firing stakeholders...",
  "Dissolving scope creep...",
  "Isolating the MVP...",
  "Cutting the fat...",
  "Committing to ship...",
];

type BrutalityLevel = "gentle" | "ruthless" | "nuclear";

interface Ticket {
  id: string;
  priority: string;
  title: string;
  scope: string;
  why: string;
  accent?: string;
  effort?: number;
}

function HammerIcon({ size = 24, style }: { size?: number; style?: React.CSSProperties }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
    >
      <path d="M15 12l-8.5 8.5c-.83.83-2.17.83-3 0 0 0 0 0 0 0a2.12 2.12 0 0 1 0-3L12 9" />
      <path d="M17.64 15 22 10.64" />
      <path d="m20.91 11.7-1.25-1.25c-.6-.6-.93-1.4-.93-2.25v-.86L16.01 4.6a5.56 5.56 0 0 0-3.94-1.64H9l.92.82A6.18 6.18 0 0 1 12 8.4v1.56l2 2h2.47l2.26 1.91" />
    </svg>
  );
}

function TicketCard({
  ticket,
  index,
  copied,
  onCopy,
}: {
  ticket: Ticket;
  index: number;
  copied: string | null;
  onCopy: (id: string, text: string) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const accent = ticket.accent === "#00FFFF"
    ? "var(--system-accent)"
    : ticket.accent === "#FF00FF"
    ? "var(--system-accent-magenta)"
    : ticket.accent === "#FF2D2D"
    ? "var(--nuclear-color)"
    : (index % 2 === 0 ? "var(--system-accent)" : "var(--system-accent-magenta)");

  const effortColor = ticket.effort !== undefined
    ? ticket.effort <= 2
      ? "var(--effort-low)"
      : ticket.effort === 3
      ? "var(--effort-med)"
      : "var(--effort-high)"
    : accent;

  return (
    <div
      className="ticket-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "rgba(0,255,255,0.03)",
        backdropFilter: "blur(4px)",
        border: `1px solid ${hovered ? accent : "var(--glass-border)"}`,
        borderLeft: `3px solid ${effortColor}`,
        boxShadow: hovered
          ? `0 28px 64px rgba(0,0,0,0.55), 0 0 0 1px ${accent}, 0 0 48px ${accent}22`
          : "0 8px 32px rgba(0,0,0,0.45)",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        transition: "all 0.2s cubic-bezier(0.34, 1.2, 0.64, 1)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          height: 2,
          background: `linear-gradient(90deg, ${accent}, ${accent}00, transparent)`,
        }}
      />
      <div style={{ padding: "20px 24px" }}>
        {/* Header row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 18,
          }}
        >
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span
              className="ticket-id-badge"
              style={{
                fontFamily: "'JetBrains Mono', 'Courier New', monospace",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.12em",
                padding: "3px 8px",
                background: "rgba(0,255,255,0.1)",
                border: "1px solid rgba(0,255,255,0.3)",
                color: "#00ffff",
              }}
            >
              {ticket.id}
            </span>
            <span
              style={{
                fontFamily: "'JetBrains Mono', 'Courier New', monospace",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.14em",
                padding: "3px 8px",
                background:
                  ticket.priority === "CRITICAL"
                    ? "#ff003c"
                    : ticket.priority === "HIGH"
                    ? "#ff6600"
                    : "#ffaa00",
                border: "none",
                color:
                  ticket.priority === "CRITICAL"
                    ? "#ffffff"
                    : ticket.priority === "HIGH"
                    ? "#ffffff"
                    : "#000000",
              }}
            >
              {ticket.priority}
            </span>
            {ticket.effort !== undefined && (
              <span
                style={{
                  fontFamily: "'JetBrains Mono', 'Courier New', monospace",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  padding: "3px 8px",
                  background: `${effortColor}18`,
                  border: `1px solid ${effortColor}44`,
                  color: effortColor,
                }}
              >
                Effort {ticket.effort}/5
              </span>
            )}
          </div>
          <button
            onClick={() =>
              onCopy(
                ticket.id,
                `${ticket.id}: ${ticket.title}\nScope: ${ticket.scope}\nWhy: ${ticket.why}`
              )
            }
            aria-label="Copy ticket details"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: copied === ticket.id ? accent : "#52525B",
              transition: "color 0.2s",
              padding: 4,
              lineHeight: 0,
            }}
          >
            {copied === ticket.id ? <Check size={13} /> : <Copy size={13} />}
          </button>
        </div>

        {/* Title row */}
        <div
          style={{
            display: "flex",
            gap: 12,
            marginBottom: 16,
            paddingBottom: 16,
            borderBottom: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <div style={{ marginTop: 3, flexShrink: 0, color: accent }}>
            <Zap size={13} />
          </div>
          <div>
            <div
              style={{
                fontFamily: "'JetBrains Mono', 'Courier New', monospace",
                fontSize: 9.5,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#a1a1aa",
                marginBottom: 4,
              }}
            >
              Title
            </div>
            <span
              style={{
                fontWeight: 800,
                fontSize: 18,
                letterSpacing: "-0.02em",
                textTransform: "uppercase",
                color: "#fff",
              }}
            >
              {ticket.title}
            </span>
          </div>
        </div>

        {/* Scope row */}
        <div
          style={{
            display: "flex",
            gap: 12,
            marginBottom: 16,
            paddingBottom: 16,
            borderBottom: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <div style={{ marginTop: 3, flexShrink: 0, color: accent }}>
            <Target size={13} />
          </div>
          <div>
            <div
              style={{
                fontFamily: "'JetBrains Mono', 'Courier New', monospace",
                fontSize: 9.5,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#a1a1aa",
                marginBottom: 4,
              }}
            >
              Ruthless Scope
            </div>
            <p style={{ fontSize: 13.5, color: "#e0e0e0", lineHeight: 1.65, margin: 0 }}>
              {ticket.scope}
            </p>
          </div>
        </div>

        {/* Why row */}
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ marginTop: 3, flexShrink: 0, color: accent }}>
            <HelpCircle size={13} />
          </div>
          <div>
            <div
              style={{
                fontFamily: "'JetBrains Mono', 'Courier New', monospace",
                fontSize: 9.5,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#a1a1aa",
                marginBottom: 4,
              }}
            >
              Why
            </div>
            <p
              title={ticket.why}
              style={{
                fontSize: 13,
                color: "#e0e0e0",
                lineHeight: 1.65,
                fontStyle: "italic",
                margin: 0,
              }}
            >
              {ticket.why}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SkeletonColumn({ modeName, accentColor, cardCount = 3 }: { modeName: string; accentColor: string; cardCount?: number }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Column Badge Skeleton */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "10px 14px",
          border: `1px solid ${accentColor}22`,
          background: "rgba(9,9,11,0.6)",
          marginBottom: 8,
        }}
      >
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: accentColor, boxShadow: `0 0 8px ${accentColor}` }} />
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700, color: accentColor, letterSpacing: "0.1em", textTransform: "uppercase" }}>
          {modeName}
        </span>
      </div>

      {/* Cards Skeletons */}
      {Array.from({ length: cardCount }).map((_, idx) => (
        <div
          key={idx}
          className="skeleton-pulse"
          style={{
            background: "rgba(15,15,18,0.9)",
            border: "1px solid rgba(255,255,255,0.07)",
            padding: "20px 24px",
            display: "flex",
            flexDirection: "column",
            gap: 16,
            height: 220,
          }}
        >
          {/* Header Row */}
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ width: 80, height: 18, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }} />
              <div style={{ width: 60, height: 18, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }} />
            </div>
          </div>
          {/* Title Row */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ width: "40%", height: 10, background: "rgba(255,255,255,0.03)" }} />
            <div style={{ width: "90%", height: 22, background: "rgba(255,255,255,0.06)" }} />
          </div>
          {/* Scope Row */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ width: "50%", height: 10, background: "rgba(255,255,255,0.03)" }} />
            <div style={{ width: "100%", height: 14, background: "rgba(255,255,255,0.05)" }} />
            <div style={{ width: "80%", height: 14, background: "rgba(255,255,255,0.05)" }} />
          </div>
        </div>
      ))}
    </div>
  );
}

interface SafeAnalysisRenderProps {
  explanation: any;
}

function toSentenceCase(text: string): string {
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (!cleaned) return "";
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1).toLowerCase();
}

function parsePotentialJson(value: unknown): any {
  if (typeof value !== "string") {
    return value;
  }

  const trimmed = value.trim();
  if (!trimmed.startsWith("{") && !trimmed.startsWith("[")) {
    return value;
  }

  try {
    return JSON.parse(trimmed);
  } catch {
    return value;
  }
}

function readText(value: unknown): string {
  if (typeof value === "string") {
    return value.trim();
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  return "";
}

function sanitizeDisplayText(value: unknown): string {
  if (value === null || value === undefined) return "";

  if (Array.isArray(value)) {
    const flattened = value
      .map((item) => sanitizeDisplayText(item))
      .filter(Boolean)
      .join(" ");
    return flattened.trim();
  }

  if (typeof value === "object") {
    const joined = Object.values(value as Record<string, unknown>)
      .map((entry) => sanitizeDisplayText(entry))
      .filter(Boolean)
      .join(" ");
    return joined.trim();
  }

  return readText(value)
    .replace(/[{}[\]"]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function SafeAnalysisRender({ explanation }: SafeAnalysisRenderProps) {
  try {
    if (!explanation) {
      return (
        <div style={{
          padding: "12px",
          background: "rgba(255, 255, 255, 0.05)",
          border: "1px dashed rgba(255, 255, 255, 0.2)",
          color: "#E4E4E7",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "12px",
          textAlign: "center"
        }}>
          No analysis data.
        </div>
      );
    }

    const dayOneRaw = parsePotentialJson(explanation?.dayOne);
    const deferRaw = parsePotentialJson(explanation?.defer);
    const watchRaw = parsePotentialJson(explanation?.watchFor);

    const dayOneIssue =
      typeof dayOneRaw === "object" && dayOneRaw !== null && !Array.isArray(dayOneRaw)
        ? sanitizeDisplayText((dayOneRaw as Record<string, unknown>)?.issue) ||
          sanitizeDisplayText((dayOneRaw as Record<string, unknown>)?.title)
        : sanitizeDisplayText(dayOneRaw);

    const dayOneDescription =
      typeof dayOneRaw === "object" && dayOneRaw !== null && !Array.isArray(dayOneRaw)
        ? sanitizeDisplayText((dayOneRaw as Record<string, unknown>)?.impact) ||
          sanitizeDisplayText((dayOneRaw as Record<string, unknown>)?.description)
        : "";

    const deferItems: Array<{ feature: string; reason: string }> = (() => {
      if (Array.isArray(deferRaw)) {
        return deferRaw
          .map((item) => {
            const parsed = parsePotentialJson(item);
            if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) {
              return {
                feature:
                  sanitizeDisplayText((parsed as Record<string, unknown>)?.feature) ||
                  sanitizeDisplayText((parsed as Record<string, unknown>)?.name),
                reason:
                  sanitizeDisplayText((parsed as Record<string, unknown>)?.reason) ||
                  sanitizeDisplayText((parsed as Record<string, unknown>)?.why),
              };
            }
            return { feature: sanitizeDisplayText(parsed), reason: "" };
          })
          .filter((item) => item.feature);
      }

      if (typeof deferRaw === "object" && deferRaw !== null) {
        const objectValue = deferRaw as Record<string, unknown>;
        const features = Array.isArray(objectValue?.features)
          ? objectValue.features
          : Array.isArray(objectValue?.items)
          ? objectValue.items
          : null;
        if (features) {
          return features
            .map((item) => {
              const parsed = parsePotentialJson(item);
              if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) {
                return {
                  feature:
                    sanitizeDisplayText((parsed as Record<string, unknown>)?.feature) ||
                    sanitizeDisplayText((parsed as Record<string, unknown>)?.name),
                  reason:
                    sanitizeDisplayText((parsed as Record<string, unknown>)?.reason) ||
                    sanitizeDisplayText((parsed as Record<string, unknown>)?.why),
                };
              }
              return { feature: sanitizeDisplayText(parsed), reason: "" };
            })
            .filter((item) => item.feature);
        }

        return Object.entries(objectValue)
          .map(([feature, reason]) => ({
            feature: sanitizeDisplayText(feature),
            reason: sanitizeDisplayText(reason),
          }))
          .filter((item) => item.feature);
      }

      const plain = sanitizeDisplayText(deferRaw);
      return plain ? [{ feature: plain, reason: "" }] : [];
    })();

    const watchRows: Array<{ label: string; threshold: string }> = (() => {
      if (Array.isArray(watchRaw)) {
        return watchRaw
          .map((item) => {
            const parsed = parsePotentialJson(item);
            if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) {
              const objectValue = parsed as Record<string, unknown>;
              return {
                label:
                  sanitizeDisplayText(objectValue?.metric) ||
                  sanitizeDisplayText(objectValue?.label) ||
                  sanitizeDisplayText(objectValue?.name),
                threshold:
                  sanitizeDisplayText(objectValue?.threshold) ||
                  sanitizeDisplayText(objectValue?.value),
              };
            }
            return { label: "Risk", threshold: sanitizeDisplayText(parsed) };
          })
          .filter((row) => row.label || row.threshold);
      }

      if (typeof watchRaw === "object" && watchRaw !== null) {
        const objectValue = watchRaw as Record<string, unknown>;
        const metric = sanitizeDisplayText(objectValue?.metric || objectValue?.label || objectValue?.name);
        const threshold = sanitizeDisplayText(objectValue?.threshold || objectValue?.value || objectValue?.warning);
        if (metric || threshold) {
          return [{ label: metric || "Metric", threshold: threshold || "Watch closely" }];
        }

        return Object.entries(objectValue)
          .map(([label, thresholdValue]) => ({
            label: sanitizeDisplayText(label),
            threshold: sanitizeDisplayText(thresholdValue),
          }))
          .filter((row) => row.label || row.threshold);
      }

      const plain = sanitizeDisplayText(watchRaw);
      return plain ? [{ label: "Risk", threshold: plain }] : [];
    })();

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ paddingBottom: 16, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase", color: "#888888", marginBottom: 8 }}>
            // Day One Implementation
          </div>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <span style={{ color: "#FFAA00", lineHeight: 1.2 }}>⚠</span>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <strong style={{ fontSize: 13.5, fontWeight: 700, color: "#FFFFFF" }}>
                {dayOneIssue || "MVP baseline implementation"}
              </strong>
              <p style={{ fontSize: 12.5, color: "#A1A1AA", margin: 0, lineHeight: 1.5 }}>
                {dayOneDescription || "• Keep scope constrained to the minimum deployable output."}
              </p>
              {dayOneIssue && (
                <p style={{ margin: 0, color: "#CCCCCC", fontSize: 12.5, lineHeight: 1.5 }}>
                  • {toSentenceCase(dayOneIssue)}
                </p>
              )}
            </div>
          </div>
        </div>

        <div style={{ paddingBottom: 16, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase", color: "#888888", marginBottom: 8 }}>
            // Deferred Scope
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {(deferItems.length > 0 ? deferItems : [{ feature: "Post-launch feature set", reason: "Defer enhancements until user pull is validated." }]).map((item, idx) => (
              <div key={`${item.feature}-${idx}`} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span
                  style={{
                    alignSelf: "flex-start",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#00FF88",
                    padding: "4px 10px",
                    borderRadius: 999,
                    border: "1px solid rgba(0,255,136,0.35)",
                    background: "rgba(0,255,136,0.09)",
                  }}
                >
                  {item.feature}
                </span>
                {item.reason && (
                  <p style={{ margin: 0, fontSize: 12, color: "#888888", fontStyle: "italic", lineHeight: 1.5 }}>
                    {item.reason}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div style={{ borderLeft: "3px solid #FF003C", paddingLeft: 12 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase", color: "#888888", marginBottom: 8 }}>
            // Technical Risks & Warning
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {(watchRows.length > 0 ? watchRows : [{ label: "Risk threshold", threshold: "Monitor stakeholder scope pressure." }]).map((row, idx) => (
              <div key={`${row.label}-${idx}`} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
                <span style={{ color: "#CCCCCC", fontSize: 12.5 }}>{row.label || "Metric"}</span>
                <span style={{ color: "#FFAA00", fontSize: 12.5, fontWeight: 700 }}>{row.threshold || "Watch"}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  } catch (err) {
    console.error("Error rendering AI drill-down analysis:", err);
    return (
      <div style={{
        padding: "12px",
        background: "rgba(255, 45, 45, 0.1)",
        border: "1px solid #FF2D2D",
        color: "#FF5555",
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "12px",
        textAlign: "center"
      }}>
        Analysis unavailable.
      </div>
    );
  }
}

function TicketWithDrillDown({
  ticket,
  index,
  copied,
  onCopy,
  drillId,
  drillLoading,
  drillData,
  onDrillDown,
}: {
  ticket: Ticket;
  index: number;
  copied: string | null;
  onCopy: (id: string, text: string) => void;
  drillId: string | null;
  drillLoading: string | null;
  drillData: Record<string, any>;
  onDrillDown: (ticket: Ticket) => void;
}) {
  const isDrillOpen = drillId === ticket.id;
  const explanation = drillData[ticket.id] || null;
  const isLoading = drillLoading === ticket.id;
  const panelRef = useRef<HTMLDivElement>(null);
  const [panelMaxHeight, setPanelMaxHeight] = useState(0);

  useEffect(() => {
    if (isDrillOpen && explanation && panelRef.current) {
      setPanelMaxHeight(panelRef.current.scrollHeight);
      return;
    }
    setPanelMaxHeight(0);
  }, [isDrillOpen, explanation]);

  return (
    <div
      className="scope-card-in"
      style={{
        animationDelay: `${index * 100}ms`,
        display: "flex",
        flexDirection: "column",
        gap: 0,
        marginBottom: 16,
      }}
    >
      <TicketCard
        ticket={ticket}
        index={index}
        copied={copied}
        onCopy={onCopy}
      />
      
      {/* Action Bar & Collapsible Panel */}
      <div
        className="ticket-action-panel"
        style={{
          background: "var(--glass-bg-card)",
          border: "var(--card-border-width, 1px) solid var(--glass-border)",
          borderTop: "none",
          boxShadow: "0 8px 32px rgba(0,0,0,0.45)",
          display: "flex",
          flexDirection: "column",
          marginTop: -1, // overlap the border of TicketCard
        }}
      >
        <div
          style={{
            padding: "12px 24px",
            display: "flex",
            justifyContent: "flex-end",
            background: "rgba(0, 0, 0, 0.25)",
          }}
        >
          <button
            className="drill-down-btn"
            onClick={() => onDrillDown(ticket)}
            disabled={drillLoading !== null && !isLoading}
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: isDrillOpen ? "#FF00FF" : "#00FFFF",
              background: "none",
              border: `1px solid ${isDrillOpen ? "#FF00FF" : "rgba(0, 255, 255, 0.3)"}`,
              padding: "5px 12px",
              cursor: (drillLoading !== null && !isLoading) ? "not-allowed" : "pointer",
              transition: "all 0.2s",
              opacity: (drillLoading !== null && !isLoading) ? 0.5 : 1,
            }}
          >
            {isLoading ? "⚡ ANALYZING..." : isDrillOpen ? "▲ HIDE ANALYSIS" : "▼ AI DRILL-DOWN"}
          </button>
        </div>

        {/* Collapsible Panel */}
        <div
          style={{
            maxHeight: isDrillOpen && explanation ? `${panelMaxHeight}px` : "0px",
            overflow: "hidden",
            transition: "max-height 0.3s ease",
          }}
        >
          <div
            ref={panelRef}
            style={{
              padding: "20px 24px",
              background: "var(--glass-bg-card)",
              borderTop: "var(--card-border-width, 1px) dashed var(--glass-border)",
              fontFamily: "var(--font-family-body)",
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            {isDrillOpen && explanation && <SafeAnalysisRender explanation={explanation} />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ScopeSledgehammer() {
  // ── Pendo track helper ──────────────────────────────────
  const trackPendo = (name: string, props?: Record<string, unknown>) => {
  if (typeof window !== "undefined" && (window as any).pendo?.track) {
    (window as any).pendo.track(name, props);
  }
};

// ── Drill-down state ─────────────────────────────────────
  const [drillId,      setDrillId]      = useState<string | null>(null);
  const [drillData,    setDrillData]    = useState<Record<string, any>>({});
  const [drillLoading, setDrillLoading] = useState<string | null>(null);
  const [killCount, setKillCount] = useState(0);
  const [phase, setPhase] = useState<"idle" | "shaking" | "loading" | "revealed" | "compare_loading" | "compare_revealed">("idle");
  const [inputValue, setInputValue] = useState("");
  const [msgIndex, setMsgIndex] = useState(0);
  const [flash, setFlash] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [btnHovered, setBtnHovered] = useState(false);
  const [btnPressed, setBtnPressed] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [brutalityLevel, setBrutalityLevel] = useState<BrutalityLevel>("ruthless");
  const [inputShake, setInputShake] = useState(false);
  const [brutalityFlash, setBrutalityFlash] = useState(false);
  const [ticketsStale, setTicketsStale] = useState(false);
  const msgTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  const abortControllerRef = useRef<AbortController | null>(null);
  const shakeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loadTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const brutalityTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const copiedTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [telemetryLogs, setTelemetryLogs] = useState<string[]>([]);
  const [debris, setDebris] = useState<{ id: number; text: string; x: number; y: number }[]>([]);
  const [animatedReduction, setAnimatedReduction] = useState(0);

  interface CompareResults {
    gentle: { tickets: Ticket[]; error: string | null };
    ruthless: { tickets: Ticket[]; error: string | null };
    nuclear: { tickets: Ticket[]; error: string | null };
  }
  const [compareResults, setCompareResults] = useState<CompareResults | null>(null);
  const [compareBtnHovered, setCompareBtnHovered] = useState(false);
  const [compareBtnPressed, setCompareBtnPressed] = useState(false);
  const [theme, setTheme] = useState<"cyber" | "terminal">("cyber");

  interface HistoryEntry {
    idea: string;
    brutality: BrutalityLevel;
    tickets: Ticket[];
    timestamp: number;
  }
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [glitchActive, setGlitchActive] = useState(false);

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("sledgehammer-theme") as "cyber" | "terminal" | null;
      if (savedTheme) {
        setTheme(savedTheme);
        document.documentElement.setAttribute("data-theme", savedTheme);
      } else {
        document.documentElement.setAttribute("data-theme", "cyber");
      }
    } catch (e) {
      console.error("Failed to read theme from localStorage:", e);
      document.documentElement.setAttribute("data-theme", "cyber");
    }

    try {
      const historyStr = localStorage.getItem("sledgehammer-history");
      if (historyStr) {
        setHistory(JSON.parse(historyStr));
      }
    } catch (e) {
      console.error("Failed to load history from localStorage:", e);
    }
  }, []);

  const saveToHistory = (ideaText: string, brutality: BrutalityLevel, ticketList: Ticket[]) => {
    try {
      const historyStr = localStorage.getItem("sledgehammer-history");
      const currentHistory: HistoryEntry[] = historyStr ? JSON.parse(historyStr) : [];
      const newEntry: HistoryEntry = {
        idea: ideaText,
        brutality,
        tickets: ticketList,
        timestamp: Date.now(),
      };
      const updatedHistory = [newEntry, ...currentHistory].slice(0, 5);
      localStorage.setItem("sledgehammer-history", JSON.stringify(updatedHistory));
      setHistory(updatedHistory);
      logEvent("Run saved to history.");
    } catch (e) {
      console.error("Failed to save to history:", e);
    }
  };

  const getRelativeTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const secs = Math.floor(diff / 1000);
    if (secs < 60) return "just now";
    const mins = Math.floor(secs / 60);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const toggleTheme = () => {
    const nextTheme = theme === "cyber" ? "terminal" : "cyber";
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    try {
      localStorage.setItem("sledgehammer-theme", nextTheme);
    } catch (e) {
      console.error("Failed to save theme to localStorage:", e);
    }
    logEvent(`Theme swapped to ${nextTheme.toUpperCase()}.`);
    trackPendo("theme_changed", { theme: nextTheme });
  };

  const logEvent = useCallback((msg: string) => {
    setTelemetryLogs(prev => [...prev, `[SYSTEM]: ${msg}`]);
  }, []);

  // Automatically clear debris particles after 1 second
  useEffect(() => {
    if (debris.length === 0) return;
    const timer = setTimeout(() => {
      setDebris([]);
    }, 1000);
    return () => clearTimeout(timer);
  }, [debris]);

  // Scope reduction counter animation
  useEffect(() => {
    if (phase === "revealed" && tickets.length > 0) {
      const targetPercent = brutalityLevel === "nuclear"
        ? Math.min(99, 95 + (inputValue.length % 5))
        : brutalityLevel === "ruthless"
        ? Math.min(94, 80 + (inputValue.length % 15))
        : Math.min(79, 50 + (inputValue.length % 30));

      let start = 0;
      const duration = 600; // ms
      const intervalTime = 20; // ms
      const totalSteps = duration / intervalTime;
      const increment = targetPercent / totalSteps;

      const timer = setInterval(() => {
        start += increment;
        if (start >= targetPercent) {
          setAnimatedReduction(targetPercent);
          clearInterval(timer);
        } else {
          setAnimatedReduction(Math.round(start));
        }
      }, intervalTime);

      return () => clearInterval(timer);
    }
  }, [phase, tickets, brutalityLevel, inputValue.length]);

  // Features Destroyed animated counter
  useEffect(() => {
    if (phase !== "loading") {
      setKillCount(0);
      return;
    }

    const targetVal = Math.floor(Math.random() * (32 - 14 + 1)) + 14;
    const duration = 3000;
    const intervalTime = 50;
    const totalSteps = duration / intervalTime;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      if (currentStep >= totalSteps) {
        setKillCount(targetVal);
        clearInterval(interval);
      } else {
        setKillCount(Math.round((targetVal * currentStep) / totalSteps));
      }
    }, intervalTime);

    return () => {
      clearInterval(interval);
    };
  }, [phase]);

  const handleExportCSV = () => {
    if (tickets.length === 0) return;
    trackPendo("tickets_exported", { format: "csv", count: tickets.length });
    const escapeCSV = (text: string) => {
      const escaped = text.replace(/"/g, '""');
      return `"${escaped}"`;
    };
    const header = ["ID", "Title", "Scope", "Why"];
    const rows = tickets.map((t) => [
      t.id,
      escapeCSV(t.title),
      escapeCSV(t.scope),
      escapeCSV(t.why),
    ]);
    const csvContent = [
      header.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "sledgehammer-tickets.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    logEvent("Tickets exported to CSV format.");
  };

  const handleDeployMVP = () => {
    window.open("https://vercel.com/new", "_blank");
    logEvent("MVP deployment initiated via Vercel.");
  };

  // Clean up all active timers and requests on unmount to prevent leaks
  useEffect(() => {
    const initTimer = setTimeout(() => {
      logEvent("System initialized. Standing by.");
    }, 0);
    return () => {
      clearTimeout(initTimer);
      if (abortControllerRef.current) abortControllerRef.current.abort();
      if (shakeTimeoutRef.current) clearTimeout(shakeTimeoutRef.current);
      if (loadTimeoutRef.current) clearTimeout(loadTimeoutRef.current);
      if (brutalityTimeoutRef.current) clearTimeout(brutalityTimeoutRef.current);
      if (copiedTimeoutRef.current) clearTimeout(copiedTimeoutRef.current);
    };
  }, [logEvent]);

  // Cycle loading messages indefinitely while phase === "loading"
  useEffect(() => {
    if (phase !== "loading") return;
    msgTimer.current = setTimeout(() => {
      setMsgIndex((i) => (i + 1) % LOADING_MESSAGES.length);
    }, 410);
    return () => {
      if (msgTimer.current) clearTimeout(msgTimer.current);
    };
  }, [phase, msgIndex]);

  // Glitch flicker: every 8-12 seconds, page translateX(3px) for 80ms
  useEffect(() => {
    const scheduleGlitch = () => {
      const delay = 8000 + Math.random() * 4000;
      return setTimeout(() => {
        setGlitchActive(true);
        setTimeout(() => setGlitchActive(false), 80);
        scheduleGlitch();
      }, delay);
    };
    const timer = scheduleGlitch();
    return () => clearTimeout(timer);
  }, []);

  const handleSledgehammer = async () => {
    if (phase === "shaking" || phase === "loading") {
      logEvent("Execution throttle active. Duplicate request blocked.");
      return; // block double clicks / overlapping executions
    }
    if (!inputValue.trim()) {
      logEvent("Validation failure: Empty product idea input.");
      setInputShake(true);
      if (shakeTimeoutRef.current) clearTimeout(shakeTimeoutRef.current);
      shakeTimeoutRef.current = setTimeout(() => setInputShake(false), 500);
      return;
    }

    logEvent(`SLEDGEHAMMER execution requested. Input size: ${inputValue.length} chars.`);
    trackPendo("sledgehammer_fired", { brutality: brutalityLevel, inputLength: inputValue.length });

    // Cancel any ongoing fetch before launching a new one
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setTicketsStale(false);
    setFlash(true);
    setPhase("shaking");
    setAnimatedReduction(0);
    setDrillId(null);
    setDrillData({});
    setDrillLoading(null);
    setCopied(null);

    // Generate 5-8 debris items with random texts and positions around center of screen
    const texts = [
      "SSO CUT",
      "CHATBOT PURGED",
      "GAMIFICATION DESTROYED",
      "OAUTH BYPASSED",
      "REAL-TIME CHAT PURGED",
      "PDF EXPORT DESTROYED",
      "ADMIN MODULE SMASHED",
      "SSO LOGIN PURGED",
      "ANALYTICS API DELETED",
      "LOYALTY BADGES VAPORIZED"
    ];
    const count = Math.floor(Math.random() * 4) + 5; // 5 to 8
    const newDebris = Array.from({ length: count }).map((_, idx) => {
      const text = texts[Math.floor(Math.random() * texts.length)];
      const x = Math.round(Math.random() * 240 - 120);
      const y = Math.round(Math.random() * -120 - 40);
      return { id: Date.now() + idx, text: `✕ ${text}`, x, y };
    });
    setDebris(newDebris);

    setError(null);
    setTickets([]);

    if (shakeTimeoutRef.current) clearTimeout(shakeTimeoutRef.current);
    shakeTimeoutRef.current = setTimeout(() => setFlash(false), 280);

    if (loadTimeoutRef.current) clearTimeout(loadTimeoutRef.current);
    loadTimeoutRef.current = setTimeout(async () => {
      setMsgIndex(0);
      setPhase("loading");
      logEvent(`Initiating Groq completions API request. Brutality: ${brutalityLevel.toUpperCase()}`);

      const timeoutId = setTimeout(() => controller.abort(), 30000);

      try {
        const response = await fetch("/api/sledgehammer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: inputValue, brutality: brutalityLevel }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        const data = await response.json();

        if (!response.ok) throw new Error(data.error || "Sledgehammer failed");

        if (data.tickets && Array.isArray(data.tickets)) {
          const priorityLabels = ["CRITICAL", "HIGH", "MEDIUM"];
          const accentColors = ["#00FFFF", "#FF00FF", "#00FFFF"];
          const mapped: Ticket[] = data.tickets
            .filter((t: any) => t !== null && typeof t === "object")
            .map((t: { title?: string; scope?: string; whyCut?: string; why?: string; effort?: number }, i: number) => ({
              id: `SLEDGE-${String(i + 1).padStart(3, "0")}`,
              priority: priorityLabels[i] || "HIGH",
              title: t.title ?? "Untitled Ticket",
              scope: t.scope ?? "",
              why: t.whyCut ?? t.why ?? "",
              accent: accentColors[i % accentColors.length],
              effort: t.effort,
            }));
          setTickets(mapped);
          setPhase("revealed");
          saveToHistory(inputValue, brutalityLevel, mapped);
          abortControllerRef.current = null;
          trackPendo("sledgehammer_revealed", { ticketCount: mapped.length, brutality: brutalityLevel });
          const modeStr = data.stats?.mode === "live" ? "LIVE (Groq)" : "FALLBACK (mock)";
          logEvent(`API request resolved. Generated ${data.tickets.length} tickets. [Mode: ${modeStr}]`);
        } else {
          throw new Error("Malformed data format received.");
        }
      } catch (err: unknown) {
        clearTimeout(timeoutId);
        if (err instanceof Error && err.name === "AbortError") {
          logEvent("Active Sledgehammer fetch timed out or aborted by user.");
          setError("Request timed out (30s). Vercel edge function or API took too long to respond.");
          setPhase("idle");
          return; // Aborted: ignore state updates
        }
        const errMsg = err instanceof Error ? err.message : "Something went wrong.";
        logEvent(`Critical failure: ${errMsg}`);
        setError(errMsg);
        setPhase("idle");
      }
    }, 560);
  };

  const handleCompareAll = async () => {
    if (phase === "shaking" || phase === "loading" || phase === "compare_loading") {
      logEvent("Execution throttle active. Duplicate request blocked.");
      return;
    }
    if (!inputValue.trim()) {
      logEvent("Validation failure: Empty product idea input.");
      setInputShake(true);
      if (shakeTimeoutRef.current) clearTimeout(shakeTimeoutRef.current);
      shakeTimeoutRef.current = setTimeout(() => setInputShake(false), 500);
      return;
    }

    logEvent("Initiating parallel comparison mode for all brutality levels.");
    trackPendo("compare_all_triggered", { inputLength: inputValue.length });

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setCompareResults(null);
    setFlash(true);
    setPhase("compare_loading");
    setDrillId(null);
    setDrillData({});
    setDrillLoading(null);
    setCopied(null);

    if (shakeTimeoutRef.current) clearTimeout(shakeTimeoutRef.current);
    shakeTimeoutRef.current = setTimeout(() => setFlash(false), 280);

    const levels: BrutalityLevel[] = ["gentle", "ruthless", "nuclear"];
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const fetchPromises = levels.map(async (level) => {
        const response = await fetch("/api/sledgehammer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: inputValue, brutality: level }),
          signal: controller.signal,
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || `${level} mode failed`);
        }

        if (!data.tickets || !Array.isArray(data.tickets)) {
          throw new Error(`${level} mode returned invalid data`);
        }

        return { level, tickets: data.tickets };
      });

      const results = await Promise.allSettled(fetchPromises);
      clearTimeout(timeoutId);

      const mappedResults: CompareResults = {
        gentle: { tickets: [], error: null },
        ruthless: { tickets: [], error: null },
        nuclear: { tickets: [], error: null },
      };

      results.forEach((res, index) => {
        const level = levels[index];
        if (res.status === "fulfilled") {
          const priorityLabels = level === "gentle" 
            ? ["CRITICAL", "HIGH", "MEDIUM", "LOW", "OPTIONAL"]
            : level === "nuclear"
            ? ["CRITICAL"]
            : ["CRITICAL", "HIGH", "MEDIUM"];
          const accentColors = level === "gentle" 
            ? ["#00FFFF", "#FF00FF", "#00FFFF"] 
            : level === "nuclear" 
            ? ["#FF2D2D"] 
            : ["#FF00FF", "#00FFFF", "#FF00FF"];

          mappedResults[level].tickets = res.value.tickets
            .filter((t: any) => t !== null && typeof t === "object")
            .map((t: any, i: number) => ({
              id: `COMP-${level.substring(0, 3).toUpperCase()}-${String(i + 1).padStart(3, "0")}`,
              priority: priorityLabels[i] || "HIGH",
              title: t.title ?? "Untitled Ticket",
              scope: t.scope ?? "",
              why: t.whyCut ?? t.why ?? "",
              accent: accentColors[i % accentColors.length],
              effort: t.effort,
            }));
          logEvent(`${level.toUpperCase()} completions resolved with ${res.value.tickets.length} tickets.`);
        } else {
          const errorMsg = res.reason instanceof Error ? res.reason.message : "Fetch failed";
          mappedResults[level].error = errorMsg;
          logEvent(`Parallel comparison [${level}] failed: ${errorMsg}`);
        }
      });

      // Check if all failed
      const allFailed = results.every(res => res.status === "rejected");
      if (allFailed) {
        throw new Error("All parallel completion modes failed.");
      }

      setCompareResults(mappedResults);
      setPhase("compare_revealed");
      abortControllerRef.current = null;
      trackPendo("compare_all_revealed", {
        gentleCount: mappedResults.gentle.tickets.length,
        ruthlessCount: mappedResults.ruthless.tickets.length,
        nuclearCount: mappedResults.nuclear.tickets.length,
      });
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      if (controller.signal.aborted) {
        logEvent("Active comparison fetch timed out or aborted by user.");
        setError("Comparison request timed out (30s). Vercel edge functions or API took too long to respond.");
        setPhase("idle");
        return;
      }
      const errMsg = err instanceof Error ? err.message : "Something went wrong.";
      logEvent(`Critical comparison failure: ${errMsg}`);
      setError(errMsg);
      setPhase("idle");
    }
  };

  const handleReset = () => {
    trackPendo("reset_triggered");
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    if (shakeTimeoutRef.current) {
      clearTimeout(shakeTimeoutRef.current);
      shakeTimeoutRef.current = null;
    }
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
      loadTimeoutRef.current = null;
    }

    setPhase("idle");
    setInputValue("");
    setMsgIndex(0);
    setTickets([]);
    setError(null);
    setTicketsStale(false);
    setAnimatedReduction(0);
    setCompareResults(null);
    setDrillId(null);
    setDrillData({});
    setDrillLoading(null);
    setCopied(null);
    logEvent("Repository mapping reset. Cache cleared.");
  };

  const handleBrutalityChange = (level: BrutalityLevel) => {
    if (level === brutalityLevel) return;
    trackPendo("brutality_changed", { level });
    setBrutalityLevel(level);
    setBrutalityFlash(true);
    if (brutalityTimeoutRef.current) clearTimeout(brutalityTimeoutRef.current);
    brutalityTimeoutRef.current = setTimeout(() => setBrutalityFlash(false), 350);
    if (phase === "revealed" && tickets.length > 0) {
      setTicketsStale(true);
      setAnimatedReduction(0);
    }
    logEvent(`Brutality set to ${level.toUpperCase()}. Purging all secondary code paths.`);
  };

  const handleCopy = (id: string, text: string) => {
    trackPendo("ticket_copied", { ticketId: id });
    if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
      navigator.clipboard.writeText(text)
        .then(() => {
          setCopied(id);
          if (copiedTimeoutRef.current) clearTimeout(copiedTimeoutRef.current);
          copiedTimeoutRef.current = setTimeout(() => setCopied(null), 1500);
          logEvent(`Ticket ${id} copied to system clipboard.`);
        })
        .catch(() => {
          fallbackCopy(id, text);
        });
    } else {
      fallbackCopy(id, text);
    }
  };

  const fallbackCopy = (id: string, text: string) => {
    try {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      const successful = document.execCommand("copy");
      document.body.removeChild(textarea);
      if (successful) {
        setCopied(id);
        if (copiedTimeoutRef.current) clearTimeout(copiedTimeoutRef.current);
        copiedTimeoutRef.current = setTimeout(() => setCopied(null), 1500);
        logEvent(`Ticket ${id} copied to clipboard (fallback).`);
      } else {
        logEvent(`Failed to copy ticket ${id}.`);
      }
    } catch (err) {
      logEvent(`Failed to copy ticket ${id} (error).`);
    }
  };
  
  const handleDrillDown = async (ticket: Ticket) => {
    if (drillId === ticket.id) { setDrillId(null); return; }
    setDrillLoading(ticket.id);
    trackPendo("drill_down_opened", { ticketId: ticket.id, title: ticket.title });
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    
    const fetchUrl = "/api/explain";
    const fetchBody = { ticket };
    console.log("[DrillDown] Fetching:", fetchUrl, "| Ticket:", ticket.id, "| Body:", JSON.stringify(fetchBody));
    
    try {
      const res = await fetch(fetchUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fetchBody),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      
      console.log("[DrillDown] Response status:", res.status, "| ok:", res.ok, "| url:", res.url);
      
      if (!res.ok) {
        let errorMsg = `Failed with status ${res.status}`;
        try {
          const errorData = await res.json();
          errorMsg = errorData.error || errorMsg;
        } catch {
          // Response body wasn't JSON (e.g. Vercel 404 HTML page)
          const textBody = await res.text().catch(() => "");
          console.error("[DrillDown] Non-JSON error response body:", textBody.substring(0, 500));
        }
        throw new Error(errorMsg);
      }
      
      const data = await res.json();
      setDrillData(prev => ({ ...prev, [ticket.id]: data }));
      setDrillId(ticket.id);
    } catch (e: any) {
      clearTimeout(timeoutId);
      console.error("[DrillDown] Error:", e);
      let errMsg = "All secondary features → v2.";
      if (e.name === "AbortError" || e.message?.includes("aborted")) {
        errMsg = "Drill-down timed out (30s). Vercel edge function or API took too long.";
      } else if (e.message) {
        errMsg = `Error: ${e.message}`;
      }
      setDrillId(ticket.id);
      setDrillData(prev => ({
        ...prev,
        [ticket.id]: {
          dayOne:   "Analysis failed or timed out.",
          defer:    errMsg,
          watchFor: "Try requesting the audit again in a few moments.",
        },
      }));
    } finally {
      setDrillLoading(null);
    }
  };

  const isInputEmpty = inputValue.trim().length === 0;

  const btnShadow = isInputEmpty
    ? "none"
    : btnPressed
    ? "2px 2px 0 #FF00FF"
    : btnHovered
    ? "7px 7px 0 #FF00FF, 14px 14px 0 rgba(255,0,255,0.25), 0 0 40px rgba(0,255,255,0.3)"
    : "5px 5px 0 #FF00FF, 10px 10px 0 rgba(255,0,255,0.22)";

  const btnTranslate = isInputEmpty
    ? "translate(0,0)"
    : btnPressed
    ? "translate(3px,3px)"
    : btnHovered
    ? "translate(-2px,-2px)"
    : "translate(0,0)";

  const brutalityMeta: Record<BrutalityLevel, { label: string; desc: string; tag: string; color: string; bgColor: string; icon: string }> = {
    gentle: {
      label: "Gentle Cut",
      desc: "5 tickets, mild scope",
      tag: "Jobs-to-be-Done Framework applied.",
      color: "var(--gentle-color)",
      bgColor: "var(--gentle-bg)",
      icon: "◇",
    },
    ruthless: {
      label: "Ruthless Slash",
      desc: "3 tickets, no mercy",
      tag: "MoSCoW Rules: Core Must-Haves Only.",
      color: "var(--ruthless-color)",
      bgColor: "var(--ruthless-bg)",
      icon: "◈",
    },
    nuclear: {
      label: "Nuclear",
      desc: "1 ticket, raw core",
      tag: "⚠ Total System Wipeout: One Feature Max.",
      color: "var(--nuclear-color)",
      bgColor: "var(--nuclear-bg)",
      icon: "☢",
    },
  };

  const currentMeta = brutalityMeta[brutalityLevel];

  return (
    <>
      <NetworkBackground />
      <PendoDebug />

      {/* Perspective Grid */}
      <div className="grid-perspective" aria-hidden="true">
        <div className="grid-lines" />
      </div>

      {/* Corner Brackets */}
      <div className="corner-bracket corner-top-left" aria-hidden="true" />
      <div className="corner-bracket corner-top-right" aria-hidden="true" />
      <div className="corner-bracket corner-bottom-left" aria-hidden="true" />
      <div className="corner-bracket corner-bottom-right" aria-hidden="true" />

      {/* Ambient Glow Blobs */}
      <div className="glow-blob glow-blob-1" aria-hidden="true" />
      <div className="glow-blob glow-blob-2" aria-hidden="true" />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;700;800&family=JetBrains+Mono:wght@400;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        @keyframes quake {
          0%,100% { transform: translate(0,0) rotate(0deg); }
          7%  { transform: translate(-9px,-5px) rotate(-0.4deg); }
          14% { transform: translate(9px,6px) rotate(0.4deg); }
          21% { transform: translate(-7px,8px) rotate(-0.3deg); }
          28% { transform: translate(8px,-8px) rotate(0.3deg); }
          35% { transform: translate(-5px,4px) rotate(-0.15deg); }
          42% { transform: translate(5px,-4px) rotate(0.15deg); }
          56% { transform: translate(-3px,2px); }
          70% { transform: translate(3px,-2px); }
          84% { transform: translate(-1px,1px); }
        }

        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes flashOverlay {
          0%   { opacity: 0.18; }
          25%  { opacity: 0.08; }
          50%  { opacity: 0.14; }
          75%  { opacity: 0.04; }
          100% { opacity: 0; }
        }

        @keyframes shimmerSweep {
          0%   { left: -120%; }
          100% { left: 120%; }
        }

        @keyframes titleChroma {
          0%,100% { text-shadow: 3px 0 #FF00FF, -3px 0 #00FFFF, 0 0 80px rgba(0,255,255,0.2); }
          50%      { text-shadow: 3px 0 #FF00FF, -3px 0 #00FFFF, 0 0 120px rgba(0,255,255,0.38); }
        }

        @keyframes inputGlow {
          0%,100% { box-shadow: inset 0 2px 18px rgba(0,0,0,0.6), 0 0 0 1px #00FFFF, 0 0 20px rgba(0,255,255,0.15); }
          50%      { box-shadow: inset 0 2px 18px rgba(0,0,0,0.6), 0 0 0 1px #00FFFF, 0 0 36px rgba(0,255,255,0.28); }
        }

        @keyframes inputShakeMicro {
          0%,100% { transform: translateX(0); }
          15% { transform: translateX(-6px); }
          30% { transform: translateX(6px); }
          45% { transform: translateX(-4px); }
          60% { transform: translateX(4px); }
          75% { transform: translateX(-2px); }
          90% { transform: translateX(2px); }
        }

        @keyframes errorSlideIn {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes brutalityFlashAnim {
          0%   { opacity: 0.6; transform: scale(1.04); }
          40%  { opacity: 0.35; }
          100% { opacity: 0; transform: scale(1); }
        }

        @keyframes nuclearPulse {
          0%, 100% { opacity: 0.15; }
          50%      { opacity: 0.5; }
        }

        @keyframes gentleGlow {
          0%, 100% { box-shadow: 0 0 12px rgba(0,255,255,0.08), inset 0 0 20px rgba(0,255,255,0.04); }
          50%      { box-shadow: 0 0 22px rgba(0,255,255,0.16), inset 0 0 30px rgba(0,255,255,0.08); }
        }

        @keyframes ruthlessGlow {
          0%, 100% { box-shadow: 0 0 12px rgba(255,0,255,0.08), inset 0 0 20px rgba(255,0,255,0.04); }
          50%      { box-shadow: 0 0 26px rgba(255,0,255,0.2), inset 0 0 30px rgba(255,0,255,0.08); }
        }

        @keyframes nuclearGlow {
          0%, 100% { box-shadow: 0 0 14px rgba(255,45,45,0.1), inset 0 0 20px rgba(255,45,45,0.05); }
          50%      { box-shadow: 0 0 30px rgba(255,45,45,0.25), inset 0 0 35px rgba(255,45,45,0.1); }
        }

        @keyframes tagSlideIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeInFast {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        @keyframes badgePulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }

        @keyframes nuclearTagBlink {
          0%, 70%, 100% { opacity: 1; }
          85% { opacity: 0.4; }
        }

        @keyframes staleTicketFade {
          from { opacity: 1; }
          to   { opacity: 0.3; }
        }

        @keyframes debrisExplode {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) translate(0, 0);
          }
          100% {
            opacity: 0;
            transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy)));
          }
        }

        @keyframes bgDrift {
          0%   { background-position: 0% 0%, 100% 100%, 50% 100%, 0 0, 0 0; }
          100% { background-position: 8% 12%, 90% 88%, 50% 92%, 0 0, 0 0; }
        }

        .scope-quaking       { animation: quake 0.52s cubic-bezier(0.36, 0.07, 0.19, 0.97) both; }
        .scope-card-in       { animation: fadeSlideUp 0.4s ease-out both; }
        .scope-blink         { animation: blink 1s step-end infinite; }
        .scope-title         { animation: titleChroma 3s ease-in-out infinite; }
        .scope-input-focused {
          border-color: #00FFFF !important;
          border-width: 2px !important;
          outline: none !important;
          animation: inputGlow 2s ease-in-out infinite;
        }
        .scope-input-blur {
          border-color: rgba(255,255,255,0.07) !important;
          box-shadow: inset 0 2px 18px rgba(0,0,0,0.6) !important;
        }
        .scope-input-error {
          border-color: rgba(255,85,85,0.5) !important;
          box-shadow: inset 0 2px 18px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,85,85,0.3) !important;
          animation: inputShakeMicro 0.45s ease both;
        }
        .scope-shimmer {
          position: absolute; top: 0; bottom: 0; width: 55%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent);
          animation: shimmerSweep 2s ease-in-out infinite;
          left: -120%; pointer-events: none;
        }
        .scope-error-banner {
          animation: errorSlideIn 0.3s ease both;
        }
        .scope-brutality-flash {
          animation: brutalityFlashAnim 0.35s ease-out forwards;
          pointer-events: none;
        }
        .scope-tag-enter {
          animation: tagSlideIn 0.25s ease both;
        }
        .brutality-desc-enter {
          animation: fadeInFast 0.2s ease both;
        }
        .ticket-id-badge {
          animation: badgePulse 0.3s ease-out 1;
          transform-origin: center;
        }
        .scope-nuclear-tag {
          animation: nuclearTagBlink 1.8s ease-in-out infinite;
        }
        .scope-stale-tickets {
          animation: staleTicketFade 0.5s ease forwards;
        }
        .brutality-btn {
          transition: all 0.2s cubic-bezier(0.34, 1.2, 0.64, 1);
        }
        .brutality-btn:hover {
          filter: brightness(1.25);
          transform: translateY(-1px);
        }
        .brutality-btn:active {
          transform: translateY(1px);
        }
        .compare-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 24px;
        }
        @media (max-width: 768px) {
          .compare-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @keyframes skeletonPulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.3; }
        }
        .skeleton-pulse {
          animation: skeletonPulse 1.5s ease-in-out infinite;
        }
        
        .history-panel {
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          width: 320px;
          background: var(--glass-bg-panel);
          backdrop-filter: var(--backdrop-blur);
          border-right: var(--card-border-width, 1px) solid var(--glass-border);
          z-index: 9999;
          transform: translateX(-100%);
          transition: transform 0.35s cubic-bezier(0.34, 1.2, 0.64, 1);
          display: flex;
          flex-direction: column;
          padding: 24px;
        }
        .history-panel.open {
          transform: translateX(0);
        }
        
        .history-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(4px);
          z-index: 9998;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
        }
        .history-backdrop.open {
          opacity: 1;
          pointer-events: auto;
        }

        @media (max-width: 768px) {
          .history-panel {
            top: auto;
            right: 0;
            bottom: 0;
            width: 100%;
            height: 60vh;
            border-right: none;
            border-top: var(--card-border-width, 1px) solid var(--glass-border);
            transform: translateY(100%);
            border-top-left-radius: 16px;
            border-top-right-radius: 16px;
          }
          .history-panel.open {
            transform: translateY(0);
            transform: translateX(0);
          }
        }

        /* ── TASK 2A: ACTION BUTTONS ── */
        .action-btn {
          border: 1px solid rgba(0,255,255,0.5) !important;
          color: #00ffff !important;
          background: rgba(0,255,255,0.05) !important;
          transition: all 0.2s ease !important;
        }
        .action-btn:hover {
          background: rgba(0,255,255,0.15) !important;
        }
        .action-btn:active {
          transform: scale(0.95) !important;
        }

        /* ── TASK 2A: BRUTALITY TABS ── */
        .brutality-tab {
          color: rgba(255,255,255,0.5);
          transition: all 0.2s ease;
        }
        .brutality-tab.active {
          color: #ffffff !important;
        }

        /* ── TASK 2C: SLEDGEHAMMER BTN ── */
        .sledgehammer-btn:hover:not(:disabled) {
          filter: brightness(1.2);
        }
        .sledgehammer-btn:active:not(:disabled) {
          transform: scale(0.98) !important;
        }
        .sledgehammer-btn:active:not(:disabled) .scope-shimmer {
          opacity: 0;
        }

        /* ── TASK 2C: INPUT PLACEHOLDER ── */
        .scope-textarea::placeholder {
          color: #444444 !important;
        }
        .scope-textarea {
          color: #cccccc !important;
        }

        /* ── TASK 2C: STATS CARD LABELS ── */
        .stats-label {
          color: #888888 !important;
          font-size: 11px !important;
          text-transform: uppercase !important;
          letter-spacing: 0.1em !important;
        }
        .stat-number {
          font-size: 3rem !important;
          color: #00ffff !important;
          font-weight: 700 !important;
        }

        /* ── TASK 2D: TERMINAL MODE ── */
        [data-theme="terminal"] .action-btn {
          border: 1px solid rgba(0,255,0,0.5) !important;
          color: #00ff00 !important;
          background: rgba(0,255,0,0.05) !important;
        }
        [data-theme="terminal"] .action-btn:hover {
          background: rgba(0,255,0,0.15) !important;
        }
        [data-theme="terminal"] .brutality-tab.active {
          border-bottom-color: #00ff00 !important;
        }
        [data-theme="terminal"] .stat-number {
          color: #00ff00 !important;
        }
        [data-theme="terminal"] .scope-textarea {
          border-color: rgba(0,255,0,0.3) !important;
        }
        [data-theme="terminal"] .scope-textarea::placeholder {
          color: #444444 !important;
        }
        [data-theme="terminal"] .glow-blob-1,
        [data-theme="terminal"] .glow-blob-2 {
          background: radial-gradient(circle, rgba(0,255,0,0.06) 0%, transparent 70%) !important;
        }
        [data-theme="terminal"] .corner-bracket {
          border-color: #00ff00 !important;
        }
        [data-theme="terminal"] .sledgehammer-btn {
          background: linear-gradient(135deg, #00ff00, #006600) !important;
          color: #000000 !important;
          text-shadow: none !important;
        }
        [data-theme="terminal"] .stat-number {
          color: #00ff00 !important;
          text-shadow: 0 0 12px rgba(0,255,0,0.1) !important;
        }
      `}</style>

      {/* Flash overlay */}
      {flash && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            pointerEvents: "none",
            background: "rgba(0,255,255,0.14)",
            animation: "flashOverlay 0.32s ease-out forwards",
          }}
        />
      )}

      {/* History Backdrop */}
      <div
        className={`history-backdrop ${historyOpen ? "open" : ""}`}
        onClick={() => setHistoryOpen(false)}
      />

      {/* History Panel / Drawer */}
      <div className={`history-panel ${historyOpen ? "open" : ""}`}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, borderBottom: "1px solid var(--glass-border)", paddingBottom: 16 }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 800, letterSpacing: "-0.01em", color: "#fff", margin: 0 }}>
            RUN HISTORY
          </h2>
          <button
            onClick={() => setHistoryOpen(false)}
            style={{
              background: "none",
              border: "none",
              color: "#52525B",
              cursor: "pointer",
              fontSize: 16,
              lineHeight: 0,
              padding: 4,
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#fff")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#52525B")}
          >
            ✕
          </button>
        </div>

        {/* History list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, overflowY: "auto", flex: 1, paddingRight: 4 }}>
          {history.length === 0 ? (
            <div style={{ color: "#52525B", fontSize: 11.5, fontFamily: "'JetBrains Mono', monospace", textAlign: "center", marginTop: 40, lineHeight: 1.6 }}>
              // NO HISTORICAL RUNS RECORDED YET
            </div>
          ) : (
            history.map((entry, idx) => {
              const truncatedIdea = entry.idea.length > 40 ? entry.idea.substring(0, 40) + "..." : entry.idea;
              const relativeTime = getRelativeTime(entry.timestamp);
              const meta = brutalityMeta[entry.brutality];
              return (
                <button
                  key={idx}
                  className="history-entry"
                  onClick={() => {
                    setInputValue(entry.idea);
                    setBrutalityLevel(entry.brutality);
                    setTickets(entry.tickets);
                    setPhase("revealed");
                    setError(null);
                    setTicketsStale(false);
                    setCompareResults(null);
                    setHistoryOpen(false);
                    logEvent(`Loaded run from history for brutality level: ${entry.brutality.toUpperCase()}`);
                    trackPendo("history_entry_loaded", { brutality: entry.brutality });
                  }}
                  style={{
                    textAlign: "left",
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid var(--glass-border)",
                    padding: 12,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    width: "100%",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--system-accent)";
                    (e.currentTarget as HTMLButtonElement).style.background = "var(--gentle-bg)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--system-accent)";
                    (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.02)";
                  }}
                >
                  <div style={{ fontSize: 13, fontWeight: 550, color: "#fff", lineHeight: 1.45, fontFamily: "var(--font-family-body)" }}>
                    &ldquo;{truncatedIdea}&rdquo;
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                    <span style={{ fontSize: 10, color: "#52525B", fontFamily: "'JetBrains Mono', monospace" }}>
                      {relativeTime}
                    </span>
                    <span
                      style={{
                        fontSize: 9,
                        fontFamily: "'JetBrains Mono', monospace",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        padding: "2px 6px",
                        background: `${meta.color}15`,
                        border: `1px solid ${meta.color}44`,
                        color: meta.color,
                      }}
                    >
                      {meta.label}
                    </span>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Clear History Button */}
        {history.length > 0 && (
          <button
            onClick={() => {
              localStorage.removeItem("sledgehammer-history");
              setHistory([]);
              logEvent("Session history cleared.");
              trackPendo("history_cleared");
            }}
            style={{
              width: "100%",
              background: "rgba(255,45,45,0.06)",
              border: "1px solid rgba(255,45,45,0.28)",
              color: "#FF5555",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              padding: "12px 0",
              cursor: "pointer",
              transition: "all 0.18s",
              marginTop: 16,
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,45,45,0.15)";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "#FF5555";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,45,45,0.06)";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,45,45,0.28)";
            }}
          >
            ✖ Clear History
          </button>
        )}
      </div>

      {/* Root */}
      <div
        style={{
          minHeight: "100vh",
          background: "var(--background)",
          color: "#fff",
          fontFamily: "var(--font-family-body)",
          position: "relative",
          overflowX: "hidden",
        }}
        className={`app-wrapper ${phase === "shaking" ? "scope-quaking" : ""} ${glitchActive ? "glitch-active" : ""}`}
      >
        {/* Faint Geometric Network Pattern */}
        <div
          className="geometric-bg"
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            zIndex: 0,
            backgroundImage: `
              radial-gradient(circle at 20% 30%, rgba(0,255,255,0.16) 0%, transparent 50%),
              radial-gradient(circle at 80% 70%, rgba(255,0,255,0.14) 0%, transparent 50%),
              radial-gradient(circle at 50% 95%, rgba(255,45,45,0.07) 0%, transparent 55%),
              linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)
            `,
            backgroundSize: "140% 140%, 140% 140%, 100% 100%, 60px 60px, 60px 60px",
            animation: "bgDrift 22s ease-in-out infinite alternate",
          }}
        />

        {/* Floating Background Data Logs */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            overflow: "hidden",
            zIndex: 0,
          }}
        >
          {/* Top Left Area */}
          <div
            style={{
              position: "absolute",
              top: "10%",
              left: "5%",
              transform: "rotate(-6deg)",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10,
              color: "#3f3f46",
              opacity: 0.2,
              whiteSpace: "nowrap",
            }}
          >
            [ $12.4k • revenue ]
          </div>

          {/* Top Right Area */}
          <div
            style={{
              position: "absolute",
              top: "12%",
              right: "6%",
              transform: "rotate(4deg)",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10,
              color: "#3f3f46",
              opacity: 0.2,
              whiteSpace: "nowrap",
            }}
          >
            ▲ sessions / week 8,392
          </div>

          {/* Mid-Left Area */}
          <div
            style={{
              position: "absolute",
              top: "42%",
              left: "4%",
              transform: "rotate(-3deg)",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10,
              color: "#3f3f46",
              opacity: 0.18,
              lineHeight: 1.2,
              whiteSpace: "pre",
            }}
          >
{`┌──────────────────────┐
│ ACTIVE USERS: 1,284  │
└──────────────────────┘`}
          </div>

          {/* Mid-Right Area */}
          <div
            style={{
              position: "absolute",
              top: "48%",
              right: "4%",
              transform: "rotate(5deg)",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10,
              color: "#3f3f46",
              opacity: 0.2,
              whiteSpace: "nowrap",
            }}
          >
            Error rate: 0.03% // stable
          </div>

          {/* Lower Left Area */}
          <div
            style={{
              position: "absolute",
              bottom: "22%",
              left: "3%",
              transform: "rotate(8deg)",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10,
              color: "#3f3f46",
              opacity: 0.15,
              whiteSpace: "nowrap",
            }}
          >
            {"system: connection established [sec_level: high]"}
          </div>

          {/* Lower Right Area */}
          <div
            style={{
              position: "absolute",
              bottom: "15%",
              right: "3%",
              transform: "rotate(-5deg)",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10,
              color: "#3f3f46",
              opacity: 0.15,
              whiteSpace: "nowrap",
            }}
          >
            {"heap_size: 42.1MB // garbage collection: idle"}
          </div>
        </div>

        {/* Scanlines */}
        <div
          className="scanline-overlay"
          style={{
            position: "fixed",
            inset: 0,
            pointerEvents: "none",
            zIndex: 1,
            backgroundImage:
              "repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.55) 3px,rgba(0,0,0,0.55) 4px)",
            opacity: "var(--scanline-opacity)" as any,
          }}
        />
        {/* Ambient glows */}
        <div
          className="ambient-glows"
          style={{
            position: "fixed",
            inset: 0,
            pointerEvents: "none",
            zIndex: 1,
            background:
              "radial-gradient(ellipse 60% 50% at 15% 65%, rgba(0,255,255,0.10) 0%, transparent 60%), radial-gradient(ellipse 55% 45% at 85% 20%, rgba(255,0,255,0.10) 0%, transparent 60%)",
          }}
        />
        {/* Noise dots */}
        <div
          className="noise-dots"
          style={{
            position: "fixed",
            inset: 0,
            pointerEvents: "none",
            zIndex: 1,
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.013'%3E%3Ccircle cx='1' cy='1' r='1'/%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />

        {/* Main content */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            maxWidth: phase === "compare_loading" || phase === "compare_revealed" ? 1200 : 680,
            margin: "0 auto",
            padding: "72px 24px 96px",
            transition: "max-width 0.4s ease-in-out",
          }}
        >
          {/* Top-Right Theme Toggle Nav */}
          <div
            style={{
              position: "absolute",
              top: 24,
              right: 24,
              display: "flex",
              gap: 8,
              alignItems: "center",
              zIndex: 99,
            }}
          >
            <button
              onClick={() => setHistoryOpen(!historyOpen)}
              title="Toggle History panel"
              style={{
                background: "rgba(10, 10, 12, 0.6)",
                border: "1px solid var(--glass-border)",
                color: "var(--system-accent)",
                padding: "8px 12.5px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10.5,
                fontWeight: 750,
                transition: "all 0.2s",
                outline: "none",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--system-accent)";
                (e.currentTarget as HTMLButtonElement).style.background = "var(--gentle-bg)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--system-accent)";
                (e.currentTarget as HTMLButtonElement).style.background = "rgba(10, 10, 12, 0.6)";
              }}
            >
              <span>{historyOpen ? "◀ CLOSE" : "▶ HISTORY"}</span>
              {history.length > 0 && (
                <span style={{ fontSize: 9.5, padding: "1px 5px", background: "var(--system-accent-magenta)", color: "#000", fontWeight: 900 }}>
                  {history.length}
                </span>
              )}
            </button>
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme mode"
              title={theme === "cyber" ? "Switch to Terminal Mode" : "Switch to Cyber Mode"}
              style={{
                background: "rgba(10, 10, 12, 0.6)",
                border: "1px solid var(--glass-border)",
                color: "var(--system-accent)",
                padding: "8px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s",
                outline: "none",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--system-accent)";
                (e.currentTarget as HTMLButtonElement).style.background = "var(--gentle-bg)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--system-accent)";
                (e.currentTarget as HTMLButtonElement).style.background = "rgba(10, 10, 12, 0.6)";
              }}
            >
              <Terminal size={14} />
            </button>
          </div>

          {/* ── HERO ── */}
          <header style={{ marginBottom: 52, position: "relative" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <div style={{ height: 1, width: 28, background: "linear-gradient(90deg, transparent, var(--system-accent))" }} />
              <span
                style={{
                  fontFamily: "'JetBrains Mono', 'Courier New', monospace",
                  fontSize: 10.5,
                  letterSpacing: "0.32em",
                  textTransform: "uppercase",
                  color: "var(--system-accent)",
                }}
              >
                AI Product Ruthlessness Engine v1.0
              </span>
              <div style={{ height: 1, width: 28, background: "linear-gradient(90deg, var(--system-accent), transparent)" }} />
            </div>

            <h1
              className="scope-title"
              style={{
                fontWeight: 800,
                lineHeight: 0.88,
                letterSpacing: "-0.03em",
                fontSize: "clamp(3.4rem, 10vw, 6.8rem)",
                marginBottom: 20,
                userSelect: "none",
                cursor: "default",
              }}
            >
              <span style={{ display: "block", color: "#fff", textShadow: "3px 0 var(--system-accent-magenta), -3px 0 var(--system-accent)" }}>
                SCOPE
              </span>
              <span
                style={{
                  display: "block",
                  color: "var(--system-accent)",
                  textShadow: "3px 0 var(--system-accent-magenta), -3px 0 #fff, 0 0 90px rgba(0,255,255,0.4)",
                }}
              >
                SLEDGE
              </span>
              <span
                style={{
                  display: "block",
                  WebkitTextStroke: "2px #fff",
                  color: "transparent",
                  textShadow: "3px 0 var(--system-accent-magenta), -3px 0 var(--system-accent)",
                }}
              >
                HAMMER
              </span>
            </h1>

            <p style={{ fontSize: 15, color: "#71717A", lineHeight: 1.7, maxWidth: 480 }}>
              Feed it your bloated product vision.{" "}
              <strong style={{ color: "#E4E4E7", fontWeight: 600 }}>
                Get {brutalityLevel === "gentle" ? "5" : brutalityLevel === "nuclear" ? "1" : "3"} ruthless MVP ticket{brutalityLevel === "nuclear" ? "" : "s"} back.
              </strong>{" "}
              No mercy. No nice-to-haves. No roadmap theater.
            </p>

            {/* Emotional hook blockquote */}
            <div
              style={{
                marginTop: 24,
                padding: "16px 20px",
                borderLeft: "3px solid var(--system-accent-magenta)",
                background: "var(--ruthless-bg)",
                position: "relative",
              }}
            >
              <p
                style={{
                  fontSize: 13.5,
                  color: "#A1A1AA",
                  lineHeight: 1.7,
                  margin: 0,
                  fontStyle: "italic",
                }}
              >
                <span style={{ color: "var(--system-accent-magenta)", fontWeight: 700, fontStyle: "normal" }}>&ldquo;</span>
                92% of software startups collapse due to self-inflicted feature bloat.
                Stop drafting roadmaps. Build what matters today.
                <span style={{ color: "var(--system-accent-magenta)", fontWeight: 700, fontStyle: "normal" }}>&rdquo;</span>
              </p>
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  width: 16,
                  height: 16,
                  borderBottom: "1px solid var(--glass-border)",
                  borderRight: "1px solid var(--glass-border)",
                  pointerEvents: "none",
                }}
              />
            </div>

            {/* Corner brackets */}
            <div
              style={{
                position: "absolute", top: 0, right: 0, width: 40, height: 40,
                borderTop: "1.5px solid var(--system-accent)", borderRight: "1.5px solid var(--system-accent)",
                opacity: 0.18, pointerEvents: "none",
              }}
            />
            <div
              style={{
                position: "absolute", top: 4, right: 4, width: 20, height: 20,
                borderTop: "1px solid var(--system-accent-magenta)", borderRight: "1px solid var(--system-accent-magenta)",
                opacity: 0.12, pointerEvents: "none",
              }}
            />
          </header>

          {/* ── ERROR BANNER ── */}
          {error && (
            <div
              className="scope-error-banner"
              style={{
                marginBottom: 20,
                border: "1px solid rgba(255,85,85,0.35)",
                background: "rgba(255,45,45,0.08)",
                padding: "16px 20px",
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
              }}
            >
              <AlertTriangle size={16} style={{ color: "#FF5555", flexShrink: 0, marginTop: 1 }} />
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 10,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "#FF5555",
                    marginBottom: 4,
                  }}
                >
                  Sledgehammer jammed
                </div>
                <p style={{ fontSize: 13, color: "#FCA5A5", margin: "0 0 12px 0", lineHeight: 1.5 }}>
                  {error}
                </p>
                <button
                  onClick={() => {
                    setError(null);
                    handleSledgehammer();
                  }}
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "#FF5555",
                    background: "rgba(255,85,85,0.1)",
                    border: "1px solid rgba(255,85,85,0.3)",
                    padding: "6px 12px",
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,85,85,0.2)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,85,85,0.1)";
                  }}
                >
                  ↺ Try Again
                </button>
              </div>
              <button
                onClick={() => setError(null)}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  color: "#52525B", padding: 2, lineHeight: 0, flexShrink: 0,
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          )}

          {/* ── IDLE / SHAKING ── */}
          {(phase === "idle" || phase === "shaking") && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

              {/* Textarea */}
              <div className="textarea-wrapper" style={{ position: "relative" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <label
                    style={{
                      display: "block",
                      fontFamily: "'JetBrains Mono', 'Courier New', monospace",
                      fontSize: 10,
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      color: "#a1a1aa",
                    }}
                  >
                    {"// your bloated product idea"}
                  </label>
                  <button
                    onClick={() => {
                      setInputValue(
                        "A web3-enabled, AI-driven hyper-local dog walking mobile application featuring real-time video streaming of every walk, custom crypto wallet integrations for tipping, multi-layered loyalty tiers with NFT achievement badges, automated drone delivery for treats and supplies, a social feed with stories and reels for pet owners, integrated veterinary telemedicine, AR-powered dog park navigation, and a gamified leaderboard ranking walkers by neighborhood."
                      );
                    }}
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 9,
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      color: "var(--system-accent)",
                      background: "var(--gentle-bg)",
                      border: "1px solid var(--glass-border)",
                      padding: "4px 10px",
                      cursor: "pointer",
                      whiteSpace: "nowrap" as const,
                      transition: "all 0.18s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = "var(--gentle-bg)";
                      (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--system-accent)";
                      (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 12px var(--gentle-bg)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = "var(--gentle-bg)";
                      (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--system-accent)";
                      (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
                    }}
                  >
                    ⚡ Load Bloated Enterprise Idea Preset
                  </button>
                </div>
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                      e.preventDefault();
                      logEvent("Keyboard shortcut detected. Firing Sledgehammer.");
                      handleSledgehammer();
                    }
                  }}
                  placeholder="We're building an AI-powered B2B SaaS with real-time collaboration, a mobile app, analytics, white-labeling, SSO, and a marketplace. Oh — and gamification..."
                  rows={6}
                  className={
                    (inputShake
                      ? "scope-input-error"
                      : inputFocused
                      ? "scope-input-focused"
                      : "scope-input-blur") + " scope-textarea"
                  }
                  style={{
                    width: "100%",
                    resize: "none",
                    fontFamily: "'JetBrains Mono', 'Courier New', monospace",
                    fontSize: 12.5,
                    background: "rgba(0,0,0,0.4)",
                    color: "#cccccc",
                    border: "1px solid rgba(0,255,255,0.2)",
                    boxShadow: "inset 0 2px 18px rgba(0,0,0,0.6)",
                    padding: "18px 20px",
                    outline: "none",
                    transition: "border-color 0.22s",
                    lineHeight: 1.7,
                  }}
                />
                <div
                  style={{
                    position: "absolute", bottom: 0, left: 0, width: 10, height: 10,
                    borderBottom: "1px solid rgba(255,255,255,0.18)",
                    borderLeft: "1px solid rgba(255,255,255,0.18)",
                    pointerEvents: "none",
                  }}
                />
                <div
                  style={{
                    position: "absolute", bottom: 0, right: 0, width: 10, height: 10,
                    borderBottom: "1px solid rgba(255,255,255,0.18)",
                    borderRight: "1px solid rgba(255,255,255,0.18)",
                    pointerEvents: "none",
                  }}
                />
              </div>

              {/* ── COMPARE ALL MODES ACTION ── */}
              <div style={{ marginTop: 4 }}>
                <button
                  onClick={handleCompareAll}
                  onMouseEnter={() => !isInputEmpty && setCompareBtnHovered(true)}
                  onMouseLeave={() => { setCompareBtnHovered(false); setCompareBtnPressed(false); }}
                  onMouseDown={() => !isInputEmpty && setCompareBtnPressed(true)}
                  onMouseUp={() => setCompareBtnPressed(false)}
                  disabled={isInputEmpty}
                  style={{
                    position: "relative",
                    width: "100%",
                    overflow: "hidden",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: isInputEmpty ? "#71717A" : "var(--system-accent)",
                    border: isInputEmpty ? "1px solid rgba(255,255,255,0.08)" : "1px solid var(--system-accent)",
                    cursor: isInputEmpty ? "not-allowed" : "pointer",
                    outline: "none",
                    padding: "15px 30px",
                    background: isInputEmpty
                      ? "rgba(255,255,255,0.02)"
                      : "var(--gentle-bg)",
                    boxShadow: isInputEmpty
                      ? "none"
                      : compareBtnPressed
                      ? "1px 1px 0 var(--system-accent-magenta)"
                      : compareBtnHovered
                      ? "4px 4px 0 var(--system-accent-magenta), 0 0 20px var(--gentle-bg)"
                      : "3px 3px 0 var(--system-accent-magenta)",
                    transform: isInputEmpty
                      ? "none"
                      : compareBtnPressed
                      ? "translate(2px, 2px)"
                      : compareBtnHovered
                      ? "translate(-1px, -1px)"
                      : "none",
                    transition: "box-shadow 0.15s, transform 0.1s, background 0.2s, color 0.2s",
                    fontFamily: "'JetBrains Mono', monospace",
                    opacity: isInputEmpty ? 0.5 : 1,
                  }}
                >
                  ⚙ Compare All Brutality Modes
                </button>
              </div>

              {/* ── BRUTALITY SELECTOR ── */}
              <div style={{ position: "relative" }}>
                {/* Micro-flash overlay */}
                {brutalityFlash && (
                  <div
                    className="scope-brutality-flash"
                    style={{
                      position: "absolute",
                      inset: -8,
                      zIndex: 20,
                      borderRadius: 2,
                      background: `radial-gradient(ellipse at center, ${currentMeta.color}35, transparent 70%)`,
                    }}
                  />
                )}

                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 10,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: "#a1a1aa",
                    marginBottom: 10,
                  }}
                >
                  {"// brutality level"}
                </div>

                {/* Industrial block buttons */}
                <div style={{ display: "flex", gap: 0, border: `1px solid ${currentMeta.color}22`, transition: "border-color 0.3s" }}>
                  {(["gentle", "ruthless", "nuclear"] as const).map((level, idx) => {
                    const meta = brutalityMeta[level];
                    const isActive = brutalityLevel === level;
                    const glowAnim = level === "gentle" ? "gentleGlow" : level === "ruthless" ? "ruthlessGlow" : "nuclearGlow";
                    return (
                      <button
                        key={level}
                        className={`brutality-btn brutality-tab ${isActive ? "active" : ""}`}
                        onClick={() => handleBrutalityChange(level)}
                        style={{
                          flex: 1,
                          padding: "16px 0 13px",
                          background: isActive ? meta.bgColor : "rgba(9,9,11,0.6)",
                          border: "none",
                          borderRight: idx < 2 ? `1px solid ${isActive ? `${meta.color}44` : "rgba(255,255,255,0.05)"}` : "none",
                          borderBottom: isActive ? `3px solid ${meta.color}` : "3px solid transparent",
                          color: isActive ? meta.color : "rgba(255, 255, 255, 0.5)",
                          fontWeight: 800,
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: 10,
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          cursor: "pointer",
                          position: "relative",
                          overflow: "hidden",
                          animation: isActive ? `${glowAnim} 2.5s ease-in-out infinite` : "none",
                        }}
                      >
                        {/* Nuclear pulse background */}
                        {isActive && level === "nuclear" && (
                          <div
                            style={{
                              position: "absolute",
                              inset: 0,
                              pointerEvents: "none",
                              animation: "nuclearPulse 1.4s ease-in-out infinite",
                              background: `radial-gradient(ellipse at center, ${meta.color}18, transparent)`,
                            }}
                          />
                        )}
                        <span
                          style={{
                            position: "relative",
                            zIndex: 1,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 5,
                          }}
                        >
                          <span style={{ fontSize: 18, lineHeight: 1, filter: isActive ? `drop-shadow(0 0 6px ${meta.color})` : "none", transition: "filter 0.3s" }}>
                            {meta.icon}
                          </span>
                          {meta.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div
                  key={`${brutalityLevel}-desc-idle`}
                  className="brutality-desc-enter"
                  style={{
                    marginTop: 8,
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 10,
                    color: "#CCCCCC",
                    letterSpacing: "0.08em",
                  }}
                >
                  {currentMeta.desc}
                </div>

                {/* Framework tag */}
                <div
                  key={brutalityLevel}
                  className={`scope-tag-enter ${brutalityLevel === "nuclear" ? "scope-nuclear-tag" : ""}`}
                  style={{
                    marginTop: 10,
                    padding: "10px 14px",
                    border: `1px solid ${currentMeta.color}30`,
                    background: currentMeta.bgColor,
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    transition: "border-color 0.3s, background 0.3s",
                  }}
                >
                  <div
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: currentMeta.color,
                      boxShadow: `0 0 8px ${currentMeta.color}`,
                      flexShrink: 0,
                      animation: brutalityLevel === "nuclear" ? "blink 0.8s ease-in-out infinite" : "none",
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 10,
                      letterSpacing: "0.08em",
                      color: currentMeta.color,
                      opacity: 0.9,
                    }}
                  >
                    {currentMeta.tag}
                  </span>
                </div>
              </div>

              {/* ── CTA BUTTON ── */}
              <div style={{ position: "relative" }}>
                {debris.map((item) => (
                  <span
                    key={item.id}
                    style={{
                      position: "absolute",
                      left: "50%",
                      top: "50%",
                      zIndex: 50,
                      pointerEvents: "none",
                      whiteSpace: "nowrap",
                      color: "#FF2D2D",
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 10.5,
                      fontWeight: 800,
                      textShadow: "0 0 8px rgba(255,45,45,0.75)",
                      // Inject custom CSS variables for keyframes
                      "--dx": `${item.x}px`,
                      "--dy": `${item.y}px`,
                      animation: "debrisExplode 1s cubic-bezier(0.15, 0.85, 0.35, 1) forwards",
                    } as React.CSSProperties}
                  >
                    {item.text}
                  </span>
                ))}

                <button
                  className="sledgehammer-btn"
                  onClick={handleSledgehammer}
                  onMouseEnter={() => !isInputEmpty && setBtnHovered(true)}
                  onMouseLeave={() => { setBtnHovered(false); setBtnPressed(false); }}
                  onMouseDown={() => !isInputEmpty && setBtnPressed(true)}
                  onMouseUp={() => setBtnPressed(false)}
                  disabled={isInputEmpty}
                  style={{
                    position: "relative",
                    width: "100%",
                    overflow: "hidden",
                    fontWeight: 700,
                    fontSize: "clamp(1.1rem, 3.5vw, 1.5rem)",
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: isInputEmpty ? "#71717A" : "#000000",
                    border: isInputEmpty ? "1px solid rgba(255,255,255,0.12)" : "none",
                    cursor: isInputEmpty ? "not-allowed" : "pointer",
                    outline: "none",
                    padding: "22px 40px",
                    background: isInputEmpty
                      ? "rgba(255,255,255,0.08)"
                      : "linear-gradient(135deg, #00ffff, #7700ff)",
                    boxShadow: btnShadow,
                    transform: btnTranslate,
                    transition: "box-shadow 0.15s, transform 0.1s, background 0.2s, color 0.2s",
                    fontFamily: "'Space Grotesk', system-ui, sans-serif",
                    opacity: isInputEmpty ? 0.65 : 1,
                  }}
                >
                  {!isInputEmpty && <div className="scope-shimmer" />}
                  <span
                    style={{
                      position: "relative",
                      zIndex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 16,
                    }}
                  >
                    <HammerIcon size={26} />
                    SLEDGEHAMMER IT
                    <HammerIcon size={26} style={{ transform: "scaleX(-1)" }} />
                  </span>
                </button>
              </div>

              {isInputEmpty ? (
                <p
                  style={{
                    textAlign: "center",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 10,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: "#52525B",
                  }}
                >
                  {"// paste your product idea above"}
                </p>
              ) : (
                <p
                  style={{
                    textAlign: "center",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 10,
                    letterSpacing: "0.28em",
                    textTransform: "uppercase",
                    color: "#52525B",
                  }}
                >
                  ⚠ warning: may cause stakeholder distress
                </p>
              )}
            </div>
          )}

          {/* ── LOADING ── */}
          {phase === "loading" && (
            <div
              style={{
                border: "1px solid rgba(255,255,255,0.07)",
                background: "rgba(0,0,0,0.72)",
                padding: "28px 28px",
                boxShadow: "0 0 40px rgba(0,255,255,0.07)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Terminal size={14} style={{ color: "var(--system-accent)" }} />
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', 'Courier New', monospace",
                      fontSize: 11,
                      letterSpacing: "0.3em",
                      textTransform: "uppercase",
                      color: "var(--system-accent)",
                    }}
                  >
                    sledgehammer:~$ executing
                  </span>
                  <span
                    className="scope-blink"
                    style={{
                      color: "var(--system-accent)",
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 14,
                      marginLeft: 2,
                    }}
                  >
                    █
                  </span>
                </div>
                <button
                  onClick={handleReset}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontFamily: "'JetBrains Mono', 'Courier New', monospace",
                    fontSize: 10,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "#52525B",
                    background: "none",
                    border: "1px solid rgba(255,255,255,0.07)",
                    padding: "6px 10px",
                    cursor: "pointer",
                    transition: "all 0.18s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.color = "#A1A1AA";
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.18)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.color = "#52525B";
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.07)";
                  }}
                >
                  <RotateCcw size={11} />
                  Reset
                </button>
              </div>

              {/* Kill Counter Display */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", marginBottom: 28, textAlign: "center" }}>
                <span style={{ fontSize: "5rem", fontWeight: 700, color: "#00ffff", textShadow: `0 0 18px rgba(0,255,255,0.4)`, lineHeight: 1 }}>
                  {killCount}
                </span>
                <span style={{ fontSize: 12, color: "#888888", fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: "0.15em", marginTop: 4 }}>
                  Features Destroyed
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {LOADING_MESSAGES.map((msg, i) => {
                  const isPast = i < msgIndex % LOADING_MESSAGES.length;
                  const isCurrent = i === msgIndex % LOADING_MESSAGES.length;
                  return (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        fontFamily: "'JetBrains Mono', 'Courier New', monospace",
                        fontSize: 12.5,
                        transition: "all 0.35s",
                        opacity: isCurrent ? 1 : isPast ? 0.35 : 0.1,
                        color: isCurrent ? "var(--system-accent)" : isPast ? "#3F3F46" : "#1C1C1F",
                      }}
                    >
                      <span
                        style={{
                          minWidth: 14,
                          color: isCurrent ? "var(--system-accent-magenta)" : isPast ? "#374151" : "#1C1C1F",
                          fontSize: 13,
                        }}
                      >
                        {isPast ? "✓" : isCurrent ? "▶" : "○"}
                      </span>
                      <span className={isCurrent ? "typewriter" : ""}>{msg}</span>
                      {isCurrent && (
                        <span className="scope-blink" style={{ color: "var(--system-accent)" }}>
                          _
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              <div
                style={{
                  marginTop: 28,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  paddingTop: 20,
                  borderTop: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "var(--system-accent)",
                    animation: "blink 1s ease-in-out infinite",
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 10,
                    color: "#a1a1aa",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                  }}
                >
                  Calling Groq API — brutality: {brutalityLevel}
                </span>
              </div>
            </div>
          )}

          {/* ── COMPARE LOADING ── */}
          {phase === "compare_loading" && (
            <div
              style={{
                border: "1px solid rgba(255,255,255,0.07)",
                background: "rgba(0,0,0,0.72)",
                padding: "28px 28px",
                boxShadow: "0 0 40px rgba(255,0,255,0.07)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Terminal size={14} style={{ color: "var(--system-accent-magenta)" }} />
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', 'Courier New', monospace",
                      fontSize: 11,
                      letterSpacing: "0.3em",
                      textTransform: "uppercase",
                      color: "var(--system-accent-magenta)",
                    }}
                  >
                    sledgehammer:~$ comparing all modes
                  </span>
                  <span
                    className="scope-blink"
                    style={{
                      color: "var(--system-accent-magenta)",
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 14,
                      marginLeft: 2,
                    }}
                  >
                    █
                  </span>
                </div>
                <button
                  onClick={handleReset}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontFamily: "'JetBrains Mono', 'Courier New', monospace",
                    fontSize: 10,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "#52525B",
                    background: "none",
                    border: "1px solid rgba(255,255,255,0.07)",
                    padding: "6px 10px",
                    cursor: "pointer",
                    transition: "all 0.18s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.color = "#A1A1AA";
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.18)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.color = "#52525B";
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.07)";
                  }}
                >
                  <RotateCcw size={11} />
                  Reset
                </button>
              </div>

              {/* Shared Loading Skeleton Grid */}
              <div className="compare-grid">
                <SkeletonColumn modeName="Gentle Cut" accentColor="#00FFFF" cardCount={2} />
                <SkeletonColumn modeName="Ruthless Slash" accentColor="#FF00FF" cardCount={2} />
                <SkeletonColumn modeName="Nuclear" accentColor="#FF2D2D" cardCount={2} />
              </div>

              <div
                style={{
                  marginTop: 28,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  paddingTop: 20,
                  borderTop: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "var(--system-accent-magenta)",
                    animation: "blink 1s ease-in-out infinite",
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 10,
                    color: "#a1a1aa",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                  }}
                >
                  Firing parallel Groq completion calls...
                </span>
              </div>
            </div>
          )}

          {/* ── COMPARE REVEALED ── */}
          {phase === "compare_revealed" && compareResults && (
            <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
              {/* Header block with Reset button */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: 16 }}>
                <div>
                  <div
                    style={{
                      fontFamily: "'JetBrains Mono', 'Courier New', monospace",
                      fontSize: 10,
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      color: "#a1a1aa",
                      marginBottom: 6,
                    }}
                  >
                    {"// parallel scope comparison"}
                  </div>
                  <h2 style={{ fontWeight: 800, fontSize: 22, color: "#fff", letterSpacing: "-0.02em", margin: 0 }}>
                    Brutality Comparison Matrix
                  </h2>
                </div>
                <button
                  onClick={handleReset}
                  className="action-btn"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontFamily: "'JetBrains Mono', 'Courier New', monospace",
                    fontSize: 10,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    padding: "8px 14px",
                    cursor: "pointer",
                  }}
                >
                  <RotateCcw size={11} />
                  Reset Engine
                </button>
              </div>

              {/* 3 Columns Grid */}
              <div className="compare-grid">
                {/* Gentle Column */}
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {/* Badge */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "10px 14px",
                      border: "1px solid var(--glass-border)",
                      background: "var(--gentle-bg)",
                    }}
                  >
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--gentle-color)", boxShadow: "0 0 8px var(--gentle-color)" }} />
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700, color: "var(--gentle-color)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                      Gentle Cut
                    </span>
                  </div>
                  {/* Content */}
                  {compareResults.gentle.error ? (
                    <div style={{ border: "1px solid rgba(255,85,85,0.2)", background: "rgba(255,85,85,0.04)", padding: 16, fontSize: 13, color: "#FCA5A5" }}>
                      {compareResults.gentle.error}
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                      {compareResults.gentle.tickets.map((t, idx) => (
                        <TicketWithDrillDown
                          key={t.id ?? idx}
                          ticket={t}
                          index={idx}
                          copied={copied}
                          onCopy={handleCopy}
                          drillId={drillId}
                          drillLoading={drillLoading}
                          drillData={drillData}
                          onDrillDown={handleDrillDown}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Ruthless Column */}
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {/* Badge */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "10px 14px",
                      border: "1px solid var(--glass-border)",
                      background: "var(--ruthless-bg)",
                    }}
                  >
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--ruthless-color)", boxShadow: "0 0 8px var(--ruthless-color)" }} />
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700, color: "var(--ruthless-color)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                      Ruthless Slash
                    </span>
                  </div>
                  {/* Content */}
                  {compareResults.ruthless.error ? (
                    <div style={{ border: "1px solid rgba(255,85,85,0.2)", background: "rgba(255,85,85,0.04)", padding: 16, fontSize: 13, color: "#FCA5A5" }}>
                      {compareResults.ruthless.error}
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                      {compareResults.ruthless.tickets.map((t, idx) => (
                        <TicketWithDrillDown
                          key={t.id ?? idx}
                          ticket={t}
                          index={idx}
                          copied={copied}
                          onCopy={handleCopy}
                          drillId={drillId}
                          drillLoading={drillLoading}
                          drillData={drillData}
                          onDrillDown={handleDrillDown}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Nuclear Column */}
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {/* Badge */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "10px 14px",
                      border: "1px solid var(--glass-border)",
                      background: "var(--nuclear-bg)",
                    }}
                  >
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--nuclear-color)", boxShadow: "0 0 8px var(--nuclear-color)" }} />
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700, color: "var(--nuclear-color)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                      Nuclear Core
                    </span>
                  </div>
                  {/* Content */}
                  {compareResults.nuclear.error ? (
                    <div style={{ border: "1px solid rgba(255,85,85,0.2)", background: "rgba(255,85,85,0.04)", padding: 16, fontSize: 13, color: "#FCA5A5" }}>
                      {compareResults.nuclear.error}
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                      {compareResults.nuclear.tickets.map((t, idx) => (
                        <TicketWithDrillDown
                          key={t.id ?? idx}
                          ticket={t}
                          index={idx}
                          copied={copied}
                          onCopy={handleCopy}
                          drillId={drillId}
                          drillLoading={drillLoading}
                          drillData={drillData}
                          onDrillDown={handleDrillDown}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── REVEALED ── */}
          {phase === "revealed" && tickets.length > 0 && (
            <div>
              {/* ── BRUTALITY SELECTOR (in revealed) ── */}
              <div style={{ position: "relative", marginBottom: 28 }}>
                {brutalityFlash && (
                  <div
                    className="scope-brutality-flash"
                    style={{
                      position: "absolute",
                      inset: -8,
                      zIndex: 20,
                      borderRadius: 2,
                      background: `radial-gradient(ellipse at center, ${currentMeta.color}35, transparent 70%)`,
                    }}
                  />
                )}
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 10,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: "#a1a1aa",
                    marginBottom: 10,
                  }}
                >
                  {"// adjust brutality & re-sledgehammer"}
                </div>
                <div style={{ display: "flex", gap: 0, border: `1px solid ${currentMeta.color}22`, transition: "border-color 0.3s" }}>
                  {(["gentle", "ruthless", "nuclear"] as const).map((level, idx) => {
                    const meta = brutalityMeta[level];
                    const isActive = brutalityLevel === level;
                    const glowAnim = level === "gentle" ? "gentleGlow" : level === "ruthless" ? "ruthlessGlow" : "nuclearGlow";
                    return (
                      <button
                        key={level}
                        className={`brutality-btn brutality-tab ${isActive ? "active" : ""}`}
                        onClick={() => handleBrutalityChange(level)}
                        style={{
                          flex: 1,
                          padding: "14px 0 11px",
                          background: isActive ? meta.bgColor : "rgba(9,9,11,0.6)",
                          border: "none",
                          borderRight: idx < 2 ? `1px solid ${isActive ? `${meta.color}44` : "rgba(255,255,255,0.05)"}` : "none",
                          borderBottom: isActive ? `3px solid ${meta.color}` : "3px solid transparent",
                          color: isActive ? meta.color : "rgba(255, 255, 255, 0.5)",
                          fontWeight: 800,
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: 10,
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          cursor: "pointer",
                          position: "relative",
                          overflow: "hidden",
                          animation: isActive ? `${glowAnim} 2.5s ease-in-out infinite` : "none",
                        }}
                      >
                        {isActive && level === "nuclear" && (
                          <div
                            style={{
                              position: "absolute", inset: 0, pointerEvents: "none",
                              animation: "nuclearPulse 1.4s ease-in-out infinite",
                              background: `radial-gradient(ellipse at center, ${meta.color}18, transparent)`,
                            }}
                          />
                        )}
                        <span style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                          <span style={{ fontSize: 16, lineHeight: 1, filter: isActive ? `drop-shadow(0 0 6px ${meta.color})` : "none", transition: "filter 0.3s" }}>
                            {meta.icon}
                          </span>
                          {meta.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <div
                  key={`${brutalityLevel}-desc-revealed`}
                  className="brutality-desc-enter"
                  style={{
                    marginTop: 8,
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 10,
                    color: "#CCCCCC",
                    letterSpacing: "0.08em",
                  }}
                >
                  {currentMeta.desc}
                </div>
                <div
                  key={brutalityLevel + "-revealed"}
                  className={`scope-tag-enter ${brutalityLevel === "nuclear" ? "scope-nuclear-tag" : ""}`}
                  style={{
                    marginTop: 10,
                    padding: "8px 14px",
                    borderRadius: 4,
                    border: "1px solid rgba(0,255,255,0.2)",
                    background: "rgba(0,255,255,0.05)",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <div
                    style={{
                      width: 6, height: 6, borderRadius: "50%",
                      background: "#00ffff",
                      boxShadow: "0 0 8px rgba(0,255,255,0.5)",
                      flexShrink: 0,
                      animation: brutalityLevel === "nuclear" ? "blink 0.8s ease-in-out infinite" : "none",
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 10,
                      letterSpacing: "0.08em",
                      color: "#00ffff",
                      opacity: 0.9,
                    }}
                  >
                    {currentMeta.tag}
                  </span>
                </div>
              </div>

              {/* ── RE-SLEDGEHAMMER PROMPT (when stale) ── */}
              {ticketsStale && (
                <div
                  className="scope-tag-enter"
                  style={{
                    marginBottom: 24,
                    padding: "10px 16px",
                    borderRadius: 6,
                    border: "1px solid rgba(255, 0, 60, 0.4)",
                    background: "rgba(255, 0, 60, 0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ color: "#ff003c", fontSize: 14, flexShrink: 0 }}>{currentMeta.icon}</span>
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 11,
                        color: "#ff6688",
                        letterSpacing: "0.04em",
                      }}
                    >
                      Brutality changed to <strong style={{ color: "#ff00ff", fontWeight: 700 }}>{brutalityLevel}</strong>. Results are stale.
                    </span>
                  </div>
                  <button
                    onClick={handleSledgehammer}
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 12,
                      border: "1px solid rgba(0,255,255,0.6)",
                      color: "#00ffff",
                      background: "rgba(0,255,255,0.08)",
                      padding: "6px 14px",
                      borderRadius: 4,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      whiteSpace: "nowrap" as const,
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = "rgba(0,255,255,0.18)";
                      (e.currentTarget as HTMLButtonElement).style.filter = "brightness(1.2)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = "rgba(0,255,255,0.08)";
                      (e.currentTarget as HTMLButtonElement).style.filter = "none";
                    }}
                    onMouseDown={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.95)";
                    }}
                    onMouseUp={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
                    }}
                  >
                    ↻ Re-Sledgehammer
                  </button>
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
                <div
                  style={{
                    width: "100%",
                    fontFamily: "'JetBrains Mono', 'Courier New', monospace",
                    fontSize: 10,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: "#888888",
                  }}
                >
                  {`// scope reduction complete — ${brutalityLevel.toUpperCase()} MODE`}
                </div>

                <h2
                  style={{
                    width: "100%",
                    fontWeight: 700,
                    fontSize: "3rem",
                    color: "#ffffff",
                    letterSpacing: "-0.02em",
                    margin: 0,
                    lineHeight: 1,
                    display: "block",
                  }}
                >
                  {tickets.length} ticket{tickets.length !== 1 ? "s" : ""}. Non-negotiable.
                </h2>

                <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                  {animatedReduction > 0 && (
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#00FF88",
                        padding: "6px 10px",
                        border: "1px solid rgba(0, 255, 136, 0.7)",
                        borderRadius: "999px",
                        background: "rgba(0, 255, 136, 0.08)",
                        letterSpacing: "0.05em",
                      }}
                    >
                      [Scope reduced by {animatedReduction}%]
                    </span>
                  )}

                  {/* Deploy MVP Button */}
                  <button
                    onClick={handleDeployMVP}
                    className="action-btn"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      fontFamily: "'JetBrains Mono', 'Courier New', monospace",
                      fontSize: 10,
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      padding: "8px 12px",
                      cursor: "pointer",
                    }}
                  >
                    DEPLOY MVP
                  </button>

                  {/* Export CSV Button */}
                  <button
                    onClick={handleExportCSV}
                    className="action-btn"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      fontFamily: "'JetBrains Mono', 'Courier New', monospace",
                      fontSize: 10,
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      padding: "8px 12px",
                      cursor: "pointer",
                    }}
                  >
                    Export CSV
                  </button>

                  {/* Reset Button */}
                  <button
                    onClick={handleReset}
                    className="action-btn"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      fontFamily: "'JetBrains Mono', 'Courier New', monospace",
                      fontSize: 10,
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      padding: "8px 12px",
                      cursor: "pointer",
                    }}
                  >
                    <RotateCcw size={11} />
                    Reset
                  </button>
                </div>
              </div>

              {/* Ticket cards — fade when stale */}
              <div
                className={ticketsStale ? "scope-stale-tickets" : ""}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                  transition: "opacity 0.5s ease",
                  ...(ticketsStale ? { pointerEvents: "none" as const } : {}),
                }}
              >
                {tickets.map((ticket, i) => (
                  <TicketWithDrillDown
                    key={ticket.id ?? i}
                    ticket={ticket}
                    index={i}
                    copied={copied}
                    onCopy={handleCopy}
                    drillId={drillId}
                    drillLoading={drillLoading}
                    drillData={drillData}
                    onDrillDown={handleDrillDown}
                  />
                ))}
              </div>

              <p
                className="scope-card-in"
                style={{
                  animationDelay: `${tickets.length * 180 + 200}ms`,
                  textAlign: "center",
                  fontFamily: "'JetBrains Mono', 'Courier New', monospace",
                  fontSize: 10,
                  letterSpacing: "0.32em",
                  textTransform: "uppercase",
                  color: "#52525B",
                  marginTop: 36,
                  transition: "opacity 0.5s ease",
                  opacity: ticketsStale ? 0.3 : 1,
                }}
              >
                {ticketsStale ? "── switch detected · re-sledgehammer to update ──" : "── ship or die ──"}
              </p>
            </div>
          )}
          {/* ── NOVUS TELEMETRY DASHBOARD ── */}
          <NovusDashboard
            inputLength={inputValue.length}
            ticketCount={phase === "compare_revealed" && compareResults ? (compareResults.gentle.tickets.length + compareResults.ruthless.tickets.length + compareResults.nuclear.tickets.length) : tickets.length}
            phase={phase}
            brutalityLevel={brutalityLevel}
            events={telemetryLogs}
          />

          {/* ── BLOAT REGISTRY FAQ PANEL ── */}
          <div
            style={{
              marginTop: 48,
              border: "1px dashed var(--system-accent)",
              background: "rgba(0, 0, 0, 0.4)",
              padding: "16px 20px",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 12,
            }}
          >
            <details style={{ cursor: "pointer", outline: "none" }}>
              <summary
                style={{
                  fontWeight: 800,
                  color: "var(--system-accent)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  listStyle: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span>▶</span> Bloat Registry: Why 92% of Startups Die
              </summary>
              <div style={{ marginTop: 16, color: "#A1A1AA", lineHeight: 1.65, fontSize: 11.5 }}>
                <p style={{ marginBottom: 12 }}>
                  Feature creep is the silent killer of early-stage products. Teams spend months engineering SAML authentication, complex notification channels, and custom cryptocurrencies before testing if the core value resonates.
                </p>
                <p style={{ marginBottom: 12 }}>
                  Scope Sledgehammer uses a cynical auditor engine to slice your bloated concepts down to atomic must-haves. Depending on your brutality setting:
                </p>
                <ul style={{ listStyleType: "square", paddingLeft: 20, marginBottom: 12, display: "flex", flexDirection: "column", gap: 6 }}>
                  <li><strong style={{ color: "var(--gentle-color)" }}>Gentle Mode:</strong> Applies light Jobs-to-be-Done (JTBD) scoping. Organizes core functions.</li>
                  <li><strong style={{ color: "var(--ruthless-color)" }}>Ruthless Mode:</strong> Applies strict MoSCoW parameters. Keeps core Must-Haves; completely purges should-haves.</li>
                  <li><strong style={{ color: "var(--nuclear-color)" }}>Nuclear Mode:</strong> Reduces the application to a single key function concept.</li>
                </ul>
                <p>
                  Take the generated tickets, export them to your board, and write code ONLY for these specific components. Ship within the week or die in the registry.
                </p>
              </div>
            </details>
          </div>

        </div>

        {/* ── FOOTER ── */}
        <footer
          style={{
            position: "relative",
            zIndex: 10,
            maxWidth: 680,
            margin: "0 auto",
            padding: "48px 24px 32px",
            borderTop: "1px solid rgba(255,255,255,0.04)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <div style={{ height: 1, width: 24, background: "linear-gradient(90deg, transparent, #52525B)" }} />
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 9,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "#52525B",
              }}
            >
              Engineered for the &lsquo;Everyone Ships Now&rsquo; Hackathon
            </span>
            <div style={{ height: 1, width: 24, background: "linear-gradient(90deg, #52525B, transparent)" }} />
          </div>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 9.5,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#a1a1aa",
            }}
          >
            Built by <strong style={{ color: "var(--system-accent)", fontWeight: 700 }}>Team Infernyx</strong>
          </span>
        </footer>

      </div>
    </>
  );
}