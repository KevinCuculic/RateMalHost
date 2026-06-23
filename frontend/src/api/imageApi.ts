import { API_BASE } from "./config";

export const searchImages = async (query: string) => {
  const res = await fetch(
    `${API_BASE}/search-images?q=${query}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch images");
  }

  return await res.json();
};
