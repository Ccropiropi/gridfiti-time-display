import { useEffect } from 'react';

type ClockStyle = 'modern' | 'minimal' | 'word' | 'retro' | 'analog' | 'bold';

interface ClockData {
  style: ClockStyle;
}

export function useDynamicBackground(clocks: ClockData[]) {
  useEffect(() => {
    const body = document.body;
    
    // Remove all existing background classes
    const backgroundClasses = ['bg-modern', 'bg-minimal', 'bg-word', 'bg-retro', 'bg-analog', 'bg-bold'];
    backgroundClasses.forEach(cls => body.classList.remove(cls));
    
    if (clocks.length === 0) {
      body.classList.add('bg-modern');
      return;
    }

    // Determine dominant style or create mixed background
    const styleCounts = clocks.reduce((acc, clock) => {
      acc[clock.style] = (acc[clock.style] || 0) + 1;
      return acc;
    }, {} as Record<ClockStyle, number>);

    // Get the most common style
    const dominantStyle = Object.entries(styleCounts).reduce((a, b) => 
      styleCounts[a[0] as ClockStyle] > styleCounts[b[0] as ClockStyle] ? a : b
    )[0] as ClockStyle;

    // Apply the dominant style background
    body.classList.add(`bg-${dominantStyle}`);

    // If multiple different styles exist, add a mixing class for subtle blending
    const uniqueStyles = Object.keys(styleCounts);
    if (uniqueStyles.length > 1) {
      body.style.setProperty('--background-opacity', '0.9');
      
      // Create a subtle blend effect
      const secondaryStyle = uniqueStyles.find(style => style !== dominantStyle);
      if (secondaryStyle) {
        body.style.setProperty('--secondary-background', `var(--gradient-${secondaryStyle})`);
        body.classList.add('bg-mixed');
      }
    } else {
      body.style.removeProperty('--background-opacity');
      body.style.removeProperty('--secondary-background');
      body.classList.remove('bg-mixed');
    }

    return () => {
      // Cleanup function
      backgroundClasses.forEach(cls => body.classList.remove(cls));
      body.classList.remove('bg-mixed');
      body.style.removeProperty('--background-opacity');
      body.style.removeProperty('--secondary-background');
    };
  }, [clocks]);
}