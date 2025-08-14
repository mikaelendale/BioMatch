import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, AlertTriangle, BookOpen, Phone, ExternalLink, ArrowLeft, Heart } from "lucide-react"
import Link from "next/link"

export default function EthicsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" asChild>
                <Link href="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
              <div className="bg-red-500 p-2 rounded-lg">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">BioMatch Ethics</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ethical Guidelines and Disclaimers</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Understanding the responsible use of BioMatch and the ethical considerations in organ donation matching
          </p>
        </div>

        <div className="space-y-8">
          {/* Critical Warning */}
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <AlertDescription className="text-red-800 text-lg">
              <strong>CRITICAL WARNING:</strong> BioMatch is an educational demonstration only. Never use this system
              for actual medical decisions or real organ matching. All medical decisions must be made by qualified
              healthcare professionals using clinically validated systems.
            </AlertDescription>
          </Alert>

          {/* Educational Purpose */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-blue-700">
                <BookOpen className="h-5 w-5" />
                <span>Educational Purpose</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>BioMatch was created to:</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Demonstrate HLA compatibility concepts in organ transplantation</li>
                <li>Illustrate the complexity of donor-recipient matching algorithms</li>
                <li>Provide hands-on learning about genetic compatibility in medicine</li>
                <li>Raise awareness about organ donation and transplantation science</li>
                <li>Show how technology can assist (but never replace) medical professionals</li>
              </ul>
            </CardContent>
          </Card>

          {/* Medical Professional Oversight */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-red-700">
                <Shield className="h-5 w-5" />
                <span>Medical Professional Oversight</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h4 className="font-semibold">Real organ matching requires:</h4>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>
                  <strong>Board-certified transplant physicians</strong> with specialized training
                </li>
                <li>
                  <strong>Clinical laboratory testing</strong> including crossmatch and antibody screening
                </li>
                <li>
                  <strong>Multidisciplinary teams</strong> including surgeons, coordinators, and social workers
                </li>
                <li>
                  <strong>Regulatory oversight</strong> by organizations like UNOS and local OPOs
                </li>
                <li>
                  <strong>Continuous monitoring</strong> and quality assurance programs
                </li>
                <li>
                  <strong>Ethical review boards</strong> and transplant committees
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Data Privacy and Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-purple-700">
                <Shield className="h-5 w-5" />
                <span>Data Privacy and Security</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="border-yellow-200 bg-yellow-50">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800">
                  <strong>Never enter real patient data</strong> into BioMatch. All donor profiles in this system are
                  synthetic.
                </AlertDescription>
              </Alert>

              <h4 className="font-semibold">Real medical systems require:</h4>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>
                  <strong>HIPAA compliance</strong> for patient privacy protection
                </li>
                <li>
                  <strong>End-to-end encryption</strong> for all genetic and medical data
                </li>
                <li>
                  <strong>Access controls</strong> limiting data to authorized personnel only
                </li>
                <li>
                  <strong>Audit trails</strong> tracking all data access and modifications
                </li>
                <li>
                  <strong>Secure data centers</strong> with physical and digital security measures
                </li>
                <li>
                  <strong>Regular security assessments</strong> and vulnerability testing
                </li>
              </ul>
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
              <p>BioMatch is a simplified educational model. Real organ matching involves:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-semibold mb-2">Clinical Factors:</h5>
                  <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                    <li>Crossmatch testing</li>
                    <li>Donor-specific antibodies</li>
                    <li>ABO blood compatibility</li>
                    <li>Size and weight matching</li>
                    <li>Medical urgency scores</li>
                    <li>Time on waiting list</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold mb-2">Logistical Factors:</h5>
                  <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                    <li>Geographic proximity</li>
                    <li>Organ preservation time</li>
                    <li>Surgical team availability</li>
                    <li>Transportation logistics</li>
                    <li>Hospital capacity</li>
                    <li>Insurance and financial factors</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ethical Principles */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-green-700">
                <BookOpen className="h-5 w-5" />
                <span>Ethical Principles in Organ Allocation</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-semibold mb-2">Core Principles:</h5>
                  <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                    <li>
                      <strong>Justice:</strong> Fair and equitable allocation
                    </li>
                    <li>
                      <strong>Utility:</strong> Maximizing benefit and minimizing waste
                    </li>
                    <li>
                      <strong>Respect for persons:</strong> Honoring patient autonomy
                    </li>
                    <li>
                      <strong>Non-maleficence:</strong> "Do no harm"
                    </li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold mb-2">Prohibited Discrimination:</h5>
                  <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                    <li>Race or ethnicity</li>
                    <li>Gender or sexual orientation</li>
                    <li>Religion or beliefs</li>
                    <li>Socioeconomic status</li>
                    <li>Geographic location (within reason)</li>
                    <li>Ability to pay</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Professional Resources */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-blue-700">
                <Phone className="h-5 w-5" />
                <span>Professional Medical Resources</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="font-semibold">For real organ donation and transplant information:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <ExternalLink className="h-4 w-4 mt-0.5 text-blue-500" />
                    <div>
                      <p className="font-semibold">UNOS (United Network for Organ Sharing)</p>
                      <p className="text-sm text-muted-foreground">organdonor.gov</p>
                      <p className="text-xs text-muted-foreground">Official U.S. organ allocation system</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <ExternalLink className="h-4 w-4 mt-0.5 text-blue-500" />
                    <div>
                      <p className="font-semibold">National Kidney Registry</p>
                      <p className="text-sm text-muted-foreground">kidneyregistry.org</p>
                      <p className="text-xs text-muted-foreground">Kidney paired donation program</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <ExternalLink className="h-4 w-4 mt-0.5 text-blue-500" />
                    <div>
                      <p className="font-semibold">American Society of Transplantation</p>
                      <p className="text-sm text-muted-foreground">myast.org</p>
                      <p className="text-xs text-muted-foreground">Professional medical organization</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Phone className="h-4 w-4 mt-0.5 text-red-500" />
                    <div>
                      <p className="font-semibold">Emergency Medical Care</p>
                      <p className="text-sm text-muted-foreground">Contact your local transplant center</p>
                      <p className="text-xs text-muted-foreground">For urgent medical situations</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact and Feedback */}
          <Card>
            <CardHeader>
              <CardTitle>Contact and Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                BioMatch was created as an educational demonstration. If you have questions about organ donation,
                transplantation, or medical genetics, please consult with qualified healthcare professionals or contact
                the resources listed above.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
