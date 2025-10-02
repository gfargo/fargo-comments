"use client";

import { useEffect } from "react";
import { track } from "@vercel/analytics/react";
import { AnalyticsEvents } from "@/lib/analytics";

/**
 * Component that sets up global error tracking for unhandled errors
 * and promise rejections. Should be mounted once at the root of the app.
 */
export function GlobalErrorTracker() {
  useEffect(() => {
    // Track unhandled errors
    const handleError = (event: ErrorEvent) => {
      track(AnalyticsEvents.REGISTRY_ERROR, {
        error_type: "unhandled_error",
        error_message: event.message,
        component: event.filename || "unknown",
        stack_trace: event.error?.stack,
        line_number: event.lineno,
        column_number: event.colno,
        timestamp: Date.now(),
      });

      console.error("Unhandled error:", event.error);
    };

    // Track unhandled promise rejections
    const handleRejection = (event: PromiseRejectionEvent) => {
      track(AnalyticsEvents.REGISTRY_ERROR, {
        error_type: "unhandled_rejection",
        error_message:
          event.reason?.message ||
          event.reason?.toString() ||
          "Unknown rejection",
        stack_trace: event.reason?.stack,
        timestamp: Date.now(),
      });

      console.error("Unhandled promise rejection:", event.reason);
    };

    // Add event listeners
    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleRejection);

    // Cleanup on unmount
    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleRejection);
    };
  }, []);

  // This component doesn't render anything
  return null;
}
