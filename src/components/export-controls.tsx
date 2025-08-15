"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Download, FileText, Printer, Share2, CheckCircle, Braces } from "lucide-react"
import { generatePDFReport, downloadJSONReport } from "@/lib/pdf-export"
import type { Donor } from "@/lib/mock-data"
import { useState } from "react"

interface HLAData {
    hlaA: string
    hlaB: string
    hlaDR: string
}

interface ExportControlsProps {
    recipientHLA: HLAData
    recipientAge?: number
    topMatches: Array<Donor & { compatibility: number }>
    aiInsights?: string
    totalDonors: number
    analysisTime: string
}

export function ExportControls({
    recipientHLA,
    recipientAge,
    topMatches,
    aiInsights,
    totalDonors,
    analysisTime,
}: ExportControlsProps) {
    const [isExporting, setIsExporting] = useState(false)
    const [exportSuccess, setExportSuccess] = useState<string | null>(null)

    const handlePDFExport = async () => {
        try {
            setIsExporting(true)
            setExportSuccess(null)

            const exportData = {
                recipientHLA,
                recipientAge,
                topMatches,
                aiInsights,
                exportDate: new Date(),
                systemInfo: {
                    totalDonors,
                    analysisTime,
                    systemVersion: "BioMatch v2.1.0",
                },
            }

            await generatePDFReport(exportData)
            setExportSuccess("PDF report generated successfully!")

            setTimeout(() => setExportSuccess(null), 3000)
        } catch (error) {
            console.error("PDF export error:", error)
            alert("Failed to generate PDF report. Please try again.")
        } finally {
            setIsExporting(false)
        }
    }

    const handleJSONExport = () => {
        try {
            setIsExporting(true)
            setExportSuccess(null)

            const exportData = {
                recipientHLA,
                recipientAge,
                topMatches,
                aiInsights,
                exportDate: new Date(),
                systemInfo: {
                    totalDonors,
                    analysisTime,
                    systemVersion: "BioMatch v2.1.0",
                },
            }

            downloadJSONReport(exportData)
            setExportSuccess("JSON data exported successfully!")

            setTimeout(() => setExportSuccess(null), 3000)
        } catch (error) {
            console.error("JSON export error:", error)
            alert("Failed to export JSON data. Please try again.")
        } finally {
            setIsExporting(false)
        }
    }

    const handleShareResults = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: "BioMatch Compatibility Results",
                    text: `Found ${topMatches.length} compatible donors with top match at ${topMatches[0]?.compatibility}% compatibility`,
                    url: window.location.href,
                })
            } catch (error) {
                console.log("Share cancelled or failed")
            }
        } else {
            // Fallback: copy to clipboard
            const shareText = `BioMatch Results: Found ${topMatches.length} compatible donors. Top match: ${topMatches[0]?.compatibility}% compatibility (Donor #${topMatches[0]?.id})`
            navigator.clipboard.writeText(shareText)
            setExportSuccess("Results copied to clipboard!")
            setTimeout(() => setExportSuccess(null), 3000)
        }
    }

    return (
        <Card className="w-full rounded-3xl shadow-none border-accent border-2  ">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    Export & Share Results
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Export Summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-primary/5 rounded-lg border border-accent">
                        <div className="text-2xl font-bold text-primary">{topMatches.length}</div>
                        <div className="text-xs text-muted-foreground">Total Matches</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border border-accent">
                        <div className="text-2xl font-bold text-green-600">
                            {topMatches.filter((m) => m.compatibility >= 80).length}
                        </div>
                        <div className="text-xs text-muted-foreground">High Quality</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-accent">
                        <div className="text-2xl font-bold text-blue-600">{totalDonors}</div>
                        <div className="text-xs text-muted-foreground">Donors Analyzed</div>
                    </div>
                    <div className="text-center p-3 bg-accent/5 rounded-lg border border-accent">
                        <div className="text-2xl font-bold text-primary">{analysisTime}</div>
                        <div className="text-xs text-muted-foreground">Analysis Time</div>
                    </div>
                </div>

                <Separator />

                {/* Export Options */}
                <div className="space-y-4">
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Export Options</h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* PDF Export */}
                        <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-accent rounded-lg">
                                    <FileText className="h-5 w-5 text-red-600 dark:text-red-400" />
                                </div>
                                <div>
                                    <div className="font-medium">Professional PDF Report</div>
                                    <div className="text-sm text-muted-foreground">Complete analysis with top 3 matches</div>
                                </div>
                            </div>
                            <Button
                                onClick={handlePDFExport}
                                disabled={isExporting}
                                className="w-full flex items-center gap-2 bg-transparent"
                                variant="outline"
                            >
                                <Printer className="h-4 w-4" />
                                Generate PDF Report
                            </Button>
                        </div>

                        {/* JSON Export */}
                        <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-accent rounded-lg">
                                    <Braces className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <div className="font-medium">Raw Data Export</div>
                                    <div className="text-sm text-muted-foreground">JSON format for further analysis</div>
                                </div>
                            </div>
                            <Button
                                onClick={handleJSONExport}
                                disabled={isExporting}
                                className="w-full flex items-center gap-2 bg-transparent"
                                variant="outline"
                            >
                                <Download className="h-4 w-4" />
                                Download JSON Data
                            </Button>
                        </div>
                    </div>
                </div>

                <Separator />

                {/* Share Options */}
                <div className="space-y-4">
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Share Results</h4>

                    <Button
                        onClick={handleShareResults}
                        variant="outline"
                        className="w-full flex items-center gap-2 bg-transparent"
                    >
                        <Share2 className="h-4 w-4" />
                        Share Compatibility Summary
                    </Button>
                </div>

                {/* Success Message */}
                {exportSuccess && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-700">{exportSuccess}</span>
                    </div>
                )}

                {/* Export Details */}
                <div className="p-4 bg-muted/30 rounded-lg border-b-4 border-b-muted-foreground">
                    <div className="text-sm">
                        <div className="font-medium mb-2">Export Includes:</div>
                        <ul className="space-y-1 text-muted-foreground">
                            <li>• Complete HLA profile analysis</li>
                            <li>• Top {Math.min(3, topMatches.length)} donor matches with detailed compatibility</li>
                            {/* <li>• AI-powered clinical insights and recommendations</li> */}
                            <li>• System metadata and analysis timestamp</li>
                            <li>• Professional formatting for medical review</li>
                        </ul>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
