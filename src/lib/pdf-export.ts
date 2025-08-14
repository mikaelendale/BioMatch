import type { Donor } from "./mock-data";

interface HLAData {
  hlaA: string;
  hlaB: string;
  hlaDR: string;
}

interface PDFExportData {
  recipientHLA: HLAData;
  recipientAge?: number;
  topMatches: Array<Donor & { compatibility: number }>;
  aiInsights?: string;
  exportDate: Date;
  systemInfo: {
    totalDonors: number;
    analysisTime: string;
    systemVersion: string;
  };
}

export async function generatePDFReport(data: PDFExportData): Promise<void> {
  try {
    // Create a new window for the PDF content
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      throw new Error(
        "Unable to open print window. Please allow popups for this site."
      );
    }

    // Generate HTML content for the PDF
    const htmlContent = generatePDFHTML(data);

    // Write content to the new window
    printWindow.document.write(htmlContent);
    printWindow.document.close();

    // Wait for content to load, then trigger print
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        // Close the window after printing (optional)
        printWindow.onafterprint = () => {
          printWindow.close();
        };
      }, 500);
    };
  } catch (error) {
    console.error("Error generating PDF report:", error);
    throw new Error("Failed to generate PDF report. Please try again.");
  }
}

function generatePDFHTML(data: PDFExportData): string {
  const { recipientHLA, topMatches, aiInsights, exportDate, systemInfo } = data;

  // Parse AI insights if available
  let parsedInsights: any = null;
  if (aiInsights) {
    try {
      parsedInsights = JSON.parse(aiInsights);
    } catch {
      // If parsing fails, treat as plain text
      parsedInsights = { summary: aiInsights };
    }
  }

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>BioMatch Compatibility Report</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #1f2937;
          background: white;
          padding: 20px;
        }
        
        .header {
          text-align: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 3px solid #0ea5e9;
        }
        
        .logo {
          font-size: 28px;
          font-weight: bold;
          color: #0ea5e9;
          margin-bottom: 5px;
        }
        
        .subtitle {
          color: #6b7280;
          font-size: 14px;
        }
        
        .report-info {
          background: #f8fafc;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 25px;
          border-left: 4px solid #0ea5e9;
        }
        
        .section {
          margin-bottom: 25px;
          page-break-inside: avoid;
        }
        
        .section-title {
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 15px;
          padding-bottom: 5px;
          border-bottom: 2px solid #e5e7eb;
        }
        
        .hla-profile {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
          margin-bottom: 20px;
        }
        
        .hla-item {
          background: #f1f5f9;
          padding: 12px;
          border-radius: 6px;
          text-align: center;
        }
        
        .hla-label {
          font-size: 12px;
          color: #64748b;
          margin-bottom: 5px;
        }
        
        .hla-value {
          font-family: 'Courier New', monospace;
          font-size: 14px;
          font-weight: bold;
          color: #0ea5e9;
        }
        
        .donor-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 15px;
          margin-bottom: 15px;
          page-break-inside: avoid;
        }
        
        .donor-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        
        .donor-id {
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
        }
        
        .compatibility-score {
          font-size: 24px;
          font-weight: bold;
          color: #059669;
        }
        
        .donor-details {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
          margin-bottom: 12px;
        }
        
        .detail-item {
          text-align: center;
          padding: 8px;
          background: #f9fafb;
          border-radius: 4px;
        }
        
        .detail-label {
          font-size: 11px;
          color: #6b7280;
          margin-bottom: 2px;
        }
        
        .detail-value {
          font-size: 13px;
          font-weight: 500;
          color: #1f2937;
        }
        
        .hla-comparison {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          margin-top: 10px;
        }
        
        .hla-match {
          padding: 6px;
          border-radius: 4px;
          text-align: center;
          font-size: 11px;
        }
        
        .hla-match.perfect {
          background: #dcfce7;
          color: #166534;
        }
        
        .hla-match.partial {
          background: #fef3c7;
          color: #92400e;
        }
        
        .hla-match.mismatch {
          background: #fee2e2;
          color: #991b1b;
        }
        
        .ai-insights {
          background: #f0f9ff;
          border: 1px solid #0ea5e9;
          border-radius: 8px;
          padding: 15px;
          margin-top: 20px;
        }
        
        .insight-section {
          margin-bottom: 12px;
        }
        
        .insight-title {
          font-size: 14px;
          font-weight: 600;
          color: #0ea5e9;
          margin-bottom: 5px;
        }
        
        .insight-content {
          font-size: 12px;
          color: #374151;
          line-height: 1.5;
        }
        
        .footer {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          text-align: center;
          font-size: 11px;
          color: #6b7280;
        }
        
        .disclaimer {
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 6px;
          padding: 12px;
          margin: 20px 0;
          font-size: 11px;
          color: #991b1b;
        }
        
        @media print {
          body {
            padding: 0;
          }
          
          .section {
            page-break-inside: avoid;
          }
          
          .donor-card {
            page-break-inside: avoid;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">BioMatch</div>
        <div class="subtitle">AI-Powered Organ Donor Compatibility Report</div>
      </div>
      
      <div class="report-info">
        <strong>Report Generated:</strong> ${exportDate.toLocaleString()}<br>
        <strong>System Version:</strong> ${systemInfo.systemVersion}<br>
        <strong>Total Donors Analyzed:</strong> ${systemInfo.totalDonors}<br>
        <strong>Analysis Time:</strong> ${systemInfo.analysisTime}
      </div>
      
      <div class="section">
        <div class="section-title">Recipient HLA Profile</div>
        <div class="hla-profile">
          <div class="hla-item">
            <div class="hla-label">HLA-A</div>
            <div class="hla-value">${recipientHLA.hlaA}</div>
          </div>
          <div class="hla-item">
            <div class="hla-label">HLA-B</div>
            <div class="hla-value">${recipientHLA.hlaB}</div>
          </div>
          <div class="hla-item">
            <div class="hla-label">HLA-DRB1</div>
            <div class="hla-value">${recipientHLA.hlaDR}</div>
          </div>
        </div>
      </div>
      
      <div class="section">
        <div class="section-title">Top Compatible Donors (${Math.min(
          3,
          topMatches.length
        )} of ${topMatches.length})</div>
        ${topMatches
          .slice(0, 3)
          .map(
            (donor, index) => `
          <div class="donor-card">
            <div class="donor-header">
              <div class="donor-id">Donor #${donor.id} - Rank ${index + 1}</div>
              <div class="compatibility-score">${donor.compatibility}%</div>
            </div>
            
            <div class="donor-details">
              <div class="detail-item">
                <div class="detail-label">Organ</div>
                <div class="detail-value">${donor.organ}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Blood Type</div>
                <div class="detail-value">${donor.bloodType}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Age</div>
                <div class="detail-value">${donor.age} years</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Status</div>
                <div class="detail-value">${donor.availability}</div>
              </div>
            </div>
            
            <div class="hla-comparison">
              <div class="hla-match ${getHLAMatchClass(
                recipientHLA.hlaA,
                donor.hla.hlaA
              )}">
                HLA-A: ${donor.hla.hlaA}
              </div>
              <div class="hla-match ${getHLAMatchClass(
                recipientHLA.hlaB,
                donor.hla.hlaB
              )}">
                HLA-B: ${donor.hla.hlaB}
              </div>
              <div class="hla-match ${getHLAMatchClass(
                recipientHLA.hlaDR,
                donor.hla.hlaDR
              )}">
                HLA-DR: ${donor.hla.hlaDR}
              </div>
            </div>
            
            <div style="margin-top: 10px; font-size: 12px; color: #6b7280;">
              <strong>Location:</strong> ${donor.location} | 
              <strong>Medical Status:</strong> ${donor.medicalStatus}
              ${
                donor.urgencyScore
                  ? ` | <strong>Urgency Score:</strong> ${donor.urgencyScore}/100`
                  : ""
              }
            </div>
          </div>
        `
          )
          .join("")}
      </div>
      
      ${
        parsedInsights
          ? `
        <div class="section">
          <div class="section-title">AI Clinical Analysis</div>
          <div class="ai-insights">
            ${
              parsedInsights.predictiveAnalytics
                ? `
              <div class="insight-section">
                <div class="insight-title">Predictive Analytics</div>
                <div class="insight-content">
                  <strong>Overall Success Rate:</strong> ${
                    parsedInsights.predictiveAnalytics.overallSuccessRate ||
                    "Not available"
                  }<br>
                  ${
                    parsedInsights.predictiveAnalytics.bestMatch
                      ? `
                    <strong>Best Match:</strong> Donor ${parsedInsights.predictiveAnalytics.bestMatch.donorId} 
                    (${parsedInsights.predictiveAnalytics.bestMatch.successProbability} success probability)
                  `
                      : ""
                  }
                </div>
              </div>
            `
                : ""
            }
            
            ${
              parsedInsights.clinicalDecisionSupport
                ? `
              <div class="insight-section">
                <div class="insight-title">Clinical Recommendations</div>
                <div class="insight-content">
                  ${
                    parsedInsights.clinicalDecisionSupport.immediateActions
                      ? parsedInsights.clinicalDecisionSupport.immediateActions
                          .map((action: string) => `• ${action}`)
                          .join("<br>")
                      : ""
                  }
                </div>
              </div>
            `
                : ""
            }
            
            ${
              parsedInsights.summary
                ? `
              <div class="insight-section">
                <div class="insight-title">Summary</div>
                <div class="insight-content">${parsedInsights.summary}</div>
              </div>
            `
                : ""
            }
          </div>
        </div>
      `
          : ""
      }
      
      <div class="disclaimer">
        <strong>IMPORTANT DISCLAIMER:</strong> This report is generated for educational and demonstration purposes only. 
        All donor profiles and compatibility scores are simulated data. This system should never be used for actual 
        medical decisions. Always consult qualified medical professionals and follow established medical protocols 
        for organ transplant matching and decision-making.
      </div>
      
      <div class="footer">
        <div>BioMatch AI-Powered Organ Matching System</div>
        <div>Report generated on ${exportDate.toLocaleDateString()} at ${exportDate.toLocaleTimeString()}</div>
        <div>© 2024 BioMatch - Educational Use Only</div>
      </div>
    </body>
    </html>
  `;
}

function getHLAMatchClass(recipient: string, donor: string): string {
  if (recipient === donor) return "perfect";

  // Check for partial match (same group, different subtype)
  const recipientGroup = recipient.split(":")[0];
  const donorGroup = donor.split(":")[0];

  if (recipientGroup === donorGroup) return "partial";

  return "mismatch";
}

export function downloadJSONReport(data: PDFExportData): void {
  try {
    const jsonData = {
      reportType: "BioMatch Compatibility Analysis",
      exportDate: data.exportDate.toISOString(),
      systemInfo: data.systemInfo,
      recipientProfile: {
        hlaA: data.recipientHLA.hlaA,
        hlaB: data.recipientHLA.hlaB,
        hlaDR: data.recipientHLA.hlaDR,
        age: data.recipientAge,
      },
      compatibilityResults: data.topMatches.map((donor, index) => ({
        rank: index + 1,
        donorId: donor.id,
        compatibilityScore: donor.compatibility,
        organ: donor.organ,
        bloodType: donor.bloodType,
        age: donor.age,
        location: donor.location,
        availability: donor.availability,
        medicalStatus: donor.medicalStatus,
        hlaProfile: donor.hla,
        urgencyScore: donor.urgencyScore,
        donorType: donor.donorType,
        organCondition: donor.organCondition,
      })),
      aiInsights: data.aiInsights ? JSON.parse(data.aiInsights) : null,
    };

    const blob = new Blob([JSON.stringify(jsonData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `biomatch-report-${
      new Date().toISOString().split("T")[0]
    }.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading JSON report:", error);
    throw new Error("Failed to download JSON report. Please try again.");
  }
}
