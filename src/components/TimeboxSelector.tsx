import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Zap, Target, BookOpen } from 'lucide-react';

interface TimeOption {
  duration: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  intensity: 'high' | 'medium' | 'low';
}

const timeOptions: TimeOption[] = [
  {
    duration: '15min',
    label: '15 Minutes',
    description: 'Essentials only - core concepts and key facts',
    icon: <Zap className="h-5 w-5" />,
    intensity: 'high'
  },
  {
    duration: '30min',
    label: '30 Minutes',
    description: 'Quick review - essentials + important examples',
    icon: <Target className="h-5 w-5" />,
    intensity: 'high'
  },
  {
    duration: '1hr',
    label: '1 Hour',
    description: 'Focused session - comprehensive coverage',
    icon: <Clock className="h-5 w-5" />,
    intensity: 'medium'
  },
  {
    duration: '2hr',
    label: '2 Hours',
    description: 'Deep dive - detailed explanations + practice',
    icon: <BookOpen className="h-5 w-5" />,
    intensity: 'medium'
  },
  {
    duration: '4hr',
    label: '4+ Hours',
    description: 'Complete study - everything + worked examples',
    icon: <BookOpen className="h-5 w-5" />,
    intensity: 'low'
  }
];

interface TimeboxSelectorProps {
  onTimeSelect?: (duration: string) => void;
}

export function TimeboxSelector({ onTimeSelect }: TimeboxSelectorProps) {
  const [selectedTime, setSelectedTime] = useState<string>('');

  const handleTimeSelect = (duration: string) => {
    setSelectedTime(duration);
    onTimeSelect?.(duration);
  };

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case 'high': return 'border-accent bg-accent/10';
      case 'medium': return 'border-warning bg-warning/10';
      case 'low': return 'border-primary bg-primary/10';
      default: return 'border-muted';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          How much time do you have?
        </CardTitle>
        <CardDescription>
          Choose your study timeframe - we'll adapt the content accordingly
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {timeOptions.map((option) => (
            <button
              key={option.duration}
              onClick={() => handleTimeSelect(option.duration)}
              className={`w-full p-4 rounded-lg border-2 text-left transition-all hover:shadow-study ${
                selectedTime === option.duration
                  ? getIntensityColor(option.intensity) + ' ring-2 ring-primary/20'
                  : 'border-muted hover:border-primary/50'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5 text-primary">
                  {option.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold">{option.label}</h3>
                    <div className={`px-2 py-1 text-xs rounded-full ${
                      option.intensity === 'high' ? 'bg-accent text-accent-foreground' :
                      option.intensity === 'medium' ? 'bg-warning text-warning-foreground' :
                      'bg-primary text-primary-foreground'
                    }`}>
                      {option.intensity === 'high' ? 'Urgent' : 
                       option.intensity === 'medium' ? 'Focused' : 'Comprehensive'}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{option.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
        
        {selectedTime && (
          <div className="mt-6 p-4 bg-success/10 border border-success/20 rounded-lg">
            <div className="flex items-center gap-2 text-success">
              <Target className="h-4 w-4" />
              <span className="font-medium">Time selected: {timeOptions.find(opt => opt.duration === selectedTime)?.label}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}