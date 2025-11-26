# Changelog

## [2.5.0] - 2025-11-26

### Visual Overhaul - Compact & Polished

#### Size Reductions (Global)
- Reduced all section padding from `py-16` to `py-10`
- Reduced card padding from `p-8` to `p-5`
- Reduced nav height from `h-20` to `h-14`
- Reduced button padding and font sizes
- Reduced heading sizes throughout (e.g., `text-6xl` → `text-4xl`)
- Reduced protocol photo height from `400px` to `280px`
- Reduced testimonial portrait height from `h-80` to `h-56`
- Reduced gaps from `gap-8` to `gap-5`
- Reduced footer padding from `py-8` to `py-6`

#### Hero Section Cleanup
- Moved subheadline, CTAs, and trust indicators to new "Value Proposition" section
- Hero now displays only the headline "Your Legacy Deserves a Guardian"
- Cleaner, more impactful first impression

#### New Value Proposition Section
- Added gold fractal texture pattern background
- Contains CTAs and trust indicators moved from hero
- Positioned after the 500-Hour Problem section

#### Protocol Section (From Grief to Greatness)
- Updated all 4 images to African American professionals in action poses
- Using Unsplash `crop=faces` API for proper face framing
- Step 1 INTAKE: Woman at laptop reviewing documents
- Step 2 VERIFY: Businessman in professional setting
- Step 3 NOTIFY: Woman professional
- Step 4 DISTRIBUTE: Family together

#### Testimonials Section (From Grief to Gratitude)
- All 3 portraits now African American headshots
- David M: Professional man portrait
- Angela W: Professional woman portrait (centered)
- Marcus T: Professional man portrait
- Consistent portrait-style framing across all cards

#### Final CTA Section
- Replaced mountain imagery with people imagery
- Now shows grandparent with grandchild moment
- Content properly centered vertically

#### Technical Fixes
- Added `object-position` to all images for proper face centering
- Protocol photos use flex centering with proper constraints
- Removed inline style conflicts
