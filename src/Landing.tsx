"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Dna,
    Users,
    Award,
    ArrowRight,
    ChevronRight,
    GitGraphIcon,
    AlignVerticalJustifyEnd,
    ChartArea,
    CloudCog,
    Shredder,
    TrendingUpDown,
    CableCar,
} from "lucide-react"
import Footer from "./components/footer"
import { InfiniteSlider } from "./components/motion-primitives/infinite-slider"
import { HeroHeader } from "./components/header"
import React from "react"
import OrganCounter from "./components/organ-counter"

export default function LandingPage() {

    const features = [
        {
            icon: <Dna className="h-8 w-8 text-primary" />,
            title: "Multi-Organ DNA Matching",
            description:
                "Advanced HLA compatibility analysis for kidney, liver, heart, lung, and pancreas transplants with organ-specific algorithms.",
        },
        {
            icon: <CloudCog className="h-8 w-8 text-primary" />,
            title: "AI-Powered Insights",
            description:
                "Machine learning algorithms provide predictive analytics, success probability calculations, and personalized clinical recommendations.",
        },
        {
            icon: <ChartArea className="h-8 w-8 text-primary" />,
            title: "Real-Time Analysis",
            description:
                "Lightning-fast compatibility analysis with comprehensive results in under 3 seconds, enabling rapid clinical decision-making.",
        },
        {
            icon: <Shredder className="h-8 w-8 text-primary" />,
            title: "Clinical-Grade Security",
            description:
                "HIPAA-compliant platform with enterprise-level security, audit trails, and comprehensive data protection protocols.",
        },
        {
            icon: <TrendingUpDown className="h-8 w-8 text-primary" />,
            title: "Precision Matching",
            description:
                "Advanced cross-reactive group analysis and partial match detection for optimal donor-recipient compatibility assessment.",
        },
        {
            icon: <CableCar className="h-8 w-8 text-primary" />,
            title: "Professional Reporting",
            description:
                "Comprehensive PDF reports with detailed compatibility breakdowns, risk assessments, and clinical recommendations for medical teams.",
        },
    ]

    const benefits = [
        {
            icon: <GitGraphIcon className="h-6 w-6 text-primary" />,
            title: "95% Match Accuracy",
            description: "Industry-leading precision in HLA compatibility analysis",
        },
        {
            icon: <AlignVerticalJustifyEnd className="h-6 w-6 text-primary" />,
            title: "3x Faster Processing",
            description: "Reduce analysis time from hours to seconds",
        },
        {
            icon: <Users className="h-6 w-6 text-primary" />,
            title: "Better Patient Outcomes",
            description: "Improved transplant success rates through AI insights",
        },
        {
            icon: <Award className="h-6 w-6 text-primary" />,
            title: "Regulatory Compliant",
            description: "Meets all medical industry standards and protocols",
        },
    ]

    return (
        <div className="min-h-screen bg-background">
            {/* Enhanced Header */}
            <HeroHeader />

            {/* Hero Section */}
            <main className="overflow-x-hidden">
                
                <section>
                    <div className="pt-27 pb-10 md:pb-32 lg:pb-20 lg:pt-72">
                        <div className="relative mx-auto z-20 flex max-w-7xl flex-col px-6 lg:block lg:px-12">

                            <OrganCounter />
                            <div className="mx-auto max-w-lg text-center lg:ml-0 lg:max-w-full lg:text-left">
                                <h1 className="mt-8 max-w-2xl text-primary text-balance text-5xl md:text-6xl lg:mt- xl:text-7xl">
                                    Save Lives with DNA Precision
                                </h1>
                                <p className="mt-8 max-w-2xl text-balance text-lg">
                                    Revolutionary AI-powered organ donor matching system that increases transplant success rates through advanced HLA compatibility analysis.
                                </p>

                                <div className="mt-12 flex flex-col items-center justify-center gap-2 sm:flex-row lg:justify-start">
                                    <Button
                                        asChild
                                        size="lg"
                                        className="h-12 rounded-full pl-5 pr-3 text-base">
                                        <a href="/app">
                                            <span className="text-nowrap">Start Matching</span>
                                            <ChevronRight className="ml-1" />
                                        </a>
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className="aspect-2/3 absolute inset-1 z-10 overflow-hidden rounded-3xl lg:aspect-video lg:rounded-[3rem] dark:border-white/5">
                            {/* Video with error handling */}
                            {(() => {
                                const [videoError, setVideoError] = React.useState(false);
                                if (videoError) return null;
                                return (
                                    <video
                                        autoPlay
                                        loop
                                        muted
                                        className="size-full object-cover opacity-50 invert dark:opacity-35 dark:invert-0 dark:lg:opacity-75"
                                        src="hero2.mp4"
                                        onError={() => setVideoError(true)}
                                    />
                                );
                            })()}
                        </div>
                    </div>
                </section>

                {/* Added trusted institutions section with medical logos */}
                <section className="bg-background pb-2">
                    <div className="group relative m-auto max-w-7xl px-6 z-20">
                        <div className="flex flex-col items-center md:flex-row ">
                            <div className="md:max-w-44 md:border-r md:pr-6">
                                <p className="text-end text-sm">Trusted by leading hospitals (demo)</p>
                            </div>
                            <div className="relative py-6 md:w-[calc(100%-11rem)]">
                                <InfiniteSlider
                                    speedOnHover={20}
                                    speed={40}
                                    gap={112}>
                                    <div className="flex">
                                        <div className="mx-auto h-5 w-fit flex items-center text-sm font-semibold text-primary">
                                            Mayo Clinic
                                        </div>
                                    </div>

                                    <div className="flex">
                                        <div className="mx-auto h-4 w-fit flex items-center text-sm font-semibold text-primary">
                                            Johns Hopkins
                                        </div>
                                    </div>

                                    <div className="flex">
                                        <div className="mx-auto h-4 w-fit flex items-center text-sm font-semibold text-primary">
                                            Cleveland Clinic
                                        </div>
                                    </div>

                                    <div className="flex">
                                        <div className="mx-auto h-5 w-fit flex items-center text-sm font-semibold text-primary">
                                            Mass General
                                        </div>
                                    </div>

                                    <div className="flex">
                                        <div className="mx-auto h-5 w-fit flex items-center text-sm font-semibold text-primary">
                                            UCSF Medical
                                        </div>
                                    </div>

                                    <div className="flex">
                                        <div className="mx-auto h-4 w-fit flex items-center text-sm font-semibold text-primary">
                                            Cedars-Sinai
                                        </div>
                                    </div>

                                    <div className="flex">
                                        <div className="mx-auto h-7 w-fit flex items-center text-sm font-semibold text-primary">
                                            Mount Sinai
                                        </div>
                                    </div>

                                    <div className="flex">
                                        <div className="mx-auto h-6 w-fit flex items-center text-sm font-semibold text-primary">
                                            NYU Langone
                                        </div>
                                    </div>
                                </InfiniteSlider>

                                <div className="bg-gradient-to-r opacity-60 rounded-xl from-background absolute inset-y-0 left-0 w-20"></div>
                                <div className="bg-gradient-to-l opacity-60 rounded-xl from-background absolute inset-y-0 right-0 w-20"></div>
                            </div>
                        </div>
                    </div>
                </section>

            </main>
            {/* Features Section */}
            <section id="features" className="pt-30 lg:pt-50 md:pt-10 w-full max-w-7xl mx-auto px-4">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <Badge variant="outline" className="mb-4">
                            Advanced Technology
                        </Badge>
                        <h2 className="text-3xl lg:text-4xl font-bold mb-4">Cutting-Edge Features for Medical Excellence</h2>
                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                            Our comprehensive platform combines advanced DNA analysis with AI-powered insights to deliver unparalleled
                            accuracy in organ matching.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <Card key={index} className="p-6  rounded-xl border-dashed border-2 transition-all shadow-none">
                                <CardContent className="p-0">
                                    <div className="space-y-4">
                                        <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center">
                                            {feature.icon}
                                        </div>
                                        <h3 className="text-xl font-semibold">{feature.title}</h3>
                                        <p className="text-muted-foreground">{feature.description}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section id="benefits" className="py-20 w-full max-w-7xl mx-auto px-4">
                <div className="container mx-auto px-4">
                    <div className="items-center mx-auto justify-center *:flex">
                        <div className="flex flex-col sm:flex-row gap-8">
                            {/* Proven Results Section */}
                            <div className="w-full sm:w-1/2 flex flex-col justify-center">
                                <Badge variant="outline" className="mb-4">
                                    Proven Results
                                </Badge>
                                <h2 className="text-3xl lg:text-4xl font-bold mb-4">Measurable Impact on Patient Outcomes</h2>
                                <p className="text-xl text-muted-foreground">
                                    Join hundreds of medical institutions already using BioMatch to improve transplant success rates and
                                    save more lives.
                                </p>
                            </div>

                            {/* Benefits Section */}
                            <div className="w-full sm:w-1/2">
                                <div className="grid grid-cols-1 gap-6">
                                    {benefits.map((benefit, index) => (
                                        <div key={index} className="flex gap-4">
                                            <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                                                {benefit.icon}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold mb-1">{benefit.title}</h3>
                                                <p className="text-sm text-muted-foreground">{benefit.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 text-primary">
                <div className="container mx-auto px-4 text-center bg-primary-foreground rounded-3xl p-12 w-full max-w-7xl">
                    <div className="max-w-3xl mx-auto space-y-8">
                        <h2 className="text-3xl lg:text-4xl font-bold">Ready to Transform Your Organ Matching Process?</h2>
                        <p className="text-xl opacity-90">
                            Join leading medical institutions using BioMatch to save more lives through precision DNA matching.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a href="/app">
                                <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                                    Try it now
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </a>
                            <a href="https://github.com/mikaelendale/biomatch" target="_blank">
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="text-lg px-8 py-6  hover:bg-primary-foreground hover:text-primary bg-transparent"
                                >
                                    Contribute
                                </Button>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <Footer />
        </div>
    )
}
