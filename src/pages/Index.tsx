import { useState, useEffect } from 'react';
import { Clock } from '@/components/Clock';
import { ThemeToggle } from '@/components/ThemeToggle';
import { AddClockButton } from '@/components/AddClockButton';
import { useToast } from '@/hooks/use-toast';
import { useDynamicBackground } from '@/hooks/useDynamicBackground';

interface ClockData {
  id: string;
  timezone: string;
  label: string;
  style: 'modern' | 'minimal' | 'word' | 'retro' | 'analog' | 'bold';
}

const Index = () => {
  const { toast } = useToast();
  const [clocks, setClocks] = useState<ClockData[]>([
    {
      id: '1',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      label: 'Local Time',
      style: 'modern' as const
    }
  ]);
  
  // Dynamic background based on clock styles
  useDynamicBackground(clocks);
  // Load saved clocks from localStorage
  useEffect(() => {
    const savedClocks = localStorage.getItem('jcw-clocks');
    if (savedClocks) {
      try {
        const parsed = JSON.parse(savedClocks);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setClocks(parsed);
        }
      } catch (error) {
        console.error('Failed to load saved clocks:', error);
      }
    }
  }, []);

  // Save clocks to localStorage whenever clocks change
  useEffect(() => {
    localStorage.setItem('jcw-clocks', JSON.stringify(clocks));
  }, [clocks]);

  const addClock = () => {
    if (clocks.length >= 3) {
      toast({
        title: "Maximum clocks reached",
        description: "You can have a maximum of 3 clocks for optimal aesthetics.",
        variant: "destructive",
      });
      return;
    }

    const newClock: ClockData = {
      id: Date.now().toString(),
      timezone: 'UTC',
      label: `Clock ${clocks.length + 1}`,
      style: 'modern'
    };

    setClocks(prev => [...prev, newClock]);
    
    toast({
      title: "Clock added",
      description: "New clock has been added. Click the settings icon to customize it.",
    });
  };

  const removeClock = (id: string) => {
    if (clocks.length <= 1) {
      toast({
        title: "Cannot remove clock",
        description: "You must have at least one clock displayed.",
        variant: "destructive",
      });
      return;
    }

    setClocks(prev => prev.filter(clock => clock.id !== id));
    
    toast({
      title: "Clock removed",
      description: "The clock has been removed from your display.",
    });
  };

  const updateClockTimezone = (id: string, timezone: string) => {
    setClocks(prev => prev.map(clock => 
      clock.id === id ? { ...clock, timezone } : clock
    ));
  };

  const updateClockLabel = (id: string, label: string) => {
    setClocks(prev => prev.map(clock => 
      clock.id === id ? { ...clock, label } : clock
    ));
  };

  const updateClockStyle = (id: string, style: string) => {
    setClocks(prev => prev.map(clock => 
      clock.id === id ? { ...clock, style: style as ClockData['style'] } : clock
    ));
  };

  const primaryClock = clocks[0];
  const secondaryClocks = clocks.slice(1);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      {/* Theme Toggle */}
      <ThemeToggle />

      {/* Main Clock Container */}
      <div className="w-full max-w-6xl mx-auto">
        <div className="flex flex-col items-center space-y-8">
          {/* Primary Clock - Always centered and largest */}
          <div className="animate-fade-in">
            <Clock
              id={primaryClock.id}
              timezone={primaryClock.timezone}
              label={primaryClock.label}
              style={primaryClock.style}
              isPrimary={true}
              onTimezoneChange={(timezone) => updateClockTimezone(primaryClock.id, timezone)}
              onLabelChange={(label) => updateClockLabel(primaryClock.id, label)}
              onStyleChange={(style) => updateClockStyle(primaryClock.id, style)}
            />
          </div>

          {/* Secondary Clocks - Arranged responsively */}
          {secondaryClocks.length > 0 && (
            <div className={`
              grid gap-6 w-full max-w-4xl
              ${secondaryClocks.length === 1 ? 'grid-cols-1 justify-items-center' : 'grid-cols-1 md:grid-cols-2'}
            `}>
              {secondaryClocks.map((clock, index) => (
                <div key={clock.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <Clock
                    id={clock.id}
                    timezone={clock.timezone}
                    label={clock.label}
                    style={clock.style}
                    isPrimary={false}
                    onRemove={() => removeClock(clock.id)}
                    onTimezoneChange={(timezone) => updateClockTimezone(clock.id, timezone)}
                    onLabelChange={(label) => updateClockLabel(clock.id, label)}
                    onStyleChange={(style) => updateClockStyle(clock.id, style)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Clock Button */}
      <AddClockButton 
        onClick={addClock}
        disabled={clocks.length >= 3}
      />

      {/* Footer */}
      <div className="fixed bottom-4 left-4 text-xs text-clock-accent/60">
        Just-Clock-Web
      </div>
    </div>
  );
};

export default Index;
