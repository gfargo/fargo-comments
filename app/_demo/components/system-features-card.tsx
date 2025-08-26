"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText } from "lucide-react"
import { systemFeatures, featureCategories, SystemFeature } from "@/app/_demo/config/system-features"
import { useState } from "react"

export function SystemFeaturesCard() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const filteredFeatures = selectedCategory 
    ? systemFeatures.filter(feature => feature.category === selectedCategory)
    : systemFeatures

  const getCategoryInfo = (category: string) => featureCategories[category as keyof typeof featureCategories]

  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          System Features
        </CardTitle>
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Comprehensive commenting system designed for modern applications
          </p>
          
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                selectedCategory === null
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-600 border-gray-300 hover:border-gray-400"
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
                    ? `${category.color} ${category.bgColor} border-current`
                    : "bg-white text-gray-600 border-gray-300 hover:border-gray-400"
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
                  <div className={`flex-shrink-0 w-10 h-10 rounded-lg ${categoryInfo.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <IconComponent className={`h-5 w-5 ${categoryInfo.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium text-gray-900 group-hover:text-gray-700 transition-colors">
                        {feature.title}
                      </h4>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${categoryInfo.color} border-current bg-transparent`}
                      >
                        {categoryInfo.name}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Feature Count */}
        <div className="mt-6 pt-6 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>
              Showing {filteredFeatures.length} of {systemFeatures.length} features
              {selectedCategory && ` in ${getCategoryInfo(selectedCategory).name}`}
            </span>
            <div className="flex items-center gap-4">
              {Object.entries(featureCategories).map(([key, category]) => {
                const count = systemFeatures.filter(f => f.category === key).length
                return (
                  <span key={key} className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${category.bgColor} ${category.color} border border-current`}></div>
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