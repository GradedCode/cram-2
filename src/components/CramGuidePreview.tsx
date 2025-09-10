import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle, BookOpen, Download, Share2, FileText, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

interface CramGuidePreviewProps {
  timeSelected?: string;
  filesUploaded?: number;
}

export function CramGuidePreview({ timeSelected, filesUploaded = 0 }: CramGuidePreviewProps) {
  const { toast } = useToast();
  const [expandedTopic, setExpandedTopic] = useState<number | null>(null);
  
  const detailedTopics = [
    {
      title: 'Data Structures & Algorithms',
      priority: 'High',
      completed: false,
      subtopics: [
        {
          name: 'Arrays & Linked Lists',
          mustDo: ['Understand time complexities', 'Practice traversal patterns'],
          mustNot: ['Confuse static vs dynamic arrays', 'Forget null pointer checks'],
          keyTakeaway: 'Arrays: O(1) access, O(n) insertion. Lists: O(n) access, O(1) insertion'
        },
        {
          name: 'Trees & Graphs',
          mustDo: ['Master BFS/DFS', 'Know tree balancing'],
          mustNot: ['Skip base cases in recursion', 'Ignore cycle detection'],
          keyTakeaway: 'DFS for path finding, BFS for shortest distance'
        }
      ],
      keyDefinitions: [
        'Big O: Describes algorithm time/space complexity',
        'Recursion: Function calling itself with base case'
      ]
    },
    {
      title: 'Object-Oriented Programming',
      priority: 'High',
      completed: true,
      subtopics: [
        {
          name: 'Inheritance & Polymorphism',
          mustDo: ['Understand method overriding', 'Use abstract classes properly'],
          mustNot: ['Overuse inheritance', 'Break encapsulation'],
          keyTakeaway: 'Favor composition over inheritance for flexibility'
        }
      ],
      keyDefinitions: [
        'Encapsulation: Data hiding through access modifiers',
        'Polymorphism: One interface, multiple implementations'
      ]
    },
    {
      title: 'Database Design Principles',
      priority: 'Medium',
      completed: false,
      subtopics: [
        {
          name: 'Normalization',
          mustDo: ['Eliminate redundancy', 'Ensure data integrity'],
          mustNot: ['Over-normalize', 'Create circular dependencies'],
          keyTakeaway: '3NF is usually sufficient for most applications'
        }
      ],
      keyDefinitions: [
        'Primary Key: Unique identifier for table rows',
        'Foreign Key: Reference to another table\'s primary key'
      ]
    }
  ];

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
    return `# 🎓 Cram Guide - ${timeSelected || 'Study Session'}
**Generated:** ${new Date().toLocaleDateString()}
**Study Time:** ${timeSelected || '30 minutes'}

---

## 📚 Topics Overview

${detailedTopics.map(topic => `
### ${topic.completed ? '✅' : '📋'} ${topic.title} (${topic.priority} Priority)

${topic.subtopics.map(sub => `
#### ${sub.name}
**✅ Must Do:**
${sub.mustDo.map(item => `• ${item}`).join('\n')}

**❌ Must NOT:**
${sub.mustNot.map(item => `• ${item}`).join('\n')}

**🔑 Key Takeaway:** ${sub.keyTakeaway}
`).join('\n')}

**📖 Key Definitions:**
${topic.keyDefinitions.map(def => `• ${def}`).join('\n')}

---
`).join('\n')}

*Generated by CramSmart - Study Panic-Proof* 🚀`;
  };

  const generateDetailedCramGuideText = () => {
    return `
CRAM GUIDE - ${timeSelected || 'Study Session'}
Generated: ${new Date().toLocaleDateString()}
Study Time: ${timeSelected || '30 minutes'}

=================================================

${detailedTopics.map(topic => `
${topic.title.toUpperCase()} (${topic.priority} Priority) ${topic.completed ? '[✓ COMPLETED]' : '[○ PENDING]'}
${'-'.repeat(topic.title.length + 20)}

${topic.subtopics.map(sub => `
▸ ${sub.name}
  
  ✅ MUST DO:
  ${sub.mustDo.map(item => `    • ${item}`).join('\n  ')}
  
  ❌ MUST NOT:
  ${sub.mustNot.map(item => `    • ${item}`).join('\n  ')}
  
  🔑 KEY TAKEAWAY: ${sub.keyTakeaway}
`).join('\n')}

📖 KEY DEFINITIONS:
${topic.keyDefinitions.map(def => `  • ${def}`).join('\n')}

`).join('\n')}

=================================================
Progress: ${Math.round((detailedTopics.filter(t => t.completed).length / detailedTopics.length) * 100)}%
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-accent text-accent-foreground';
      case 'Medium': return 'bg-warning text-warning-foreground';
      case 'Low': return 'bg-primary text-primary-foreground';
      default: return 'bg-muted';
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
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-primary/10 rounded-lg">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Estimated Study Time</p>
                <p className="text-sm text-muted-foreground">{timeSelected || '30 minutes'} based on your selections</p>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Detailed Study Topics</h3>
              <div className="space-y-3">
                {detailedTopics.map((topic, index) => (
                  <div key={index} className="bg-card rounded-lg border overflow-hidden">
                    <div 
                      className="flex items-center justify-between p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => setExpandedTopic(expandedTopic === index ? null : index)}
                    >
                      <div className="flex items-center gap-3">
                        <CheckCircle className={`h-4 w-4 ${topic.completed ? 'text-success' : 'text-muted-foreground'}`} />
                        <span className={`font-medium ${topic.completed ? 'line-through text-muted-foreground' : ''}`}>
                          {topic.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getPriorityColor(topic.priority)}>
                          {topic.priority}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {expandedTopic === index ? '−' : '+'}
                        </span>
                      </div>
                    </div>
                    
                    {expandedTopic === index && (
                      <div className="px-3 pb-3 space-y-4 border-t bg-muted/20">
                        {topic.subtopics.map((subtopic, subIndex) => (
                          <div key={subIndex} className="space-y-2">
                            <h4 className="font-medium text-sm mt-3">{subtopic.name}</h4>
                            
                            <div className="grid md:grid-cols-2 gap-3 text-xs">
                              <div className="space-y-1">
                                <p className="font-medium text-success">✅ Must Do:</p>
                                {subtopic.mustDo.map((item, i) => (
                                  <p key={i} className="text-muted-foreground ml-2">• {item}</p>
                                ))}
                              </div>
                              
                              <div className="space-y-1">
                                <p className="font-medium text-destructive">❌ Must NOT:</p>
                                {subtopic.mustNot.map((item, i) => (
                                  <p key={i} className="text-muted-foreground ml-2">• {item}</p>
                                ))}
                              </div>
                            </div>
                            
                            <div className="bg-primary/10 p-2 rounded text-xs">
                              <p className="font-medium">🔑 Key Takeaway:</p>
                              <p className="text-muted-foreground">{subtopic.keyTakeaway}</p>
                            </div>
                          </div>
                        ))}
                        
                        <div className="mt-3">
                          <p className="font-medium text-sm mb-2">📖 Key Definitions:</p>
                          <div className="space-y-1 text-xs">
                            {topic.keyDefinitions.map((def, i) => (
                              <p key={i} className="text-muted-foreground">• {def}</p>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center p-3 bg-success/10 rounded-lg">
                <div className="text-2xl font-bold text-success">{detailedTopics.filter(t => t.completed).length}</div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
              <div className="text-center p-3 bg-accent/10 rounded-lg">
                <div className="text-2xl font-bold text-accent">{detailedTopics.filter(t => !t.completed).length}</div>
                <div className="text-sm text-muted-foreground">Remaining</div>
              </div>
              <div className="text-center p-3 bg-primary/10 rounded-lg">
                <div className="text-2xl font-bold text-primary">{Math.round((detailedTopics.filter(t => t.completed).length / detailedTopics.length) * 100)}%</div>
                <div className="text-sm text-muted-foreground">Progress</div>
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