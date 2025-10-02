"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Copy, Package, Terminal, ExternalLink, CheckCircle } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { installationConfig } from "@/app/_demo/config/installation-data"
import { OpenInV0Button } from "@/components/open-in-v0-button"
import { useAnalytics } from "@/lib/hooks/use-analytics"
import { AnalyticsEvents } from "@/lib/analytics"

export function InstallationCard() {
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null)
  const { trackEvent } = useAnalytics()

  // Map installation item names to registry file names
  const getRegistryName = (itemName: string): string => {
    const mappings: Record<string, string> = {
      "Core System": "core",
      "Comment List": "comment-list",
      "Comment Drawer": "drawer",
      "Server Actions Adapter": "adapter-server-actions",
      "API Adapter": "adapter-api",
      "TanStack Query Adapter": "adapter-tanstack-query"
    }
    return mappings[itemName] || itemName.toLowerCase().replace(/\s+/g, '-')
  }

  const copyToClipboard = async (command: string, itemName?: string) => {
    try {
      await navigator.clipboard.writeText(command)
      setCopiedCommand(command)
      setTimeout(() => setCopiedCommand(null), 2000)

      // Track copy action with enhanced metadata
      const componentName = command.split(' ')[command.split(' ').length - 1]
      const registryName = getRegistryName(itemName || 'unknown')

      trackEvent(AnalyticsEvents.INSTALLATION_COMMAND_COPIED, {
        component_name: componentName,
        demo_type: 'installation-card',
        action: 'copy',
        feature: itemName || 'unknown',
        adapter: registryName.includes('adapter') ? registryName : undefined,
      })
    } catch (err) {
      console.error('Failed to copy command:', err)
    }
  }

  return (
    <Card id="install" className="border-2 border-primary/10 rounded-2xl bg-primary/10 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5 text-primary" />
          <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Install Fargo Comments</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-2">
          Add commenting functionality to your project using our ShadcnUI-compatible component registry.
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Prerequisites */}
          <div className="bg-card/50 backdrop-blur-sm rounded-lg p-4 border border-primary/20">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Terminal className="h-4 w-4 text-primary" />
              <span className="text-primary">Prerequisites</span>
            </h4>
            <p className="text-sm text-muted-foreground mb-3">
              Ensure your project has ShadcnUI configured with proper aliases in <code className="bg-primary/10 px-1 py-0.5 rounded text-xs text-primary">components.json</code>
            </p>
            <div className="bg-muted/50 rounded p-3 font-mono text-xs">
              <div className="text-muted-foreground mb-1"># Initialize ShadcnUI (if not already done)</div>
              <div className="flex items-center justify-between">
                <span>{installationConfig.prerequisiteCommand}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(installationConfig.prerequisiteCommand, "Prerequisites")}
                  className="h-6 w-6 p-0"
                >
                  {copiedCommand === installationConfig.prerequisiteCommand ? (
                    <CheckCircle className="h-3 w-3 text-green-600" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Installation Commands */}
          <div className="bg-card/50 backdrop-blur-sm rounded-lg p-4 border border-primary/20">
            <h4 className="font-medium text-primary mb-3">Installation Commands</h4>
            <div className="space-y-3">
              {installationConfig.coreCommands.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{item.name}</span>
                    {item.required && (
                      <Badge variant="secondary" className="text-xs">Required</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                  <div className="bg-muted/50 rounded p-3 font-mono text-xs">
                    <div className="flex items-center justify-between">
                      <span className="break-all">{item.command}</span>
                      <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(item.command, item.name)}
                          className="h-6 w-6 p-0"
                        >
                          {copiedCommand === item.command ? (
                            <CheckCircle className="h-3 w-3 text-green-600" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                        <OpenInV0Button
                          name={getRegistryName(item.name)}
                          variant="ghost"
                          size="sm"
                          // className="h-6 w-6 p-0"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-card/50 backdrop-blur-sm rounded-lg p-4 border border-primary/20">
            <h4 className="font-medium text-primary mb-3">Learn More</h4>
            <div className="flex flex-wrap gap-2">
              {installationConfig.quickLinks.map((link, index) => {
                const LinkComponent = link.external ?
                  ({ children }: { children: React.ReactNode }) => (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs"
                      onClick={() => {
                        trackEvent(link.name.toLowerCase().includes('github')
                          ? AnalyticsEvents.GITHUB_CLICKED
                          : AnalyticsEvents.DOCUMENTATION_OPENED, {
                          demo_type: 'installation-card',
                          action: 'external-link',
                          feature: link.name,
                        });
                        window.open(link.url, "_blank");
                      }}
                    >
                      {children}
                    </Button>
                  ) :
                  ({ children }: { children: React.ReactNode }) => (
                    <Link
                      href={link.url}
                      onClick={() => trackEvent(AnalyticsEvents.DOCUMENTATION_OPENED, {
                        demo_type: 'installation-card',
                        action: 'internal-link',
                        feature: link.name,
                      })}
                    >
                      <Button variant="outline" size="sm" className="h-8 text-xs">
                        {children}
                      </Button>
                    </Link>
                  )

                return (
                  <LinkComponent key={index}>
                    <ExternalLink className="h-3 w-3 mr-1" />
                    {link.name}
                  </LinkComponent>
                )
              })}
            </div>
          </div>

          {/* Additional Adapters */}
          <details className="bg-card/50 backdrop-blur-sm rounded-lg border border-primary/20">
            <summary className="p-4 cursor-pointer font-medium text-primary hover:bg-primary/5 rounded-lg">
              Additional Storage Adapters
            </summary>
            <div className="px-4 pb-4 pt-0 space-y-3">
              {installationConfig.additionalAdapters.map((adapter, index) => (
                <div key={index} className="space-y-2">
                  <div className="text-sm font-medium">{adapter.name}</div>
                  <p className="text-xs text-muted-foreground">{adapter.description}</p>
                  <div className="bg-muted/50 rounded p-3 font-mono text-xs">
                    <div className="flex items-center justify-between">
                      <span>{adapter.command}</span>
                      <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(adapter.command, adapter.name)}
                          className="h-6 w-6 p-0"
                        >
                          {copiedCommand === adapter.command ? (
                            <CheckCircle className="h-3 w-3 text-green-600" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                        <OpenInV0Button
                          name={getRegistryName(adapter.name)}
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </details>
        </div>
      </CardContent>
    </Card>
  )
}