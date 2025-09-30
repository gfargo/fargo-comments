// Debug utility for lib/comments
// Since individual plugins/components don't have direct access to config,
// we'll provide a simple debug utility they can use

let isDebugEnabled = false;

export function setDebugMode(enabled: boolean) {
  isDebugEnabled = enabled;
}

export const debug = {
  log: (...args: any[]) => {
    if (isDebugEnabled) {
      console.log("[FARGO]", ...args);
    }
  },
  error: (...args: any[]) => {
    if (isDebugEnabled) {
      console.error("[FARGO]", ...args);
    }
  },
  warn: (...args: any[]) => {
    if (isDebugEnabled) {
      console.warn("[FARGO]", ...args);
    }
  },
};