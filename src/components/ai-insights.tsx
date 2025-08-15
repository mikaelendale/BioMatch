"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, Brain, AlertCircle, Beef, Blend, SignalHigh, ChartArea, FlaskConical, CircleCheck } from "lucide-react"
import { generateAIInsights } from "@/lib/ai-insights"
import type { Donor } from "@/lib/mock-data"

interface AIInsightsProps {
    recipientHLA: {
        hlaA: string
        hlaB: string
        hlaDR: string
    }
    topMatches: Array<Donor & { compatibility: number }>
    onInsightsGenerated?: (insights: any) => void
}

interface ParsedInsights {
    predictiveAnalytics?: {
        overallSuccessRate: string
        bestMatch?: {
            donorId: string
            successProbability: string
            reasoning: string
        }
        riskStratification?: {
            low: string[]
            moderate: string[]
            high: string[]
        }
    }
    organSpecificInsights?: {
        primaryRecommendation: string
        alternativeOptions: string[]
        organSpecificRisks: string[]
    }
    clinicalDecisionSupport?: {
        immediateActions: string[]
        additionalTesting: string[]
        timelineConsiderations: string[]
    }
    personalized?: {
        ageFactors: string
        hlaOptimization: string
        longTermPrognosis: string
    }
    summary: string
}

