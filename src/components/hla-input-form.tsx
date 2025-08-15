"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Info } from "lucide-react"
import { OrganIcon } from "./organ-icon"

interface HLAData {
    hlaA: string
    hlaB: string
    hlaDR: string
}

interface HLAInputFormProps {
    hlaData: HLAData
    onChange: (data: HLAData) => void
    onSampleData: () => void
    onAnalyze: () => void
    isAnalyzing: boolean
    selectedOrgan?: string
    onOrganChange?: (organ: string) => void
}

const organOptions = [
    { value: "all", label: "All Organs", icon: "heart" },
    { value: "kidney", label: "Kidney", icon: "kidney" },
    { value: "liver", label: "Liver", icon: "liver" },
    { value: "heart", label: "Heart", icon: "heart" },
    { value: "lung", label: "Lung", icon: "lung" },
    { value: "pancreas", label: "Pancreas", icon: "pancreas" },
]

export function HLAInputForm({
    hlaData,
    onChange,
    onSampleData,
    onAnalyze,
    isAnalyzing,
    selectedOrgan = "all",
    onOrganChange,
}: HLAInputFormProps) {
    const handleInputChange = (field: keyof HLAData, value: string) => {
        onChange({ ...hlaData, [field]: value })
    }

    const isFormValid = hlaData.hlaA && hlaData.hlaB && hlaData.hlaDR

    return (
        <div className="space-y-6">
            {/* Organ Selection */}
            {onOrganChange && (
                <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                        Target Organ Type
                    </Label>
                    <Select value={selectedOrgan} onValueChange={onOrganChange}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select organ type" />
                        </SelectTrigger>
                        <SelectContent>
                            {organOptions.map((organ) => (
                                <SelectItem key={organ.value} value={organ.value}>
                                    <div className="flex items-center gap-2">
                                        <OrganIcon organ={organ.icon} size="sm" />
                                        {organ.label}
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            )}

            {/* HLA Input Fields */}
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="hla-a" className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        HLA-A Allele
                    </Label>
                    <Input
                        id="hla-a"
                        placeholder="e.g., A*02:01"
                        value={hlaData.hlaA}
                        onChange={(e) => handleInputChange("hlaA", e.target.value)}
                        className="font-mono text-base"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="hla-b" className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        HLA-B Allele
                    </Label>
                    <Input
                        id="hla-b"
                        placeholder="e.g., B*35:01"
                        value={hlaData.hlaB}
                        onChange={(e) => handleInputChange("hlaB", e.target.value)}
                        className="font-mono text-base"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="hla-dr" className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        HLA-DRB1 Allele
                    </Label>
                    <Input
                        id="hla-dr"
                        placeholder="e.g., DRB1*04:01"
                        value={hlaData.hlaDR}
                        onChange={(e) => handleInputChange("hlaDR", e.target.value)}
                        className="font-mono text-base"
                    />
                </div>
            </div>

            {/* Enhanced Format Guide */}
            <Card className="bg-primary-foreground border-accent shadow-none">
                <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <Info className="h-4 w-4 text-primary" />
                        <div className="text-sm font-medium text-primary">HLA Allele Format Guide</div>
                    </div>
                    <div className="grid grid-cols-1 gap-3 text-xs">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="font-medium">HLA-A:</span>
                            <span className="font-mono text-muted-foreground">A*01:01, A*02:01, A*03:01, A*24:02</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="font-medium">HLA-B:</span>
                            <span className="font-mono text-muted-foreground">B*07:02, B*35:01, B*44:02, B*57:01</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <span className="font-medium">HLA-DRB1:</span>
                            <span className="font-mono text-muted-foreground">DRB1*01:01, DRB1*04:01, DRB1*15:01</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
                <Button
                    variant="outline"
                    onClick={onSampleData}
                    className="flex items-center gap-2 hover:bg-primary/5 hover:border-primary/30 bg-transparent"
                >
                    Use Sample Data
                </Button>

                <Button
                    onClick={onAnalyze}
                    disabled={!isFormValid || isAnalyzing}
                    className="flex-1 flex items-center gap-2 bg-primary hover:bg-primary/90"
                >
                    {isAnalyzing ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Analyzing HLA Profile...
                        </>
                    ) : (
                        <>
                            Find Compatible Donors
                        </>
                    )}
                </Button>
            </div>
        </div>
    )
}
