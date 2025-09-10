import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Clock, CheckCircle, BookOpen, Download, Share2, FileText, ExternalLink, 
         AlertTriangle, Battery, Target, Zap, Brain, Heart, Timer, Gauge } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

interface TimeSlot {
  timeSlot: string;
  taskTopic: string;
  priority: 'High' | 'Med' | 'Low' | '—';
  notesResources: string;
  completed: boolean;
}

interface PriorityItem {
  topic: string;
  completed: boolean;
}

interface StudyPlan {
  examName: string;
  examDate: string;
  timeLeft: string;
  motivation: string;
  schedule: TimeSlot[];
  highPriority: PriorityItem[];
  mediumPriority: PriorityItem[];
  lowPriority: PriorityItem[];
  quickReference: string[];
  progressPercent: number;
  energyLevel: '😃' | '🙂' | '😐' | '😴';
  reviewNotes: string[];
}

interface CramGuidePreviewProps {
  timeSelected?: string;
  filesUploaded?: number;
}

export function CramGuidePreview({ timeSelected, filesUploaded = 0 }: CramGuidePreviewProps) {
  const { toast } = useToast();
  
  // Generate time-blocked schedule based on selected duration - matching the original template
  const generateSchedule = (duration: string): TimeSlot[] => {
    const now = new Date();
    let currentTime = new Date(now);
    
    // Define time durations for each task type
    const getSlotDuration = (taskType: string, sessionDuration: string): number => {
      if (sessionDuration === '15min') {
        if (taskType.includes('Review')) return 5;
        if (taskType.includes('Practice')) return 8;
        return 2;
      } else if (sessionDuration === '30min') {
        if (taskType.includes('Summary')) return 10;
        if (taskType.includes('Practice')) return 15;
        return 5;
      } else if (sessionDuration === '1hr') {
        if (taskType.includes('Summary')) return 20;
        if (taskType.includes('Practice')) return 25;
        if (taskType.includes('Break')) return 5;
        return 10;
      } else if (sessionDuration === '2hr') {
        if (taskType.includes('Break')) return 10;
        if (taskType.includes('Summary')) return 20;
        if (taskType.includes('Practice')) return 25;
        return 20;
      } else {
        if (taskType.includes('Break')) return 30;
        return 60;
      }
    };
    
    // Define schedule templates
    let scheduleTemplate: Array<{taskTopic: string; priority: TimeSlot['priority']; notesResources: string}> = [];
    
    if (duration === '15min') {
      scheduleTemplate = [
        { taskTopic: 'Key Formulas Review', priority: 'High', notesResources: 'Key definitions' },
        { taskTopic: 'Practice Questions', priority: 'High', notesResources: 'Focus weak spots' },
        { taskTopic: 'Final Quick Review', priority: 'Med', notesResources: 'Flashcards / key facts' }
      ];
    } else if (duration === '30min') {
      scheduleTemplate = [
        { taskTopic: 'Chapter 1 Summary', priority: 'High', notesResources: 'Key definitions' },
        { taskTopic: 'Practice Questions', priority: 'High', notesResources: 'Focus weak spots' },
        { taskTopic: 'Final Review', priority: 'Med', notesResources: 'Flashcards' }
      ];
    } else if (duration === '1hr') {
      scheduleTemplate = [
        { taskTopic: 'Chapter 1 Summary', priority: 'High', notesResources: 'Key definitions' },
        { taskTopic: 'Practice Questions / Past Qs', priority: 'High', notesResources: 'Focus weak spots' },
        { taskTopic: 'Break / Snack', priority: '—', notesResources: 'No screens' },
        { taskTopic: 'Flashcards Review', priority: 'Med', notesResources: 'Self-test' }
      ];
    } else if (duration === '2hr') {
      scheduleTemplate = [
        { taskTopic: 'Chapter 1 Summary', priority: 'High', notesResources: 'Key definitions' },
        { taskTopic: 'Practice Questions / Past Qs', priority: 'High', notesResources: 'Focus weak spots' },
        { taskTopic: 'Topic 2', priority: 'Med', notesResources: 'Highlight formulas' },
        { taskTopic: 'Break / Snack', priority: '—', notesResources: 'No screens' },
        { taskTopic: 'Practice Problems', priority: 'High', notesResources: 'Time yourself' },
        { taskTopic: 'Final Notes', priority: '—', notesResources: 'Write weak areas' }
      ];
    } else {
      scheduleTemplate = [
        { taskTopic: 'Chapter 1 Summary', priority: 'High', notesResources: 'Key definitions' },
        { taskTopic: 'Practice Questions / Past Qs', priority: 'High', notesResources: 'Focus weak spots' },
        { taskTopic: 'Topic 2', priority: 'Med', notesResources: 'Highlight formulas' },
        { taskTopic: 'Break / Snack', priority: '—', notesResources: 'No screens' },
        { taskTopic: 'Topic 3 / Flashcards', priority: 'High', notesResources: 'Self-test' },
        { taskTopic: 'Practice Problems', priority: 'High', notesResources: 'Time yourself' },
        { taskTopic: 'Topic 4', priority: 'Med', notesResources: 'Skim notes' },
        { taskTopic: 'Break', priority: '—', notesResources: 'Stretch / walk' },
        { taskTopic: 'Topic 5 Review', priority: 'Low', notesResources: 'Light reading' },
        { taskTopic: 'Rapid Fire Review', priority: 'High', notesResources: 'Flashcards / key facts' },
        { taskTopic: 'Final Notes', priority: '—', notesResources: 'Write weak areas' }
      ];
    }
    
    return scheduleTemplate.map((template, index) => {
      const slotDuration = getSlotDuration(template.taskTopic, duration);
      const startTime = new Date(currentTime);
      currentTime.setMinutes(currentTime.getMinutes() + slotDuration);
      const endTime = new Date(currentTime);
      
      const timeSlot = `${startTime.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      })} – ${endTime.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      })}`;
      
      return {
        timeSlot,
        taskTopic: template.taskTopic,
        priority: template.priority,
        notesResources: template.notesResources,
        completed: index === 0 // Mark first item as completed for demo
      };
    });
  };

  const studyPlan: StudyPlan = {
    examName: 'Computer Science Final',
    examDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    timeLeft: timeSelected ? `${timeSelected} session` : '2 days',
    motivation: 'Focus now, relax later.',
    schedule: generateSchedule(timeSelected || '1hr'),
    highPriority: [
      { topic: 'Data Structures & Algorithms', completed: true },
      { topic: 'Object-Oriented Programming', completed: false }
    ],
    mediumPriority: [
      { topic: 'Database Design', completed: false },
      { topic: 'Software Engineering', completed: false }
    ],
    lowPriority: [
      { topic: 'Advanced Topics', completed: false }
    ],
    quickReference: [
      'Big O Notation: O(1) < O(log n) < O(n) < O(n²)',
      'Binary Search: O(log n) time complexity',
      'Hash Tables: O(1) average lookup time',
      'Recursion: Function calls itself with base case'
    ],
    progressPercent: 60,
    energyLevel: '🙂',
    reviewNotes: [
      'Review graph algorithms - still weak',
      'Practice more dynamic programming problems'
    ]
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
    return `📘 Last-Minute Study Plan

**Exam:** ${studyPlan.examName}
**Date:** ${studyPlan.examDate}
**Time Left:** ⏳ ${studyPlan.timeLeft}

**Motivation:** "${studyPlan.motivation}"

## ⏱️ Time-Blocked Schedule

| Time Slot | Task / Topic | Priority | Notes / Resources |
|-----------|-------------|----------|-------------------|
${studyPlan.schedule.map(slot => 
  `| ${slot.timeSlot} | ${slot.taskTopic} | ${slot.priority === 'High' ? '🔴 High' : slot.priority === 'Med' ? '🟡 Med' : slot.priority === 'Low' ? '🟢 Low' : '—'} | ${slot.notesResources} |`
).join('\n')}

## ✅ Priority Checklist

### 🔴 High Priority (Must Do)
${studyPlan.highPriority.map(item => `- [${item.completed ? 'x' : ' '}] ${item.topic}`).join('\n')}

### 🟡 Medium Priority
${studyPlan.mediumPriority.map(item => `- [${item.completed ? 'x' : ' '}] ${item.topic}`).join('\n')}

### 🟢 Low Priority
${studyPlan.lowPriority.map(item => `- [${item.completed ? 'x' : ' '}] ${item.topic}`).join('\n')}

## 📌 Quick Reference (Cheat Sheet)
${studyPlan.quickReference.join('\n')}

## 📊 Progress & Reflection
**Progress Bar:** ${'▓'.repeat(Math.floor(studyPlan.progressPercent/10))}${'░'.repeat(10-Math.floor(studyPlan.progressPercent/10))} ${studyPlan.progressPercent}% Done
**Energy Check:** ${studyPlan.energyLevel}
**Notes for Review Tonight:**
${studyPlan.reviewNotes.map(note => `• ${note}`).join('\n')}

*Generated by CramSmart - Study Panic-Proof*`;
  };

  const generateDetailedCramGuideText = () => {
    return `📘 Last-Minute Study Plan

Exam: ${studyPlan.examName}
Date: ${studyPlan.examDate}
Time Left: ⏳ ${studyPlan.timeLeft}

Motivation: "${studyPlan.motivation}"

⏱️ Time-Blocked Schedule
Time Slot\tTask / Topic\tPriority\tNotes / Resources
${studyPlan.schedule.map(slot => 
  `${slot.timeSlot}\t${slot.taskTopic}\t${slot.priority === 'High' ? '🔴 High' : slot.priority === 'Med' ? '🟡 Med' : slot.priority === 'Low' ? '🟢 Low' : '—'}\t${slot.notesResources}`
).join('\n')}

(Adjust slots based on how many hours you have left)

✅ Priority Checklist

🔴 High Priority (Must Do)
${studyPlan.highPriority.map(item => `☐ ${item.topic}`).join('\n')}

🟡 Medium Priority
${studyPlan.mediumPriority.map(item => `☐ ${item.topic}`).join('\n')}

🟢 Low Priority
${studyPlan.lowPriority.map(item => `☐ ${item.topic}`).join('\n')}

📌 Quick Reference (Cheat Sheet)
${studyPlan.quickReference.join('\n')}

📊 Progress & Reflection
Progress Bar: ${'▓'.repeat(Math.floor(studyPlan.progressPercent/10))}${'░'.repeat(10-Math.floor(studyPlan.progressPercent/10))} ${studyPlan.progressPercent}% Done
Energy Check (circle one): 😃 🙂 😐 😴
Notes for Review Tonight:
${studyPlan.reviewNotes.join('\n')}

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
      case 'High': return 'text-red-600 font-bold';
      case 'Med': return 'text-yellow-600 font-bold';
      case 'Low': return 'text-green-600 font-bold';
      default: return 'text-muted-foreground';
    }
  };

  const getPriorityIcon = (priority: TimeSlot['priority']) => {
    switch (priority) {
      case 'High': return '🔴';
      case 'Med': return '🟡';
      case 'Low': return '🟢';
      default: return '—';
    }
  };

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
            {/* Study Plan Header - Matching Original Template */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">📘 Last-Minute Study Plan</h2>
              <div className="space-y-1">
                <p><strong>Exam:</strong> {studyPlan.examName}</p>
                <p><strong>Date:</strong> {studyPlan.examDate}</p>
                <p><strong>Time Left:</strong> ⏳ {studyPlan.timeLeft}</p>
                <p className="mt-3 p-2 bg-primary/10 rounded italic">
                  <strong>Motivation:</strong> "{studyPlan.motivation}"
                </p>
              </div>
            </div>

            {/* Time-Blocked Schedule Table */}
            <div>
              <h3 className="font-bold text-lg mb-3">⏱️ Time-Blocked Schedule</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-gray-300 p-2 text-left font-semibold">Time Slot</th>
                      <th className="border border-gray-300 p-2 text-left font-semibold">Task / Topic</th>
                      <th className="border border-gray-300 p-2 text-left font-semibold">Priority</th>
                      <th className="border border-gray-300 p-2 text-left font-semibold">Notes / Resources</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studyPlan.schedule.map((slot, index) => (
                      <tr key={index} className="hover:bg-muted/50">
                        <td className="border border-gray-300 p-2 text-sm">{slot.timeSlot}</td>
                        <td className="border border-gray-300 p-2 text-sm">{slot.taskTopic}</td>
                        <td className="border border-gray-300 p-2 text-sm">
                          <span className={getPriorityColor(slot.priority)}>
                            {getPriorityIcon(slot.priority)} {slot.priority}
                          </span>
                        </td>
                        <td className="border border-gray-300 p-2 text-sm text-muted-foreground">{slot.notesResources}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-muted-foreground mt-2 italic">
                (Adjust slots based on how many hours you have left)
              </p>
            </div>

            {/* Priority Checklist */}
            <div>
              <h3 className="font-bold text-lg mb-3">✅ Priority Checklist</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-red-600 mb-2">🔴 High Priority (Must Do)</h4>
                  <div className="space-y-1">
                    {studyPlan.highPriority.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Checkbox 
                          checked={item.completed}
                          onCheckedChange={() => {/* Update completion */}}
                        />
                        <span className={item.completed ? 'line-through text-muted-foreground' : ''}>
                          {item.topic}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-yellow-600 mb-2">🟡 Medium Priority</h4>
                  <div className="space-y-1">
                    {studyPlan.mediumPriority.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Checkbox 
                          checked={item.completed}
                          onCheckedChange={() => {/* Update completion */}}
                        />
                        <span className={item.completed ? 'line-through text-muted-foreground' : ''}>
                          {item.topic}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-green-600 mb-2">🟢 Low Priority</h4>
                  <div className="space-y-1">
                    {studyPlan.lowPriority.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Checkbox 
                          checked={item.completed}
                          onCheckedChange={() => {/* Update completion */}}
                        />
                        <span className={item.completed ? 'line-through text-muted-foreground' : ''}>
                          {item.topic}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Reference */}
            <div>
              <h3 className="font-bold text-lg mb-3">📌 Quick Reference (Cheat Sheet)</h3>
              <div className="bg-muted/30 p-4 rounded-lg border">
                <div className="space-y-2">
                  {studyPlan.quickReference.map((ref, index) => (
                    <p key={index} className="text-sm">
                      <strong>{ref.split(':')[0]}:</strong> {ref.split(':').slice(1).join(':')}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            {/* Progress & Reflection */}
            <div>
              <h3 className="font-bold text-lg mb-3">📊 Progress & Reflection</h3>
              <div className="space-y-3 bg-muted/20 p-4 rounded-lg">
                <div>
                  <p className="text-sm"><strong>Progress Bar:</strong></p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="font-mono text-lg">
                      {'▓'.repeat(Math.floor(studyPlan.progressPercent/10))}
                      {'░'.repeat(10-Math.floor(studyPlan.progressPercent/10))}
                    </div>
                    <span className="text-sm font-semibold">{studyPlan.progressPercent}% Done</span>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm mb-2"><strong>Energy Check (circle one):</strong></p>
                  <div className="flex items-center gap-2">
                    {['😃', '🙂', '😐', '😴'].map((emoji, index) => (
                      <Button
                        key={index}
                        variant={studyPlan.energyLevel === emoji ? "default" : "outline"}
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => {/* Update energy level */}}
                      >
                        {emoji}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-semibold mb-2">Notes for Review Tonight:</p>
                  <div className="space-y-1">
                    {studyPlan.reviewNotes.map((note, index) => (
                      <p key={index} className="text-sm text-muted-foreground">• {note}</p>
                    ))}
                  </div>
                </div>
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