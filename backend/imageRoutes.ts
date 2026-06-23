import express from "express";

const router = express.Router();

type ImageResult = {
  id: number | string;
  url: string;
  alt: string;
};

async function searchPexels(query: string): Promise<ImageResult[]> {
  if (!process.env.PEXELS_API_KEY) return [];

  const response = await fetch(
    `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=9`,
    {
      headers: {
        Authorization: process.env.PEXELS_API_KEY,
      },
    }
  );

  if (!response.ok) return [];

  type PexelsResponse = {
    photos?: {
      id: number;
      alt: string;
      src: {
        medium: string;
      };
    }[];
  };

  const data = await response.json() as PexelsResponse;
  return (data.photos ?? []).map((photo) => ({
    id: photo.id,
    url: photo.src.medium,
    alt: photo.alt,
  }));
}

async function searchWikimedia(query: string): Promise<ImageResult[]> {
  const params = new URLSearchParams({
    action: "query",
    generator: "search",
    gsrsearch: `filetype:bitmap ${query}`,
    gsrnamespace: "6",
    gsrlimit: "12",
    prop: "imageinfo",
    iiprop: "url|mime",
    iiurlwidth: "500",
    format: "json",
    origin: "*",
  });

  const response = await fetch(`https://commons.wikimedia.org/w/api.php?${params.toString()}`, {
    headers: {
      "User-Agent": "RateMal/1.0 local educational project",
    },
  });

  if (!response.ok) return [];

  type CommonsResponse = {
    query?: {
      pages?: Record<string, {
        pageid: number;
        title: string;
        imageinfo?: {
          thumburl?: string;
          url?: string;
          mime?: string;
        }[];
      }>;
    };
  };

  const data = await response.json() as CommonsResponse;
  return Object.values(data.query?.pages ?? {})
    .reduce<ImageResult[]>((results, page) => {
      const info = page.imageinfo?.[0];
      if (!info || !info.mime?.startsWith("image/")) return results;
      const result: ImageResult = {
        id: `commons-${page.pageid}`,
        url: info.thumburl ?? info.url ?? "",
        alt: page.title.replace(/^File:/, "").replace(/\.[^.]+$/, ""),
      };
      if (result.url) results.push(result);
      return results;
    }, [])
    .slice(0, 9);
}

router.get("/search-images", async (req, res) => {
  const query = req.query.q as string;

  if (!query) {
    res.status(400).json({ error: "Missing query" });
    return;
  }

  try {
    const pexelsImages = await searchPexels(query);
    if (pexelsImages.length > 0) {
      res.json(pexelsImages);
      return;
    }

    const commonsImages = await searchWikimedia(query);
    res.json(commonsImages);
  } catch {
    res.status(502).json({ error: "Image search unavailable" });
  }
});

router.get("/image-data-url", async (req, res) => {
  const rawUrl = String(req.query.url ?? "");

  try {
    const parsed = new URL(rawUrl);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      res.status(400).json({ error: "Invalid image URL" });
      return;
    }

    const hostname = parsed.hostname.toLowerCase();
    if (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname.startsWith("10.") ||
      hostname.startsWith("192.168.") ||
      /^172\.(1[6-9]|2\d|3[0-1])\./.test(hostname)
    ) {
      res.status(400).json({ error: "Invalid image host" });
      return;
    }

    const response = await fetch(parsed);
    const contentType = response.headers.get("content-type") ?? "";
    if (!response.ok || !contentType.startsWith("image/")) {
      res.status(502).json({ error: "Image could not be loaded" });
      return;
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    res.json({ dataUrl: `data:${contentType};base64,${buffer.toString("base64")}` });
  } catch {
    res.status(400).json({ error: "Invalid image URL" });
  }
});

export default router;
