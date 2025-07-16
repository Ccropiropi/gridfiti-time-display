import { useState, useEffect } from 'react';
import { Settings, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { TimezoneSelector } from './TimezoneSelector';
import { ClockDisplay } from './ClockStyles';

interface ClockProps {
  id: string;
  timezone: string;
  label: string;
  style?: 'modern' | 'minimal' | 'word' | 'retro' | 'analog' | 'bold';
  isPrimary?: boolean;
  onRemove?: () => void;
  onTimezoneChange?: (timezone: string) => void;
  onLabelChange?: (label: string) => void;
  onStyleChange?: (style: string) => void;
}

export function Clock({ 
  id, 
  timezone, 
  label, 
  style = 'modern',
  isPrimary = false, 
  onRemove, 
  onTimezoneChange,
  onLabelChange,
  onStyleChange
}: ClockProps) {
  const [time, setTime] = useState(new Date());
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = () => {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(time);
  };

  const formatDate = () => {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    }).format(time);
  };

  const getTimezoneOffset = () => {
    const formatter = new Intl.DateTimeFormat('en', {
      timeZone: timezone,
      timeZoneName: 'short'
    });
    const parts = formatter.formatToParts(time);
    const timeZoneName = parts.find(part => part.type === 'timeZoneName')?.value;
    return timeZoneName;
  };

  // Get style-specific background classes
  const getStyleBackground = () => {
    switch (style) {
      case 'minimal':
        return 'bg-gradient-to-br from-blue-400 to-blue-600';
      case 'word':
      case 'retro':
      case 'bold':
        return 'bg-gray-900 border-gray-800';
      case 'analog':
        return 'bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900';
      default:
        return 'clock-glass';
    }
  };

  return (
    <Card 
      className={`
        hover-lift smooth-transition relative group
        ${getStyleBackground()}
        ${isPrimary ? 'p-12' : 'p-8'}
        animate-scale-in
      `}
      onMouseEnter={() => setShowSettings(true)}
      onMouseLeave={() => setShowSettings(false)}
    >
      {/* Settings Button */}
      {showSettings && (
        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 smooth-transition">
          <TimezoneSelector
            value={timezone}
            onChange={onTimezoneChange}
            onLabelChange={onLabelChange}
            onStyleChange={onStyleChange}
            currentLabel={label}
            currentStyle={style}
          />
          {!isPrimary && onRemove && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onRemove}
              className="h-8 w-8 hover:bg-destructive/20 hover:text-destructive"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}

      {/* Clock Content */}
      <div className="text-center space-y-4">
        {/* Time Display */}
        <div className={`
          ${isPrimary ? 'clock-primary' : 'clock-secondary'}
        `}>
          <ClockDisplay timezone={timezone} style={style} />
        </div>
        
        {/* Date and Timezone */}
        <div className="space-y-2">
          <div className={`clock-label ${
            ['word', 'retro', 'bold'].includes(style) ? 'text-white/70' : ''
          }`}>
            {label}
          </div>
          <div className={`text-sm ${
            ['word', 'retro', 'bold'].includes(style) ? 'text-white/50' : 'text-clock-accent'
          }`}>
            {formatDate()}
          </div>
          <div className={`text-xs ${
            ['word', 'retro', 'bold'].includes(style) ? 'text-white/40' : 'text-clock-accent/70'
          }`}>
            {getTimezoneOffset()}
          </div>
        </div>
      </div>
    </Card>
  );
}