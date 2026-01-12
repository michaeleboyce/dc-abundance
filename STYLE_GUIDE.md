# DC Abundance Style Guide

This document defines the visual design system for the DC Abundance website.

---

## Brand Identity

**Mission:** Promote an abundance agenda for Washington, DC—more housing, better transit, clean energy, and efficient government for everyone.

**Tone:** Optimistic, action-oriented, cross-partisan, inclusive

**Tagline:** "Build a More Abundant DC"

---

## Color Palette

### Primary: Deep Navy
Trust, authority, and DC government identity. Used for headers, navigation, and primary text.

| Token | Hex | Usage |
|-------|-----|-------|
| `primary-50` | `#eff6ff` | Lightest tint, hover backgrounds |
| `primary-100` | `#dbeafe` | Light backgrounds |
| `primary-200` | `#bfdbfe` | Borders, dividers |
| `primary-300` | `#93c5fd` | Icons, secondary elements |
| `primary-400` | `#60a5fa` | Links |
| `primary-500` | `#3b82f6` | Base blue |
| `primary-600` | `#1e40af` | Buttons, strong emphasis |
| `primary-700` | `#1e3a8a` | **Main navy** - headers, nav |
| `primary-800` | `#172554` | Dark backgrounds |
| `primary-900` | `#0f172a` | Darkest, footer background |

### Accent: Abundance Gold
Optimism, warmth, and action. Used for CTAs, highlights, and emphasis.

| Token | Hex | Usage |
|-------|-----|-------|
| `accent-50` | `#fffbeb` | Light gold backgrounds |
| `accent-100` | `#fef3c7` | Hover states |
| `accent-200` | `#fde68a` | Borders |
| `accent-300` | `#fcd34d` | Icons |
| `accent-400` | `#fbbf24` | **Bright gold** - highlights |
| `accent-500` | `#f59e0b` | **Main gold** - primary CTAs |
| `accent-600` | `#d97706` | Hover on CTAs |
| `accent-700` | `#b45309` | Active states |
| `accent-800` | `#92400e` | Dark gold text |
| `accent-900` | `#78350f` | Darkest gold |

### Neutral: Warm Stone
Backgrounds, text, and UI chrome. Warmer than pure grays to feel welcoming.

| Token | Hex | Usage |
|-------|-----|-------|
| `neutral-50` | `#fafaf9` | **Page background** |
| `neutral-100` | `#f5f5f4` | Card backgrounds, sections |
| `neutral-200` | `#e7e5e4` | Borders, dividers |
| `neutral-300` | `#d6d3d1` | Disabled states |
| `neutral-400` | `#a8a29e` | **Muted text**, placeholders |
| `neutral-500` | `#78716c` | Secondary text |
| `neutral-600` | `#57534e` | Icons |
| `neutral-700` | `#44403c` | Strong secondary text |
| `neutral-800` | `#292524` | **Headings** |
| `neutral-900` | `#1c1917` | **Body text** |

### Semantic Colors

| Purpose | Hex | Tailwind |
|---------|-----|----------|
| Success | `#22c55e` | `green-500` |
| Error | `#ef4444` | `red-500` |
| Warning | `#f59e0b` | `amber-500` |
| Info | `#3b82f6` | `blue-500` |

---

## Typography

### Font Family
- **Primary:** Geist Sans (via Next.js)
- **Monospace:** Geist Mono (for code, data)

### Type Scale

| Class | Size | Line Height | Usage |
|-------|------|-------------|-------|
| `text-xs` | 12px / 0.75rem | 1.5 | Captions, labels |
| `text-sm` | 14px / 0.875rem | 1.5 | Small text, metadata |
| `text-base` | 16px / 1rem | 1.6 | Body text |
| `text-lg` | 18px / 1.125rem | 1.6 | Lead paragraphs |
| `text-xl` | 20px / 1.25rem | 1.5 | Section subtitles |
| `text-2xl` | 24px / 1.5rem | 1.4 | Card headings |
| `text-3xl` | 30px / 1.875rem | 1.3 | Section headings |
| `text-4xl` | 36px / 2.25rem | 1.2 | Page titles |
| `text-5xl` | 48px / 3rem | 1.1 | Hero subheadline |
| `text-6xl` | 60px / 3.75rem | 1.1 | Hero headline (mobile) |
| `text-7xl` | 72px / 4.5rem | 1.0 | Hero headline (desktop) |

### Font Weights

| Weight | Value | Usage |
|--------|-------|-------|
| Regular | 400 | Body text |
| Medium | 500 | Buttons, labels, nav links |
| Semibold | 600 | Card headings, emphasis |
| Bold | 700 | Section headings, hero |

---

## Spacing System

Based on a 4px grid for consistent rhythm.

