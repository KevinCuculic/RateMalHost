import { io } from "socket.io-client";

const protocol = window.location.protocol === "https:" ? "https" : "http";
const host = window.location.hostname;
const socketUrl = import.meta.env.VITE_API_URL || (host === "localhost" ? `${protocol}://${host}:3000` : undefined);

export const socket = io(socketUrl);
