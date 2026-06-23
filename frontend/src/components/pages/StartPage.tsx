import { useRef } from "react";

export type GameMode = "group-draw" | "guessing-game" | "paint-by-numbers" | "memory";

interface StartPageProps {
  onSelectMode: (mode: GameMode) => void;
}

const modes: Array<{
  mode: GameMode;
  label: string;
  title: string;
  description: string;
  featured?: boolean;
}> = [
  {
    mode: "group-draw",
    label: "Team",
    title: "Gemeinsam zeichnen",
    description: "Zusammen auf einem geteilten Canvas in Echtzeit.",
    featured: true,
  },
  {
    mode: "guessing-game",
    label: "Rate",
    title: "Rate-Spiel",
    description: "Erkenne, was deine Freunde zeichnen.",
  },
  {
    mode: "paint-by-numbers",
    label: "Zahlen",
    title: "Malen nach Zahlen",
    description: "Färbe ein Bild Feld für Feld nach Zahlen.",
  },
  {
    mode: "memory",
    label: "Memory",
    title: "Memory",
    description: "Spiele allein oder gemeinsam mit Bildern aus Suche und Zeichnungen.",
  },
];

export default function StartPage({ onSelectMode }: StartPageProps) {
  const cardRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const handleCardKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    const columns = window.matchMedia("(max-width: 720px)").matches ? 1 : 2;
    let nextIndex = index;

    if (event.key === "ArrowRight") nextIndex = Math.min(modes.length - 1, index + 1);
    else if (event.key === "ArrowLeft") nextIndex = Math.max(0, index - 1);
    else if (event.key === "ArrowDown") nextIndex = Math.min(modes.length - 1, index + columns);
    else if (event.key === "ArrowUp") nextIndex = Math.max(0, index - columns);
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = modes.length - 1;
    else return;

    event.preventDefault();
    cardRefs.current[nextIndex]?.focus();
  };

  return (
    <div
      style={{
        padding: "40px 24px",
        maxWidth: "1200px",
        margin: "0 auto",
        animation: "fadeIn 0.5s ease-out",
      }}
    >
      <h1 style={{ fontSize: "32px", fontWeight: 800, marginBottom: "8px" }}>
        Jetzt loslegen
      </h1>
      <p style={{ color: "#666", marginBottom: "40px" }}>Wähle einen Spielmodus.</p>

      <div
        role="list"
        aria-label="Spielmodi"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "24px",
        }}
      >
        {modes.map((mode, index) => {
          const isFeatured = mode.featured;
          return (
            <button
              key={mode.mode}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              type="button"
              onClick={() => onSelectMode(mode.mode)}
              onKeyDown={(event) => handleCardKeyDown(event, index)}
              className={isFeatured ? "mode-card-main" : "mode-card-sub"}
              style={{
                gridColumn: isFeatured ? "1 / -1" : undefined,
                minHeight: isFeatured ? "220px" : "190px",
                padding: isFeatured ? "40px" : "32px",
                borderRadius: "24px",
                cursor: "pointer",
                position: "relative",
                overflow: "hidden",
                textAlign: "left",
                border: isFeatured ? "0" : "2px solid #fef3c7",
                background: isFeatured ? "#1a6dd4" : "#fffbeb",
                color: isFeatured ? "white" : "#92400e",
                boxShadow: isFeatured ? "0 20px 40px rgba(26,109,212,0.2)" : "none",
              }}
            >
              <div style={{ fontSize: isFeatured ? "40px" : "32px", marginBottom: isFeatured ? "20px" : "16px" }}>
                {mode.label}
              </div>
              {isFeatured ? (
                <h2 style={{ fontSize: "28px", fontWeight: 800, margin: "0 0 12px" }}>
                  {mode.title}
                </h2>
              ) : (
                <h3 style={{ fontSize: "22px", fontWeight: 800, margin: "0 0 8px" }}>
                  {mode.title}
                </h3>
              )}
              <p style={{ margin: 0, color: isFeatured ? "rgba(255,255,255,0.9)" : "#b45309", fontSize: isFeatured ? "18px" : undefined }}>
                {mode.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
