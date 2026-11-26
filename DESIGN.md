---
name: 'OmniBuf'
description: 'Fast, self-describing binary wire format for .proto schemas and plain structs'
colors:
  signal-orange: '#FF4F18'
  signal-orange-text: '#D63B09'
  cobalt-blue: '#1E40AF'
  mint-emerald: '#10B981'
  drafting-paper: '#F4F0E6'
  warm-cream: '#FAF8F2'
  stone-subtle: '#EDE8DC'
  carbon-ink: '#111111'
  code-charcoal: '#16181D'
  pure-white: '#FFFFFF'
typography:
  display:
    fontFamily: 'Space Grotesk, sans-serif'
    fontSize: 'clamp(2rem, 4vw, 3rem)'
    fontWeight: 700
    lineHeight: 1.12
    letterSpacing: '-0.025em'
  headline:
    fontFamily: 'Space Grotesk, sans-serif'
    fontSize: 'clamp(1.4rem, 2.5vw, 1.85rem)'
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: '-0.02em'
  title:
    fontFamily: 'Space Grotesk, sans-serif'
    fontSize: '1.125rem'
    fontWeight: 600
    lineHeight: 1.35
  body:
    fontFamily: 'Space Grotesk, sans-serif'
    fontSize: '1.0625rem'
    fontWeight: 400
    lineHeight: 1.7
  mono:
    fontFamily: 'IBM Plex Mono, monospace'
    fontSize: '0.875rem'
    fontWeight: 500
    lineHeight: 1.55
rounded:
  xs: '4px'
  sm: '6px'
  md: '8px'
  lg: '10px'
spacing:
  xs: '8px'
  sm: '12px'
  md: '16px'
  lg: '24px'
  xl: '32px'
  2xl: '48px'
components:
  button-primary:
    backgroundColor: '{colors.carbon-ink}'
    textColor: '{colors.warm-cream}'
    rounded: '{rounded.sm}'
    padding: '8px 16px'
  button-secondary:
    backgroundColor: '{colors.warm-cream}'
    textColor: '{colors.carbon-ink}'
    rounded: '{rounded.sm}'
    padding: '8px 16px'
  card-panel:
    backgroundColor: '{colors.warm-cream}'
    textColor: '{colors.carbon-ink}'
    rounded: '{rounded.md}'
    padding: '20px'
---

# Design System: OmniBuf

## Overview

**Creative North Star: "Quiet Technical Manual"**

OmniBuf's visual identity pairs the warmth of archival drafting paper (`#F4F0E6`) and dark ink (`#111111`) with calm, uncluttered engineering documentation. Prose, code snippets, wire-byte examples, and benchmark measurements come first, without background grids, loud all-caps display headings, hard offset shadows, or fake window chrome competing for attention.

Signal Orange (`#FF4F18` for bars and marks, `#D63B09` for AA-compliant text on light paper, `#FF7A4D` in dark mode) serves as the single restrained accent across the site. Dark mode (`html.dark`) maps the paper canvas to calm charcoal (`#0F1115`) and elevated slate (`#161920`) while keeping crisp text contrast and tabular alignment intact.

**Key Characteristics:**

- Plain warm-paper background (`#F4F0E6`) with no grid overlay and subtle `1px` borders (`rgba(17, 17, 17, 0.14)`).
- Sentence-case headings in `Space Grotesk` sized for calm scanning (`2rem` to `3rem` for `h1`, `1.4rem` to `1.85rem` for `h2`).
- `IBM Plex Mono` reserved strictly for code, wire bytes, wire types, package names, and tabular benchmark numbers.
- Single restrained Signal Orange accent for OmniBuf benchmark series, diagram highlights, and interactive focus/link states.

## Colors

- **Drafting Paper (`#F4F0E6`)**: Root page background in light mode (`#0F1115` in dark mode).
- **Warm Cream (`#FAF8F2`)**: Elevated surface fill for panels, cards, tables, and the sticky top bar (`#161920` in dark mode).
- **Stone Subtle (`#EDE8DC`)**: Table headers, subtle hover fills, and secondary panel strips (`#1E232E` in dark mode).
- **Carbon Ink (`#111111`)**: Primary typography and primary action buttons (`#F4F0E6` in dark mode).
- **Code Charcoal (`#16181D`)**: Code block and terminal output surface (`#0B0D11` in dark mode).
- **Signal Orange (`#FF4F18` / `#D63B09` light text / `#FF7A4D` dark text)**: Primary benchmark bars, active markers, and inline link hover accents.

## Typography

- **UI & Prose (`Space Grotesk`)**: Sentence-case headings, navigation, buttons, and body prose (`1.0625rem`, `1.7` line-height, `65ch` max measure).
- **Technical Data (`IBM Plex Mono`)**: Inline code, hex streams, CLI snippets, schema definitions, and `tabular-nums` benchmark values.

## Layout & Elevation

- Primary reading pages (like `/` and `/tooling`) use a centered `max-w-4xl` (`896px`) column so prose, diagrams, and code blocks share a calm vertical rhythm. Data-heavy reference pages (`/benchmarks`, `/spec`, `/how-it-works`, and language guides) use `max-w-6xl` (`1152px`) while capping prose paragraphs at `65ch`.
- Containers rely on crisp `1px` hairline borders and subtle tonal contrast between `#F4F0E6`, `#FAF8F2`, and `#EDE8DC`, with no hard offset drop shadows or noisy chrome.
- Complex diagrams provide dedicated desktop (horizontal) and mobile (vertical) SVG layouts so labels stay legible without shrinking.

## Do's and Don'ts

### Do

- Keep headings sentence-case and appropriately scaled so body prose and code remain the focal point.
- Keep prose paragraphs within `65ch` and vary sentence lengths naturally.
- Use `buf` (`buf.gen.yaml` and `buf generate`) in code generation examples.
- State honest tradeoffs alongside every benchmark or comparison.

### Don't

- Don't add background gridlines, hard offset shadows, fake OS window titlebars, or neon fills to UI chrome.
- Don't set headings or UI controls in shouting all-caps.
- Don't use em-dashes, `"We're still paying for..."` (or variations), kickers/eyebrows above headings, or AI-filler copy.
