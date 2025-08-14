"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Shield, AlertTriangle, BookOpen, Phone, ExternalLink } from "lucide-react"

interface EthicalDisclaimerProps {
  onAccept: () => void
  showDialog?: boolean
}

export function EthicalDisclaimer({ onAccept, showDialog = false }: EthicalDisclaimerProps) {
  const [hasReadDisclaimer, setHasReadDisclaimer] = useState(false)
  const [hasReadPrivacy, setHasReadPrivacy] = useState(false)
  const [hasReadLimitations, setHasReadLimitations] = useState(false)

  const canProceed = hasReadDisclaimer && hasReadPrivacy && hasReadLimitations

  const DisclaimerContent = () => (
    <div className="space-y-6">
      {/* Main Educational Disclaimer */}
      <Alert className="border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          <strong>EDUCATIONAL USE ONLY:</strong> BioMatch is a demonstration system designed for educational and
          research purposes only. This system must NOT be used for actual medical decisions or real organ matching.
        </AlertDescription>
      </Alert>

      {/* Medical Professional Oversight */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-red-700">
            <Shield className="h-5 w-5" />
            <span>Medical Professional Oversight Required</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start space-x-2">
            <Checkbox
              checked={hasReadDisclaimer}
              onCheckedChange={(checked) => setHasReadDisclaimer(Boolean(checked))}
            />
            <div
              className="text-sm leading-relaxed cursor-pointer"
              onClick={() => setHasReadDisclaimer(!hasReadDisclaimer)}
            >
              I understand that{" "}
              <strong>all organ matching decisions must be made by qualified medical professionals</strong> using
              clinically validated systems. BioMatch results should never replace professional medical judgment or
              established organ allocation protocols.
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Privacy and Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-blue-700">
            <Shield className="h-5 w-5" />
            <span>Data Privacy and Security</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start space-x-2">
            <Checkbox checked={hasReadPrivacy} onCheckedChange={(checked) => setHasReadPrivacy(Boolean(checked))} />
            <div className="text-sm leading-relaxed cursor-pointer" onClick={() => setHasReadPrivacy(!hasReadPrivacy)}>
              I acknowledge that <strong>no real patient data should be entered</strong> into this system. All donor
              profiles are synthetic/mock data. In real applications, genetic information requires the highest levels of
              security, encryption, and compliance with healthcare privacy regulations (HIPAA, GDPR).
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Limitations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-orange-700">
            <AlertTriangle className="h-5 w-5" />
            <span>System Limitations</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start space-x-2">
            <Checkbox
              checked={hasReadLimitations}
              onCheckedChange={(checked) => setHasReadLimitations(Boolean(checked))}
            />
            <div
              className="text-sm leading-relaxed cursor-pointer"
              onClick={() => setHasReadLimitations(!hasReadLimitations)}
            >
              I understand that <strong>real organ matching involves many factors beyond HLA typing</strong>, including
              crossmatch testing, donor-specific antibodies, medical urgency, geographic logistics, and numerous
              clinical considerations not modeled in this educational system.
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Professional Resources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-green-700">
            <Phone className="h-5 w-5" />
            <span>Professional Medical Resources</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">For real organ donation and transplant information:</p>
          <div className="space-y-2 text-sm">
            <div className="flex items-center space-x-2">
              <ExternalLink className="h-3 w-3" />
              <span>
                <strong>UNOS (United Network for Organ Sharing):</strong> organdonor.gov
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <ExternalLink className="h-3 w-3" />
              <span>
                <strong>National Kidney Registry:</strong> kidneyregistry.org
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <ExternalLink className="h-3 w-3" />
              <span>
                <strong>American Society of Transplantation:</strong> myast.org
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="h-3 w-3" />
              <span>
                <strong>Emergency:</strong> Contact your local transplant center immediately
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ethical Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-purple-700">
            <BookOpen className="h-5 w-5" />
            <span>Ethical Guidelines</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-sm space-y-2 text-muted-foreground">
            <li>• Organ allocation must be fair, transparent, and based on medical need</li>
            <li>• Patient consent and privacy must be protected at all times</li>
            <li>• No discrimination based on race, gender, religion, or socioeconomic status</li>
            <li>• Genetic information requires special protection and ethical oversight</li>
            <li>• Educational tools should clearly distinguish from clinical systems</li>
          </ul>
        </CardContent>
      </Card>

      {canProceed && (
        <div className="flex justify-center pt-4">
          <Button onClick={onAccept} className="bg-green-600 hover:bg-green-700">
            I Understand - Proceed to Educational Demo
          </Button>
        </div>
      )}
    </div>
  )

  if (showDialog) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
            <Shield className="h-4 w-4" />
            <span>View Ethical Guidelines</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Ethical Guidelines and Disclaimers</DialogTitle>
            <DialogDescription>Important information about the responsible use of BioMatch</DialogDescription>
          </DialogHeader>
          <DisclaimerContent />
        </DialogContent>
      </Dialog>
    )
  }

  return <DisclaimerContent />
}
