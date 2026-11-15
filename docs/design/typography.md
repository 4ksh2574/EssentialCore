# Essential Typography System

The Essential ecosystem uses a shared four-role typography system. Product teams should use the semantic roles rather than choosing arbitrary font families per screen.

## Font roles

| Role | Typeface | Use |
| --- | --- | --- |
| Display | Zen Dots Regular | Product wordmarks, page titles, major section headings and short, high-impact labels |
| Interface | DM Sans | Body copy, navigation, buttons, forms, settings and dense UI |
| Editorial | Playfair Display Variable | Occasional feature statements, editorial callouts and expressive secondary headings |
| Mono | System monospace stack | Clocks, dates, IDs, measurements, counters and aligned numeric data |

Playfair Display Variable is the selected primary Playfair asset. Its weight axis should be used instead of shipping separate static regular and black files. Use italic styles sparingly for emphasis.

## Usage rules

- Display typography is an accent, not the default for paragraphs or controls. Keep headings short and provide enough room for Zen Dots' distinctive shapes.
- Interface text remains DM Sans for legibility and compact layouts.
- Editorial Playfair should be used selectively; do not mix it into every heading.
- Numeric and technical values should use the mono role with tabular numerals where alignment matters.
- Respect the type scale and responsive sizing of each product. Avoid all-caps body copy and excessive tracking.
- Provide a system fallback so the interface remains usable if Google Fonts cannot load. For offline-first native apps, package licensed font assets locally rather than depending on a network font request.

## Font licensing and provenance

Zen Dots and Playfair Display are distributed under the SIL Open Font License 1.1. Their upstream project and license information must accompany any redistributed font binaries. This web implementation loads them from Google Fonts.

NType 82 was reviewed but deliberately excluded. Its embedded license text restricts use to Nothing-related brand materials and prohibits other uses and redistribution. It must not be included in Essential products without explicit written permission from the rights holder.

## Future work

Essential Sans and Essential Mono are planned original AX typefaces. Until those are designed, DM Sans and the system monospace stack are the approved interface and mono fallbacks. Do not present the temporary fallback fonts as original Essential-designed fonts.
