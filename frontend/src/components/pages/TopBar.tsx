import { useContext, useState } from "react";
import LobbyManager from "../lobby/LobbyManager";
import LobbyParticipants from "../lobby/LobbyParticipants";
import Prompts from "../canvas/Prompts";
import GuessingGameCreator from "../canvas/GuessingGame";
import PBNGame from "../paintByNumbers/PBNGame";
import SavedDrawingsGallery from "../canvas/SavedDrawingsGallery";
import { AppContext } from "../../context/AppContext";
import type { GameMode } from "./StartPage";

interface TopBarProps {
  view: "home" | "canvas" | "memory";
  selectedMode?: GameMode | null;
  onBack: () => void;
  onLoginClick?: () => void;
  onMemoryClick?: () => void;
}

export default function TopBar({ view, selectedMode, onBack, onLoginClick, onMemoryClick }: TopBarProps) {
  const { isAuthenticated, username, logout, undoCanvas, clearCanvas, canUndoCanvas } = useContext(AppContext);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);
  const isPaintByNumbers = selectedMode === "paint-by-numbers";

  const handleLogout = async () => {
    setIsAccountOpen(false);
    await logout();
  };

  return (
    <header
      className="app-topbar"
      style={{
        minHeight: "72px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "12px",
        padding: "0 24px",
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(0,0,0,0.08)",
        zIndex: 1000,
        flexWrap: "wrap",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: "1 1 220px" }}>
        {view !== "home" && (
          <button onClick={onBack} className="btn" aria-label="Zur Startseite zurück" style={{ padding: "8px 15px", marginRight: "10px" }}>
            Zurück
          </button>
        )}
        <div
          style={{
            width: "40px",
            height: "40px",
            background: "#1a6dd4",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: "bold",
          }}
        >
          R
        </div>
        <span style={{ fontWeight: 800, color: "#333", fontSize: "18px" }}>
          Rate<span style={{ color: "#1a6dd4" }}>Mal</span>
        </span>
      </div>

      <nav aria-label="Lobby" style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "12px", flex: "1 1 260px" }}>
        {view !== "home" && (
          <>
            <div className="top-bar-element">
              <LobbyManager />
            </div>
            <div className="top-bar-element">
              <LobbyParticipants />
            </div>
          </>
        )}
      </nav>

      <nav aria-label="Spielaktionen" style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "12px", flex: "1 1 320px", flexWrap: "wrap" }}>
        {view === "canvas" && (
          <>
            {selectedMode === "group-draw" && (
              <div className="top-bar-element">
                <Prompts />
              </div>
            )}
            {selectedMode === "guessing-game" && (
              <div className="top-bar-element">
                <GuessingGameCreator />
              </div>
            )}
            {selectedMode === "paint-by-numbers" && (
              <div className="top-bar-element">
                <PBNGame autoOpen />
              </div>
            )}
            {!isPaintByNumbers && (
              <div
                aria-label="Zeichenaktionen"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "4px",
                  border: "1px solid rgba(79,70,229,0.16)",
                  borderRadius: "12px",
                  background: "#f8fbff",
                }}
              >
            <button
              type="button"
              className="btn btn-secondary"
              onClick={undoCanvas}
              disabled={!canUndoCanvas}
              aria-label="Letzten Zeichenschritt rückgängig machen"
            >
              Undo
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsClearConfirmOpen(true)}
              aria-label="Canvas löschen"
            >
              Löschen
            </button>
              </div>
            )}
            {selectedMode !== "guessing-game" && selectedMode !== "group-draw" && !isPaintByNumbers && (
              <button className="btn btn-secondary" onClick={onMemoryClick} aria-label="Memory Spiel öffnen">
                Memory
              </button>
            )}
          </>
        )}
        {isAuthenticated ? (
          <div style={{ position: "relative" }}>
            <button
              type="button"
              className="btn btn-secondary"
              aria-label={`Account-Menü für ${username}`}
              aria-expanded={isAccountOpen}
              onClick={() => setIsAccountOpen((open) => !open)}
            >
              {username}
            </button>
            {isAccountOpen && (
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: "calc(100% + 8px)",
                  minWidth: "160px",
                  padding: "8px",
                  background: "#fff",
                  border: "1px solid rgba(0,0,0,0.12)",
                  borderRadius: "8px",
                  boxShadow: "0 12px 28px rgba(0,0,0,0.16)",
                  zIndex: 1200,
                }}
              >
                <SavedDrawingsGallery
                  triggerClassName="btn btn-secondary"
                  triggerStyle={{ width: "100%", justifyContent: "center", marginBottom: "8px" }}
                />
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleLogout}
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  Abmelden
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={onLoginClick}
            aria-label="Anmelden oder registrieren"
            style={{
              background: "#0a3cff",
              color: "#fff",
              padding: "10px 24px",
              fontWeight: 700,
              fontSize: "15px",
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
            }}
          >
            Anmelden
          </button>
        )}
      </nav>
      {isClearConfirmOpen && (
        <div
          role="presentation"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 2000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            background: "rgba(15,23,42,0.28)",
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Canvas löschen bestätigen"
            style={{
              width: "min(380px, 100%)",
              padding: "20px",
              background: "#fff",
              border: "1px solid rgba(0,0,0,0.12)",
              borderRadius: "8px",
              boxShadow: "0 22px 48px rgba(15,23,42,0.24)",
            }}
          >
            <h2 style={{ margin: "0 0 8px", fontSize: "20px", color: "#111827" }}>Canvas löschen?</h2>
            <p style={{ margin: "0 0 18px", color: "#4b5563", lineHeight: 1.45 }}>
              Alles auf dem Canvas wird unwiderruflich gelöscht.
            </p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button type="button" className="btn btn-secondary" onClick={() => setIsClearConfirmOpen(false)}>
                Abbrechen
              </button>
              <button
                type="button"
                className="btn"
                onClick={() => {
                  clearCanvas?.();
                  setIsClearConfirmOpen(false);
                }}
              >
                Löschen
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
