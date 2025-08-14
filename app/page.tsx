import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ConsentBanner } from "@/components/consent-banner"
import { Heart, Users, Activity, Shield } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <ConsentBanner />

      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="bg-red-500 p-2 rounded-lg">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">BioMatch</h1>
            </div>
            <nav className="flex space-x-6">
              <Link href="/match" className="text-gray-600 hover:text-gray-900">
                Find Matches
              </Link>
              <Link href="/donors" className="text-gray-600 hover:text-gray-900">
                Donor Database
              </Link>
              <Link href="/ethics" className="text-gray-600 hover:text-gray-900">
                Ethics
              </Link>
              <Link href="/about" className="text-gray-600 hover:text-gray-900">
                About
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">DNA-Based Organ Donor Matching</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Advanced HLA compatibility analysis to find the best organ matches, reducing rejection risk and saving lives
            through precision medicine.
          </p>
          <div className="flex justify-center space-x-4">
            <Button asChild size="lg" className="bg-red-500 hover:bg-red-600">
              <Link href="/match">Find Matches</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/demo">Try Demo</Link>
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">100K+</div>
              <div className="text-sm text-gray-600">People waiting for organs</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Activity className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">95%</div>
              <div className="text-sm text-gray-600">Matching accuracy</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">1,000</div>
              <div className="text-sm text-gray-600">Registered donors</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Shield className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">6</div>
              <div className="text-sm text-gray-600">HLA loci analyzed</div>
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-blue-500" />
                <span>HLA Analysis</span>
              </CardTitle>
              <CardDescription>
                Comprehensive analysis of 6 major HLA loci for precise compatibility scoring
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Our algorithm analyzes HLA-A, HLA-B, HLA-C, HLA-DRB1, HLA-DQB1, and HLA-DPB1 to calculate compatibility
                scores and predict transplant success rates.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-green-500" />
                <span>Smart Matching</span>
              </CardTitle>
              <CardDescription>Advanced algorithms rank donors by compatibility and risk assessment</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Blood type compatibility, HLA matching scores, and geographic proximity are all considered to find the
                optimal donor-recipient pairs.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-purple-500" />
                <span>Risk Assessment</span>
              </CardTitle>
              <CardDescription>Detailed risk analysis to predict transplant outcomes</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Each match includes risk level assessment (low, medium, high) based on HLA compatibility and clinical
                factors to guide medical decisions.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Educational Disclaimer */}
        <div className="mt-16 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <Shield className="h-6 w-6 text-yellow-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-800 mb-2">Educational Use Only</h3>
              <p className="text-yellow-700 text-sm mb-3">
                BioMatch is designed for educational and research purposes. This system should not be used for actual
                medical decisions without proper clinical validation and oversight by qualified medical professionals.
                Always consult with transplant specialists for real organ matching.
              </p>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="border-yellow-300 text-yellow-800 hover:bg-yellow-100 bg-transparent"
              >
                <Link href="/ethics">Read Full Ethical Guidelines</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
