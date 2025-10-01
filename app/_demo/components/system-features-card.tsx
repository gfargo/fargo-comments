"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText } from "lucide-react"
import { systemFeatures, featureCategories } from "@/app/_demo/config/system-features"
import { useState } from "react"

export function SystemFeaturesCard() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const filteredFeatures = selectedCategory 
    ? systemFeatures.filter(feature => feature.category === selectedCategory)
    : systemFeatures

  const getCategoryInfo = (category: string) => featureCategories[category as keyof typeof featureCategories]

  return (
    <Card className="border-2 border-primary/10 rounded-2xl bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">System Features</span>
        </CardTitle>
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Comprehensive commenting system designed for modern applications
          </p>
          
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                selectedCategory === null
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-muted-foreground border-border hover:bg-primary/5 hover:border-primary/20"
              }`}
            >
              All Features
            </button>
            {Object.entries(featureCategories).map(([key, category]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                  selectedCategory === key
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-muted-foreground border-border hover:bg-primary/5 hover:border-primary/20"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredFeatures.map((feature, index) => {
            const categoryInfo = getCategoryInfo(feature.category)
            const IconComponent = feature.icon
            
            return (
              <div key={index} className="group">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <IconComponent className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">
                        {feature.title}
                      </h4>
                      <Badge 
                        variant="secondary" 
                        className="text-xs text-primary border-primary/20 bg-primary/10"
                      >
                        {categoryInfo.name}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Feature Count */}
        <div className="mt-6 pt-6 border-t border-border">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Showing {filteredFeatures.length} of {systemFeatures.length} features
              {selectedCategory && ` in ${getCategoryInfo(selectedCategory).name}`}
            </span>
            <div className="flex items-center gap-4">
              {Object.entries(featureCategories).map(([key, category]) => {
                const count = systemFeatures.filter(f => f.category === key).length
                return (
                  <span key={key} className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-primary/20 border border-primary"></div>
                    <span className="text-xs">{count} {category.name.toLowerCase()}</span>
                  </span>
                )
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}