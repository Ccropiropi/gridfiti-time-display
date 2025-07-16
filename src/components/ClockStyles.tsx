import { useState, useEffect } from 'react';

interface ClockStyleProps {
  timezone: string;
  style: 'modern' | 'minimal' | 'word' | 'retro' | 'analog' | 'bold';
}

export function ClockDisplay({ timezone, style }: ClockStyleProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (format: string) => {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      ...getTimeFormat(format)
    }).format(time);
  };

  const getTimeFormat = (format: string): Intl.DateTimeFormatOptions => {
    switch (format) {
      case '24h':
        return { hour: '2-digit' as const, minute: '2-digit' as const, hour12: false };
      case '12h':
        return { hour: '2-digit' as const, minute: '2-digit' as const, hour12: true };
      case 'seconds':
        return { hour: '2-digit' as const, minute: '2-digit' as const, second: '2-digit' as const, hour12: false };
      case 'timestamp':
        return { hour: '2-digit' as const, minute: '2-digit' as const, second: '2-digit' as const, hour12: false };
      default:
        return { hour: '2-digit' as const, minute: '2-digit' as const, hour12: false };
    }
  };

  switch (style) {
    case 'modern':
      return <ModernClock time={time} timezone={timezone} />;
    case 'minimal':
      return <MinimalClock time={time} timezone={timezone} />;
    case 'word':
      return <WordClock time={time} timezone={timezone} />;
    case 'retro':
      return <RetroClock time={time} timezone={timezone} />;
    case 'analog':
      return <AnalogClock time={time} timezone={timezone} />;
    case 'bold':
      return <BoldClock time={time} timezone={timezone} />;
    default:
      return <ModernClock time={time} timezone={timezone} />;
  }
}

// Modern Style (Default - current style)
function ModernClock({ time, timezone }: { time: Date; timezone: string }) {
  const formatTime = () => {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(time);
  };

  return (
    <div className="font-mono tabular-nums text-clock-text">
      {formatTime()}
    </div>
  );
}

// Minimal Style (Gridfiti blue aesthetic)
function MinimalClock({ time, timezone }: { time: Date; timezone: string }) {
  const formatTime = () => {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
    return formatter.format(time).replace(/:/g, '');
  };

  return (
    <div className="relative">
      <div className="font-light tracking-wider text-white/90 drop-shadow-lg">
        {formatTime()}
      </div>
    </div>
  );
}

// Word Clock Style
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
    <div className="font-light tracking-widest text-white/80 leading-relaxed text-center">
      {getWordTime().split(' ').map((word, index) => (
        <span key={index} className={`inline-block mr-2 mb-1 ${
          ['IT', 'IS', 'A', 'PAST', 'TO', 'QUARTER', 'HALF', "O'CLOCK"].includes(word) 
            ? 'text-white/40' 
            : 'text-white font-medium'
        }`}>
          {word}
        </span>
      ))}
    </div>
  );
}

// Retro Style (Black with gray numbers)
function RetroClock({ time, timezone }: { time: Date; timezone: string }) {
  const formatTime = () => {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
    const parts = formatter.formatToParts(time);
    const hour = parts.find(p => p.type === 'hour')?.value;
    const minute = parts.find(p => p.type === 'minute')?.value;
    const dayPeriod = parts.find(p => p.type === 'dayPeriod')?.value;
    
    return { hour, minute, dayPeriod };
  };

  const { hour, minute, dayPeriod } = formatTime();

  return (
    <div className="flex items-baseline gap-1">
      <span className="text-gray-400 font-bold tracking-tight">
        {hour}
      </span>
      <span className="text-gray-400 font-bold tracking-tight">
        {minute}
      </span>
      <span className="text-gray-500 text-sm font-normal ml-1">
        {dayPeriod}
      </span>
    </div>
  );
}

// Analog Clock Style
function AnalogClock({ time, timezone }: { time: Date; timezone: string }) {
  const localTime = new Date(time.toLocaleString("en-US", { timeZone: timezone }));
  const hours = localTime.getHours() % 12;
  const minutes = localTime.getMinutes();
  const seconds = localTime.getSeconds();
  
  const hourAngle = (hours * 30) + (minutes * 0.5);
  const minuteAngle = minutes * 6;
  const secondAngle = seconds * 6;

  return (
    <div className="relative w-32 h-32 rounded-full border-2 border-white/20 bg-white/5">
      {/* Hour markers */}
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute w-0.5 h-6 bg-white/40"
          style={{
            top: '4px',
            left: '50%',
            transformOrigin: '50% 60px',
            transform: `translateX(-50%) rotate(${i * 30}deg)`,
          }}
        />
      ))}
      
      {/* Hour hand */}
      <div
        className="absolute w-1 bg-white/80 rounded-full"
        style={{
          height: '40px',
          top: '24px',
          left: '50%',
          transformOrigin: '50% 40px',
          transform: `translateX(-50%) rotate(${hourAngle}deg)`,
        }}
      />
      
      {/* Minute hand */}
      <div
        className="absolute w-0.5 bg-white/90 rounded-full"
        style={{
          height: '56px',
          top: '8px',
          left: '50%',
          transformOrigin: '50% 56px',
          transform: `translateX(-50%) rotate(${minuteAngle}deg)`,
        }}
      />
      
      {/* Second hand */}
      <div
        className="absolute w-px bg-red-400 rounded-full"
        style={{
          height: '60px',
          top: '4px',
          left: '50%',
          transformOrigin: '50% 60px',
          transform: `translateX(-50%) rotate(${secondAngle}deg)`,
        }}
      />
      
      {/* Center dot */}
      <div className="absolute w-2 h-2 bg-white rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
    </div>
  );
}

// Bold Style (Clean white on black)
function BoldClock({ time, timezone }: { time: Date; timezone: string }) {
  const formatTime = () => {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
    return formatter.format(time);
  };

  return (
    <div className="font-bold tracking-tight text-white">
      {formatTime()}
    </div>
  );
}