| Token | Value | Pixels |
|-------|-------|--------|
| `space-1` | 0.25rem | 4px |
| `space-2` | 0.5rem | 8px |
| `space-3` | 0.75rem | 12px |
| `space-4` | 1rem | 16px |
| `space-5` | 1.25rem | 20px |
| `space-6` | 1.5rem | 24px |
| `space-8` | 2rem | 32px |
| `space-10` | 2.5rem | 40px |
| `space-12` | 3rem | 48px |
| `space-16` | 4rem | 64px |
| `space-20` | 5rem | 80px |
| `space-24` | 6rem | 96px |

### Section Spacing
- **Between sections:** `py-16` (64px) on mobile, `py-24` (96px) on desktop
- **Container padding:** `px-4` (16px) on mobile, `px-8` (32px) on desktop

---

## Component Patterns

### Buttons

**Primary (Gold):**
```css
bg-accent-500 hover:bg-accent-600 text-neutral-900 font-medium
px-6 py-3 rounded-lg transition-colors
```

**Secondary (Navy outline):**
```css
border-2 border-primary-700 text-primary-700 hover:bg-primary-700 hover:text-white
font-medium px-6 py-3 rounded-lg transition-colors
```

**Ghost:**
```css
text-primary-700 hover:text-primary-800 underline-offset-4 hover:underline
font-medium transition-colors
```

### Cards

```css
bg-white rounded-xl shadow-sm hover:shadow-md
transition-shadow duration-200
p-6 or p-8
```

With image:
```css
overflow-hidden rounded-xl
/* Image */
aspect-[4/3] object-cover
```

### Form Inputs

```css
w-full px-4 py-3 rounded-lg border border-neutral-200
focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
placeholder:text-neutral-400
```

Error state:
```css
border-red-500 focus:ring-red-500
```

### Images

- **Hero backgrounds:** Full width, `object-cover`, dark gradient overlay
- **Card images:** `rounded-lg` or `rounded-t-xl`, `aspect-[4/3]` or `aspect-[16/9]`
- **Overlays:** `bg-gradient-to-b from-black/50 via-black/30 to-black/60`

---

## Layout

### Container
- Max width: `max-w-7xl` (1280px)
- Padding: `px-4 sm:px-6 lg:px-8`
- Centered: `mx-auto`

### Grid
- Policy pillars: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6`
- Content + sidebar: `grid grid-cols-1 lg:grid-cols-3 gap-8`

### Breakpoints
| Name | Width | Usage |
|------|-------|-------|
| `sm` | 640px | Small tablets |
| `md` | 768px | Tablets |
| `lg` | 1024px | Laptops |
| `xl` | 1280px | Desktops |
| `2xl` | 1536px | Large screens |

---

## Voice & Tone

### Do
- Use **action verbs**: "Build," "Create," "Enable," "Expand," "Unlock"
- Focus on **outcomes**: "more homes," "faster commutes," "lower bills"
- Be **inclusive**: "for everyone," "all DC residents," "our community"
- Stay **optimistic**: emphasize possibilities, not problems
- Be **specific**: concrete examples over vague promises

### Don't
- Use partisan language (avoid left/right, liberal/conservative framing)
- Use policy jargon or wonk speak
- Frame things negatively (what we're against)
- Make vague promises without specifics
- Be preachy or condescending

### Example Copy

**Good:**
> "Build more homes in every neighborhood so everyone can afford to live in DC."

**Bad:**
> "We oppose exclusionary zoning policies that perpetuate systemic inequities."

**Good:**
> "Make Metro more frequent and reliable—trains every 5 minutes, all day."

**Bad:**
> "Advocate for increased transit investment and operational efficiency improvements."

---

## Image Guidelines

### Hero Images
- High resolution (min 1920px wide)
- Horizontal/landscape orientation
- Dark overlay applied in CSS
- Subject should be centered or weighted left (text overlays right)

### Card Images
- 4:3 or 16:9 aspect ratio
- Should clearly represent the pillar topic
- Avoid images with text/logos

### Current Image Library

| File | Subject | Recommended Use |
|------|---------|-----------------|
| `union-station.jpg` | Union Station interior | Homepage hero |
| `dc-rowhouses.jpg` | Logan Circle rowhouses | Housing pillar |
| `u-street-metro.jpg` | Metro station | Transit pillar |
| `library-of-congress.jpg` | Library interior | Government pillar |
| `dulles-airport.jpg` | Airport at dusk | Energy pillar |
| `haupt-garden.jpg` | Smithsonian garden | CTA backgrounds |
| `arena-stage.jpg` | Arena Stage | Get Involved page |

---

## Accessibility

- Maintain WCAG 2.1 AA contrast ratios (4.5:1 for body text)
- All images must have descriptive `alt` text
- Interactive elements must have visible focus states
- Use semantic HTML (`<nav>`, `<main>`, `<section>`, etc.)
- Form inputs must have associated `<label>` elements
