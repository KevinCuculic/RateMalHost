import { useContext, useState } from 'react';
import '../../App.css';

import Canvas from '../canvas/Canvas';
import ToolWheel from '../toolbar/ToolWheel';
import { AppContext } from '../../context/AppContext';
import { socket } from '../../socket/socket';
import type { GameMode } from './StartPage';

export default function CanvasPage({ selectedMode }: { selectedMode?: GameMode | null }) {
  const { showGrid, guessingGame } = useContext(AppContext);
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
