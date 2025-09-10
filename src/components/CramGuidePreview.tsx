import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Download, AlertCircle, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLocalAi, AiResponse } from '@/hooks/use-local-ai';
import { Report } from '@/components/Report';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useRef, useState } from 'react';

interface CramGuidePreviewProps {
  extractedText: string;
  onGenerate?: () => void;
}

export function CramGuidePreview({ extractedText, onGenerate }: CramGuidePreviewProps) {
  const { toast } = useToast();
  const { isGenerating, error: aiError, generate, progress } = useLocalAi();
  const [reportData, setReportData] = useState<AiResponse | null>(null);
  const reportRef = useRef(null);

  const handleGenerateReport = async () => {
    if (onGenerate) {
      onGenerate();
    }
    try {
      const data = await generate(extractedText);
      setReportData(data);
    } catch (e) {
      // The useLocalAi hook handles setting the error state
    }
  };

  const handleDownloadPdf = async () => {
    if (!reportRef.current) return;

    toast({ title: 'Generating PDF...', description: 'Please wait a moment.' });

    const canvas = await html2canvas(reportRef.current, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('cram-guide.pdf');

    toast({
      title: "Downloaded!",
      description: "Your cram guide has been saved as a PDF.",
    });
  };

  return (
    <Card className="bg-gradient-subtle border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Your Cram Guide
            </CardTitle>
            <CardDescription>
              {reportData ? 'Your report is ready!' : isGenerating ? 'Generating your report...' : 'Generate a report from your uploaded materials'}
            </CardDescription>
          </div>
          {reportData && (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleGenerateReport} disabled={isGenerating}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Regenerate
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownloadPdf}>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {reportData ? (
          <div ref={reportRef}>
            <Report {...reportData} />
          </div>
        ) : (
          <div className="space-y-4 text-center">
             {isGenerating ? (
              <div className="space-y-2">
                <Progress value={progress} />
                <p className="text-sm text-muted-foreground">Your report is being generated locally. This may take a moment.</p>
              </div>
            ) : (
              <Button onClick={handleGenerateReport} disabled={isGenerating || !extractedText} className="w-full">
                Generate Report
              </Button>
            )}

            {aiError && (
              <div className="text-red-500 text-sm flex items-center gap-2 p-2 bg-red-500/10 rounded-md">
                <AlertCircle className="h-4 w-4" />
                {aiError}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
