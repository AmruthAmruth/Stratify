import fs from "fs";
import path from "path";

const LOG_PATH = path.resolve(process.cwd(), "..", "debug-a9000f.log");
const INGEST =
  "http://127.0.0.1:7368/ingest/0a2e858e-c3ab-4083-9b79-8dcce7045833";

export function agentLog(
  hypothesisId: string,
  location: string,
  message: string,
  data: Record<string, unknown>,
): void {
  // #region agent log
  const payload = {
    sessionId: "a9000f",
    hypothesisId,
    location,
    message,
    data,
    timestamp: Date.now(),
  };
  try {
    fs.appendFileSync(LOG_PATH, JSON.stringify(payload) + "\n");
  } catch {
    /* ignore */
  }
  fetch(INGEST, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Debug-Session-Id": "a9000f",
    },
    body: JSON.stringify(payload),
  }).catch(() => {});
  // #endregion
}
