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
    Database,
    Zap,
    Shield,
    TrendingUp,
    Clock,
    Search,
    Activity,
    Download,
    Filter,
    BarChart3,
    Package,
    GitCompare,
} from "lucide-react"

export default function Home() {
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
    const mediumCompatibilityCount = matches.filter((m) => m.compatibility >= 60 && m.compatibility < 80).length
    const lowCompatibilityCount = matches.filter((m) => m.compatibility < 60).length

    const formatUptime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600)
        const minutes = Math.floor((seconds % 3600) / 60)
        return `${hours}h ${minutes}m`
    }

    const organDistribution = matches.reduce(
        (acc, match) => {
            acc[match.organ] = (acc[match.organ] || 0) + 1
            return acc
        },
        {} as Record<string, number>,
    )

    return (
        <div className="min-h-screen bg-background">
            {/* Enhanced Header */}
            <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
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
                        compatibility analysis with predictive analytics. All data is simulated. Never use for actual medical
                        decisions - always consult qualified transplant professionals.
                    </AlertDescription>
                </Alert>

                <div className="grid lg:grid-cols-12 gap-8">
                    {/* Enhanced Sidebar */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Enhanced HLA Input with Organ Selection */}
                        <Card className="top-24">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Dna className="h-5 w-5 text-primary" />
                                    Advanced HLA Analysis
                                </CardTitle>
                                <CardDescription>Multi-organ compatibility with AI insights</CardDescription>
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

                        {/* Enhanced System Status */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Database className="h-5 w-5 text-primary" />
                                    Live System Analytics
                                    <div className="ml-auto w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="text-center p-3 bg-primary/5 rounded-lg border border-primary/10">
                                        <div className="text-2xl font-bold text-primary">{donorCount}</div>
                                        <div className="text-xs text-muted-foreground">Active Donors</div>
                                    </div>
                                    <div className="text-center p-3 bg-accent/5 rounded-lg border border-accent/10">
                                        <div className="text-2xl font-bold text-accent">{formatUptime(systemUptime)}</div>
                                        <div className="text-xs text-muted-foreground">System Uptime</div>
                                    </div>
                                </div>

                                {selectedOrgan !== "all" && (
                                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Filter className="h-4 w-4 text-blue-600" />
                                            <span className="text-sm font-medium text-blue-800">Active Filter</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <OrganIcon organ={selectedOrgan} size="sm" className="text-blue-600" />
                                            <span className="text-sm text-blue-700 capitalize">{selectedOrgan} Only</span>
                                        </div>
                                    </div>
                                )}

                                {showResults && (
                                    <div className="space-y-3 pt-4 border-t">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium">Match Distribution</span>
                                            <Badge variant="outline">{matches.length} Found</Badge>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-xs">
                                                <span className="flex items-center gap-1">
                                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                    Excellent (80%+)
                                                </span>
                                                <span className="font-medium text-green-600">{highCompatibilityCount}</span>
                                            </div>
                                            <div className="flex justify-between text-xs">
                                                <span className="flex items-center gap-1">
                                                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                                    Good (60-79%)
                                                </span>
                                                <span className="font-medium text-yellow-600">{mediumCompatibilityCount}</span>
                                            </div>
                                            <div className="flex justify-between text-xs">
                                                <span className="flex items-center gap-1">
                                                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                                    Fair (&lt;60%)
                                                </span>
                                                <span className="font-medium text-red-600">{lowCompatibilityCount}</span>
                                            </div>
                                        </div>

                                        {Object.keys(organDistribution).length > 1 && (
                                            <div className="space-y-2 pt-2 border-t">
                                                <div className="text-sm font-medium">Organ Distribution</div>
                                                {Object.entries(organDistribution).map(([organ, count]) => (
                                                    <div key={organ} className="flex items-center justify-between text-xs">
                                                        <span className="flex items-center gap-1">
                                                            <OrganIcon organ={organ} size="sm" />
                                                            {organ}
                                                        </span>
                                                        <span className="font-medium">{count}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {isAnalyzing && (
                                    <div className="space-y-3 pt-4 border-t">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="flex items-center gap-2">
                                                <Search className="h-4 w-4 animate-spin text-primary" />
                                                AI-Enhanced Analysis...
                                            </span>
                                            <span className="text-primary font-medium">{analysisProgress}%</span>
                                        </div>
                                        <Progress value={analysisProgress} className="h-2" />
                                        <div className="text-xs text-muted-foreground text-center">
                                            Processing {donorCount} donors with predictive analytics
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Enhanced Main Content */}
                    <div className="lg:col-span-8">
                        {!showResults ? (
                            /* Enhanced Welcome State */
                            <Card className="h-full min-h-[600px] flex items-center justify-center">
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
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
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
                                        <GitCompare className="h-4 w-4" />
                                        Matches ({matches.length})
                                    </Button>
                                    <Button
                                        variant={activeSection === "insights" ? "default" : "ghost"}
                                        size="sm"
                                        onClick={() => setActiveSection("insights")}
                                        className="flex items-center gap-2 flex-1"
                                    >
                                        <Package className="h-4 w-4" />
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
                                    <AIInsights recipientHLA={recipientHLA} topMatches={matches.slice(0, 5)} />
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
                    </div>
                </div>

                {/* Enhanced Features Section */}
                {!showResults && (
                    <div className="mt-16 space-y-12">
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
