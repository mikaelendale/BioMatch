"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { HLAInputForm } from "@/components/hla-input-form"
import { DonorCard } from "@/components/donor-card"
import { AIInsights } from "@/components/ai-insights"
import { ExportControls } from "@/components/export-controls"
import { OrganIcon } from "@/components/organ-icon"
import { generateMockDonors, type Donor } from "@/lib/mock-data"
import { calculateCompatibility } from "@/lib/matching-algorithm"
import {
    AlertTriangle,
    Heart,
    Users,
    Dna,
    Zap,
    Shield,
    TrendingUp,
    Clock,
    Search,
    Activity,
    Download,
    BarChart3,
    Database,
    CheckCircle,
} from "lucide-react"

export default function BioMatchApp() {
    const [recipientHLA, setRecipientHLA] = useState({
        hlaA: "",
        hlaB: "",
        hlaDR: "",
    })
    const [selectedOrgan, setSelectedOrgan] = useState("all")
    const [donors, setDonors] = useState<Donor[]>([])
    const [matches, setMatches] = useState<Array<Donor & { compatibility: number }>>([])
    const [currentMatchIndex, setCurrentMatchIndex] = useState(0)
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [showResults, setShowResults] = useState(false)
    const [activeSection, setActiveSection] = useState<"input" | "matches" | "insights" | "export">("input")
    const [analysisProgress, setAnalysisProgress] = useState(0)
    const [currentTime, setCurrentTime] = useState(new Date())
    const [donorCount, setDonorCount] = useState(0)
    const [systemUptime, setSystemUptime] = useState(0)
    const [aiInsights, setAiInsights] = useState<string>("")

    useEffect(() => {
        const timeInterval = setInterval(() => {
            setCurrentTime(new Date())
            setSystemUptime((prev) => prev + 1)
        }, 1000)

        return () => clearInterval(timeInterval)
    }, [])

    useEffect(() => {
        const generateDonors = () => {
            const newCount = Math.floor(Math.random() * 20) + 45
            const mockDonors = generateMockDonors(newCount)
            setDonors(mockDonors)
            setDonorCount(newCount)
        }

        generateDonors()
        const donorInterval = setInterval(generateDonors, 30000)
        return () => clearInterval(donorInterval)
    }, [])

    const handleAnalyze = async () => {
        if (!recipientHLA.hlaA || !recipientHLA.hlaB || !recipientHLA.hlaDR) {
            return
        }

        setIsAnalyzing(true)
        setShowResults(false)
        setAnalysisProgress(0)

        const progressSteps = [
            { progress: 15, delay: 200, message: "Validating HLA markers..." },
            { progress: 35, delay: 300, message: "Scanning donor database..." },
            { progress: 55, delay: 400, message: "Calculating organ-specific compatibility..." },
            { progress: 75, delay: 350, message: "Analyzing predictive outcomes..." },
            { progress: 90, delay: 250, message: "Ranking matches by success probability..." },
            { progress: 100, delay: 200, message: "Analysis complete!" },
        ]

        for (const step of progressSteps) {
            await new Promise((resolve) => setTimeout(resolve, step.delay))
            setAnalysisProgress(step.progress)
        }

        let filteredDonors = donors
        if (selectedOrgan !== "all") {
            filteredDonors = donors.filter((donor) => donor.organ.toLowerCase() === selectedOrgan.toLowerCase())
        }

        const matchedDonors = filteredDonors
            .map((donor) => ({
                ...donor,
                compatibility: calculateCompatibility(recipientHLA, donor.hla, donor.organ),
            }))
            .sort((a, b) => {
                const scoreA = b.compatibility + (b.urgencyScore || 0) * 0.1
                const scoreB = a.compatibility + (a.urgencyScore || 0) * 0.1
                return scoreA - scoreB
            })
            .slice(0, 15) // Increased to 15 matches

        setMatches(matchedDonors)
        setCurrentMatchIndex(0)
        setIsAnalyzing(false)
        setShowResults(true)
        setActiveSection("matches")
    }

    const handleSampleData = () => {
        const sampleProfiles = [
            { hlaA: "A*02:01", hlaB: "B*35:01", hlaDR: "DRB1*04:01" },
            { hlaA: "A*01:01", hlaB: "B*08:01", hlaDR: "DRB1*03:01" },
            { hlaA: "A*03:01", hlaB: "B*07:02", hlaDR: "DRB1*15:01" },
            { hlaA: "A*24:02", hlaB: "B*44:02", hlaDR: "DRB1*07:01" },
            { hlaA: "A*11:01", hlaB: "B*51:01", hlaDR: "DRB1*11:01" },
        ]
        const randomProfile = sampleProfiles[Math.floor(Math.random() * sampleProfiles.length)]
        setRecipientHLA(randomProfile)
    }

    const nextMatch = () => {
        setCurrentMatchIndex((prev) => (prev + 1) % matches.length)
    }

    const previousMatch = () => {
        setCurrentMatchIndex((prev) => (prev - 1 + matches.length) % matches.length)
    }

    const highCompatibilityCount = matches.filter((m) => m.compatibility >= 80).length
    // const mediumCompatibilityCount = matches.filter((m) => m.compatibility >= 60 && m.compatibility < 80).length
    // const lowCompatibilityCount = matches.filter((m) => m.compatibility < 60).length

    const formatUptime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600)
        const minutes = Math.floor((seconds % 3600) / 60)
        return `${hours}h ${minutes}m`
    }

    // const organDistribution = matches.reduce(
    //     (acc, match) => {
    //         acc[match.organ] = (acc[match.organ] || 0) + 1
    //         return acc
    //     },
    //     {} as Record<string, number>,
    // )

    return (
        <div className="min-h-screen bg-background">
            {/* Enhanced Header */}
            <header className="border-b bg-card/50 backdrop-blur-sm">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                                    <Dna className="h-6 w-6 text-primary" />
                                </div>
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">BioMatch Pro</h1>
                                <p className="text-sm text-muted-foreground">Advanced Multi-Organ AI Matching</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="hidden md:flex items-center gap-2 text-sm">
                                <Database className="h-4 w-4 text-green-500" />
                                <span className="text-muted-foreground">Real HLA Data</span>
                                <CheckCircle className="h-3 w-3 text-green-500" />
                            </div>
                            <div className="hidden md:flex items-center gap-2 text-sm">
                                <Activity className="h-4 w-4 text-green-500" />
                                <span className="text-muted-foreground">AI Enhanced</span>
                            </div>
                            <Badge variant="outline" className="hidden sm:flex">
                                {currentTime.toLocaleTimeString()}
                            </Badge>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Enhanced Ethical Disclaimer */}
                <Alert className="mb-8 border-destructive/20 bg-destructive/5">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    <AlertDescription className="text-sm">
                        <strong>Educational & Research Use Only:</strong> This advanced AI system demonstrates multi-organ
                        compatibility analysis with predictive analytics using real population genetics data. All donor profiles are
                        simulated. Never use for actual medical decisions - always consult qualified transplant professionals.
                    </AlertDescription>
                </Alert>

                <Card className="mb-6 bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                                    <Database className="h-4 w-4 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                    <div className="font-medium text-green-800 dark:text-green-200">
                                        Real Population Genetics Data Active
                                    </div>
                                    <div className="text-sm text-green-600 dark:text-green-400">
                                        Using authentic HLA allele frequencies from 8 genetic loci (A, B, C, DPA1, DPB1, DQA1, DQB1, DRB1)
                                    </div>
                                </div>
                            </div>
                            <CheckCircle className="h-5 w-5 text-green-500" />
                        </div>
                    </CardContent>
                </Card>

                {/* HLA Input Section - No longer sticky */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Dna className="h-5 w-5 text-primary" />
                            Advanced HLA Analysis
                        </CardTitle>
                        <CardDescription>
                            Multi-organ compatibility with AI insights using real population genetics data
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <HLAInputForm
                            hlaData={recipientHLA}
                            onChange={setRecipientHLA}
                            onSampleData={handleSampleData}
                            onAnalyze={handleAnalyze}
                            isAnalyzing={isAnalyzing}
                            selectedOrgan={selectedOrgan}
                            onOrganChange={setSelectedOrgan}
                        />
                    </CardContent>
                </Card>

                {/* System Status Section */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                        <CardContent className="p-6 text-center">
                            <div className="text-3xl font-bold text-primary mb-2">{donorCount}</div>
                            <div className="text-sm text-muted-foreground">Active Donors</div>
                            <div className="mt-2 w-2 h-2 bg-green-500 rounded-full animate-pulse mx-auto"></div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6 text-center">
                            <div className="text-3xl font-bold text-accent mb-2">{formatUptime(systemUptime)}</div>
                            <div className="text-sm text-muted-foreground">System Uptime</div>
                            <div className="mt-2 flex items-center justify-center gap-1">
                                <Clock className="h-3 w-3 text-muted-foreground" />
                            </div>
                        </CardContent>
                    </Card>

                    {showResults && (
                        <>
                            <Card>
                                <CardContent className="p-6 text-center">
                                    <div className="text-3xl font-bold text-green-600 mb-2">{highCompatibilityCount}</div>
                                    <div className="text-sm text-muted-foreground">Excellent Matches</div>
                                    <div className="mt-2 w-2 h-2 bg-green-500 rounded-full mx-auto"></div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-6 text-center">
                                    <div className="text-3xl font-bold text-primary mb-2">{matches.length}</div>
                                    <div className="text-sm text-muted-foreground">Total Matches</div>
                                    <div className="mt-2 flex items-center justify-center gap-1">
                                        <BarChart3 className="h-3 w-3 text-primary" />
                                    </div>
                                </CardContent>
                            </Card>
                        </>
                    )}
                </div>

                {/* Analysis Progress */}
                {isAnalyzing && (
                    <Card>
                        <CardContent className="p-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="flex items-center gap-2 text-lg font-medium">
                                        <Search className="h-5 w-5 animate-spin text-primary" />
                                        AI-Enhanced Analysis in Progress...
                                    </span>
                                    <span className="text-2xl font-bold text-primary">{analysisProgress}%</span>
                                </div>
                                <Progress value={analysisProgress} className="h-3" />
                                <div className="text-center text-muted-foreground">
                                    Processing {donorCount} donors with predictive analytics and organ-specific algorithms
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Main Results Section */}
                {!showResults ? (
                    /* Enhanced Welcome State */
                    <Card className="min-h-[500px] flex items-center justify-center">
                        <CardContent className="text-center space-y-8 p-12">
                            <div className="w-24 h-24 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                                <Heart className="h-12 w-12 text-primary animate-pulse" />
                            </div>
                            <div className="space-y-4">
                                <h2 className="text-3xl font-bold">Advanced Multi-Organ Matching</h2>
                                <p className="text-muted-foreground max-w-md mx-auto text-lg">
                                    AI-powered compatibility analysis with predictive outcomes and organ-specific algorithms.
                                </p>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                                <div className="flex flex-col items-center gap-2 p-4 bg-muted/50 rounded-lg">
                                    <Clock className="h-6 w-6 text-primary" />
                                    <span className="text-sm font-medium">2s Analysis</span>
                                </div>
                                <div className="flex flex-col items-center gap-2 p-4 bg-muted/50 rounded-lg">
                                    <Shield className="h-6 w-6 text-primary" />
                                    <span className="text-sm font-medium">AI Insights</span>
                                </div>
                                <div className="flex flex-col items-center gap-2 p-4 bg-muted/50 rounded-lg">
                                    <TrendingUp className="h-6 w-6 text-primary" />
                                    <span className="text-sm font-medium">Predictive</span>
                                </div>
                                <div className="flex flex-col items-center gap-2 p-4 bg-muted/50 rounded-lg">
                                    <Download className="h-6 w-6 text-primary" />
                                    <span className="text-sm font-medium">PDF Export</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    /* Enhanced Results State */
                    <div className="space-y-6">
                        {/* Enhanced Navigation Tabs */}
                        <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
                            <Button
                                variant={activeSection === "matches" ? "default" : "ghost"}
                                size="sm"
                                onClick={() => setActiveSection("matches")}
                                className="flex items-center gap-2 flex-1"
                            >
                                <Heart className="h-4 w-4" />
                                Matches ({matches.length})
                            </Button>
                            <Button
                                variant={activeSection === "insights" ? "default" : "ghost"}
                                size="sm"
                                onClick={() => setActiveSection("insights")}
                                className="flex items-center gap-2 flex-1"
                            >
                                <Users className="h-4 w-4" />
                                AI Analysis
                            </Button>
                            <Button
                                variant={activeSection === "export" ? "default" : "ghost"}
                                size="sm"
                                onClick={() => setActiveSection("export")}
                                className="flex items-center gap-2 flex-1"
                            >
                                <Download className="h-4 w-4" />
                                Export
                            </Button>
                        </div>

                        {activeSection === "matches" && (
                            <div className="space-y-6">
                                {/* Enhanced Featured Match */}
                                <div>
                                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                        <BarChart3 className="h-6 w-6 text-primary" />
                                        Top Compatible Donors
                                    </h2>
                                    <DonorCard
                                        donor={matches[currentMatchIndex]}
                                        onNext={nextMatch}
                                        onPrevious={previousMatch}
                                        currentIndex={currentMatchIndex}
                                        totalMatches={matches.length}
                                    />
                                </div>

                                {/* Enhanced All Matches Grid */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-4">Complete Match Overview</h3>
                                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {matches.map((match, index) => (
                                            <Card
                                                key={match.id}
                                                className={`cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] ${index === currentMatchIndex ? "ring-2 ring-primary shadow-lg" : ""
                                                    }`}
                                                onClick={() => setCurrentMatchIndex(index)}
                                            >
                                                <CardContent className="p-4">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <Badge
                                                            variant={
                                                                match.compatibility >= 80
                                                                    ? "default"
                                                                    : match.compatibility >= 60
                                                                        ? "secondary"
                                                                        : "outline"
                                                            }
                                                        >
                                                            {match.compatibility}%
                                                        </Badge>
                                                        <div className="flex items-center gap-1">
                                                            <OrganIcon organ={match.organ} size="sm" />
                                                            <div className="text-sm text-muted-foreground">{match.organ}</div>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <div className="font-medium">Donor #{match.id}</div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {match.bloodType} • Age {match.age}
                                                            {match.urgencyScore && ` • Urgency ${match.urgencyScore}`}
                                                        </div>
                                                        <Progress value={match.compatibility} className="h-2" />
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeSection === "insights" && (
                            <AIInsights
                                recipientHLA={recipientHLA}
                                topMatches={matches.slice(0, 5)}
                                onInsightsGenerated={setAiInsights}
                            />
                        )}

                        {activeSection === "export" && (
                            <ExportControls
                                recipientHLA={recipientHLA}
                                recipientAge={45}
                                topMatches={matches.slice(0, 3)}
                                aiInsights={aiInsights}
                                totalDonors={donorCount}
                                analysisTime="2.3s"
                            />
                        )}
                    </div>
                )}

                {/* Enhanced Features Section */}
                {!showResults && (
                    <div className="space-y-12">
                        <div className="text-center">
                            <h2 className="text-3xl font-bold mb-4">Advanced BioMatch Features</h2>
                            <p className="text-muted-foreground max-w-2xl mx-auto">
                                Next-generation organ matching with AI-powered insights and multi-organ support
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <Card className="text-center p-6 hover:shadow-lg transition-all hover:scale-[1.02]">
                                <div className="w-12 h-12 mx-auto mb-4 bg-primary/10 rounded-lg flex items-center justify-center">
                                    <Zap className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="font-semibold mb-2">Multi-Organ Support</h3>
                                <p className="text-sm text-muted-foreground">
                                    Kidney, liver, heart, lung, and pancreas with organ-specific algorithms
                                </p>
                            </Card>

                            <Card className="text-center p-6 hover:shadow-lg transition-all hover:scale-[1.02]">
                                <div className="w-12 h-12 mx-auto mb-4 bg-accent/10 rounded-lg flex items-center justify-center">
                                    <Users className="h-6 w-6 text-accent" />
                                </div>
                                <h3 className="font-semibold mb-2">Predictive Analytics</h3>
                                <p className="text-sm text-muted-foreground">AI-powered success probability and risk assessment</p>
                            </Card>

                            <Card className="text-center p-6 hover:shadow-lg transition-all hover:scale-[1.02]">
                                <div className="w-12 h-12 mx-auto mb-4 bg-primary/10 rounded-lg flex items-center justify-center">
                                    <Shield className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="font-semibold mb-2">Professional Export</h3>
                                <p className="text-sm text-muted-foreground">PDF reports and JSON data for clinical review</p>
                            </Card>

                            <Card className="text-center p-6 hover:shadow-lg transition-all hover:scale-[1.02]">
                                <div className="w-12 h-12 mx-auto mb-4 bg-accent/10 rounded-lg flex items-center justify-center">
                                    <TrendingUp className="h-6 w-6 text-accent" />
                                </div>
                                <h3 className="font-semibold mb-2">Real-time Insights</h3>
                                <p className="text-sm text-muted-foreground">Live donor updates and compatibility tracking</p>
                            </Card>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
