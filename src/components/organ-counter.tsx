"use client"
import { useState, useEffect } from "react"  

interface OrganData {
    name: string
    lastWeek: number
    lastMonth: number 
}

const organData: OrganData[] = [
    { name: "Kidney", lastWeek: 95, lastMonth: 422 },
    { name: "Liver", lastWeek: 21, lastMonth: 95, },
    { name: "Heart", lastWeek: 6, lastMonth: 28 },
    { name: "Lung", lastWeek: 2, lastMonth: 10 },
    { name: "Pancreas", lastWeek: 3, lastMonth: 14 },
]

function AnimatedNumber({ target, duration = 2000, delay = 0 }: { target: number; duration?: number; delay?: number }) {
    const [current, setCurrent] = useState(0)
    const [displayValue, setDisplayValue] = useState(0)
    const [isPulsing, setIsPulsing] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => {
            const startTime = Date.now()
            const startValue = 0
            setIsPulsing(true)

            const animate = () => {
                const elapsed = Date.now() - startTime
                const progress = Math.min(elapsed / duration, 1)

                // Easing function for smooth animation
                const easeOutQuart = 1 - Math.pow(1 - progress, 4)
                const value = Math.floor(startValue + (target - startValue) * easeOutQuart)

                setCurrent(value)
                setDisplayValue(value)

                if (progress < 1) {
                    requestAnimationFrame(animate)
                } else {
                    setIsPulsing(false)
                }
            }

            animate()
        }, delay)

        return () => clearTimeout(timer)
    }, [target, duration, delay])

    useEffect(() => {
        if (!isPulsing && current > 0) {
            const liveUpdateInterval = setInterval(
                () => {
                    const change = Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0
                    if (change !== 0) {
                        setIsPulsing(true)
                        setDisplayValue((prev) => Math.max(0, prev + change))
                        setTimeout(() => setIsPulsing(false), 400)
                    }
                },
                2000 + Math.random() * 3000,
            ) // Random interval between 2-5 seconds

            return () => clearInterval(liveUpdateInterval)
        }
    }, [isPulsing, current])

    return (
        <span
            className={`font-mono font-bold text-lg sm:text-xl text-primary transition-all duration-300 ${isPulsing ? "scale-110 text-primary/80" : ""
                }`}
        >
            {displayValue.toLocaleString()}
        </span>
    )
}

export default function OrganCounter() {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return <div className="h-16 bg-muted rounded animate-pulse max-w-md mx-auto" />
    }

    return (
        <div className="flex gap-2 p-3 sm:p-4 bg-primary-foreground/40 rounded-3xl max-w-md ">
            {organData.map((organ, index) => { 
                return (
                    <div key={organ.name} className="text-center group flex-1"> 
                        <div className="text-xs sm:text-sm text-secondary-foreground mb-1 group-hover:text-foreground transition-colors duration-200 truncate">
                            {organ.name}
                        </div>
                        <div>
                            <AnimatedNumber target={organ.lastWeek} delay={index * 150} />
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
