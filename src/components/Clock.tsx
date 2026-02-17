import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
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
  id, timezone, label, style = 'modern', isPrimary = false, 
  onRemove, onTimezoneChange, onLabelChange, onStyleChange
}: ClockProps) {
  const [time, setTime] = useState(new Date());
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = () => {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: timezone, weekday: 'long', month: 'long', day: 'numeric',
    }).format(time);
  };

  const getTimezoneOffset = () => {
    const formatter = new Intl.DateTimeFormat('en', { timeZone: timezone, timeZoneName: 'short' });
    return formatter.formatToParts(time).find(part => part.type === 'timeZoneName')?.value;
  };

  const getGlassClass = () => `clock-glass-${style}`;

  const getLabelColor = () => {
    switch (style) {
      case 'word': return 'text-amber-300/70';
      case 'retro': return 'text-green-400/70';
      case 'bold': return 'text-red-400/70';
      case 'minimal': return 'text-blue-200/80';
      case 'analog': return 'text-amber-700/70 dark:text-amber-300/70';
      default: return '';
    }
  };

  const getDateColor = () => {
    switch (style) {
      case 'word': return 'text-amber-400/50';
      case 'retro': return 'text-green-500/50';
      case 'bold': return 'text-white/40';
      case 'minimal': return 'text-blue-100/60';
      case 'analog': return 'text-amber-800/50 dark:text-amber-200/50';
      default: return 'text-clock-accent';
    }
  };

  const getTzColor = () => {
    switch (style) {
      case 'word': return 'text-amber-400/30';
      case 'retro': return 'text-green-500/30';
      case 'bold': return 'text-white/25';
      case 'minimal': return 'text-blue-100/40';
      case 'analog': return 'text-amber-800/40 dark:text-amber-200/40';
      default: return 'text-clock-accent/70';
    }
  };

  return (
    <Card 
      className={`
        hover-lift smooth-transition relative group
        ${getGlassClass()}
        ${isPrimary ? 'p-12' : 'p-8'}
        animate-scale-in
      `}
      onMouseEnter={() => setShowSettings(true)}
      onMouseLeave={() => setShowSettings(false)}
    >
      {showSettings && (
        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 smooth-transition">
          <TimezoneSelector
            value={timezone} onChange={onTimezoneChange}
            onLabelChange={onLabelChange} onStyleChange={onStyleChange}
            currentLabel={label} currentStyle={style}
          />
          {!isPrimary && onRemove && (
            <Button variant="ghost" size="icon" onClick={onRemove}
              className="h-8 w-8 hover:bg-destructive/20 hover:text-destructive">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}

      <div className="text-center space-y-4">
        <div className={isPrimary ? 'clock-primary' : 'clock-secondary'}>
          <ClockDisplay timezone={timezone} style={style} />
        </div>
        
        <div className="space-y-2">
          <div className={`clock-label ${getLabelColor()}`}>{label}</div>
          <div className={`text-sm ${getDateColor()}`}>{formatDate()}</div>
          <div className={`text-xs ${getTzColor()}`}>{getTimezoneOffset()}</div>
        </div>
      </div>
    </Card>
  );
}
