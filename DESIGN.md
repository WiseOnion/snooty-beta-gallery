
# DESIGN.md: Snooty design language (mirrors the real app's tokens.css)

Single source: `shared/snooty.css`. No page defines its own tokens.

## Color
- Cream surfaces: `--color-bg #fcfaf9`, `--color-bg-alt #FBF6F1`
- Dark surfaces: `--color-bg-dark #181818`, raised `#232323` (deck theater blacks may run warmer, tinted toward the brand hue, never pure `#000`)
- Primary burgundy: `#5E2330` (deep `#4A1B26`)
- Accent gold: `#C99A4A` (soft wash `rgba(201,154,74,0.14)`). Gold is scarce: money, the founding moment, live states.
- Text: `#181818` on cream, `#F6F1E8` on dark; muted `#8A7E72` / `#D8CFC2`
- Border: `#E3D9CC` on cream, `#332C29` on dark
- Success `#1F7A4D`, error `#C8281F`

## Typography
- Display: Jost (500 to 700), tracked-out uppercase for kickers and labels
- Editorial voice: Cormorant Garamond italic (pull-quotes, emotional lines)
- Body: Inter
- Wordmark: Jost 400, uppercase, letter-spacing ~0.28em

## Shape and depth
- Radii 4/8/16/full; pills for buttons and chips
- Shadows soft and warm (`rgba(24,24,24,...)`), three steps
- Photography loads blur-up (`.ph` pattern); warm placeholder gradient

## Motion
- Two curves only: `--ease-out cubic-bezier(0.22,1,0.36,1)` for nearly everything; `--ease-brand` (slight overshoot) reserved for small delight moments (heart pop, toasts)
- Stagger entrances 40ms apart (`.stagger`)
- Reveals a room must read: 600ms or less; micro-interactions 160 to 520ms
- Nothing bounces on the deck; deck reveals ride `--ease-out` exclusively
- `prefers-reduced-motion` collapses all animation

## Deck-specific registers
- Dark slides: theater (openers, money dissection, pauses, close)
- Cream slides: product daylight (anything captioning the live app)
- Kickers: Jost 600, 0.16em tracking, uppercase, gold
- Headlines: Jost 600, clamp ~30 to 64px; editorial lines: Cormorant italic clamp ~28 to 58px
