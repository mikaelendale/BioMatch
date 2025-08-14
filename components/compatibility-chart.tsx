"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import type { MatchResult } from "@/lib/types"
import { TrendingUp, Shield, Heart, AlertTriangle } from "lucide-react"

interface CompatibilityChartProps {
  matches: MatchResult[]
  selectedMatch?: MatchResult
}

export function CompatibilityChart({ matches, selectedMatch }: CompatibilityChartProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-500"
    if (score >= 60) return "bg-yellow-500"
    if (score >= 40) return "bg-orange-500"
    return "bg-red-500"
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent"
    if (score >= 60) return "Good"
    if (score >= 40) return "Fair"
    return "Poor"
  }

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case "low":
        return <Shield className="h-4 w-4 text-green-600" />
      case "medium":
        return <Heart className="h-4 w-4 text-yellow-600" />
      case "high":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return <Shield className="h-4 w-4 text-gray-600" />
    }
  }

  const topMatches = matches.slice(0, 10)

  return (
    <div className="space-y-6">
      {/* Overall Compatibility Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            <span>Compatibility Score Distribution</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topMatches.map((match, index) => (
              <div
                key={match.donor.id}
                className={`p-4 rounded-lg border transition-all ${
                  selectedMatch?.donor.id === match.donor.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline">#{index + 1}</Badge>
                    <span className="font-semibold">{match.donor.name}</span>
                    <div className="flex items-center space-x-1">
                      {getRiskIcon(match.riskLevel)}
                      <span className="text-sm text-muted-foreground capitalize">{match.riskLevel} Risk</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">{match.compatibilityScore}%</div>
                    <div className="text-sm text-muted-foreground">{getScoreLabel(match.compatibilityScore)}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Progress value={match.compatibilityScore} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>
                      {match.matchDetails.exactMatches} exact, {match.matchDetails.partialMatches} partial
                    </span>
                    <span>{match.matchDetails.bloodTypeCompatible ? "Blood compatible" : "Blood incompatible"}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Compatibility Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {matches.filter((m) => m.compatibilityScore >= 80).length}
            </div>
            <div className="text-sm text-muted-foreground">Excellent Matches</div>
            <div className="text-xs text-muted-foreground mt-1">≥80% compatibility</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {matches.filter((m) => m.compatibilityScore >= 60 && m.compatibilityScore < 80).length}
            </div>
            <div className="text-sm text-muted-foreground">Good Matches</div>
            <div className="text-xs text-muted-foreground mt-1">60-79% compatibility</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {matches.filter((m) => m.compatibilityScore >= 40 && m.compatibilityScore < 60).length}
            </div>
            <div className="text-sm text-muted-foreground">Fair Matches</div>
            <div className="text-xs text-muted-foreground mt-1">40-59% compatibility</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{matches.filter((m) => m.riskLevel === "low").length}</div>
            <div className="text-sm text-muted-foreground">Low Risk</div>
            <div className="text-xs text-muted-foreground mt-1">Optimal outcomes</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
