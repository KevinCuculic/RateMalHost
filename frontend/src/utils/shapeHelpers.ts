//drawBlob, drawStar, rendner sticker etc. 



  export type Point = { x: number; y: number };




  ///---------------------------
  // Shapes Functions
  export const createPermanentBlobShape = (
    radius = 28,
    points = 55,
    variance = 8
  ): Point[] => {
    const shape: Point[] = [];

    for (let i = 0; i < points; i++) {
      const angle = (i / points) * Math.PI * 2;
      const r = radius + (Math.random() - 0.5) * variance;

      shape.push({
        x: Math.cos(angle) * r,
        y: Math.sin(angle) * r,
      });
    }
    return shape;
  };

export const DEFAULT_BLOB = createPermanentBlobShape();



export const drawBlob = (ctx: CanvasRenderingContext2D, x: number, y: number, color: string, size: number=60) => {
  ctx.fillStyle = color;
  ctx.beginPath();
  const scale = size/ 56;

  DEFAULT_BLOB.forEach((p, i) => {
    const px = x + p.x * scale;
    const py = y + p.y* scale;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  });
  ctx.closePath();
  ctx.fill();
};




export const drawStar = (ctx: CanvasRenderingContext2D, x: number, y: number, color: string, size: number =60) => {
  ctx.fillStyle = color;
  ctx.beginPath();
  const radius= size/ 2;
  const innerRadius = size/ 5;
  for (let i = 0; i < 5; i++) {
    ctx.lineTo(Math.cos((18 + i * 72) / 180 * Math.PI) * radius + x,
               -Math.sin((18 + i * 72) / 180 * Math.PI) * radius + y);
    ctx.lineTo(Math.cos((54 + i * 72) / 180 * Math.PI) * innerRadius + x,
               -Math.sin((54 + i * 72) / 180 * Math.PI) * innerRadius + y);
  }
  ctx.closePath();
  ctx.fill();
};



export const drawHeart = (ctx: CanvasRenderingContext2D, x: number, y: number, color: string, size: number = 60) => {
  ctx.fillStyle = color;
  ctx.beginPath();
  
  // Wir bewegen uns zur oberen Mitte des Herzens und zeichnen zwei Bezier-Kurven
  const d = size / 2;
  ctx.moveTo(x, y - d / 4);
  // Linke Herzhälfte
  ctx.bezierCurveTo(x - d / 2, y - d, x - d, y - d / 3, x, y + d / 2);
  // Rechte Herzhälfte
  ctx.bezierCurveTo(x + d, y - d / 3, x + d / 2, y - d, x, y - d / 4);
  
  ctx.closePath();
  ctx.fill();
};


export const drawPolygon = (ctx: CanvasRenderingContext2D, x: number, y: number, color: string, size: number = 60, sides: number = 6) => {
  ctx.fillStyle = color;
  ctx.beginPath();
  
  // Multiplikator (0.85), damit die Form optisch der Bounding-Box eines Emojis entspricht
  const radius = (size * 0.85) / 2; 
  
  for (let i = 0; i < sides; i++) {
    const angle = (i * 2 * Math.PI) / sides - Math.PI / 2;
    ctx.lineTo(x + radius * Math.cos(angle), y + radius * Math.sin(angle));
  }
  ctx.closePath();
  ctx.fill();
};



export const drawTriangle = (ctx: CanvasRenderingContext2D, x: number, y: number, color: string, size: number = 60) => {
  ctx.fillStyle = color;
  ctx.beginPath();
  
  // Optischer Skalierungsfaktor, damit es zum Ghost passt
  const s = size * 0.85; 
  
  // Berechnung basierend auf dem echten geometrischen Schwerpunkt:
  const height = s * (Math.sqrt(3) / 2);
  const up = height * (2 / 3);   // Abstand zur oberen Spitze
  const down = height * (1 / 3); // Abstand zur Basis
  
  ctx.moveTo(x, y - up);             // Obere Spitze
  ctx.lineTo(x - s / 2, y + down);   // Unten links
  ctx.lineTo(x + s / 2, y + down);   // Unten rechts
  
  ctx.closePath();
  ctx.fill();
};



//----------------------------------
//-----------------------------


export const drawImageSticker = (
  ctx: CanvasRenderingContext2D, 
  x: number, 
  y: number, 
  color: string, // color wird hier ignoriert, da das Bild eigene Farben hat
  src: string,
  size: number =60
) => {
  const img = new Image();
  img.src = src;
  img.onload = () => {
    // Zentriert zeichnen: x - size/2
    ctx.drawImage(img, x - size / 2, y - size / 2, size, size);
  };
};



// central Mapper
export const SHAPE_RENDERERS: Record<string, Function> = {

  blob: drawBlob,
  star: drawStar,
  heart: drawHeart,
  hexagon: (ctx: any, x: any, y: any, color: any, size: any) => drawPolygon(ctx, x, y, color, size, 6), // 6 Ecken
  triangle: drawTriangle,
  square: (ctx: any, x: any, y: any, color: any, size: any) => {
    ctx.fillStyle = color;
    // Leicht verkleinert (size * 0.75), damit das Quadrat nicht massiv größer wirkt als runde Emojis
    const s = size * 0.75; 
    ctx.fillRect(x - s / 2, y - s / 2, s, s);
  },
  circle: (ctx: any, x: any, y: any, color: any, size: any) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    // Nutzt radius basierend auf angepasster Größe
    ctx.arc(x, y, (size * 0.8) / 2, 0, Math.PI * 2);
    ctx.fill();
  },

  
  // Für Bild-Sticker (tree2):
  tree2: (ctx: any, x: any, y: any, color: any, size: any) => drawImageSticker(ctx, x, y, color, '/sticker/tree.png', size),
  
};






//-----------------------------------------------------
//render sticker from canvas to cleaner version

export const renderSticker = (
  ctx: CanvasRenderingContext2D,
  id: string,
  x: number,
  y: number,
  size: number,
  allStickers: any[], // List of Sticker 
  currentColor?: string
) => {
  //  Check for SHAPE_RENDERERS (mathematische Formen)
  if (SHAPE_RENDERERS[id]) {
    SHAPE_RENDERERS[id](ctx, x, y, currentColor || ctx.fillStyle, size); // Farbe ggf. aus Context
    return;
  }


  // search in Sticker-Liste
  const sticker = allStickers.find(s => s.id === id);
  if (!sticker) return;

  if (sticker.isImage || sticker.icon.startsWith("data:") || sticker.icon.startsWith("/")) {
    const img = new Image();
    img.src = sticker.icon;
    img.onload = () => {
      ctx.drawImage(img, x - size / 2, y - size / 2, size, size);
    };
  } else {
    // Emoji
    ctx.font = `${size}px serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(sticker.icon, x, y + (size * 0.1));
  }
};






