import { useState, useEffect } from 'react';

interface ClockStyleProps {
  timezone: string;
  style: 'modern' | 'minimal' | 'word' | 'retro' | 'analog' | 'bold';
}

export function ClockDisplay({ timezone, style }: ClockStyleProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  switch (style) {
    case 'modern': return <ModernClock time={time} timezone={timezone} />;
    case 'minimal': return <MinimalClock time={time} timezone={timezone} />;
    case 'word': return <WordClock time={time} timezone={timezone} />;
    case 'retro': return <RetroClock time={time} timezone={timezone} />;
    case 'analog': return <AnalogClock time={time} timezone={timezone} />;
    case 'bold': return <BoldClock time={time} timezone={timezone} />;
    default: return <ModernClock time={time} timezone={timezone} />;
  }
}

// Modern - Lavender/pink, elegant thin font
function ModernClock({ time, timezone }: { time: Date; timezone: string }) {
  const formatTime = () => new Intl.DateTimeFormat('en-US', {
    timeZone: timezone, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
  }).format(time);

  return (
    <div className="font-mono tabular-nums text-purple-900 dark:text-purple-200">
      {formatTime()}
    </div>
  );
}

// Minimal - Ocean blue, clean sans
function MinimalClock({ time, timezone }: { time: Date; timezone: string }) {
  const formatTime = () => new Intl.DateTimeFormat('en-US', {
    timeZone: timezone, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
  }).format(time).replace(/:/g, '');

  return (
    <div className="relative">
      <div className="font-light tracking-wider text-blue-900 dark:text-blue-100 drop-shadow-lg">
        {formatTime()}
      </div>
    </div>
  );
}

// Word - Warm amber/gold on charcoal
function WordClock({ time, timezone }: { time: Date; timezone: string }) {
  const getWordTime = () => {
    const localTime = new Date(time.toLocaleString("en-US", { timeZone: timezone }));
    const hours = localTime.getHours();
    const minutes = localTime.getMinutes();
    
    const hourWords = [
      'TWELVE', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX',
      'SEVEN', 'EIGHT', 'NINE', 'TEN', 'ELEVEN', 'TWELVE'
    ];
    
    let timeString = 'IT IS ';
    
    if (minutes === 0) {
      timeString += hourWords[hours % 12] + " O'CLOCK";
    } else if (minutes === 15) {
      timeString += 'A QUARTER PAST ' + hourWords[hours % 12];
    } else if (minutes === 30) {
      timeString += 'HALF PAST ' + hourWords[hours % 12];
    } else if (minutes === 45) {
      timeString += 'A QUARTER TO ' + hourWords[(hours + 1) % 12];
    } else if (minutes < 30) {
      timeString += `${getMinuteWord(minutes)} PAST ${hourWords[hours % 12]}`;
    } else {
      timeString += `${getMinuteWord(60 - minutes)} TO ${hourWords[(hours + 1) % 12]}`;
    }
    
    return timeString;
  };

  const getMinuteWord = (min: number) => {
    const minuteWords = ['', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE', 'TEN',
      'ELEVEN', 'TWELVE', 'THIRTEEN', 'FOURTEEN', 'FIFTEEN', 'SIXTEEN', 'SEVENTEEN', 'EIGHTEEN', 'NINETEEN', 'TWENTY',
      'TWENTY ONE', 'TWENTY TWO', 'TWENTY THREE', 'TWENTY FOUR', 'TWENTY FIVE', 'TWENTY SIX', 'TWENTY SEVEN', 'TWENTY EIGHT', 'TWENTY NINE'];
    return minuteWords[min] || min.toString();
  };

  return (
    <div className="font-serif font-light tracking-widest leading-relaxed text-center">
      {getWordTime().split(' ').map((word, index) => (
        <span key={index} className={`inline-block mr-2 mb-1 ${
          ['IT', 'IS', 'A', 'PAST', 'TO', 'QUARTER', 'HALF', "O'CLOCK"].includes(word) 
            ? 'text-amber-600/40 dark:text-amber-400/40' 
            : 'text-amber-500 dark:text-amber-300 font-medium'
        }`}>
          {word}
        </span>
      ))}
    </div>
  );
}

