import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { BookOpen, Download, AlertCircle, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAi, AiResponse, SummaryLength } from '@/hooks/use-ai';
import { Report } from '@/components/Report';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useRef, useState, useEffect } from 'react';

interface CramGuidePreviewProps {
  extractedText: string;
  onGenerate?: () => void;
}

export function CramGuidePreview({ extractedText, onGenerate }: CramGuidePreviewProps) {
  const { toast } = useToast();
  const { isGenerating, error: aiError, generate } = useAi();
  const [reportData, setReportData] = useState<AiResponse | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [numFlashcards, setNumFlashcards] = useState(10);
  const [summaryLength, setSummaryLength] = useState<SummaryLength>('medium');
  const reportRef = useRef(null);

  useEffect(() => {
    const savedApiKey = localStorage.getItem('gemini-api-key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  const handleSaveApiKey = () => {
    localStorage.setItem('gemini-api-key', apiKey);
    toast({
      title: 'API Key Saved',
      description: 'Your Gemini API key has been saved locally.',
    });
  };

  const handleGenerateReport = async () => {
    if (!apiKey) {
      toast({
        title: 'API Key Required',
        description: 'Please enter your Gemini API key to generate a report.',
        variant: 'destructive',
      });
      return;
    }
    if (onGenerate) {
      onGenerate();
    }
    try {
      const data = await generate(extractedText, apiKey, numFlashcards, summaryLength);
      setReportData(data);
    } catch (e) {
      // The useAi hook handles setting the error state
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
              {reportData ? 'Your report is ready!' : 'Generate a report from your uploaded materials'}
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
          <div className="space-y-6 text-center">
            <div className="grid gap-4">
                <div className="flex flex-col items-start gap-2">
                    <Label htmlFor="api-key">Gemini API Key</Label>
                    <div className="flex w-full items-center gap-2">
                        <Input
                        id="api-key"
                        type="password"
                        placeholder="Enter your API key"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        />
                        <Button onClick={handleSaveApiKey} variant="secondary">Save</Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Get your key from{' '}
                        <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="underline">AI Studio</a>.
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col items-start gap-2">
                        <Label htmlFor="num-flashcards">Number of Flashcards: {numFlashcards}</Label>
                        <Slider
                            id="num-flashcards"
                            min={5}
                            max={20}
                            step={1}
                            value={[numFlashcards]}
                            onValueChange={(value) => setNumFlashcards(value[0])}
                        />
                    </div>
                    <div className="flex flex-col items-start gap-2">
                        <Label>Summary Length</Label>
                        <ToggleGroup type="single" value={summaryLength} onValueChange={(value) => setSummaryLength(value as SummaryLength)} className="w-full">
                            <ToggleGroupItem value="short" className="w-full">Short</ToggleGroupItem>
                            <ToggleGroupItem value="medium" className="w-full">Medium</ToggleGroupItem>
                            <ToggleGroupItem value="long" className="w-full">Long</ToggleGroupItem>
                        </ToggleGroup>
                    </div>
                </div>
            </div>
            <Button onClick={handleGenerateReport} disabled={isGenerating || !extractedText || !apiKey} className="w-full">
              {isGenerating ? 'Generating...' : 'Generate Report'}
            </Button>
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
