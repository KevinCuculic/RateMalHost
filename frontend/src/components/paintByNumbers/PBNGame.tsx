import { useContext, useEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { createPortal } from "react-dom";
import { AppContext } from "../../context/AppContext";
import { listDrawings, type DrawingSummary } from "../../api/drawingsApi";
import { imageUrlToDataUrl, searchImages } from "../../api/imageApi";
import {
  emitGeneratePBN,
  onPBNReady,
  offPBNReady,
  onPBNError,
  offPBNError,
  toPngDataUrl,
  pbnColorToCss,
  swatchTextColor,
  type PBNPaletteEntry,
  type PBNResult,
} from "../../socket/PBNEvents";
import "./PBNGame.css";

// Restiction to 1200px img size for PBN pipeline speedup
const MAX_DIM = 1200;
type SourceTab = "upload" | "saved" | "search";
type SearchImage = { id: number | string; url: string; alt: string };

//loads pic downscales and returns as jpeg
function downscaleImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(1, MAX_DIM / Math.max(img.width, img.height));
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("canvas error"));
        return;
      }
      ctx.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("error loading image"));
    };
    img.src = url;
  });
}

export default function PBNGame({ autoOpen = false }: { autoOpen?: boolean }) {
  const { activeLobbyId, currentColor, setCurrentColor, pbnPalette, setPbnPalette, isAuthenticated } =
    useContext(AppContext);

  const [open, setOpen] = useState(false);
  const [sourceTab, setSourceTab] = useState<SourceTab>("upload");
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [savedDrawings, setSavedDrawings] = useState<DrawingSummary[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchImage[]>([]);
  const [difficulty, setDifficulty] = useState(5);
  const [loading, setLoading] = useState(false);
  const [sourceLoading, setSourceLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completed, setCompleted] = useState<string | null>(null);
  const [portalEl] = useState(() => document.createElement("div"));
  const didAutoOpen = useRef(false);

  useEffect(() => {
    document.body.appendChild(portalEl);
    return () => {
      document.body.removeChild(portalEl);
    };
  }, [portalEl]);

  useEffect(() => {
    if (!autoOpen || didAutoOpen.current) return;
    didAutoOpen.current = true;
    setOpen(true);
  }, [autoOpen]);

  // Clear the shared palette when leaving PBN mode (component unmounts) so the
  // tool wheel only shows PBN colours while this mode is active.
  useEffect(() => () => setPbnPalette(null), []);

  useEffect(() => {
    const handleReady = (result: PBNResult) => {
      setPbnPalette(result.palette);
      setCompleted(result.completed);
      setLoading(false);
    };
    const handleError = (err: { message: string }) => {
      setError(err.message);
      setLoading(false);
    };
    onPBNReady(handleReady);
    onPBNError(handleError);
    return () => {
      offPBNReady(handleReady);
      offPBNError(handleError);
    };
  }, []);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setError(null);
    try {
      setImageDataUrl(await downscaleImage(file));
    } catch (err) {
      setError(err instanceof Error ? err.message : "file handling error");
    }
  };

  const loadSavedDrawings = async () => {
    if (!isAuthenticated) {
      setError("Melde dich an, um gespeicherte Zeichnungen zu nutzen.");
      return;
    }

    setSourceLoading(true);
    setError(null);
    try {
      const drawings = await listDrawings();
      setSavedDrawings(drawings);
      if (drawings.length === 0) setError("Noch keine gespeicherten Zeichnungen gefunden.");
    } catch {
      setError("Gespeicherte Zeichnungen konnten nicht geladen werden.");
    } finally {
      setSourceLoading(false);
    }
  };

  const changeSourceTab = (tab: SourceTab) => {
    setSourceTab(tab);
    setError(null);
    if (tab === "saved" && savedDrawings.length === 0) void loadSavedDrawings();
  };

  const handleSavedDrawingSelect = (drawing: DrawingSummary) => {
    setImageDataUrl(drawing.thumbnail);
    setFileName(drawing.title || "Gespeicherte Zeichnung");
    setError(null);
  };

  const handleSearch = async () => {
    const query = searchQuery.trim();
    if (!query) return;

    setSourceLoading(true);
    setError(null);
    try {
      const results = await searchImages(query);
      setSearchResults(results);
      if (results.length === 0) setError("Keine passenden Bilder gefunden.");
    } catch {
      setError("Bildersuche konnte nicht geladen werden.");
    } finally {
      setSourceLoading(false);
    }
  };

  const handleSearchImageSelect = async (image: SearchImage) => {
    setSourceLoading(true);
    setError(null);
    try {
      setImageDataUrl(await imageUrlToDataUrl(image.url));
      setFileName(image.alt || "Suchbild");
    } catch {
      setError("Dieses Bild konnte nicht vorbereitet werden.");
    } finally {
      setSourceLoading(false);
    }
  };

  const handleGenerate = () => {
    if (!activeLobbyId || !imageDataUrl) return;
    setError(null);
    setLoading(true);
    emitGeneratePBN({ lobbyId: activeLobbyId, image: imageDataUrl, difficulty });
  };

  return (
    <>
      <button className="btn btn-secondary lm-trigger" onClick={() => setOpen(true)}>
        Malen nach Zahlen
      </button>

      {open && createPortal(
        <div className="pbn-overlay" onClick={() => setOpen(false)}>
          <div className="pbn-window" onClick={(e) => e.stopPropagation()}>
            <div className="pbn-window__head">
              <h2>Malen nach Zahlen</h2>
              <button className="pbn-close" aria-label="Schließen" onClick={() => setOpen(false)}>
                ✕
              </button>
            </div>

            <div className="pbn-panels">
              {/* Panel 1 — upload + difficulty */}
              <section className="pbn-panel">
                <h3>1 · Bild &amp; Schwierigkeit</h3>

                <div className="pbn-source-tabs" aria-label="Bildquelle">
                  <button className={sourceTab === "upload" ? "is-active" : ""} onClick={() => changeSourceTab("upload")} type="button">
                    Hochladen
                  </button>
                  <button className={sourceTab === "saved" ? "is-active" : ""} onClick={() => changeSourceTab("saved")} type="button">
                    Gespeichert
                  </button>
                  <button className={sourceTab === "search" ? "is-active" : ""} onClick={() => changeSourceTab("search")} type="button">
                    Suchen
                  </button>
                </div>

                {sourceTab === "upload" && (
                <label className="pbn-upload">
                  <input type="file" accept="image/*" hidden onChange={handleFileChange} />
                  {imageDataUrl ? (
                    <img src={imageDataUrl} alt="Vorschau des hochgeladenen Bildes" />
                  ) : (
                    <span>Bild auswählen</span>
                  )}
                </label>
                )}

                {sourceTab === "saved" && (
                  <div className="pbn-picker">
                    {!isAuthenticated ? (
                      <p className="pbn-placeholder">Melde dich an, um gespeicherte Zeichnungen zu nutzen.</p>
                    ) : sourceLoading ? (
                      <p className="pbn-placeholder">Lädt...</p>
                    ) : savedDrawings.length === 0 ? (
                      <p className="pbn-placeholder">Noch keine gespeicherten Zeichnungen.</p>
                    ) : (
                      <div className="pbn-source-grid">
                        {savedDrawings.map((drawing) => (
                          <button key={drawing.id} type="button" className="pbn-source-card" onClick={() => handleSavedDrawingSelect(drawing)}>
                            <img src={drawing.thumbnail} alt={drawing.title} />
                            <span>{drawing.title}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {sourceTab === "search" && (
                  <div className="pbn-picker">
                    <div className="pbn-search-row">
                      <input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            void handleSearch();
                          }
                        }}
                        placeholder="Bild suchen"
                      />
                      <button className="btn btn-secondary" type="button" onClick={handleSearch} disabled={sourceLoading || !searchQuery.trim()}>
                        Suchen
                      </button>
                    </div>
                    {sourceLoading ? (
                      <p className="pbn-placeholder">Lädt...</p>
                    ) : searchResults.length === 0 ? (
                      <p className="pbn-placeholder">Suche ein Bild als Vorlage.</p>
                    ) : (
                      <div className="pbn-source-grid">
                        {searchResults.map((image) => (
                          <button key={image.id} type="button" className="pbn-source-card" onClick={() => handleSearchImageSelect(image)}>
                            <img src={image.url} alt={image.alt} />
                            <span>{image.alt || "Bild"}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {sourceTab !== "upload" && imageDataUrl && (
                  <div className="pbn-selected-preview">
                    <img src={imageDataUrl} alt="Ausgewählte Vorlage" />
                  </div>
                )}
                {fileName && <p className="pbn-filename">{fileName}</p>}

                <label className="pbn-difficulty">
                  <span>
                    Schwierigkeit: <strong>{difficulty}</strong>
                  </span>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    step={1}
                    value={difficulty}
                    onChange={(e) => setDifficulty(Number(e.target.value))}
                  />
                  <span className="pbn-difficulty__hint">1 = wenige Farben · 10 = viele Details</span>
                </label>

                <button
                  className="btn btn-secondary pbn-generate"
                  onClick={handleGenerate}
                  disabled={!imageDataUrl || !activeLobbyId || loading}
                >
                  {loading ? "Wird generiert…" : "Generieren"}
                </button>

                {!activeLobbyId && <p className="pbn-warn">Tritt zuerst einer Lobby bei.</p>}
                {error && <p className="pbn-error">{error}</p>}
              </section>

              {/* Panel 2 — palette */}
              <section className="pbn-panel">
                <h3>2 · Farbpalette</h3>
                {pbnPalette ? (
                  <div className="pbn-palette">
                    {pbnPalette.map((entry: PBNPaletteEntry) => {
                      const css = pbnColorToCss(entry.color);
                      return (
                        <div
                          key={entry.index}
                          className={"pbn-swatch" + (currentColor === css ? " is-selected" : "")}
                          style={{ background: css, color: swatchTextColor(entry.color) }}
                          onClick={() => setCurrentColor(css)}
                          role="button"
                          title={`Farbe ${entry.index} auswählen`}
                        >
                          {entry.index}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="pbn-placeholder">Noch keine Palette.</p>
                )}
              </section>

              {/* Panel 3 — completed preview */}
              <section className="pbn-panel">
                <h3>3 · Vorschau</h3>
                {completed ? (
                  <img
                    className="pbn-completed"
                    src={toPngDataUrl(completed)}
                    alt="Fertiges Bild in Flächenfarben"
                  />
                ) : (
                  <p className="pbn-placeholder">Noch kein Ergebnis.</p>
                )}
              </section>
            </div>
          </div>
        </div>,
        portalEl
      )}
    </>
  );
}
