import React from "react";
import "../../app/globals.css";


export type SkeletonVariant = 
  | "text"
  | "rect"
  | "circle"
  | "avatar"
  | "card"
  | "table-row"
  | "list"
  | "grid"
  | "custom";

export interface SkeletonProps {
  variant?: SkeletonVariant;
  count?: number; // repeated items
  lines?: number; // text lines for 'text' or card
  width?: string | number;
  height?: string | number;
  className?: string;
  style?: React.CSSProperties;
  shimmer?: boolean; // default true
  radius?: string | number;
  gap?: string | number;
  ariaLabel?: string;
  children?: React.ReactNode; // used only for custom variant
}

/**
 * Universal skeleton
 */
const Skeleton: React.FC<SkeletonProps> = ({
  variant = "text",
  count = 1,
  lines = 3,
  width,
  height,
  className = "",
  style,
  shimmer = true,
  radius = 6,
  gap = 12,
  ariaLabel = "Loading…",
  children
}) => {
  const items = new Array(Math.max(1, count)).fill(null);

  const baseClass = `skeleton ${shimmer ? "skeleton--shimmer" : ""}`;

  const styleFor = (w?: string | number, h?: string | number, r?: string | number) => {
    const s: React.CSSProperties = {};
    if (w !== undefined) s.width = typeof w === "number" ? `${w}px` : w;
    if (h !== undefined) s.height = typeof h === "number" ? `${h}px` : h;
    if (r !== undefined) s.borderRadius = typeof r === "number" ? `${r}px` : r;
    return s;
  };

  // text lines helper
  const renderLines = (n: number) => {
    return (
      <>
        {Array.from({ length: n }).map((_, idx) => (
          <div
            key={idx}
            className={`${baseClass} mb-2`}
            style={{
              height: 10,
              width: idx === n - 1 ? "70%" : `${80 - idx * 8}%`,
              borderRadius: typeof radius === "number" ? `${radius / 2}px` : radius
            }}
          />
        ))}
      </>
    );
  };

  return (
    <div role="status" aria-busy="true" aria-label={ariaLabel} className={className} style={style}>
      {items.map((_, i) => {
        const key = `skeleton-${variant}-${i}`;
        switch (variant) {
          case "text":
            return (
              <div key={key} className="mb-4">
                {renderLines(lines)}
              </div>
            );

          case "rect":
            return (
              <div
                key={key}
                className={baseClass}
                style={styleFor(width ?? "100%", height ?? 12, radius)}
              />
            );

          case "circle":
            return (
              <div
                key={key}
                className={`${baseClass} round`}
                style={styleFor(width ?? 40, width ?? 40, "50%")}
              />
            );

          case "avatar":
            return (
              <div key={key} style={{ display: "flex", gap, alignItems: "center" }}>
                <div className={`${baseClass} round`} style={styleFor(width ?? 48, width ?? 48, "50%")} />
                <div style={{ flex: 1 }}>
                  {renderLines(Math.max(1, lines))}
                </div>
              </div>
            );

          case "card":
            return (
              <div key={key} style={{ display: "flex", gap, alignItems: "flex-start" }}>
                <div className={`${baseClass}`} style={styleFor(width ?? 120, height ?? 80, radius)} />
                <div style={{ flex: 1 }}>
                  <div className={`${baseClass} mb-3`} style={{ height: 14, width: "40%", borderRadius: 6 }} />
                  {renderLines(Math.max(2, lines))}
                </div>
              </div>
            );

          case "table-row":
            return (
              <div key={key} style={{ display: "flex", gap, alignItems: "center", padding: "6px 0" }}>
                <div className={`${baseClass}`} style={styleFor(36, 36, "6px")} />
                <div style={{ flex: 1 }}>
                  <div className={`${baseClass} mb-2`} style={{ height: 10, width: "60%" }} />
                </div>
                <div style={{ width: 80 }}>
                  <div className={`${baseClass}`} style={{ height: 10, width: "100%", borderRadius: 6 }} />
                </div>
              </div>
            );

          case "list":
            return (
              <div key={key} style={{ display: "grid", gap }}>
                {Array.from({ length: 3 }).map((__, idx) => (
                  <div key={idx} style={{ display: "flex", gap, alignItems: "center" }}>
                    <div className={`${baseClass}`} style={styleFor(32, 32, 8)} />
                    <div style={{ flex: 1 }}>
                      <div className={`${baseClass} mb-2`} style={{ height: 10, width: "60%" }} />
                    </div>
                  </div>
                ))}
              </div>
            );

          case "grid":
            return (
              <div key={key} style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap }}>
                <div className={`${baseClass}`} style={styleFor("100%", 120, 8)} />
                <div className={`${baseClass}`} style={styleFor("100%", 120, 8)} />
                <div className={`${baseClass}`} style={styleFor("100%", 120, 8)} />
              </div>
            );

          case "custom":
            return (
              <div key={key}>
                {children ?? (
                  <div className={`${baseClass}`} style={styleFor(width ?? "100%", height ?? 10, radius)} />
                )}
              </div>
            );

          default:
            return (
              <div key={key} className={baseClass} style={styleFor(width ?? "100%", height ?? 12, radius)} />
            );
        }
      })}
    </div>
  );
};

export default Skeleton;
