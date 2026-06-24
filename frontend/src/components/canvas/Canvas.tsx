/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
//---------------------------------
//
//
//--------------------------------
import { useRef, useEffect, useContext, useState, useCallback } from "react";
import { AppContext } from "../../context/AppContext";
import { emitCanvasClear, emitCanvasUndo, emitDraw, onDraw, offDraw, onCanvasSync, offCanvasSync, type DrawEvent } from "../../socket/drawingEvents";
import { onPBNReady, offPBNReady, toPngDataUrl, pbnColorToCss, swatchTextColor, type PBNResult } from "../../socket/PBNEvents";
import { renderSticker} from "../../utils/shapeHelpers";
import { STICKER_CATEGORIES } from "../sticker/stickers";
import type { Sticker } from "../sticker/stickers";
import SaveDrawing from "./SaveDrawing";


type Point = { x: number; y: number };


export default function Canvas({ hideSaveButton = false }: { hideSaveButton?: boolean }) {

  const { currentColor, setCurrentColor, activeLobbyId, tool, activeShape, stickerSize, penWidth, showGrid, pbnPalette, setCanvasControlActions } = useContext(AppContext);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const lastPoint = useRef<Point | null>(null);
  // Clientseitige Kopie aller gezeichneten Events, damit der Canvas nach einem
  // Resize (z.B. Browser-Zoom) verlustfrei neu aufgebaut werden kann.
  const historyRef = useRef<DrawEvent[]>([]);
  const pbnImageRef = useRef<HTMLImageElement | null>(null);
  const repaintRef = useRef<() => void>(() => {});
  const paletteButtonRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const [previewPos, setPreviewPos] = useState<Point | null>(null);
  const [customStickers, setCustomStickers] = useState<Sticker[]>([]);
  const [historyVersion, setHistoryVersion] = useState(0);
  const [paletteMenuPos, setPaletteMenuPos] = useState<Point | null>(null);
  const [paletteFocusIndex, setPaletteFocusIndex] = useState(0);
  // Helpfunction, gets stickers as flat list
  //const allStickers = Object.values(STICKER_CATEGORIES).flat();
  const allStickers = [...Object.values(STICKER_CATEGORIES).flat(), ...customStickers];
  const currentStickerObj = allStickers.find(s => s.id === activeShape);

  const markHistoryChanged = () => setHistoryVersion((version) => version + 1);

  



  useEffect(() => {
    // Lade custom stickers damit der Ghost sie anzeigen kann
    const saved = localStorage.getItem("custom_stickers");
    if (saved) setCustomStickers(JSON.parse(saved));
  }, [activeShape]); // Wir laden neu, wenn sich die Auswahl ändert, um sicherzugehen





  
  const handleMouseMove= (e: React.MouseEvent) =>{

    const p = getPos(e.nativeEvent);
    if ( tool === "shape" && activeShape) {
      setPreviewPos(p); // Ghost follows mouse
    } else {
      draw (e.nativeEvent); // normal draw
    }
  };

  const handleMouseDown= (e: React.MouseEvent)=> {
    setPaletteMenuPos(null);

    // if not left mouse button
    if (e.button !== 0) {
      return;
    }

    if ( tool === "shape" && activeShape && previewPos) {
      confirmPlacement(previewPos.x, previewPos.y);
    } else{
      startDraw(e.nativeEvent);
    }
  };


  const confirmPlacement= (x: number, y: number) => {

    const ctx = canvasRef.current!.getContext("2d")!;
    const eventData: DrawEvent ={
      type:"shape",
      shapeType: activeShape,
      x: x,
      y: y,
      color: currentColor,
      size: stickerSize
    };
    renderEvent(ctx, eventData);
    historyRef.current.push(eventData);
    markHistoryChanged();
    emitDraw({lobbyId: activeLobbyId, data: eventData});
  };





  // ZENTRALE ZEICHEN-LOGIK (Fix für alle Sticker & Linien)
  const renderEvent = (ctx: CanvasRenderingContext2D, data: DrawEvent) => {

    if (data.type === "shape") {
      renderSticker(ctx, data.shapeType, data.x, data.y, data.size || 60, allStickers, currentColor);
    } else if (data.type === "line") {
      ctx.strokeStyle = data.color;
      ctx.lineWidth = data.width ?? 4;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(data.from.x, data.from.y);
      ctx.lineTo(data.to.x, data.to.y);
      ctx.stroke();
    }
  };








  const getPos = (e: MouseEvent | TouchEvent): Point => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    if ("touches" in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };








  const startDraw = (e: MouseEvent | TouchEvent) => {
    if (!activeLobbyId) return;


    if ("button" in e && e.button !== 0) {
      return;
    }

    const p = getPos(e);
    const ctx = canvasRef.current!.getContext("2d")!;

    if (tool === "shape" && activeShape) {
      // Nutze die neue render-Funktion für lokales Zeichnen
      const eventData:DrawEvent = {
        type: "shape",
        shapeType: activeShape,
        x: p.x,
        y: p.y,
        color: currentColor,
        size:stickerSize,
      };
      
      renderEvent(ctx, eventData);
      historyRef.current.push(eventData);
      markHistoryChanged();
      emitDraw({ lobbyId: activeLobbyId, canvasWidth: canvasRef.current!.getBoundingClientRect().width, data: eventData });
      return;
    }

    isDrawing.current = true;
    lastPoint.current = p;
  };





  const draw = (e: MouseEvent | TouchEvent) => {
    if (!activeLobbyId || !isDrawing.current || !lastPoint.current) return;
    const ctx = canvasRef.current!.getContext("2d")!;
    const p = getPos(e);

    const eventData: DrawEvent= {
      type: "line",
      from: lastPoint.current,
      to: p,
      color: currentColor,
      width: penWidth
    };

    renderEvent(ctx, eventData);
    historyRef.current.push(eventData);
    markHistoryChanged();
    emitDraw({ lobbyId: activeLobbyId, canvasWidth: canvasRef.current!.getBoundingClientRect().width, data: eventData });
    lastPoint.current = p;
  };

  const endDraw = () => {
    isDrawing.current = false;
    lastPoint.current = null;
  };

  // Kleines JPEG-Vorschaubild des aktuellen Canvas für die Galerie.
  const makeThumbnail = (): string | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const maxW = 900;
    const scale = Math.min(1, maxW / canvas.width);
    const off = document.createElement("canvas");
    off.width = Math.max(1, Math.round(canvas.width * scale));
    off.height = Math.max(1, Math.round(canvas.height * scale));
    const octx = off.getContext("2d");
    if (!octx) return null;
    octx.fillStyle = "#ffffff";
    octx.fillRect(0, 0, off.width, off.height);
    octx.imageSmoothingEnabled = true;
    octx.imageSmoothingQuality = "high";
    octx.drawImage(canvas, 0, 0, off.width, off.height);
    return off.toDataURL("image/jpeg", 0.92);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    if (!pbnPalette?.length) return;
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const currentIndex = pbnPalette.findIndex((entry: { color: { r: number; g: number; b: number } }) => pbnColorToCss(entry.color) === currentColor);
    setPaletteFocusIndex(currentIndex >= 0 ? currentIndex : 0);
    setPaletteMenuPos({
      x: Math.min(e.clientX - rect.left, rect.width - 220),
      y: Math.min(e.clientY - rect.top, rect.height - 180),
    });
  };

  useEffect(() => {
    if (!paletteMenuPos) return;
    window.setTimeout(() => paletteButtonRefs.current[paletteFocusIndex]?.focus(), 0);
  }, [paletteMenuPos, paletteFocusIndex]);

  const handlePaletteKeyDown = (e: React.KeyboardEvent) => {
    if (!pbnPalette?.length) return;
    const lastIndex = pbnPalette.length - 1;
    let nextIndex = paletteFocusIndex;

    if (e.key === "ArrowRight" || e.key === "ArrowDown") nextIndex = Math.min(lastIndex, paletteFocusIndex + 1);
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") nextIndex = Math.max(0, paletteFocusIndex - 1);
    else if (e.key === "Home") nextIndex = 0;
    else if (e.key === "End") nextIndex = lastIndex;
    else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      paletteButtonRefs.current[paletteFocusIndex]?.click();
      return;
    } else if (e.key === "Escape") {
      e.preventDefault();
      setPaletteMenuPos(null);
      return;
    } else {
      return;
    }

    e.preventDefault();
    setPaletteFocusIndex(nextIndex);
    paletteButtonRefs.current[nextIndex]?.focus();
  };

  const clearLocalCanvas = useCallback(() => {
    historyRef.current = [];
    pbnImageRef.current = null;
    repaintRef.current();
    markHistoryChanged();
  }, []);

  const clearCanvas = useCallback(() => {
    if (activeLobbyId) {
      emitCanvasClear(activeLobbyId);
      return;
    }
    clearLocalCanvas();
  }, [activeLobbyId, clearLocalCanvas]);

  const undoCanvas = useCallback(() => {
    if (!historyRef.current.length) return;

    if (activeLobbyId) {
      emitCanvasUndo(activeLobbyId);
      return;
    }

    historyRef.current = historyRef.current.slice(0, -1);
    repaintRef.current();
    markHistoryChanged();
  }, [activeLobbyId]);

  useEffect(() => {
    setCanvasControlActions?.({
      canUndo: historyRef.current.length > 0,
      undo: undoCanvas,
      clear: clearCanvas,
    });

    return () => {
      setCanvasControlActions?.({
        canUndo: false,
        undo: () => {},
        clear: () => {},
      });
    };
  }, [clearCanvas, historyVersion, setCanvasControlActions, undoCanvas]);

  useEffect(() => {
    const handleUndoShortcut = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isTyping =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;

      if (isTyping || (!e.ctrlKey && !e.metaKey) || e.key.toLowerCase() !== "z") return;
      e.preventDefault();
      undoCanvas();
    };

    window.addEventListener("keydown", handleUndoShortcut);
    return () => window.removeEventListener("keydown", handleUndoShortcut);
  }, [undoCanvas]);




  //keyboard control
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (tool !== "shape" || !previewPos) return;

      const step = e.shiftKey ? 25 : 5; // Schneller mit Shift
      let newX = previewPos.x;
      let newY = previewPos.y;

      if (e.key === "ArrowUp")    newY -= step;
      if (e.key === "ArrowDown")  newY += step;
      if (e.key === "ArrowLeft")  newX -= step;
      if (e.key === "ArrowRight") newX += step;
      
      if (e.key === "Enter") {
        confirmPlacement(newX, newY);
      }
      if (e.key === "Escape") {
        setPreviewPos(null); // Abbrechen
      }

      setPreviewPos({ x: newX, y: newY });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [previewPos, tool, activeShape]);






  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    const container = canvas.parentElement!;
    const getLogicalSize = () => ({
      width: Math.max(1, container.clientWidth),
      height: Math.max(1, container.clientHeight),
    });
    const fitCanvasToContainer = () => {
      const { width, height } = getLogicalSize();
      const ratio = Math.max(1, window.devicePixelRatio || 1);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    fitCanvasToContainer();

    // Zeichnet eine geladene PBN-Vorlage zentriert/eingepasst auf den Canvas.
    const drawPbn = (img: HTMLImageElement) => {
      const { width, height } = getLogicalSize();
      const scale = Math.min(width / img.width, height / img.height);
      const w = img.width * scale;
      const h = img.height * scale;
      const x = (width - w) / 2;
      const y = (height - h) / 2;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, x, y, w, h);
    };

    // Baut den Canvas komplett aus dem gehaltenen Zustand neu auf.
    const repaint = () => {
      const { width, height } = getLogicalSize();
      ctx.clearRect(0, 0, width, height);
      if (pbnImageRef.current) drawPbn(pbnImageRef.current);
      historyRef.current.forEach((ev) => renderEvent(ctx, ev));
    };
    repaintRef.current = repaint;

    // Resize Observer damit Canvas bei Größenänderung mitgeht.
    // Hinweis: canvas.width/height neu zu setzen LEERT das Bitmap, deshalb
    // zeichnen wir aus historyRef neu, statt das alte Bitmap zu kopieren
    // (getImageData/putImageData würde beim Verkleinern abschneiden).
    const ro = new ResizeObserver(() => {
      fitCanvasToContainer();
      repaint();
    });
    ro.observe(container);


    // LIVE ZEICHNEN VON ANDEREN
    onDraw((data) => {
      historyRef.current.push(data);
      renderEvent(ctx, data);
      markHistoryChanged();
    });

    // HISTORY LADEN
    onCanvasSync((history) => {
      historyRef.current = [...history];
      pbnImageRef.current = null;
      repaint();
      markHistoryChanged();
    });

    // PAINT-BY-NUMBERS Vorlage auf den Canvas legen
    const handlePBNReady = (result: PBNResult) => {
      const img = new Image();
      img.onload = () => {
        pbnImageRef.current = img;
        const { width, height } = getLogicalSize();
        ctx.clearRect(0, 0, width, height);
        drawPbn(img);
        markHistoryChanged();
      };
      img.src = toPngDataUrl(result.pbn_template);
    };
    onPBNReady(handlePBNReady);

    return () => {
      ro.disconnect();
      offDraw();
      offCanvasSync();
      offPBNReady(handlePBNReady);
    };
  }, []); // Wichtig: Leeres Array, damit Listener nur 1x registriert werden






  return (

    <div
      style={{ position: 'relative', width: '100%', height: '100%', cursor: tool === 'shape' ? 'none' : 'crosshair' }}
      onContextMenu={handleContextMenu}
    >

    {!hideSaveButton && <SaveDrawing getThumbnail={makeThumbnail} />}

    <canvas
      ref={canvasRef}
      style={{ touchAction: "none", backgroundColor: "#ffffff", display: 'block', width:'100%', height:'100%',
        backgroundImage: showGrid 
        ? `linear-gradient(to right, #f84040 1px, transparent 1px), 
          linear-gradient(to bottom, #d72929 1px, transparent 1px)`
        : 'none',
      backgroundSize: '40px 40px', // Größe der Quadrate
       }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={endDraw}
      onMouseLeave={endDraw}
      onTouchStart={(e) => startDraw(e.nativeEvent)}
      onTouchMove={(e) => draw(e.nativeEvent)}
      onTouchEnd={endDraw}
    />

    {paletteMenuPos && pbnPalette?.length > 0 && (
      <div
        role="menu"
        aria-label="Farbpalette"
        onKeyDown={handlePaletteKeyDown}
        style={{
          position: "absolute",
          left: Math.max(8, paletteMenuPos.x),
          top: Math.max(8, paletteMenuPos.y),
          zIndex: 90,
          width: 212,
          maxHeight: 220,
          overflowY: "auto",
          padding: 10,
          border: "1px solid rgba(0,0,0,0.12)",
          borderRadius: 8,
          background: "#ffffff",
          boxShadow: "0 18px 44px rgba(15,23,42,0.22)",
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 8,
        }}
      >
        {pbnPalette.map((entry: { index: number; color: { r: number; g: number; b: number } }, index: number) => {
          const css = pbnColorToCss(entry.color);
          return (
            <button
              key={entry.index}
              ref={(el) => {
                paletteButtonRefs.current[index] = el;
              }}
              type="button"
              role="menuitem"
              tabIndex={index === paletteFocusIndex ? 0 : -1}
              aria-label={`Farbe ${entry.index} auswählen`}
              onFocus={() => setPaletteFocusIndex(index)}
              onClick={() => {
                setCurrentColor(css);
                setPaletteMenuPos(null);
              }}
              style={{
                aspectRatio: "1 / 1",
                border: currentColor === css ? "3px solid #111827" : "1px solid rgba(0,0,0,0.14)",
                borderRadius: 8,
                background: css,
                color: swatchTextColor(entry.color),
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              {entry.index}
            </button>
          );
        })}
      </div>
    )}

    {/* DER GHOST (HTML-Vorschau) */}
    {tool === "shape" && activeShape && previewPos && (
      <div style={{
        position: 'absolute',
        left: previewPos.x,
        top: previewPos.y,
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        opacity: 0.5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {currentStickerObj?.isImage ? (
          <img src={currentStickerObj.icon} style={{ width: stickerSize, height: stickerSize }} alt="preview" />
        ) : (
          <span style={{ fontSize: `${stickerSize}px` }}>{currentStickerObj?.icon}</span>
        )}
      </div>
    )}

  </div>

  );








}

