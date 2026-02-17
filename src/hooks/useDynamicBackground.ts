import { useEffect } from 'react';

type ClockStyle = 'modern' | 'minimal' | 'word' | 'retro' | 'analog' | 'bold';

interface ClockData {
  style: ClockStyle;
}

// HSL values for each style's 3 gradient stops
// [h1, s1, l1, h2, s2, l2, h3, s3, l3]
const STYLE_COLORS: Record<ClockStyle, { light: number[]; dark: number[] }> = {
  modern: {
    light: [270, 100, 85, 300, 80, 80, 320, 85, 85],
    dark:  [260, 50, 12, 275, 45, 16, 290, 40, 20],
  },
  minimal: {
    light: [200, 90, 88, 215, 85, 82, 230, 80, 86],
    dark:  [200, 50, 10, 215, 45, 14, 230, 40, 18],
  },
  word: {
    light: [35, 40, 25, 30, 30, 18, 25, 25, 15],
    dark:  [35, 30, 10, 30, 25, 8, 25, 20, 6],
  },
  retro: {
    light: [120, 15, 10, 130, 20, 8, 140, 10, 12],
    dark:  [120, 20, 5, 130, 25, 4, 140, 15, 6],
  },
  analog: {
    light: [40, 30, 95, 38, 25, 91, 35, 20, 88],
    dark:  [40, 15, 12, 38, 12, 15, 35, 10, 18],
  },
  bold: {
    light: [0, 0, 5, 0, 0, 8, 0, 0, 12],
    dark:  [0, 0, 3, 0, 0, 5, 0, 0, 8],
  },
};

export function useDynamicBackground(clocks: ClockData[]) {
  useEffect(() => {
    const body = document.body;
    const isDark = document.documentElement.classList.contains('dark');

    if (clocks.length === 0) {
      applyStyle(body, 'modern', isDark);
      return;
    }

    // Get dominant style
    const styleCounts = clocks.reduce((acc, clock) => {
      acc[clock.style] = (acc[clock.style] || 0) + 1;
      return acc;
    }, {} as Record<ClockStyle, number>);

    const dominantStyle = Object.entries(styleCounts).reduce((a, b) =>
      (a[1] as number) >= (b[1] as number) ? a : b
    )[0] as ClockStyle;

    applyStyle(body, dominantStyle, isDark);

    return () => {
      // Cleanup
      const props = ['--bg-h1','--bg-s1','--bg-l1','--bg-h2','--bg-s2','--bg-l2','--bg-h3','--bg-s3','--bg-l3'];
      props.forEach(p => body.style.removeProperty(p));
    };
  }, [clocks]);

  // Also react to dark mode changes
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains('dark');
      if (clocks.length === 0) return;

      const styleCounts = clocks.reduce((acc, clock) => {
        acc[clock.style] = (acc[clock.style] || 0) + 1;
        return acc;
      }, {} as Record<ClockStyle, number>);

      const dominantStyle = Object.entries(styleCounts).reduce((a, b) =>
        (a[1] as number) >= (b[1] as number) ? a : b
      )[0] as ClockStyle;

      applyStyle(document.body, dominantStyle, isDark);
    });

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, [clocks]);
}

function applyStyle(body: HTMLElement, style: ClockStyle, isDark: boolean) {
  const colors = isDark ? STYLE_COLORS[style].dark : STYLE_COLORS[style].light;
  const [h1, s1, l1, h2, s2, l2, h3, s3, l3] = colors;

  body.style.setProperty('--bg-h1', String(h1));
  body.style.setProperty('--bg-s1', String(s1));
  body.style.setProperty('--bg-l1', String(l1));
  body.style.setProperty('--bg-h2', String(h2));
  body.style.setProperty('--bg-s2', String(s2));
  body.style.setProperty('--bg-l2', String(l2));
  body.style.setProperty('--bg-h3', String(h3));
  body.style.setProperty('--bg-s3', String(s3));
  body.style.setProperty('--bg-l3', String(l3));
}