// Retro - Green phosphor terminal
function RetroClock({ time, timezone }: { time: Date; timezone: string }) {
  const formatTime = () => {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone, hour: '2-digit', minute: '2-digit', hour12: true,
    });
    const parts = formatter.formatToParts(time);
    return {
      hour: parts.find(p => p.type === 'hour')?.value,
      minute: parts.find(p => p.type === 'minute')?.value,
      dayPeriod: parts.find(p => p.type === 'dayPeriod')?.value,
    };
  };

  const { hour, minute, dayPeriod } = formatTime();

  return (
    <div className="flex items-baseline gap-1" style={{ animation: 'flicker 4s infinite' }}>
      <span className="text-green-400 font-bold tracking-tight drop-shadow-[0_0_8px_hsl(120,80%,50%)]">
        {hour}
      </span>
      <span className="text-green-400 font-bold tracking-tight drop-shadow-[0_0_8px_hsl(120,80%,50%)]">
        {minute}
      </span>
      <span className="text-green-500/60 text-sm font-normal ml-1">
        {dayPeriod}
      </span>
    </div>
  );
}

// Analog - Cream/parchment with elegant accents
function AnalogClock({ time, timezone }: { time: Date; timezone: string }) {
  const localTime = new Date(time.toLocaleString("en-US", { timeZone: timezone }));
  const hours = localTime.getHours() % 12;
  const minutes = localTime.getMinutes();
  const seconds = localTime.getSeconds();
  
  const hourAngle = (hours * 30) + (minutes * 0.5);
  const minuteAngle = minutes * 6;
  const secondAngle = seconds * 6;

  return (
    <div className="relative w-32 h-32 rounded-full border-2 border-amber-700/30 dark:border-amber-400/20 bg-amber-50/10 dark:bg-amber-900/10">
      {[...Array(12)].map((_, i) => (
        <div key={i}
          className="absolute w-0.5 h-6 bg-amber-800/40 dark:bg-amber-300/40"
          style={{
            top: '4px', left: '50%',
            transformOrigin: '50% 60px',
            transform: `translateX(-50%) rotate(${i * 30}deg)`,
          }}
        />
      ))}
      
      <div className="absolute w-1 bg-amber-900/80 dark:bg-amber-200/80 rounded-full"
        style={{ height: '40px', top: '24px', left: '50%',
          transformOrigin: '50% 40px',
          transform: `translateX(-50%) rotate(${hourAngle}deg)`,
        }}
      />
      
      <div className="absolute w-0.5 bg-amber-800/90 dark:bg-amber-300/90 rounded-full"
        style={{ height: '56px', top: '8px', left: '50%',
          transformOrigin: '50% 56px',
          transform: `translateX(-50%) rotate(${minuteAngle}deg)`,
        }}
      />
      
      <div className="absolute w-px bg-red-600 dark:bg-red-400 rounded-full"
        style={{ height: '60px', top: '4px', left: '50%',
          transformOrigin: '50% 60px',
          transform: `translateX(-50%) rotate(${secondAngle}deg)`,
          transition: 'none',
        }}
      />
      
      <div className="absolute w-2 h-2 bg-amber-900 dark:bg-amber-200 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
    </div>
  );
}

// Bold - High contrast black/white with red accent
function BoldClock({ time, timezone }: { time: Date; timezone: string }) {
  const formatTime = () => new Intl.DateTimeFormat('en-US', {
    timeZone: timezone, hour: '2-digit', minute: '2-digit', hour12: true,
  }).format(time);

  return (
    <div className="font-bold tracking-tight text-white">
      {formatTime().split(':').map((part, i) => (
        <span key={i}>
          {i > 0 && <span className="text-red-500">:</span>}
          {part}
        </span>
      ))}
    </div>
  );
}
