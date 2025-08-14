"use client"

import { useState, useEffect } from "react"
import { HLAInputForm } from "@/components/hla-input-form"
import { DNAVisualization } from "@/components/dna-visualization"
import { CompatibilityChart } from "@/components/compatibility-chart"
import { DNAHelixAnimation } from "@/components/dna-helix-animation"
import { EthicalDisclaimer } from "@/components/ethical-disclaimer"
import { generateMockDonors } from "@/lib/mock-data-generator"
import { getTopMatches } from "@/lib/matching-algorithm"
import type { Recipient, MatchResult } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Heart, ArrowLeft, User, MapPin, Calendar, Activity, Dna, BarChart3, Shield } from "lucide-react"
import Link from "next/link"

export default function MatchPage() {
  const [matches, setMatches] = useState<MatchResult[] | null>(null)
  const [recipient, setRecipient] = useState<Recipient | null>(null)
  const [selectedMatch, setSelectedMatch] = useState<MatchResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [hasAcceptedDisclaimer, setHasAcceptedDisclaimer] = useState(false)

  useEffect(() => {
    const hasConsented = localStorage.getItem("biomatch-consent")
    if (hasConsented) {
      setHasAcceptedDisclaimer(true)
    }
  }, [])

  const handleDisclaimerAccept = () => {
    setHasAcceptedDisclaimer(true)
    localStorage.setItem("biomatch-consent", "true")
  }

  const handleFormSubmit = async (recipientData: Recipient) => {
    setIsLoading(true)
    setRecipient(recipientData)

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Generate mock donors and find matches
    const donors = generateMockDonors(500)
    const topMatches = getTopMatches(recipientData, donors, 15, 20)

    setMatches(topMatches)
    setSelectedMatch(topMatches[0] || null)
    setIsLoading(false)
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "high":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (!hasAcceptedDisclaimer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center space-x-3">
                <Button variant="ghost" asChild>
                  <Link href="/">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Home
                  </Link>
                </Button>
                <div className="bg-red-500 p-2 rounded-lg">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">BioMatch - Ethical Guidelines</h1>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Before You Begin</h2>
            <p className="text-lg text-gray-600">
              Please review and acknowledge these important ethical guidelines and disclaimers
            </p>
          </div>

          <EthicalDisclaimer onAccept={handleDisclaimerAccept} />
        </main>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <Card>
            <CardContent className="p-12 text-center">
              <div className="space-y-6">
                <DNAHelixAnimation compatibilityScore={75} isAnimating={true} />
                <h3 className="text-xl font-semibold">Analyzing HLA Compatibility</h3>
                <p className="text-muted-foreground">
                  Searching through donor database and calculating compatibility scores...
                </p>
                <Progress value={75} className="w-full max-w-md mx-auto" />
                <Alert className="border-yellow-200 bg-yellow-50 max-w-md mx-auto">
                  <Shield className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-800 text-sm">
                    Remember: This is an educational demonstration using synthetic data only.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (matches && recipient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Button variant="outline" asChild>
                <Link href="/match">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  New Search
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Match Results</h1>
                <p className="text-muted-foreground">
                  Found {matches.length} compatible donors for {recipient.name}
                </p>
              </div>
            </div>
            <EthicalDisclaimer onAccept={() => {}} showDialog={true} />
          </div>

          <Alert className="mb-6 border-yellow-200 bg-yellow-50">
            <Shield className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              <strong>Educational Demo:</strong> These results are for learning purposes only. Real organ matching
              requires medical professionals and clinical validation.
            </AlertDescription>
          </Alert>

          {/* Tabs for different visualization views */}
          <Tabs defaultValue="matches" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="matches" className="flex items-center space-x-2">
                <Heart className="h-4 w-4" />
                <span>Match Results</span>
              </TabsTrigger>
              <TabsTrigger value="visualization" className="flex items-center space-x-2">
                <Dna className="h-4 w-4" />
                <span>DNA Analysis</span>
              </TabsTrigger>
              <TabsTrigger value="charts" className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4" />
                <span>Compatibility Charts</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="matches" className="space-y-4">
              {/* Match Results */}
              {matches.map((match, index) => (
                <Card
                  key={match.donor.id}
                  className={`hover:shadow-md transition-all cursor-pointer ${
                    selectedMatch?.donor.id === match.donor.id ? "ring-2 ring-blue-500" : ""
                  }`}
                  onClick={() => setSelectedMatch(match)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-4">
                        {/* Donor Info */}
                        <div className="flex items-center space-x-4">
                          <div className="bg-blue-100 p-2 rounded-full">
                            <Heart className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">
                              #{index + 1} - {match.donor.name}
                            </h3>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <span className="flex items-center space-x-1">
                                <User className="h-3 w-3" />
                                <span>{match.donor.age} years old</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <MapPin className="h-3 w-3" />
                                <span>{match.donor.location}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <Calendar className="h-3 w-3" />
                                <span>Registered {match.donor.registrationDate}</span>
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Compatibility Details */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Blood Type</p>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline">{match.donor.bloodType}</Badge>
                              {match.matchDetails.bloodTypeCompatible ? (
                                <Badge className="bg-green-100 text-green-800">Compatible</Badge>
                              ) : (
                                <Badge className="bg-red-100 text-red-800">Incompatible</Badge>
                              )}
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">HLA Matches</p>
                            <p className="font-semibold">
                              {match.matchDetails.exactMatches}/12 exact, {match.matchDetails.partialMatches} partial
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Risk Level</p>
                            <Badge className={getRiskColor(match.riskLevel)}>{match.riskLevel}</Badge>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Organ</p>
                            <p className="font-semibold capitalize">{match.donor.organType}</p>
                          </div>
                        </div>
                      </div>

                      {/* DNA helix animation for each match */}
                      <div className="ml-6">
                        <DNAHelixAnimation
                          compatibilityScore={match.compatibilityScore}
                          isAnimating={selectedMatch?.donor.id === match.donor.id}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {matches.length === 0 && (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Activity className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No Compatible Donors Found</h3>
                    <p className="text-muted-foreground">
                      No donors meet the minimum compatibility threshold. Consider expanding search criteria or checking
                      with additional donor registries.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="visualization">
              {/* DNA visualization tab */}
              {selectedMatch ? (
                <DNAVisualization recipientHLA={recipient.hlaProfile} match={selectedMatch} />
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Dna className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Select a Match to View DNA Analysis</h3>
                    <p className="text-muted-foreground">
                      Click on a match result to see detailed HLA compatibility visualization.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="charts">
              {/* Compatibility charts tab */}
              <CompatibilityChart matches={matches} selectedMatch={selectedMatch} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" asChild>
                <Link href="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
              <div className="bg-red-500 p-2 rounded-lg">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Find Organ Matches</h1>
            </div>
            <EthicalDisclaimer onAccept={() => {}} showDialog={true} />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Enter Recipient Information</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Provide the recipient's HLA profile and medical details to find the most compatible organ donors from our
            database.
          </p>
        </div>

        <HLAInputForm onSubmit={handleFormSubmit} />
      </main>
    </div>
  )
}
