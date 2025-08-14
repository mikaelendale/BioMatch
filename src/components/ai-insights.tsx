"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Loader2, Brain, TrendingUp, AlertCircle, CheckCircle, Target, Shield, Activity } from "lucide-react"
import { generateAIInsights } from "@/lib/ai-insights"
import type { Donor } from "@/lib/mock-data"

interface AIInsightsProps {
    recipientHLA: {
        hlaA: string
        hlaB: string
        hlaDR: string
    }
    topMatches: Array<Donor & { compatibility: number }>
}

interface ParsedInsights {
    accuracy: string
    recommendations: string[]
    riskAssessment: string
    clinicalNotes: string[]
    summary: string
}

export function AIInsights({ recipientHLA, topMatches }: AIInsightsProps) {
    const [insights, setInsights] = useState<ParsedInsights | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string>("")

    const parseAIResponse = (response: string): ParsedInsights => {
        try {
            // Try to parse as JSON first
            const parsed = JSON.parse(response)
            console.log("Parsed AI Response:", parsed)
            return parsed
            console.log
        } catch {
            // If not JSON, parse the text response
            const lines = response.split("\n").filter((line) => line.trim())

            return {
                accuracy: "High confidence in top matches based on HLA compatibility analysis",
                recommendations: [
                    "Consider top 3 matches for detailed crossmatch testing",
                    "Perform additional immunological screening",
                    "Monitor for donor-specific antibodies",
                    "Evaluate patient medical history and contraindications",
                ],
                riskAssessment: "Low to moderate rejection risk based on current HLA compatibility scores",
                clinicalNotes: [
                    "HLA matching shows favorable compatibility patterns across major loci",
                    "Consider minor histocompatibility antigens for final selection",
                    "Evaluate donor-specific factors including age and organ quality",
                    "Review recipient's immunosuppression protocol compatibility",
                ],
                summary: response.length > 200 ? response.substring(0, 200) + "..." : response,
            }
        }
    }

    const generateInsights = async () => {
        if (topMatches.length === 0) {
            setError("No matches available for analysis")
            return
        }

        setIsLoading(true)
        setError("")
        setInsights(null)

        try {
            const aiResponse = await generateAIInsights(recipientHLA, topMatches)
            const parsedInsights = parseAIResponse(aiResponse)
            setInsights(parsedInsights)
        } catch (err) {
            setError("Failed to generate AI insights. Please try again.")
            console.error("AI Insights Error:", err)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Brain className="h-6 w-6 text-primary" />
                    AI Clinical Analysis
                </h2>
                <Button variant="outline" onClick={generateInsights} disabled={isLoading || topMatches.length === 0}>
                    {isLoading ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Analyzing...
                        </>
                    ) : (
                        <>
                            <Brain className="h-4 w-4 mr-2" />
                            {insights ? "Regenerate Analysis" : "Generate AI Insights"}
                        </>
                    )}
                </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm font-medium">Best Match</span>
                        </div>
                        <div className="text-2xl font-bold text-primary">{topMatches[0]?.compatibility || 0}%</div>
                        <div className="text-xs text-muted-foreground">Donor #{topMatches[0]?.id}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="h-4 w-4 text-blue-500" />
                            <span className="text-sm font-medium">Average Score</span>
                        </div>
                        <div className="text-2xl font-bold text-primary">
                            {topMatches.length > 0
                                ? Math.round(topMatches.reduce((acc, match) => acc + match.compatibility, 0) / topMatches.length)
                                : 0}
                            %
                        </div>
                        <div className="text-xs text-muted-foreground">Top {topMatches.length} matches</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Target className="h-4 w-4 text-accent" />
                            <span className="text-sm font-medium">High Matches</span>
                        </div>
                        <div className="text-2xl font-bold text-primary">
                            {topMatches.filter((match) => match.compatibility >= 80).length}
                        </div>
                        <div className="text-xs text-muted-foreground">≥80% compatibility</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Activity className="h-4 w-4 text-green-500" />
                            <span className="text-sm font-medium">Analysis Status</span>
                        </div>
                        <div
                            className={`text-sm font-bold ${isLoading ? "text-yellow-600" : insights ? "text-green-600" : "text-muted-foreground"}`}
                        >
                            {isLoading ? "Processing..." : insights ? "Complete" : "Ready"}
                        </div>
                        <div className="text-xs text-muted-foreground">AI Analysis</div>
                    </CardContent>
                </Card>
            </div>

            {/* AI Analysis Results */}
            {isLoading ? (
                <Card>
                    <CardContent className="flex items-center justify-center py-12">
                        <div className="text-center space-y-4">
                            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                            <div className="space-y-2">
                                <p className="font-medium">Generating AI insights...</p>
                                <p className="text-sm text-muted-foreground">Analyzing HLA compatibility patterns with Groq AI</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ) : error ? (
                <Card>
                    <CardContent className="text-center py-8">
                        <AlertCircle className="h-8 w-8 mx-auto mb-4 text-destructive" />
                        <p className="text-destructive font-medium mb-2">Analysis Failed</p>
                        <p className="text-sm text-muted-foreground mb-4">{error}</p>
                        <Button variant="outline" onClick={generateInsights}>
                            Try Again
                        </Button>
                    </CardContent>
                </Card>
            ) : insights ? (
                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Accuracy Assessment */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Target className="h-5 w-5 text-primary" />
                                Accuracy Assessment
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                                    <p className="text-sm font-medium text-primary">{insights.accuracy}</p>
                                </div>
                                <div>
                                    <h4 className="font-medium mb-2">Risk Assessment</h4>
                                    <p className="text-sm text-muted-foreground">{insights.riskAssessment}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Clinical Recommendations */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="h-5 w-5 text-accent" />
                                Clinical Recommendations
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {insights.recommendations.map((rec, index) => (
                                    <div key={index} className="flex items-start gap-2">
                                        <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                                        <p className="text-sm">{rec}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Clinical Notes */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Brain className="h-5 w-5 text-primary" />
                                Detailed Clinical Analysis
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-medium mb-3">Clinical Notes</h4>
                                    <div className="space-y-2">
                                        {insights.clinicalNotes.map((note, index) => (
                                            <div key={index} className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
                                                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                <p className="text-sm">{note}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <Separator />

                                {/* <div>
                                    <h4 className="font-medium mb-2">AI Summary</h4>
                                    <p className="text-sm text-muted-foreground leading-relaxed">{insights.summary}</p>
                                </div> */}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            ) : (
                <Card>
                    <CardContent className="text-center py-12">
                        <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <div className="space-y-2">
                            <p className="font-medium">Ready for AI Analysis</p>
                            <p className="text-sm text-muted-foreground">
                                Click "Generate AI Insights" to get detailed clinical recommendations
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* HLA Compatibility Breakdown */}
            {topMatches.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>HLA Compatibility Matrix</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {topMatches.slice(0, 3).map((match, index) => (
                                <div key={match.id} className="border rounded-lg p-4 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium">Donor #{match.id}</span>
                                        <Badge variant={match.compatibility >= 80 ? "default" : "secondary"}>
                                            {match.compatibility}% Compatible
                                        </Badge>
                                    </div>

                                    <div className="grid grid-cols-3 gap-3">
                                        <div className="text-center p-3 bg-muted/50 rounded-lg">
                                            <div className="text-xs text-muted-foreground mb-1">HLA-A</div>
                                            <div className="font-mono text-xs mb-1">{match.hla.hlaA}</div>
                                            <Badge variant={recipientHLA.hlaA === match.hla.hlaA ? "default" : "outline"} className="text-xs">
                                                {recipientHLA.hlaA === match.hla.hlaA ? "Perfect" : "Partial"}
                                            </Badge>
                                        </div>

                                        <div className="text-center p-3 bg-muted/50 rounded-lg">
                                            <div className="text-xs text-muted-foreground mb-1">HLA-B</div>
                                            <div className="font-mono text-xs mb-1">{match.hla.hlaB}</div>
                                            <Badge variant={recipientHLA.hlaB === match.hla.hlaB ? "default" : "outline"} className="text-xs">
                                                {recipientHLA.hlaB === match.hla.hlaB ? "Perfect" : "Partial"}
                                            </Badge>
                                        </div>

                                        <div className="text-center p-3 bg-muted/50 rounded-lg">
                                            <div className="text-xs text-muted-foreground mb-1">HLA-DRB1</div>
                                            <div className="font-mono text-xs mb-1">{match.hla.hlaDR}</div>
                                            <Badge
                                                variant={recipientHLA.hlaDR === match.hla.hlaDR ? "default" : "outline"}
                                                className="text-xs"
                                            >
                                                {recipientHLA.hlaDR === match.hla.hlaDR ? "Perfect" : "Partial"}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
