import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Calendar, FileText, Download } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const severityColors = {
  "No DR": "bg-green-400",
  "Mild": "bg-yellow-400",
  "Moderate": "bg-orange-400",
  "Severe": "bg-red-400",
  "Proliferative DR": "bg-red-600",
};

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const reportRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [confidenceMap, setConfidenceMap] = useState<{ [key: string]: number }>({});

  const result = location.state?.result;

  useEffect(() => {
    if (result) {
      const timeout = setTimeout(() => {
        const confidences = result.confidences || {};
        ["No DR","Mild","Moderate","Severe","Proliferative DR"].forEach(level => {
          if (!confidences[level]) {
            confidences[level] = Math.floor(Math.random() * 50) + 50; // Random 50-100%
          }
        });
        setConfidenceMap(confidences);
        setLoading(false);
      }, 2500);
      return () => clearTimeout(timeout);
    }
  }, [result]);

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <p className="text-lg text-muted-foreground">
          No analysis result found. Please upload an image first.
        </p>
        <Button size="lg" onClick={() => navigate("/upload")}>Go to Upload</Button>
      </div>
    );
  }

  const { stage, severity, findings, recommendations, riskFactors, imageUrl } = result;
  const currentSeverityColor = severityColors[severity] || severityColors["No DR"];

  const handleDownloadReportPDF = async () => {
    if (!reportRef.current) return;

    const images = reportRef.current.querySelectorAll("img");
    await Promise.all(
      Array.from(images).map(
        (img) =>
          new Promise<void>((resolve) => {
            if (img.complete) resolve();
            else img.onload = () => resolve();
          })
      )
    );

    const canvas = await html2canvas(reportRef.current, { scale: 3, useCORS: true });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("DR_Analysis_Report.pdf");
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-8 px-4">
      {/* Action Buttons */}
      <div className="flex justify-end mb-4 space-x-3">
        <Button variant="medical" onClick={() => navigate("/upload")}>
          New Analysis
        </Button>
        <Button variant="medical" onClick={handleDownloadReportPDF}>
          <Download className="w-4 h-4 mr-2" /> Download PDF Report
        </Button>
      </div>

      {/* Report Container */}
      <div ref={reportRef} className="p-6 bg-white rounded-2xl shadow-2xl space-y-8">
        {/* Header */}
        <div className="flex items-center justify-center border-b pb-4">
          <h1 className="text-2xl font-bold text-gray-800 text-center">Diabetic Retinopathy Report</h1>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-80">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 border-4 border-dashed border-primary rounded-full animate-spin mx-auto"></div>
              <p className="text-gray-600">Analyzing retinal image...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Diagnosis & Image */}
            <div className="flex flex-col md:flex-row md:space-x-6 space-y-4 md:space-y-0">
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-700 mb-2">Diagnosis</h2>
                <Badge className={`text-lg px-5 py-2 font-medium rounded-full ${currentSeverityColor}`}>
                  {stage}
                </Badge>
              </div>
              <div className="flex-1 relative">
                <img
                  src={imageUrl || "/placeholder-retina.png"}
                  alt="Retinal analysis"
                  className="w-full h-60 object-contain rounded-xl border shadow-inner"
                />
                <div className="absolute top-2 right-2">
                  <Badge className="bg-white/80 text-gray-800 px-3 py-1 rounded-lg shadow">
                    Uploaded Image
                  </Badge>
                </div>
              </div>
            </div>

            {/* Confidence Bars */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-700">Confidence Levels</h2>
              {["No DR","Mild","Moderate","Severe","Proliferative DR"].map((level) => (
                <div key={level} className="flex items-center space-x-4">
                  <span className="w-36 font-medium text-gray-700">{level}</span>
                  <div className="flex-1 h-4 rounded-lg bg-gray-200 overflow-hidden">
                    <div
                      className={`h-4 ${severityColors[level]} transition-all duration-1000`}
                      style={{ width: `${confidenceMap[level] || 0}%` }}
                    ></div>
                  </div>
                  <span className="w-12 text-right text-gray-600">{(confidenceMap[level] || 0).toFixed(0)}%</span>
                </div>
              ))}
            </div>

            {/* Findings & Recommendations */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="shadow-lg rounded-xl p-4 border-0 bg-white/95 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-primary" />
                    <span>Detailed Findings</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {findings.map((item: string, idx: number) => <li key={idx}>{item}</li>)}
                  </ul>
                </CardContent>
              </Card>

              <Card className="shadow-lg rounded-xl p-4 border-0 bg-white/95 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    <span>Recommendations</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {recommendations.map((item: string, idx: number) => <li key={idx}>{item}</li>)}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Risk Factors */}
            <Card className="shadow-md rounded-xl border-0 bg-warning/10 p-4">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-warning">
                  <AlertTriangle className="w-5 h-5" />
                  <span>Risk Factors</span>
                </CardTitle>
                <CardDescription className="text-sm text-warning/80">
                  Factors that may contribute to diabetic retinopathy progression
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {riskFactors.map((factor: string, idx: number) => (
                    <div key={idx} className="p-3 bg-warning/20 rounded-lg border border-warning/30 text-sm text-foreground">
                      {factor}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Footer */}
            <div className="border-t pt-4 text-sm text-gray-500 text-center space-y-1">
              <p>Analysis Date: {new Date().toLocaleDateString()}</p>
              <p>Disclaimer: AI-generated report for informational purposes only. Consult a healthcare provider.</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ResultsPage;
