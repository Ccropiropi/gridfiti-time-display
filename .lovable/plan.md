
# Dynamic Background Transitions and Theme Improvements

## What's Changing

### 1. Smooth Animated Background Transitions
Currently the background snaps instantly when switching clock styles. We'll add CSS-powered gradient transitions using `@property` for smooth color morphing, plus a slow ambient animation that makes the background feel alive (subtle gradient shifting).

### 2. Style-Specific Theme Overrides
Each clock style will update not just the background gradient but also the clock card styling, text colors, and UI accent colors -- so everything feels cohesive. Right now, Word/Retro/Bold share identical dark backgrounds with hardcoded colors. Each will get a unique personality:
- **Modern**: Lavender-to-pink pastels (light), deep purple (dark)
- **Minimal**: Ocean blue tones with crisp white accents
- **Word**: Warm amber/gold text on charcoal, literary feel
- **Retro**: Green phosphor terminal aesthetic with scanline overlay
- **Analog**: Cream/parchment with elegant serif-inspired accents
- **Bold**: Pure high-contrast black/white with red accent

### 3. Ambient Background Animation
A slow-moving gradient animation (keyframe over ~15s) that subtly shifts the gradient angle, giving the page a living, breathing quality without being distracting.

### 4. Enhanced Dark Mode Per Style
Dark mode gradients will be richer and more distinct per style rather than just "darker versions" of light mode.

### 5. Clock Card Glass Effect Per Style
Each style's card will get a tailored glass/frosted effect that matches its theme rather than all sharing the same `clock-glass` treatment.

---

## Suggestions to Consider Adding Later
- **Time-of-day adaptive colors**: Background subtly shifts warmer at sunset hours, cooler at night based on the primary clock's timezone
- **Ambient sound toggle**: Optional soft ticking or ambient sound per style
- **Custom accent color picker**: Let users pick their own accent color overlay
- **Parallax dot grid**: The dot pattern background shifts slightly on mouse movement

---

## Technical Details

### Files to modify:

**`src/index.css`**
- Add `@property` declarations for animatable CSS custom properties (gradient colors)
- Add `@keyframes gradient-shift` for ambient background animation
- Update each `.bg-*` class with unique gradient angles, animation, and overlay effects
- Add style-specific card glass effects (`.clock-glass-modern`, `.clock-glass-retro`, etc.)
- Give Retro style a scanline pseudo-element overlay
- Give Word style a subtle paper texture effect
- Improve dark mode gradients with more saturation and depth per style
- Add transition properties on body for smooth gradient interpolation

**`src/hooks/useDynamicBackground.ts`**
- Set CSS custom properties (`--bg-h1`, `--bg-s1`, `--bg-l1`, etc.) for gradient stop colors instead of toggling classes, enabling smooth CSS transitions between any two styles
- Add transition duration control
- Clean up mixed-background logic to use the property-based approach

**`src/components/Clock.tsx`**
- Update `getStyleBackground()` to use style-specific glass classes
- Adjust text color classes per style for better contrast

**`src/components/ClockStyles.tsx`**
- Fine-tune text colors per style (e.g., Retro gets green phosphor color, Word gets warm amber)
- Add subtle per-style animations (e.g., retro digit flicker, analog smooth sweep)

**`tailwind.config.ts`**
- Add `gradient-shift` keyframe and animation
- Add style-specific color utilities if needed
