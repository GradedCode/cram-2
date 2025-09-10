import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Clock, CheckCircle, BookOpen, Download, Share2, FileText, ExternalLink, 
         AlertTriangle, Battery, Target, Zap, Brain, Heart, Timer, Gauge } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

interface TimeSlot {
  startTime: string;
  endTime: string;
  duration: number;
  task: string;
  priority: 'CRITICAL' | 'HIGH_IMPACT' | 'DEPTH' | 'BREAK';
  completed: boolean;
  confidence: number;
  energyBefore: number;
  energyAfter: number;
  notes: string;
  resources: string[];
  startedAt?: string;
  finishedAt?: string;
}

interface StudyPlan {
  examName: string;
  examDate: string;
  timeLeft: string;
  motivation: string;
  schedule: TimeSlot[];
  quickReference: { formula: string; definition: string }[];
  currentProgress: number;
  overallEnergy: number;
  weakAreas: string[];
}

interface CramGuidePreviewProps {
  timeSelected?: string;
  filesUploaded?: number;
}

export function CramGuidePreview({ timeSelected, filesUploaded = 0 }: CramGuidePreviewProps) {
  const { toast } = useToast();
  const [expandedSlot, setExpandedSlot] = useState<number | null>(null);
  const [showPanicMode, setShowPanicMode] = useState(false);
  const [currentEnergy, setCurrentEnergy] = useState(4);
  
  // Generate time slots based on selected duration
  const generateTimeSlots = (duration: string): TimeSlot[] => {
    const baseSlots: Partial<TimeSlot>[] = [];
    const now = new Date();
    
    if (duration === '15min') {
      baseSlots.push(
        { task: 'Key Formulas Review', duration: 5, priority: 'CRITICAL' },
        { task: 'Practice Questions', duration: 8, priority: 'CRITICAL' },
        { task: 'Final Quick Review', duration: 2, priority: 'HIGH_IMPACT' }
      );
    } else if (duration === '30min') {
      baseSlots.push(
        { task: 'Core Concepts Review', duration: 10, priority: 'CRITICAL' },
        { task: 'Practice Problems', duration: 15, priority: 'CRITICAL' },
        { task: 'Quick Reference Check', duration: 5, priority: 'HIGH_IMPACT' }
      );
    } else if (duration === '1hr') {
      baseSlots.push(
        { task: 'Chapter 1 Summary', duration: 20, priority: 'CRITICAL' },
        { task: 'Practice Questions', duration: 25, priority: 'CRITICAL' },
        { task: 'Break', duration: 5, priority: 'BREAK' },
        { task: 'Weak Areas Focus', duration: 10, priority: 'HIGH_IMPACT' }
      );
    } else if (duration === '2hr') {
      baseSlots.push(
        { task: 'Topic 1 Deep Dive', duration: 35, priority: 'CRITICAL' },
        { task: 'Break', duration: 10, priority: 'BREAK' },
        { task: 'Practice Problems', duration: 40, priority: 'CRITICAL' },
        { task: 'Break', duration: 10, priority: 'BREAK' },
        { task: 'Topic 2 Review', duration: 20, priority: 'HIGH_IMPACT' },
        { task: 'Final Review', duration: 5, priority: 'DEPTH' }
      );
    } else {
      baseSlots.push(
        { task: 'Topic 1 Comprehensive', duration: 45, priority: 'CRITICAL' },
        { task: 'Break', duration: 15, priority: 'BREAK' },
        { task: 'Practice Session 1', duration: 45, priority: 'CRITICAL' },
        { task: 'Break', duration: 15, priority: 'BREAK' },
        { task: 'Topic 2 Deep Study', duration: 60, priority: 'HIGH_IMPACT' },
        { task: 'Break', duration: 15, priority: 'BREAK' },
        { task: 'Advanced Topics', duration: 45, priority: 'DEPTH' },
        { task: 'Final Review', duration: 20, priority: 'HIGH_IMPACT' }
      );
    }
    
    let currentTime = new Date(now);
    return baseSlots.map((slot, index) => {
      const startTime = new Date(currentTime);
      currentTime.setMinutes(currentTime.getMinutes() + (slot.duration || 0));
      const endTime = new Date(currentTime);
      
      return {
        startTime: startTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        endTime: endTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        duration: slot.duration || 0,
        task: slot.task || '',
        priority: slot.priority as TimeSlot['priority'],
        completed: index === 0, // Mark first item as completed for demo
        confidence: Math.floor(Math.random() * 3) + 3, // 3-5 rating
        energyBefore: 4,
        energyAfter: 0,
        notes: '',
        resources: slot.priority === 'CRITICAL' ? ['Key formulas', 'Past papers'] : ['Study notes'],
      };
    });
  };

  const studyPlan: StudyPlan = {
    examName: 'Computer Science Final',
    examDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    timeLeft: timeSelected ? `${timeSelected} session` : '2 days',
    motivation: 'Focus now, relax later.',
    schedule: generateTimeSlots(timeSelected || '1hr'),
    quickReference: [
      { formula: 'Big O(n) = O(n²)', definition: 'Time complexity for nested loops' },
      { formula: 'Binary Search = O(log n)', definition: 'Divide and conquer search' },
      { formula: 'Hash Table = O(1)', definition: 'Average case lookup time' }
    ],
    currentProgress: 15,
    overallEnergy: currentEnergy,
    weakAreas: ['Graph Algorithms', 'Dynamic Programming', 'System Design']
  };

  const handleDownload = () => {
    const cramGuideContent = generateDetailedCramGuideText();
    const blob = new Blob([cramGuideContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cram-guide-${timeSelected || 'study'}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded!",
      description: "Your cram guide has been saved to your device.",
    });
  };

  const handleNotepadExport = () => {
    const content = generateDetailedCramGuideText();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `notepad-cram-guide.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Notepad Export Ready!",
      description: "Text file downloaded for Notepad.",
    });
  };

  const handleNotionExport = async () => {
    const notionContent = generateNotionFormattedText();
    try {
      await navigator.clipboard.writeText(notionContent);
      toast({
        title: "Copied for Notion!",
        description: "Formatted text copied to clipboard. Paste in Notion.",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Please try again or use download instead.",
        variant: "destructive",
      });
    }
  };

  const generateNotionFormattedText = () => {
    return `# 📘 CRAM PLAN • ${studyPlan.examName}
🗓️ ${studyPlan.examDate} • ⏳ ${studyPlan.timeLeft}

💪 Focus Mantra: "${studyPlan.motivation}"

---

## ⏱️ Time-Blocked Schedule

${studyPlan.schedule.map(slot => `
### ${slot.completed ? '☑️' : '☐'} ${slot.startTime} - ${slot.endTime} | ${slot.task} (${slot.duration}min)
**Priority:** ${slot.priority === 'CRITICAL' ? '🔥 CRITICAL' : slot.priority === 'HIGH_IMPACT' ? '⚡ HIGH IMPACT' : slot.priority === 'DEPTH' ? '📚 DEPTH' : '🚨 BREAK'}
**Resources:** ${slot.resources.join(', ')}
**Confidence:** ${'★'.repeat(slot.confidence)}${'☆'.repeat(5-slot.confidence)}
**Energy:** ${'😃'.repeat(slot.energyBefore)}

---
`).join('\n')}

## 📌 Quick Reference
${studyPlan.quickReference.map(ref => `**${ref.formula}:** ${ref.definition}`).join('\n')}

## 📊 Progress Tracking
**Progress:** ${'▓'.repeat(Math.floor(studyPlan.currentProgress/10))}${'░'.repeat(10-Math.floor(studyPlan.currentProgress/10))} ${studyPlan.currentProgress}%
**Energy:** ${'😃'.repeat(studyPlan.overallEnergy)}
**Weak Areas:** ${studyPlan.weakAreas.join(', ')}

*Generated by CramSmart - Study Panic-Proof* 🚀`;
  };

  const generateDetailedCramGuideText = () => {
    return `
📘 CRAM PLAN • ${studyPlan.examName}
Generated: ${new Date().toLocaleDateString()}
Exam Date: ${studyPlan.examDate}
Time Left: ${studyPlan.timeLeft}

💪 Motivation: "${studyPlan.motivation}"

=================================================

⏱️ TIME-BLOCKED SCHEDULE

${studyPlan.schedule.map(slot => `
${slot.startTime} - ${slot.endTime} | ${slot.task} (${slot.duration} min)
Priority: ${slot.priority === 'CRITICAL' ? '🔥 CRITICAL' : slot.priority === 'HIGH_IMPACT' ? '⚡ HIGH IMPACT' : slot.priority === 'DEPTH' ? '📚 DEPTH' : '🚨 BREAK'}
Status: ${slot.completed ? '[✓ COMPLETED]' : '[○ PENDING]'}
Resources: ${slot.resources.join(', ')}
Confidence: ${'★'.repeat(slot.confidence)}${'☆'.repeat(5-slot.confidence)}
Energy: ${'😃'.repeat(slot.energyBefore)}

`).join('')}

📌 QUICK REFERENCE CHEAT SHEET
${studyPlan.quickReference.map(ref => `${ref.formula}: ${ref.definition}`).join('\n')}

📊 PROGRESS & REFLECTION
Progress Bar: ${'▓'.repeat(Math.floor(studyPlan.currentProgress/10))}${'░'.repeat(10-Math.floor(studyPlan.currentProgress/10))} ${studyPlan.currentProgress}%
Energy Check: ${'😃'.repeat(studyPlan.overallEnergy)}${'😐'.repeat(5-studyPlan.overallEnergy)}
Notes for Review Tonight:
${studyPlan.weakAreas.map(area => `  • ${area}`).join('\n')}

=================================================
Generated by CramSmart - Study Panic-Proof
    `.trim();
  };

  const handleShare = async () => {
    const shareData = {
      title: 'My Cram Guide',
      text: `Check out my personalized ${timeSelected || 'study'} cram guide!`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast({
          title: "Shared!",
          description: "Your cram guide has been shared.",
        });
      } catch (error) {
        console.log('Share failed:', error);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
        toast({
          title: "Copied to clipboard!",
          description: "Share link copied to clipboard.",
        });
      } catch (error) {
        toast({
          title: "Share unavailable",
          description: "Sharing is not supported on this device.",
          variant: "destructive",
        });
      }
    }
  };

  const generateCramGuideText = () => {
    return generateDetailedCramGuideText();
  };

  const getPriorityColor = (priority: TimeSlot['priority']) => {
    switch (priority) {
      case 'CRITICAL': return 'bg-destructive text-destructive-foreground';
      case 'HIGH_IMPACT': return 'bg-accent text-accent-foreground';
      case 'DEPTH': return 'bg-primary text-primary-foreground';
      case 'BREAK': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted';
    }
  };

  const getPriorityIcon = (priority: TimeSlot['priority']) => {
    switch (priority) {
      case 'CRITICAL': return <Zap className="h-4 w-4" />;
      case 'HIGH_IMPACT': return <Target className="h-4 w-4" />;
      case 'DEPTH': return <Brain className="h-4 w-4" />;
      case 'BREAK': return <Heart className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const updateSlotCompletion = (index: number, completed: boolean) => {
    // In a real app, this would update the data
    console.log(`Slot ${index} completion: ${completed}`);
  };

  const renderPanicMode = () => (
    <Card className="border-destructive bg-destructive/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <AlertTriangle className="h-5 w-5" />
          🧘 PANIC BUTTON
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="font-medium">Feeling overwhelmed? Try this:</p>
        <ol className="list-decimal list-inside space-y-2 text-sm">
          <li>Take 5 deep breaths</li>
          <li>Review what you've already completed ✅</li>
          <li>Pick the easiest remaining task</li>
          <li>Set timer for 25 minutes only</li>
        </ol>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setShowPanicMode(false)}
          className="w-full"
        >
          I'm Ready to Continue
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <Card className="bg-gradient-subtle border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Your Cram Guide Preview
            </CardTitle>
            <CardDescription>
              {timeSelected ? `Optimized for ${timeSelected} study session` : 'Upload materials to generate your personalized guide'}
            </CardDescription>
          </div>
          {filesUploaded > 0 && (
            <div className="flex gap-1">
              <Button variant="outline" size="sm" onClick={handleDownload} title="Download as Text">
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleNotepadExport} title="Export to Notepad">
                <FileText className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleNotionExport} title="Copy for Notion">
                <ExternalLink className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare} title="Share">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {filesUploaded > 0 ? (
          <div className="space-y-6">
            {/* Study Plan Header */}
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-4 rounded-lg border">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-bold">📘 {studyPlan.examName}</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPanicMode(!showPanicMode)}
                  className="text-destructive border-destructive hover:bg-destructive/10"
                >
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  Panic Button
                </Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Exam Date</p>
                  <p className="font-medium">🗓️ {studyPlan.examDate}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Time Left</p>
                  <p className="font-medium">⏳ {studyPlan.timeLeft}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Energy Level</p>
                  <p className="font-medium">{'😃'.repeat(currentEnergy)}{'😐'.repeat(5-currentEnergy)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Progress</p>
                  <p className="font-medium">📊 {studyPlan.currentProgress}%</p>
                </div>
              </div>
              <div className="mt-3 p-2 bg-primary/10 rounded text-center">
                <p className="font-medium text-primary">💪 "{studyPlan.motivation}"</p>
              </div>
            </div>

            {/* Panic Mode */}
            {showPanicMode && renderPanicMode()}

            {/* Time-Blocked Schedule */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Timer className="h-5 w-5" />
                ⏱️ Time-Blocked Schedule
              </h3>
              <div className="space-y-2">
                {studyPlan.schedule.map((slot, index) => (
                  <div key={index} className="bg-card rounded-lg border overflow-hidden">
                    <div 
                      className="flex items-center justify-between p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => setExpandedSlot(expandedSlot === index ? null : index)}
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox 
                          checked={slot.completed}
                          onCheckedChange={(checked) => updateSlotCompletion(index, !!checked)}
                        />
                        <div className="flex items-center gap-2">
                          {getPriorityIcon(slot.priority)}
                          <span className={`font-medium ${slot.completed ? 'line-through text-muted-foreground' : ''}`}>
                            {slot.startTime} - {slot.endTime}
                          </span>
                        </div>
                        <span className="text-sm font-medium">{slot.task}</span>
                        <Badge variant="outline" className="text-xs">
                          {slot.duration}min
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getPriorityColor(slot.priority)}>
                          {slot.priority === 'CRITICAL' ? '🔥 CRITICAL' : 
                           slot.priority === 'HIGH_IMPACT' ? '⚡ HIGH IMPACT' :
                           slot.priority === 'DEPTH' ? '📚 DEPTH' : '🚨 BREAK'}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {expandedSlot === index ? '−' : '+'}
                        </span>
                      </div>
                    </div>
                    
                    {expandedSlot === index && (
                      <div className="px-3 pb-3 space-y-3 border-t bg-muted/20">
                        <div className="grid md:grid-cols-2 gap-4 pt-3">
                          <div>
                            <p className="text-sm font-medium mb-2">📚 Resources:</p>
                            <div className="space-y-1">
                              {slot.resources.map((resource, i) => (
                                <p key={i} className="text-xs text-muted-foreground">• {resource}</p>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-medium mb-2">⚡ Confidence Level:</p>
                            <p className="text-sm">{'★'.repeat(slot.confidence)}{'☆'.repeat(5-slot.confidence)} ({slot.confidence}/5)</p>
                          </div>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium mb-1">🔋 Energy Before:</p>
                            <div className="flex items-center gap-1">
                              {[1,2,3,4,5].map(level => (
                                <Button
                                  key={level}
                                  variant={slot.energyBefore >= level ? "default" : "outline"}
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={() => {/* Update energy */}}
                                >
                                  {level <= slot.energyBefore ? '😃' : '😐'}
                                </Button>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-medium mb-1">📝 Quick Notes:</p>
                            <input 
                              type="text" 
                              placeholder="Add notes..."
                              className="w-full text-xs p-1 border rounded"
                              defaultValue={slot.notes}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Reference */}
            <div>
              <h3 className="font-semibold mb-3">📌 Quick Reference Cheat Sheet</h3>
              <div className="bg-primary/5 p-4 rounded-lg border">
                <div className="grid gap-2">
                  {studyPlan.quickReference.map((ref, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 bg-card rounded border">
                      <code className="text-sm font-mono bg-muted px-2 py-1 rounded">{ref.formula}</code>
                      <span className="text-sm text-muted-foreground">{ref.definition}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Progress Tracking */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-success/10 rounded-lg border">
                <div className="text-2xl font-bold text-success">
                  {studyPlan.schedule.filter(s => s.completed).length}
                </div>
                <div className="text-sm text-muted-foreground">Completed</div>
                <div className="text-xs text-success mt-1">
                  {'▓'.repeat(Math.floor(studyPlan.schedule.filter(s => s.completed).length / 2))}
                </div>
              </div>
              <div className="text-center p-4 bg-accent/10 rounded-lg border">
                <div className="text-2xl font-bold text-accent">
                  {studyPlan.schedule.filter(s => !s.completed && s.priority !== 'BREAK').length}
                </div>
                <div className="text-sm text-muted-foreground">Remaining</div>
                <div className="text-xs text-accent mt-1">
                  {'▓'.repeat(Math.floor(studyPlan.currentProgress/10))}{'░'.repeat(10-Math.floor(studyPlan.currentProgress/10))}
                </div>
              </div>
              <div className="text-center p-4 bg-primary/10 rounded-lg border">
                <div className="text-2xl font-bold text-primary flex items-center justify-center gap-1">
                  <Gauge className="h-6 w-6" />
                  {studyPlan.currentProgress}%
                </div>
                <div className="text-sm text-muted-foreground">Overall Progress</div>
                <div className="text-xs mt-1">
                  {'😃'.repeat(currentEnergy)}{'😐'.repeat(5-currentEnergy)}
                </div>
              </div>
            </div>

            {/* Weak Areas */}
            <div className="bg-warning/10 p-4 rounded-lg border border-warning/20">
              <h4 className="font-medium mb-2 text-warning">🎯 Focus Areas for Tonight:</h4>
              <div className="flex flex-wrap gap-2">
                {studyPlan.weakAreas.map((area, index) => (
                  <Badge key={index} variant="outline" className="border-warning text-warning">
                    {area}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Upload your study materials to see a personalized cram guide</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}