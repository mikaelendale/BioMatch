"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"

interface DNAHelixAnimationProps {
  compatibilityScore: number
  isAnimating?: boolean
}

export function DNAHelixAnimation({ compatibilityScore, isAnimating = true }: DNAHelixAnimationProps) {
  const [animationPhase, setAnimationPhase] = useState(0)

  useEffect(() => {
    if (!isAnimating) return

    const interval = setInterval(() => {
      setAnimationPhase((prev) => (prev + 1) % 360)
    }, 50)

    return () => clearInterval(interval)
  }, [isAnimating])

  const getHelixColor = (score: number) => {
    if (score >= 80) return "#10b981" // green
    if (score >= 60) return "#f59e0b" // yellow
    if (score >= 40) return "#f97316" // orange
    return "#ef4444" // red
  }

  const helixColor = getHelixColor(compatibilityScore)

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative w-32 h-32">
            <svg
              width="128"
              height="128"
              viewBox="0 0 128 128"
              className={isAnimating ? "animate-pulse" : ""}
              style={{
                transform: isAnimating ? `rotate(${animationPhase}deg)` : "none",
                transition: "transform 0.05s linear",
              }}
            >
              {/* DNA Helix Strands */}
              <path
                d="M20 20 Q64 40 108 20 Q64 60 20 80 Q64 100 108 80 Q64 120 20 108"
                fill="none"
                stroke={helixColor}
                strokeWidth="3"
                opacity="0.8"
              />
              <path
                d="M108 20 Q64 40 20 20 Q64 60 108 80 Q64 100 20 80 Q64 120 108 108"
                fill="none"
                stroke={helixColor}
                strokeWidth="3"
                opacity="0.6"
              />

              {/* Base Pairs */}
              {[0, 1, 2, 3, 4, 5].map((i) => {
                const y = 20 + i * 18
                const offset = Math.sin((animationPhase + i * 60) * (Math.PI / 180)) * 10
                return (
                  <g key={i}>
                    <circle cx={40 + offset} cy={y} r="3" fill={helixColor} opacity="0.7" />
                    <circle cx={88 - offset} cy={y} r="3" fill={helixColor} opacity="0.7" />
                    <line
                      x1={40 + offset}
                      y1={y}
                      x2={88 - offset}
                      y2={y}
                      stroke={helixColor}
                      strokeWidth="1"
                      opacity="0.5"
                    />
                  </g>
                )
              })}

              {/* Compatibility Indicator */}
              <circle
                cx="64"
                cy="64"
                r="8"
                fill={helixColor}
                opacity="0.9"
                className={isAnimating ? "animate-ping" : ""}
              />
              <text
                x="64"
                y="68"
                textAnchor="middle"
                fontSize="8"
                fill="white"
                fontWeight="bold"
                className="select-none"
              >
                {Math.round(compatibilityScore)}%
              </text>
            </svg>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: helixColor }}>
              {compatibilityScore}%
            </div>
            <div className="text-sm text-muted-foreground">HLA Compatibility</div>
          </div>

          {/* Compatibility Legend */}
          <div className="flex space-x-4 text-xs">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Excellent (≥80%)</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span>Good (60-79%)</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <span>Fair (40-59%)</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span>Poor (&lt;40%)</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
