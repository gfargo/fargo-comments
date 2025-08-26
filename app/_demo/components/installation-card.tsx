"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Copy, Package, Terminal, ExternalLink, CheckCircle } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { installationConfig } from "@/app/_demo/config/installation-data"

export function InstallationCard() {
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null)

  const copyToClipboard = async (command: string) => {
    try {
      await navigator.clipboard.writeText(command)
      setCopiedCommand(command)
      setTimeout(() => setCopiedCommand(null), 2000)
    } catch (err) {
      console.error('Failed to copy command:', err)
    }
  }

  return (
    <Card id="install" className="border border-blue-200 shadow-sm bg-blue-50/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5 text-blue-600" />
          Install Okayd Comments
        </CardTitle>
        <p className="text-sm text-gray-600 mt-2">
          Add commenting functionality to your project using our ShadcnUI-compatible component registry.
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Prerequisites */}
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
              <Terminal className="h-4 w-4" />
              Prerequisites
            </h4>
            <p className="text-sm text-gray-600 mb-3">
              Ensure your project has ShadcnUI configured with proper aliases in <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">components.json</code>
            </p>
            <div className="bg-gray-50 rounded p-3 font-mono text-xs">
              <div className="text-gray-500 mb-1"># Initialize ShadcnUI (if not already done)</div>
              <div className="flex items-center justify-between">
                <span>{installationConfig.prerequisiteCommand}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(installationConfig.prerequisiteCommand)}
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
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h4 className="font-medium text-gray-900 mb-3">Installation Commands</h4>
            <div className="space-y-3">
              {installationConfig.coreCommands.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{item.name}</span>
                    {item.required && (
                      <Badge variant="secondary" className="text-xs">Required</Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-600">{item.description}</p>
                  <div className="bg-gray-50 rounded p-3 font-mono text-xs">
                    <div className="flex items-center justify-between">
                      <span className="break-all">{item.command}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(item.command)}
                        className="h-6 w-6 p-0 flex-shrink-0 ml-2"
                      >
                        {copiedCommand === item.command ? (
                          <CheckCircle className="h-3 w-3 text-green-600" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h4 className="font-medium text-gray-900 mb-3">Learn More</h4>
            <div className="flex flex-wrap gap-2">
              {installationConfig.quickLinks.map((link, index) => {
                const LinkComponent = link.external ? 
                  ({ children }: { children: React.ReactNode }) => (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs"
                      onClick={() => window.open(link.url, "_blank")}
                    >
                      {children}
                    </Button>
                  ) :
                  ({ children }: { children: React.ReactNode }) => (
                    <Link href={link.url}>
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
          <details className="bg-white rounded-lg border border-gray-200">
            <summary className="p-4 cursor-pointer font-medium text-gray-900 hover:bg-gray-50 rounded-lg">
              Additional Storage Adapters
            </summary>
            <div className="px-4 pb-4 pt-0 space-y-3">
              {installationConfig.additionalAdapters.map((adapter, index) => (
                <div key={index} className="space-y-2">
                  <div className="text-sm font-medium">{adapter.name}</div>
                  <p className="text-xs text-gray-600">{adapter.description}</p>
                  <div className="bg-gray-50 rounded p-3 font-mono text-xs">
                    <div className="flex items-center justify-between">
                      <span>{adapter.command}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(adapter.command)}
                        className="h-6 w-6 p-0"
                      >
                        {copiedCommand === adapter.command ? (
                          <CheckCircle className="h-3 w-3 text-green-600" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
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