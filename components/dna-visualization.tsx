"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { HLAProfile, MatchResult } from "@/lib/types"
import { Dna, Eye, EyeOff } from "lucide-react"

interface DNAVisualizationProps {
  recipientHLA: HLAProfile
  match: MatchResult
}

export function DNAVisualization({ recipientHLA, match }: DNAVisualizationProps) {
  const [animationEnabled, setAnimationEnabled] = useState(true)
  const [selectedLocus, setSelectedLocus] = useState<keyof HLAProfile>("HLA-A")

  const loci = Object.keys(recipientHLA) as (keyof HLAProfile)[]

  const getMatchType = (
    recipientAlleles: [string, string],
    donorAlleles: [string, string],
  ): "exact" | "partial" | "mismatch" => {
    if (
      (recipientAlleles[0] === donorAlleles[0] && recipientAlleles[1] === donorAlleles[1]) ||
      (recipientAlleles[0] === donorAlleles[1] && recipientAlleles[1] === donorAlleles[0])
    ) {
      return "exact"
    }

    if (donorAlleles.includes(recipientAlleles[0]) || donorAlleles.includes(recipientAlleles[1])) {
      return "partial"
    }

    return "mismatch"
  }

  const getMatchColor = (matchType: "exact" | "partial" | "mismatch") => {
    switch (matchType) {
      case "exact":
        return "text-green-600 bg-green-50 border-green-200"
      case "partial":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "mismatch":
        return "text-red-600 bg-red-50 border-red-200"
    }
  }

  return (
    <div className="space-y-6">
      {/* DNA Helix Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Dna className="h-5 w-5 text-blue-500" />
              <span>HLA Compatibility Analysis</span>
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAnimationEnabled(!animationEnabled)}
              className="flex items-center space-x-2"
            >
              {animationEnabled ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              <span>{animationEnabled ? "Disable" : "Enable"} Animation</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{match.matchDetails.exactMatches}</div>
              <p className="text-sm text-muted-foreground">Exact Matches</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600">{match.matchDetails.partialMatches}</div>
              <p className="text-sm text-muted-foreground">Partial Matches</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">{match.matchDetails.mismatches}</div>
              <p className="text-sm text-muted-foreground">Mismatches</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interactive HLA Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>HLA Locus Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedLocus} onValueChange={(value) => setSelectedLocus(value as keyof HLAProfile)}>
            <TabsList className="grid w-full grid-cols-6">
              {loci.map((locus) => {
                const matchType = getMatchType(recipientHLA[locus], match.donor.hlaProfile[locus])
                return (
                  <TabsTrigger key={locus} value={locus} className="text-xs">
                    <div className="flex items-center space-x-1">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          matchType === "exact"
                            ? "bg-green-500"
                            : matchType === "partial"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        }`}
                      />
                      <span>{locus.split("-")[1]}</span>
                    </div>
                  </TabsTrigger>
                )
              })}
            </TabsList>

            {loci.map((locus) => {
              const recipientAlleles = recipientHLA[locus]
              const donorAlleles = match.donor.hlaProfile[locus]
              const matchType = getMatchType(recipientAlleles, donorAlleles)

              return (
                <TabsContent key={locus} value={locus} className="space-y-4">
                  <div className="text-center">
                    <Badge variant="outline" className="text-lg px-4 py-2">
                      {locus}
                    </Badge>
                    <p className="text-sm text-muted-foreground mt-2">
                      {locus === "HLA-A" && "Class I MHC - Antigen presentation to CD8+ T cells"}
                      {locus === "HLA-B" && "Class I MHC - Antigen presentation to CD8+ T cells"}
                      {locus === "HLA-C" && "Class I MHC - Antigen presentation to CD8+ T cells"}
                      {locus === "HLA-DRB1" && "Class II MHC - Antigen presentation to CD4+ T cells"}
                      {locus === "HLA-DQB1" && "Class II MHC - Antigen presentation to CD4+ T cells"}
                      {locus === "HLA-DPB1" && "Class II MHC - Antigen presentation to CD4+ T cells"}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Recipient */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-center text-blue-600">Recipient</h4>
                      <div className="space-y-2">
                        {recipientAlleles.map((allele, index) => (
                          <div
                            key={index}
                            className={`p-3 rounded-lg border-2 text-center font-mono ${getMatchColor(
                              donorAlleles.includes(allele) ? "exact" : "mismatch",
                            )}`}
                          >
                            {allele}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Donor */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-center text-green-600">Donor</h4>
                      <div className="space-y-2">
                        {donorAlleles.map((allele, index) => (
                          <div
                            key={index}
                            className={`p-3 rounded-lg border-2 text-center font-mono ${getMatchColor(
                              recipientAlleles.includes(allele) ? "exact" : "mismatch",
                            )}`}
                          >
                            {allele}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Match Status */}
                  <div className="text-center">
                    <Badge
                      className={`text-lg px-6 py-2 ${
                        matchType === "exact"
                          ? "bg-green-100 text-green-800"
                          : matchType === "partial"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {matchType === "exact" && "Perfect Match"}
                      {matchType === "partial" && "Partial Match"}
                      {matchType === "mismatch" && "No Match"}
                    </Badge>
                  </div>
                </TabsContent>
              )
            })}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
