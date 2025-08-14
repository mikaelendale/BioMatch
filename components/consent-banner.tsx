"use client"

import { useState, useEffect } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { X, Shield } from "lucide-react"

export function ConsentBanner() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const hasConsented = localStorage.getItem("biomatch-consent")
    if (!hasConsented) {
      setIsVisible(true)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem("biomatch-consent", "true")
    setIsVisible(false)
  }

  const handleDismiss = () => {
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white border-t shadow-lg">
      <Alert className="border-yellow-200 bg-yellow-50">
        <Shield className="h-4 w-4 text-yellow-600" />
        <AlertDescription className="flex items-center justify-between">
          <div className="text-yellow-800">
            <strong>Educational Demo:</strong> This system is for learning purposes only. Do not use for real medical
            decisions.
            <span className="ml-2">
              <Button
                variant="link"
                className="p-0 h-auto text-yellow-800 underline"
                onClick={() => window.open("/ethics", "_blank")}
              >
                Read full disclaimer
              </Button>
            </span>
          </div>
          <div className="flex items-center space-x-2 ml-4">
            <Button size="sm" onClick={handleAccept} className="bg-yellow-600 hover:bg-yellow-700 text-white">
              I Understand
            </Button>
            <Button size="sm" variant="ghost" onClick={handleDismiss}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  )
}
