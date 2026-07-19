import { CorsOptions } from "cors";

export function getAllowedOrigins(): string[] {
  const origins = [
    "https://stratify-sigma.vercel.app",
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
  ];

  const frontendUrl = process.env.FRONTEND_URL?.replace(/\/$/, "");
  if (frontendUrl && !origins.includes(frontendUrl)) {
    origins.push(frontendUrl);
  }

  return origins;     
}

export function buildCorsOptions(): CorsOptions {
  return {
    origin: getAllowedOrigins(),
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  };
}
