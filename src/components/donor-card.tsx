"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { ChevronLeft, ChevronRight, MapPin, Calendar, Droplets, User, Clock, Timer, SearchCheck, ScanHeart, UserSearchIcon } from "lucide-react"
import { OrganIcon } from "./organ-icon"
import type { Donor } from "@/lib/mock-data"

interface DonorCardProps {
    donor: Donor & { compatibility: number }
    onNext: () => void
    onPrevious: () => void
    currentIndex: number
    totalMatches: number
}

export function DonorCard({ donor, onNext, onPrevious, currentIndex, totalMatches }: DonorCardProps) {
    const getCompatibilityColor = (score: number) => {
        if (score >= 90) return "text-green-600"
        if (score >= 80) return "text-blue-600"
        if (score >= 70) return "text-yellow-600"
        return "text-orange-600"
    }

    const getCompatibilityBadge = (score: number) => {
        if (score >= 90) {
            return { label: "Excellent Match", variant: "default" as const }
        }
        if (score >= 80) {
            return { label: "Very Good Match", variant: "default" as const }
        }
        if (score >= 70) {
            return { label: "Good Match", variant: "secondary" as const }
        }
        if (score >= 50) {
            return { label: "Moderate Match", variant: "outline" as const }
        }
        return { label: "Low Compatibility", variant: "outline" as const }
    }

    const compatibilityBadge = getCompatibilityBadge(donor.compatibility)

    return (
        <Card className="w-full rounded-3xl max-w-4xl mx-auto shadow-none border-accent border-2 transition-all duration-300">
            <CardHeader className="text-center space-y-4 ">
                {/* Navigation */}
                <div className="flex items-center justify-between">
                    <Button variant="outline" size="sm" onClick={onPrevious} className="flex items-center gap-1 bg-transparent">
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                    </Button>
                    <Badge variant="outline" className="px-3 py-1 font-medium">
                        {currentIndex + 1} of {totalMatches}
                    </Badge>
                    <Button variant="outline" size="sm" onClick={onNext} className="flex items-center gap-1 bg-transparent">
                        Next
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>

                {/* Main Title with Organ Icon */}
                <div className="space-y-3">
                    <CardTitle className="text-3xl flex items-center justify-center gap-3">
                        <div className="p-2  rounded-full">
                            <OrganIcon organ={donor.organ} size="lg" className="text-primary" />
                        </div>
                        Donor #{donor.id}
                    </CardTitle>

                    {/* Compatibility Score */}
                    <div className="flex items-center justify-center gap-6">
                        <div className="text-center">
                            <div className={`text-6xl font-bold ${getCompatibilityColor(donor.compatibility)} mb-2`}>
                                {donor.compatibility}%
                            </div>
                            <Progress value={donor.compatibility} className="h-1 w-32" />
                        </div>
                        <div className="text-center space-y-2">
                            <div className="text-sm text-muted-foreground">Match Quality</div>
                            <Badge variant={compatibilityBadge.variant} className="text-sm px-3 py-1">
                                {compatibilityBadge.label}
                            </Badge>
                            {donor.urgencyScore && (
                                <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                                    <Timer className="h-3 w-3" />
                                    Urgency: {donor.urgencyScore}/100
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-6 p-6">
                {/* Enhanced Information Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-xl border border-accent  transition-colors">
                        <OrganIcon organ={donor.organ} className="text-primary flex-shrink-0" />
                        <div>
                            <div className="text-sm text-muted-foreground">Organ Type</div>
                            <div className="font-semibold">{donor.organ}</div>
                            {donor.organCondition && (
                                <div className="text-xs text-muted-foreground capitalize">{donor.organCondition} condition</div>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-800/30 rounded-xl border border-accent  transition-colors">
                        <Droplets className="h-5 w-5 text-red-500 flex-shrink-0" />
                        <div>
                            <div className="text-sm text-muted-foreground">Blood Type</div>
                            <div className="font-semibold text-red-700">{donor.bloodType}</div>
                            <div className="text-xs text-muted-foreground">ABO/Rh factor</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-800/20 rounded-xl border border-accent  transition-colors">
                        <Calendar className="h-5 w-5 text-blue-500 flex-shrink-0" />
                        <div>
                            <div className="text-sm text-muted-foreground">Age</div>
                            <div className="font-semibold text-blue-700">{donor.age} years</div>
                            <div className="text-xs text-muted-foreground">{donor.donorType || "Standard"}</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-800/30 rounded-xl border border-accent  transition-colors">
                        <MapPin className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <div>
                            <div className="text-sm text-muted-foreground">Location</div>
                            <div className="font-semibold text-green-700 text-sm">{donor.location}</div>
                            {donor.preservationTime && (
                                <div className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {donor.preservationTime}h preservation
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <Separator />

                {/* Enhanced HLA Profile Section */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <SearchCheck className="h-5 w-5 text-primary" />
                        HLA Genetic Profile Analysis
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-gradient-to-br from-muted/50 to-muted/30 rounded-xl border hover:shadow-md transition-all">
                            <div className="flex items-center justify-between mb-2">
                                <div className="text-sm text-muted-foreground">HLA-A Allele</div>
                                <Badge variant="outline" className="text-xs">
                                    Class I
                                </Badge>
                            </div>
                            <div className="font-mono text-lg font-semibold mb-2 text-primary">{donor.hla.hlaA}</div>
                            <div className="text-xs text-muted-foreground">
                                Primary histocompatibility marker for tissue recognition
                            </div>
                        </div>
                        <div className="p-4 bg-gradient-to-br from-muted/50 to-muted/30 rounded-xl border hover:shadow-md transition-all">
                            <div className="flex items-center justify-between mb-2">
                                <div className="text-sm text-muted-foreground">HLA-B Allele</div>
                                <Badge variant="outline" className="text-xs">
                                    Class I
                                </Badge>
                            </div>
                            <div className="font-mono text-lg font-semibold mb-2 text-primary">{donor.hla.hlaB}</div>
                            <div className="text-xs text-muted-foreground">Secondary compatibility marker for immune response</div>
                        </div>
                        <div className="p-4 bg-gradient-to-br from-muted/50 to-muted/30 rounded-xl border hover:shadow-md transition-all">
                            <div className="flex items-center justify-between mb-2">
                                <div className="text-sm text-muted-foreground">HLA-DRB1 Allele</div>
                                <Badge variant="outline" className="text-xs">
                                    Class II
                                </Badge>
                            </div>
                            <div className="font-mono text-lg font-semibold mb-2 text-primary">{donor.hla.hlaDR}</div>
                            <div className="text-xs text-muted-foreground">Critical for long-term transplant success</div>
                        </div>
                    </div>
                </div>

                <Separator />

                {/* Enhanced Medical Status */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-3">
                        <h4 className="font-semibold text-muted-foreground uppercase tracking-wide text-sm flex items-center gap-2">
                            <ScanHeart className="h-4 w-4" />
                            Medical Status
                        </h4>
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-800/30 dark:text-green-400 dark:border-green-700">
                                {donor.medicalStatus}
                            </Badge>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h4 className="font-semibold text-muted-foreground uppercase tracking-wide text-sm flex items-center gap-2">
                            <UserSearchIcon className="h-4 w-4" />
                            Availability
                        </h4>
                        <div className="flex items-center gap-2">
                            <div
                                className={`w-2 h-2 rounded-full ${donor.availability === "Available"
                                    ? ""
                                    : donor.availability === "Pending"
                                        ? "bg-yellow-500 dark:bg-yellow-800/30"
                                        : "bg-red-500 dark:bg-red-800/30"
                                    }`}
                            ></div>
                            <Badge
                                variant={donor.availability === "Available" ? "default" : "secondary"}
                                className={
                                    donor.availability === "Available"
                                        ? "bg-green-100 text-green-800 border-green-200 dark:bg-green-800/30 dark:text-green-400 dark:border-green-700"
                                        : donor.availability === "Pending"
                                            ? "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-800/30 dark:text-yellow-400 dark:border-yellow-700"
                                            : "bg-red-100 text-red-800 border-red-200 dark:bg-red-800/30 dark:text-red-400 dark:border-red-700"
                                }
                            >
                                {donor.availability}
                            </Badge>
                        </div>
                    </div>

                    {donor.donorType && (
                        <div className="space-y-3">
                            <h4 className="font-semibold text-muted-foreground uppercase tracking-wide text-sm flex items-center gap-2">
                                <User className="h-4 w-4" />
                                Donor Type
                            </h4>
                            <Badge variant="outline" className="capitalize">
                                {donor.donorType} Donor
                            </Badge>
                        </div>
                    )}
                </div>

                {/* Enhanced Additional Info */}
                <div className="p-4 bg-primary-foreground rounded-xl border-l-4 border-l-accent">
                    <div className="flex items-start gap-3">
                        <div>
                            <p className="text-sm font-medium mb-1">Clinical Assessment</p>
                            <p className="text-sm text-muted-foreground">
                                This donor profile demonstrates{" "}
                                {donor.compatibility >= 80 ? "excellent" : donor.compatibility >= 70 ? "good" : "moderate"} HLA
                                compatibility based on advanced matching algorithms.
                                {donor.compatibility >= 90 && " This represents an exceptional match with minimal rejection risk."}
                                {donor.compatibility >= 80 &&
                                    donor.compatibility < 90 &&
                                    " Strong compatibility indicates favorable transplant outcomes."}
                                {donor.compatibility < 70 && " Additional immunosuppressive protocols may be recommended."}
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
