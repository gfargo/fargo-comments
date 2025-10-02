"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { track } from "@vercel/analytics/react";
import { AnalyticsEvents } from "@/lib/analytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  componentName?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

/**
 * Error boundary that catches React errors and tracks them with analytics
 */
export class AnalyticsErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Track the error with analytics
    track(AnalyticsEvents.REGISTRY_ERROR, {
      error_type: "react_error",
      error_message: error.message,
      component: this.props.componentName || "unknown",
      stack_trace: error.stack,
      component_stack: errorInfo.componentStack,
      timestamp: Date.now(),
    });

    // Log to console for debugging
    console.error("Error caught by boundary:", error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <Card className="border-2 border-destructive/20 bg-destructive/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Something went wrong
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              We encountered an error while rendering this component. The error
              has been logged and we&apos;ll look into it.
            </p>

            {process.env.NODE_ENV === "development" && this.state.error && (
              <div className="bg-muted rounded-lg p-4">
                <p className="text-xs font-mono text-destructive mb-2">
                  {this.state.error.message}
                </p>
                {this.state.error.stack && (
                  <pre className="text-xs font-mono text-muted-foreground overflow-x-auto">
                    {this.state.error.stack}
                  </pre>
                )}
              </div>
            )}

            <Button onClick={this.handleReset} variant="outline" size="sm">
              Try again
            </Button>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}
