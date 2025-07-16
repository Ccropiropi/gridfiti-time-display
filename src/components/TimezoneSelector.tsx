import { useState } from 'react';
import { Settings, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface TimezoneSelectorProps {
  value: string;
  onChange?: (timezone: string) => void;
  onLabelChange?: (label: string) => void;
  onStyleChange?: (style: string) => void;
  currentLabel: string;
  currentStyle?: string;
}

// Comprehensive timezones organized by continent
const TIMEZONES = [
  // North America
  { value: 'America/New_York', label: 'New York (EST/EDT)', continent: 'North America' },
  { value: 'America/Los_Angeles', label: 'Los Angeles (PST/PDT)', continent: 'North America' },
  { value: 'America/Chicago', label: 'Chicago (CST/CDT)', continent: 'North America' },
  { value: 'America/Denver', label: 'Denver (MST/MDT)', continent: 'North America' },
  { value: 'America/Phoenix', label: 'Phoenix (MST)', continent: 'North America' },
  { value: 'America/Toronto', label: 'Toronto (EST/EDT)', continent: 'North America' },
  { value: 'America/Vancouver', label: 'Vancouver (PST/PDT)', continent: 'North America' },
  { value: 'America/Montreal', label: 'Montreal (EST/EDT)', continent: 'North America' },
  { value: 'America/Anchorage', label: 'Anchorage (AKST/AKDT)', continent: 'North America' },
  { value: 'America/Mexico_City', label: 'Mexico City (CST/CDT)', continent: 'North America' },

  // South America
  { value: 'America/Sao_Paulo', label: 'São Paulo (BRT/BRST)', continent: 'South America' },
  { value: 'America/Argentina/Buenos_Aires', label: 'Buenos Aires (ART)', continent: 'South America' },
  { value: 'America/Lima', label: 'Lima (PET)', continent: 'South America' },
  { value: 'America/Bogota', label: 'Bogotá (COT)', continent: 'South America' },
  { value: 'America/Santiago', label: 'Santiago (CLT/CLST)', continent: 'South America' },
  { value: 'America/Caracas', label: 'Caracas (VET)', continent: 'South America' },
  { value: 'America/La_Paz', label: 'La Paz (BOT)', continent: 'South America' },
  { value: 'America/Montevideo', label: 'Montevideo (UYT)', continent: 'South America' },

  // Europe
  { value: 'Europe/London', label: 'London (GMT/BST)', continent: 'Europe' },
  { value: 'Europe/Paris', label: 'Paris (CET/CEST)', continent: 'Europe' },
  { value: 'Europe/Berlin', label: 'Berlin (CET/CEST)', continent: 'Europe' },
  { value: 'Europe/Rome', label: 'Rome (CET/CEST)', continent: 'Europe' },
  { value: 'Europe/Madrid', label: 'Madrid (CET/CEST)', continent: 'Europe' },
  { value: 'Europe/Amsterdam', label: 'Amsterdam (CET/CEST)', continent: 'Europe' },
  { value: 'Europe/Zurich', label: 'Zurich (CET/CEST)', continent: 'Europe' },
  { value: 'Europe/Vienna', label: 'Vienna (CET/CEST)', continent: 'Europe' },
  { value: 'Europe/Stockholm', label: 'Stockholm (CET/CEST)', continent: 'Europe' },
  { value: 'Europe/Oslo', label: 'Oslo (CET/CEST)', continent: 'Europe' },
  { value: 'Europe/Copenhagen', label: 'Copenhagen (CET/CEST)', continent: 'Europe' },
  { value: 'Europe/Helsinki', label: 'Helsinki (EET/EEST)', continent: 'Europe' },
  { value: 'Europe/Warsaw', label: 'Warsaw (CET/CEST)', continent: 'Europe' },
  { value: 'Europe/Prague', label: 'Prague (CET/CEST)', continent: 'Europe' },
  { value: 'Europe/Budapest', label: 'Budapest (CET/CEST)', continent: 'Europe' },
  { value: 'Europe/Moscow', label: 'Moscow (MSK)', continent: 'Europe' },
  { value: 'Europe/Kiev', label: 'Kyiv (EET/EEST)', continent: 'Europe' },
  { value: 'Europe/Athens', label: 'Athens (EET/EEST)', continent: 'Europe' },
  { value: 'Europe/Istanbul', label: 'Istanbul (TRT)', continent: 'Europe' },
  { value: 'Europe/Dublin', label: 'Dublin (GMT/IST)', continent: 'Europe' },
  { value: 'Europe/Lisbon', label: 'Lisbon (WET/WEST)', continent: 'Europe' },

  // Asia
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)', continent: 'Asia' },
  { value: 'Asia/Shanghai', label: 'Shanghai (CST)', continent: 'Asia' },
  { value: 'Asia/Hong_Kong', label: 'Hong Kong (HKT)', continent: 'Asia' },
  { value: 'Asia/Singapore', label: 'Singapore (SGT)', continent: 'Asia' },
  { value: 'Asia/Seoul', label: 'Seoul (KST)', continent: 'Asia' },
  { value: 'Asia/Kolkata', label: 'Mumbai (IST)', continent: 'Asia' },
  { value: 'Asia/Dubai', label: 'Dubai (GST)', continent: 'Asia' },
  { value: 'Asia/Bangkok', label: 'Bangkok (ICT)', continent: 'Asia' },
  { value: 'Asia/Manila', label: 'Manila (PHT)', continent: 'Asia' },
  { value: 'Asia/Jakarta', label: 'Jakarta (WIB)', continent: 'Asia' },
  { value: 'Asia/Kuala_Lumpur', label: 'Kuala Lumpur (MYT)', continent: 'Asia' },
  { value: 'Asia/Tehran', label: 'Tehran (IRST/IRDT)', continent: 'Asia' },
  { value: 'Asia/Jerusalem', label: 'Jerusalem (IST/IDT)', continent: 'Asia' },
  { value: 'Asia/Riyadh', label: 'Riyadh (AST)', continent: 'Asia' },
  { value: 'Asia/Karachi', label: 'Karachi (PKT)', continent: 'Asia' },
  { value: 'Asia/Dhaka', label: 'Dhaka (BST)', continent: 'Asia' },
  { value: 'Asia/Kathmandu', label: 'Kathmandu (NPT)', continent: 'Asia' },
  { value: 'Asia/Colombo', label: 'Colombo (SLST)', continent: 'Asia' },
  { value: 'Asia/Almaty', label: 'Almaty (ALMT)', continent: 'Asia' },
  { value: 'Asia/Tashkent', label: 'Tashkent (UZT)', continent: 'Asia' },

  // Africa
  { value: 'Africa/Cairo', label: 'Cairo (EET)', continent: 'Africa' },
  { value: 'Africa/Lagos', label: 'Lagos (WAT)', continent: 'Africa' },
  { value: 'Africa/Johannesburg', label: 'Johannesburg (SAST)', continent: 'Africa' },
  { value: 'Africa/Nairobi', label: 'Nairobi (EAT)', continent: 'Africa' },
  { value: 'Africa/Casablanca', label: 'Casablanca (WET/WEST)', continent: 'Africa' },
  { value: 'Africa/Tunis', label: 'Tunis (CET)', continent: 'Africa' },
  { value: 'Africa/Algiers', label: 'Algiers (CET)', continent: 'Africa' },
  { value: 'Africa/Accra', label: 'Accra (GMT)', continent: 'Africa' },
  { value: 'Africa/Addis_Ababa', label: 'Addis Ababa (EAT)', continent: 'Africa' },
  { value: 'Africa/Dar_es_Salaam', label: 'Dar es Salaam (EAT)', continent: 'Africa' },
  { value: 'Africa/Kinshasa', label: 'Kinshasa (WAT)', continent: 'Africa' },

  // Australia & Oceania
  { value: 'Australia/Sydney', label: 'Sydney (AEST/AEDT)', continent: 'Oceania' },
  { value: 'Australia/Melbourne', label: 'Melbourne (AEST/AEDT)', continent: 'Oceania' },
  { value: 'Australia/Brisbane', label: 'Brisbane (AEST)', continent: 'Oceania' },
  { value: 'Australia/Perth', label: 'Perth (AWST)', continent: 'Oceania' },
  { value: 'Australia/Adelaide', label: 'Adelaide (ACST/ACDT)', continent: 'Oceania' },
  { value: 'Australia/Darwin', label: 'Darwin (ACST)', continent: 'Oceania' },
  { value: 'Pacific/Auckland', label: 'Auckland (NZST/NZDT)', continent: 'Oceania' },
  { value: 'Pacific/Fiji', label: 'Fiji (FJT)', continent: 'Oceania' },
  { value: 'Pacific/Honolulu', label: 'Honolulu (HST)', continent: 'Oceania' },
  { value: 'Pacific/Tahiti', label: 'Tahiti (TAHT)', continent: 'Oceania' },
  { value: 'Pacific/Guam', label: 'Guam (ChST)', continent: 'Oceania' },

  // Special/UTC
  { value: 'UTC', label: 'UTC (Coordinated Universal Time)', continent: 'UTC' },
];

