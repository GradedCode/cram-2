import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UploadInterface } from '@/components/UploadInterface';
import { TimeboxSelector } from '@/components/TimeboxSelector';
import { CramGuidePreview } from '@/components/CramGuidePreview';
import { Clock, Zap, Target, Star, ArrowRight } from 'lucide-react';
import heroImage from '@/assets/hero-study.jpg';
import * as pdfjs from 'pdfjs-dist';
import mammoth from 'mammoth';
import PptxParser from 'pptx-parser';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const Index = () => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [currentStep, setCurrentStep] = useState<'hero' | 'upload' | 'timebox' | 'preview'>('hero');
  const [extractedText, setExtractedText] = useState<string>('');

  const parseFile = async (file: File): Promise<string> => {
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
      reader.onload = async (event) => {
        if (!event.target?.result) {
          return reject('FileReader error');
        }
        const arrayBuffer = event.target.result as ArrayBuffer;

        try {
          if (file.name.endsWith('.pdf')) {
            const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
            let text = '';
            for (let i = 1; i <= pdf.numPages; i++) {
              const page = await pdf.getPage(i);
              const content = await page.getTextContent();
              text += content.items.map(item => (item as any).str).join(' ');
            }
            resolve(text);
          } else if (file.name.endsWith('.docx')) {
            const result = await mammoth.extractRawText({ arrayBuffer });
            resolve(result.value);
          } else if (file.name.endsWith('.pptx')) {
            const parser = new PptxParser();
            const result = await parser.parse(arrayBuffer);
            if (result && result.slides) {
                resolve(result.slides.map(slide => slide.text).join('\n\n'));
            } else {
                resolve('');
            }
          } else {
            resolve('File type not supported');
          }
        } catch (error) {
          console.error('Error parsing file:', error);
          reject(`Error parsing ${file.name}`);
        }
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsArrayBuffer(file);
    });
  };

  const handleGetStarted = () => {
    setCurrentStep('upload');
  };

  const handleUploadComplete = async (files: File[]) => {
    setUploadedFiles(prev => [...prev, ...files]);
    
    let combinedText = '';
    for (const file of files) {
      try {
        const text = await parseFile(file);
        combinedText += text + '\n\n';
      } catch (error) {
        console.error(error);
        combinedText += `Could not parse ${file.name}\n\n`;
      }
    }
    setExtractedText(combinedText.trim());

    if (files.length > 0) {
      setCurrentStep('timebox');
    }
  };

  const handleTimeSelect = (duration: string) => {
    setSelectedTime(duration);
    setCurrentStep('preview');
  };

  const handleGenerate = () => {
    setCurrentStep('preview');
  };

  if (currentStep === 'hero') {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="w-fit bg-accent/10 text-accent border-accent/20">
                  <Zap className="h-3 w-3 mr-1" />
                  Study Panic-Proof
                </Badge>
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  Cram Smarter, Not{' '}
                  <span className="bg-gradient-hero bg-clip-text text-transparent">
                    Harder
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Transform your notes and past papers into personalized, timeboxed study guides. 
                  Get exam-ready in minutes, not hours.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  variant="hero" 
                  size="lg" 
                  onClick={handleGetStarted}
                  className="text-lg px-8 py-6"
                >
                  Start Cramming Now
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                  See How It Works
                </Button>
              </div>

              {/* Feature Highlights */}
              <div className="grid sm:grid-cols-3 gap-4 mt-8">
                <div className="flex items-center gap-3 p-4 bg-card rounded-lg shadow-card-study">
                  <Clock className="h-8 w-8 text-accent" />
                  <div>
                    <p className="font-semibold">15min - 8hrs</p>
                    <p className="text-sm text-muted-foreground">Adaptive timing</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-card rounded-lg shadow-card-study">
                  <Target className="h-8 w-8 text-primary" />
                  <div>
                    <p className="font-semibold">AI-Powered</p>
                    <p className="text-sm text-muted-foreground">Smart prioritization</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-card rounded-lg shadow-card-study">
                  <Star className="h-8 w-8 text-success" />
                  <div>
                    <p className="font-semibold">Exam-Ready</p>
                    <p className="text-sm text-muted-foreground">Proven effective</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:order-last">
              <Card className="overflow-hidden shadow-float border-primary/20">
                <CardContent className="p-0">
                  <img 
                    src={heroImage} 
                    alt="Student studying with AI-powered cram guide" 
                    className="w-full h-auto rounded-lg"
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="container mx-auto px-4 pb-16">
          <div className="text-center mb-8">
            <p className="text-muted-foreground">Trusted by students at</p>
          </div>
          <div className="flex justify-center items-center gap-8 opacity-60">
            <Badge variant="outline" className="px-4 py-2">MIT</Badge>
            <Badge variant="outline" className="px-4 py-2">Stanford</Badge>
            <Badge variant="outline" className="px-4 py-2">Oxford</Badge>
            <Badge variant="outline" className="px-4 py-2">Cambridge</Badge>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-6 w-6 text-accent" />
              <span className="text-xl font-bold">CramSmart</span>
            </div>
            <Button 
              variant="ghost" 
              onClick={() => setCurrentStep('hero')}
            >
              ← Back to Home
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            {(currentStep === 'upload' || currentStep === 'timebox' || currentStep === 'preview') && (
              <UploadInterface onUploadComplete={handleUploadComplete} />
            )}
            
            {(currentStep === 'timebox' || currentStep === 'preview') && (
              <TimeboxSelector onTimeSelect={handleTimeSelect} />
            )}
          </div>

          <div>
            <CramGuidePreview 
              extractedText={extractedText} 
              onGenerate={handleGenerate} 
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