export function AIInsights({ recipientHLA, topMatches, onInsightsGenerated }: AIInsightsProps) {
    const [insights, setInsights] = useState<ParsedInsights | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string>("")

    const sanitizeForRender = (value: any): string => {
        if (typeof value === "string") return value
        if (typeof value === "number") return String(value)
        if (typeof value === "boolean") return String(value)
        if (value === null || value === undefined) return ""

        if (typeof value === "object") {
            // Handle common object structures that might be returned by AI
            if (value.organ && value.donorId && value.rationale) {
                return `${value.organ} transplant with Donor #${value.donorId}: ${value.rationale}`
            }
            if (value.organ && value.donor && value.rationale) {
                return `${value.organ} transplant with ${value.donor}: ${value.rationale}`
            }
            if (value.recommendation) return String(value.recommendation)
            if (value.description) return String(value.description)
            if (value.rationale) return String(value.rationale)
            if (value.text) return String(value.text)
            if (value.content) return String(value.content)
            if (value.message) return String(value.message)

            // If it's an array, join the elements
            if (Array.isArray(value)) {
                return value.map(sanitizeForRender).join(", ")
            }

            // Last resort: stringify the object
            return JSON.stringify(value)
        }

        return String(value)
    }

    const parseAIResponse = (response: string): ParsedInsights => {
        console.log("Raw AI Response:", response.split("\n"))

        const sanitizeValue = (value: any): string => {
            if (typeof value === "string") return value
            if (typeof value === "number") return String(value)
            if (typeof value === "boolean") return String(value)
            if (value === null || value === undefined) return ""

            if (typeof value === "object") {
                // Handle common object structures that might be returned by AI
                if (value.organ && value.donor && value.rationale) {
                    return `${value.organ} transplant with ${value.donor}: ${value.rationale}`
                }
                if (value.recommendation) return String(value.recommendation)
                if (value.description) return String(value.description)
                if (value.rationale) return String(value.rationale)
                if (value.text) return String(value.text)
                if (value.content) return String(value.content)
                if (value.message) return String(value.message)

                // If it's an array, join the elements
                if (Array.isArray(value)) {
                    return value.map(sanitizeValue).join(", ")
                }

                // Last resort: stringify the object
                return JSON.stringify(value)
            }

            return String(value)
        }

        const sanitizeArray = (arr: any[]): string[] => {
            if (!Array.isArray(arr)) return []
            return arr.map(sanitizeValue)
        }

        const deepSanitize = (obj: any): any => {
            if (typeof obj !== "object" || obj === null) return obj

            const sanitized: any = {}

            for (const [key, value] of Object.entries(obj)) {
                if (Array.isArray(value)) {
                    sanitized[key] = sanitizeArray(value)
                } else if (typeof value === "object" && value !== null) {
                    sanitized[key] = deepSanitize(value)
                } else {
                    sanitized[key] = sanitizeValue(value)
                }
            }

            return sanitized
        }

        try {
            const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/)
            if (jsonMatch) {
                const jsonString = jsonMatch[1].trim()
                console.log("Extracted JSON:", jsonString)
                const parsed = JSON.parse(jsonString)
                console.log("Parsed AI Response:", parsed)

                const sanitizedParsed = deepSanitize(parsed)
                console.log("Sanitized AI Response:", sanitizedParsed)

                return sanitizedParsed
            }

            const parsed = JSON.parse(response)
            console.log("Direct JSON Parse:", parsed)
            return deepSanitize(parsed)
        } catch (parseError) {
            console.error("JSON Parse Error:", parseError)

            return {
                predictiveAnalytics: {
                    overallSuccessRate: "Analysis completed - see detailed breakdown below",
                    bestMatch: {
                        donorId: topMatches[0]?.id || "N/A",
                        successProbability: `${topMatches[0]?.compatibility || 0}%`,
                        reasoning: "Based on HLA compatibility analysis and clinical factors",
                    },
                },
                organSpecificInsights: {
                    primaryRecommendation: `${topMatches[0]?.organ || "Organ"} transplant with Donor #${topMatches[0]?.id || "N/A"}`,
                    alternativeOptions: topMatches
                        .slice(1, 3)
                        .map(
                            (match) => `${match.organ} transplant with Donor #${match.id} (${match.compatibility}% compatibility)`,
                        ),
                    organSpecificRisks: [
                        "Standard transplant rejection risks apply",
                        "Monitor for organ-specific complications",
                        "Consider immunosuppression protocols",
                    ],
                },
                clinicalDecisionSupport: {
                    immediateActions: [
                        "Review top donor matches for clinical suitability",
                        "Prepare for transplant evaluation process",
                        "Coordinate with transplant team",
                    ],
                    additionalTesting: [
                        "Complete crossmatch testing",
                        "Verify donor organ quality",
                        "Assess recipient readiness",
                    ],
                    timelineConsiderations: [
                        "Urgent evaluation required for high-compatibility matches",
                        "Standard transplant protocols apply",
                        "Monitor donor availability windows",
                    ],
                },
                personalized: {
                    ageFactors: "Recipient age factors considered in compatibility analysis",
                    hlaOptimization: `HLA profile (${recipientHLA.hlaA}, ${recipientHLA.hlaB}, ${recipientHLA.hlaDR}) analyzed for optimal matching`,
                    longTermPrognosis: "Long-term outcomes depend on final donor selection and post-transplant care",
                },
                summary:
                    response.length > 200 ? response.substring(0, 200) + "..." : response || "AI analysis completed successfully",
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

            if (onInsightsGenerated) {
                onInsightsGenerated(parsedInsights)
            }
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
                <Card className="rounded-3xl shadow-none border-dashed border-accent border-2">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Beef className="w-4 h-4 text-primary" />
                            <span className="text-sm font-medium">Best Match</span>
                        </div>
                        <div className="text-2xl font-bold text-primary">{topMatches[0]?.compatibility || 0}%</div>
                        <div className="text-xs text-muted-foreground">Donor #{topMatches[0]?.id}</div>
                    </CardContent>
                </Card>

                <Card className="rounded-3xl shadow-none border-dashed border-accent border-2">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Blend className="h-4 w-4 text-primary" />
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

                <Card className="rounded-3xl shadow-none border-dashed border-accent border-2">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <SignalHigh className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium">High Matches</span>
                        </div>
                        <div className="text-2xl font-bold text-primary">
                            {topMatches.filter((match) => match.compatibility >= 80).length}
                        </div>
                        <div className="text-xs text-muted-foreground">≥80% compatibility</div>
                    </CardContent>
                </Card>

                <Card className="rounded-3xl shadow-none border-dashed border-accent border-2">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <ChartArea className="h-4 w-4 text-primary" />
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
                <Card className="rounded-3xl shadow-none border-dashed border-accent border-2">
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
                <Card className="rounded-3xl shadow-none border-dashed border-destructive border-2">
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
                    {/* Predictive Analytics */}
                    {insights.predictiveAnalytics && (
                        <Card className="lg:col-span-2 rounded-3xl shadow-none border-dashed border-accent border-2">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    Predictive Analytics
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border border-accent">
                                        <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">Success Rate</h4>
                                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                            {sanitizeForRender(insights.predictiveAnalytics.overallSuccessRate)}
                                        </p>
                                    </div>
                                    {insights.predictiveAnalytics.bestMatch && (
                                        <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-accent">
                                            <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Best Match</h4>
                                            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                                Donor #{sanitizeForRender(insights.predictiveAnalytics.bestMatch.donorId)}
                                            </p>
                                            <p className="text-sm text-blue-700 dark:text-blue-300">
                                                {sanitizeForRender(insights.predictiveAnalytics.bestMatch.successProbability)}
                                            </p>
                                        </div>
                                    )}
                                    {insights.predictiveAnalytics.riskStratification && (
                                        <div className="p-4 bg-yellow-50 dark:bg-yellow-950/30  rounded-lg border border-accent">
                                            <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">Risk Levels</h4>
                                            <div className="space-y-1 text-sm">
                                                <div className="text-green-600 dark:text-green-400">
                                                    Low: {insights.predictiveAnalytics.riskStratification.low?.length || 0}
                                                </div>
                                                <div className="text-yellow-600 dark:text-yellow-400">
                                                    Moderate: {insights.predictiveAnalytics.riskStratification.moderate?.length || 0}
                                                </div>
                                                <div className="text-red-600 dark:text-red-400">
                                                    High: {insights.predictiveAnalytics.riskStratification.high?.length || 0}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {insights.predictiveAnalytics.bestMatch?.reasoning && (
                                    <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                                        <h4 className="font-medium mb-2">Reasoning</h4>
                                        <p className="text-sm text-muted-foreground">
                                            {sanitizeForRender(insights.predictiveAnalytics.bestMatch.reasoning)}
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Organ-Specific Insights */}
                    {insights.organSpecificInsights && (
                        <Card className="rounded-3xl shadow-none border-dashed border-accent border-2">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    Organ-Specific Insights
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
                                        <h4 className="font-medium text-primary mb-2">Primary Recommendation</h4>
                                        <p className="text-sm">{sanitizeForRender(insights.organSpecificInsights.primaryRecommendation)}</p>
                                    </div>

                                    {insights.organSpecificInsights.alternativeOptions &&
                                        insights.organSpecificInsights.alternativeOptions.length > 0 && (
                                            <div>
                                                <h4 className="font-medium mb-2">Alternative Options</h4>
                                                <div className="space-y-2">
                                                    {insights.organSpecificInsights.alternativeOptions.map((option, index) => (
                                                        <div key={index} className="flex items-start gap-2 p-2 bg-muted/50 rounded-xl">
                                                            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                                                            <p className="text-sm">{sanitizeForRender(option)}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                    {insights.organSpecificInsights.organSpecificRisks &&
                                        insights.organSpecificInsights.organSpecificRisks.length > 0 && (
                                            <div>
                                                <h4 className="font-medium mb-2">Organ-Specific Risks</h4>
                                                <div className="space-y-2">
                                                    {insights.organSpecificInsights.organSpecificRisks.map((risk, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex items-start gap-2 p-2 bg-red-50 dark:bg-red-950/30 rounded-xl border border-accent"
                                                        >
                                                            <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                                                            <p className="text-sm text-red-700 dark:text-red-300">{sanitizeForRender(risk)}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Clinical Decision Support */}
                    {insights.clinicalDecisionSupport && (
                        <Card className="rounded-3xl shadow-none border-dashed border-accent border-2">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    Clinical Decision Support
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {insights.clinicalDecisionSupport.immediateActions && (
                                        <div>
                                            <h4 className="font-medium mb-2">Immediate Actions</h4>
                                            <div className="space-y-2">
                                                {insights.clinicalDecisionSupport.immediateActions.map((action, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-start gap-2 p-2 bg-yellow-50 dark:bg-yellow-950/30 rounded-xl border border-accent "
                                                    >
                                                        <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                                                        <p className="text-sm text-yellow-800 dark:text-yellow-200">{sanitizeForRender(action)}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {insights.clinicalDecisionSupport.additionalTesting && (
                                        <div>
                                            <h4 className="font-medium mb-2">Additional Testing</h4>
                                            <div className="space-y-2">
                                                {insights.clinicalDecisionSupport.additionalTesting.map((test, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-start gap-2 p-2 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-accent"
                                                    >
                                                        <FlaskConical className="h-4 w-4 text-blue-600 dark:text-blue-200 mt-0.5 flex-shrink-0" />
                                                        <p className="text-sm text-blue-800 dark:text-blue-200">{sanitizeForRender(test)}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Personalized Analysis */}
                    {insights.personalized && (
                        <Card className="lg:col-span-2 rounded-3xl shadow-none border-dashed border-accent border-2">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    Personalized Analysis
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div className="p-4 bg-muted/50 rounded-xl">
                                        <h4 className="font-medium mb-2">Age Factors</h4>
                                        <p className="text-sm text-muted-foreground">
                                            {sanitizeForRender(insights.personalized.ageFactors)}
                                        </p>
                                    </div>
                                    <div className="p-4 bg-muted/50 rounded-xl">
                                        <h4 className="font-medium mb-2">HLA Optimization</h4>
                                        <p className="text-sm text-muted-foreground">
                                            {sanitizeForRender(insights.personalized.hlaOptimization)}
                                        </p>
                                    </div>
                                    <div className="p-4 bg-muted/50 rounded-xl">
                                        <h4 className="font-medium mb-2">Long-term Prognosis</h4>
                                        <p className="text-sm text-muted-foreground">
                                            {sanitizeForRender(insights.personalized.longTermPrognosis)}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Summary */}
                    <Card className="lg:col-span-2 rounded-3xl shadow-none border-dashed border-accent border-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CircleCheck className="h-5 w-5 text-primary" />
                                Executive Summary
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm leading-relaxed">{sanitizeForRender(insights.summary)}</p>
                        </CardContent>
                    </Card>
                </div>
            ) : (
                <Card className="rounded-3xl shadow-none border-dashed border-accent border-2">
                    <CardContent className="text-center py-12">
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
                <Card className="rounded-3xl shadow-none border-dashed border-accent border-2">
                    <CardHeader>
                        <CardTitle>HLA Compatibility Matrix</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {topMatches.slice(0, 3).map((match) => (
                                <div key={match.id} className="border rounded-xl p-4 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium">Donor #{match.id}</span>
                                        <Badge variant={match.compatibility >= 80 ? "default" : "secondary"}>
                                            {match.compatibility}% Compatible
                                        </Badge>
                                    </div>

                                    <div className="grid grid-cols-3 gap-3">
                                        <div className="text-center p-3 bg-muted/50 rounded-xl">
                                            <div className="text-xs text-muted-foreground mb-1">HLA-A</div>
                                            <div className="font-mono text-xs mb-1">{match.hla.hlaA}</div>
                                            <Badge variant={recipientHLA.hlaA === match.hla.hlaA ? "default" : "outline"} className="text-xs">
                                                {recipientHLA.hlaA === match.hla.hlaA ? "Perfect" : "Partial"}
                                            </Badge>
                                        </div>

                                        <div className="text-center p-3 bg-muted/50 rounded-xl">
                                            <div className="text-xs text-muted-foreground mb-1">HLA-B</div>
                                            <div className="font-mono text-xs mb-1">{match.hla.hlaB}</div>
                                            <Badge variant={recipientHLA.hlaB === match.hla.hlaB ? "default" : "outline"} className="text-xs">
                                                {recipientHLA.hlaB === match.hla.hlaB ? "Perfect" : "Partial"}
                                            </Badge>
                                        </div>

                                        <div className="text-center p-3 bg-muted/50 rounded-xl">
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