// Clock style options
const CLOCK_STYLES = [
  { value: 'modern', label: 'Modern Glass', description: 'Clean digital with glass effect' },
  { value: 'minimal', label: 'Minimal Blue', description: 'Thin outlined numbers' },
  { value: 'word', label: 'Word Clock', description: 'Time spelled out in words' },
  { value: 'retro', label: 'Retro Display', description: 'Classic gray on black' },
  { value: 'analog', label: 'Analog Face', description: 'Traditional clock hands' },
  { value: 'bold', label: 'Bold Simple', description: 'Clean white on black' },
];

export function TimezoneSelector({ value, onChange, onLabelChange, onStyleChange, currentLabel, currentStyle = 'modern' }: TimezoneSelectorProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [labelInput, setLabelInput] = useState(currentLabel);
  const [selectedStyle, setSelectedStyle] = useState(currentStyle);

  const handleTimezoneSelect = (timezone: string) => {
    onChange?.(timezone);
    setOpen(false);
  };

  const handleLabelSave = () => {
    onLabelChange?.(labelInput);
  };

  const handleStyleChange = (style: string) => {
    setSelectedStyle(style);
    onStyleChange?.(style);
  };

  const filteredTimezones = TIMEZONES.filter(tz =>
    tz.label.toLowerCase().includes(search.toLowerCase()) ||
    tz.value.toLowerCase().includes(search.toLowerCase()) ||
    tz.continent.toLowerCase().includes(search.toLowerCase())
  );

  // Group timezones by continent
  const groupedTimezones = filteredTimezones.reduce((acc, tz) => {
    const continent = tz.continent;
    if (!acc[continent]) {
      acc[continent] = [];
    }
    acc[continent].push(tz);
    return acc;
  }, {} as Record<string, typeof filteredTimezones>);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:bg-primary/20"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <div className="p-4 space-y-6">
          {/* Style Selector */}
          <div className="space-y-3">
            <Label>Clock Style</Label>
            <div className="grid grid-cols-2 gap-2">
              {CLOCK_STYLES.map((style) => (
                <button
                  key={style.value}
                  onClick={() => handleStyleChange(style.value)}
                  className={`p-3 text-left rounded-lg border transition-all ${
                    selectedStyle === style.value
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border hover:border-primary/50 hover:bg-accent'
                  }`}
                >
                  <div className="font-medium text-sm">{style.label}</div>
                  <div className="text-xs text-muted-foreground mt-1">{style.description}</div>
                </button>
              ))}
            </div>
          </div>
          {/* Label Input */}
          <div className="space-y-2">
            <Label htmlFor="label">Clock Label</Label>
            <div className="flex gap-2">
              <Input
                id="label"
                value={labelInput}
                onChange={(e) => setLabelInput(e.target.value)}
                placeholder="Enter clock label"
                className="flex-1"
              />
              <Button 
                onClick={handleLabelSave}
                size="sm"
                disabled={labelInput === currentLabel}
              >
                <Check className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Timezone Selector */}
          <div className="space-y-2">
            <Label>Timezone</Label>
            <Command>
              <CommandInput
                placeholder="Search timezones..."
                value={search}
                onValueChange={setSearch}
              />
              <CommandList className="max-h-64">
                <CommandEmpty>No timezone found.</CommandEmpty>
                {Object.entries(groupedTimezones).map(([continent, timezones]) => (
                  <CommandGroup key={continent} heading={continent}>
                    {timezones.map((timezone) => (
                      <CommandItem
                        key={timezone.value}
                        value={timezone.value}
                        onSelect={() => handleTimezoneSelect(timezone.value)}
                        className="cursor-pointer"
                      >
                        <Check
                          className={`mr-2 h-4 w-4 ${
                            value === timezone.value ? 'opacity-100' : 'opacity-0'
                          }`}
                        />
                        <div>
                          <div className="font-medium">{timezone.label}</div>
                          <div className="text-xs text-muted-foreground">
                            {timezone.value}
                          </div>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                ))}
              </CommandList>
            </Command>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}