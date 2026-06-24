import { useContext, useState } from 'react';
import '../../App.css';

import Canvas from '../canvas/Canvas';
import ToolWheel from '../toolbar/ToolWheel';
import { AppContext } from '../../context/AppContext';
import { socket } from '../../socket/socket';
import type { GameMode } from './StartPage';
import { pbnColorToCss, swatchTextColor, type PBNPaletteEntry } from '../../socket/PBNEvents';

export default function CanvasPage({ selectedMode }: { selectedMode?: GameMode | null }) {
  const {
    showGrid,
    guessingGame,
    pbnPalette,
    currentColor,
    setCurrentColor,
    penWidth,
    setPenWidth,
    undoCanvas,
    canUndoCanvas,
  } = useContext(AppContext);
  const isGuessingDrawer = guessingGame && socket.id === guessingGame.drawMasterId;
  const isPaintByNumbers = selectedMode === 'paint-by-numbers';
  
  // Trackt, ob der Sticker-Modus global aktiv ist
  const [stickerModeActive, setStickerModeActive] = useState(false);

  return (
    <div style={{ flex: 1, position: 'relative', display: 'flex', overflow: 'hidden' }}>
      
      <div style={{ flex: 1, position: 'relative', background: '#e7efe9' }}>
        {isGuessingDrawer && (
          <section
            aria-label="Zeichenauftrag"
            style={{
              position: 'absolute',
              top: 18,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 80,
              width: 'min(520px, calc(100% - 32px))',
              padding: '12px 18px',
              background: 'rgba(255,255,255,0.94)',
              border: '1px solid rgba(26,109,212,0.18)',
              borderRadius: 8,
              boxShadow: '0 14px 34px rgba(15,23,42,0.14)',
              textAlign: 'center',
            }}
          >
            <span style={{ display: 'block', color: '#4b5563', fontSize: 13, fontWeight: 700, marginBottom: 3 }}>
              Zeichne
            </span>
            <strong style={{ display: 'block', color: '#111827', fontSize: 28, lineHeight: 1.1 }}>
              {guessingGame.drawPrompt}
            </strong>
          </section>
        )}
        {showGrid && <div className="grid-overlay" />} 
        <Canvas hideSaveButton={isPaintByNumbers} />
        {isPaintByNumbers && (
          <aside
            aria-label="Malen nach Zahlen Werkzeuge"
            style={{
              position: 'absolute',
              right: 16,
              top: 16,
              zIndex: 70,
              width: 260,
              maxWidth: 'calc(100% - 32px)',
              padding: 14,
              border: '1px solid rgba(0,0,0,0.1)',
              borderRadius: 8,
              background: 'rgba(255,255,255,0.96)',
              boxShadow: '0 16px 36px rgba(15,23,42,0.16)',
              display: 'grid',
              gap: 12,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button className="btn btn-secondary" type="button" onClick={undoCanvas} disabled={!canUndoCanvas} style={{ flex: 1 }}>
                Undo
              </button>
              <div
                aria-hidden="true"
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 8,
                  border: '1px solid rgba(0,0,0,0.16)',
                  background: currentColor,
                }}
              />
            </div>

            <label style={{ display: 'grid', gap: 6, color: '#1f2937', fontWeight: 800, fontSize: 13 }}>
              Stiftstärke: {penWidth}
              <input
                type="range"
                min={1}
                max={24}
                step={1}
                value={penWidth}
                onChange={(event) => setPenWidth(Number(event.target.value))}
                aria-label="Stiftstärke"
              />
            </label>

            {pbnPalette?.length ? (
              <div
                aria-label="Farbpalette"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(5, 1fr)',
                  gap: 7,
                  maxHeight: 170,
                  overflowY: 'auto',
                }}
              >
                {pbnPalette.map((entry: PBNPaletteEntry) => {
                  const css = pbnColorToCss(entry.color);
                  return (
                    <button
                      key={entry.index}
                      type="button"
                      aria-label={`Farbe ${entry.index} auswählen`}
                      onClick={() => setCurrentColor(css)}
                      style={{
                        aspectRatio: '1 / 1',
                        borderRadius: 8,
                        border: currentColor === css ? '3px solid #111827' : '1px solid rgba(0,0,0,0.14)',
                        background: css,
                        color: swatchTextColor(entry.color),
                        fontWeight: 800,
                      }}
                    >
                      {entry.index}
                    </button>
                  );
                })}
              </div>
            ) : (
              <p style={{ margin: 0, color: '#6b7280', fontSize: 13 }}>Palette erscheint nach dem Generieren.</p>
            )}
          </aside>
        )}
      </div>

      {/* Das ToolWheel übernimmt jetzt das gesamte Rendering an Ort und Stelle */}
      {!isPaintByNumbers && (
        <ToolWheel
          stickerModeActive={stickerModeActive}
          setStickerModeActive={setStickerModeActive}
        />
      )}
    </div>
  );
}
