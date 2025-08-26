"use client"

import React from "react"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, X, ChevronDown } from "lucide-react"
import type { Comment, User as UserType } from "@/lib/types/comments"

interface CommentSearchProps {
  comments: Comment[]
  onFilteredCommentsChange: (comments: Comment[]) => void
  users: UserType[]
}

interface SearchFilters {
  query: string
  author: string
  dateRange: string
  status: string
}

export function CommentSearch({ comments, onFilteredCommentsChange, users }: CommentSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    author: "",
    dateRange: "",
    status: "",
  })
  const [showAdvanced, setShowAdvanced] = useState(false)

  const filteredComments = useMemo(() => {
    const safeComments = Array.isArray(comments) ? comments : []
    let filtered = [...safeComments]

    // Text search
    if (filters.query) {
      const query = filters.query.toLowerCase()
      filtered = filtered.filter(
        (comment) =>
          comment.content.toLowerCase().includes(query) ||
          comment.author.name.toLowerCase().includes(query) ||
          comment.author.email.toLowerCase().includes(query),
      )
    }

    if (filters.author && filters.author !== "" && filters.author !== "any") {
      filtered = filtered.filter((comment) => comment.authorId === filters.author)
    }

    // Date range filter
    if (filters.dateRange && filters.dateRange !== "" && filters.dateRange !== "any") {
      const now = new Date()
      const cutoffDate = new Date()

      switch (filters.dateRange) {
        case "today":
          cutoffDate.setHours(0, 0, 0, 0)
          break
        case "week":
          cutoffDate.setDate(now.getDate() - 7)
          break
        case "month":
          cutoffDate.setMonth(now.getMonth() - 1)
          break
      }

      filtered = filtered.filter((comment) => comment.createdAt >= cutoffDate)
    }

    if (filters.status && filters.status !== "" && filters.status !== "any") {
      filtered = filtered.filter((comment) => comment.status === filters.status)
    }

    return filtered
  }, [comments, filters])

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
  }

  const clearFilters = () => {
    setFilters({
      query: "",
      author: "",
      dateRange: "",
      status: "",
    })
  }

  const activeFilterCount = Object.values(filters).filter(
    (value) => value !== "" && value !== "any"
  ).length

  // Update parent component when filtered comments change
  React.useEffect(() => {
    onFilteredCommentsChange(filteredComments)
  }, [filteredComments, onFilteredCommentsChange])

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search comments, authors, or content..."
            value={filters.query}
            onChange={(e) => handleFilterChange("query", e.target.value)}
            className="pl-10 h-9"
          />
        </div>
        <Button variant="outline" size="sm" onClick={() => setShowAdvanced(!showAdvanced)} className="h-9 px-3">
          <Filter className="h-4 w-4 mr-1" />
          Filters
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-xs">
              {activeFilterCount}
            </Badge>
          )}
          <ChevronDown className={`h-3 w-3 ml-1 transition-transform ${showAdvanced ? "rotate-180" : ""}`} />
        </Button>
        {activeFilterCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-9 px-2">
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {showAdvanced && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-muted/30 rounded-lg border">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Author</label>
            <Select value={filters.author} onValueChange={(value) => handleFilterChange("author", value)}>
              <SelectTrigger className="h-8">
                <SelectValue placeholder="Any author" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any author</SelectItem>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Date Range</label>
            <Select value={filters.dateRange} onValueChange={(value) => handleFilterChange("dateRange", value)}>
              <SelectTrigger className="h-8">
                <SelectValue placeholder="Any time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">Past week</SelectItem>
                <SelectItem value="month">Past month</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Status</label>
            <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
              <SelectTrigger className="h-8">
                <SelectValue placeholder="Any status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="deleted">Deleted</SelectItem>
                <SelectItem value="hidden">Hidden</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {filteredComments.length} of {Array.isArray(comments) ? comments.length : 0} comments
        </span>
        {activeFilterCount > 0 && <span className="text-primary font-medium">Filtered</span>}
      </div>
    </div>
  )
}
