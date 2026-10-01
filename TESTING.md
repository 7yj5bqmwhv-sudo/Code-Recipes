# Verification record

Date: 1 October 2026

## Automated checks

- `npm test`: 1,610 assertions passed using React in jsdom.
- `npm run lint`: passed without ESLint warnings/errors.
- `npm run build`: passed. Vite reports a non-blocking bundle-size advisory; this is not a browser console error.
- All 20 remote image URLs returned HTTP 200 and an image MIME type (15 JPEG, 5 WebP). This checks availability, not browser display.
- All 20 recipe cards and all 20 detail pages were rendered and compared with the supplied data.
- Every required diet, caution, health, meal, dish, ingredient, serving, cooking-time, and nutrition field was checked. Zero cooking time displays `N/A`.
- All original recipe values were compared with the starter data and remained unchanged. The only data additions are fixed ingredient-row IDs.
- Both repeated olive-oil ingredient rows in Mushroom and Spinach Ravioli remain present, without duplicate keys.
- Tested title and health-label searches, capitalization, whitespace, hyphen/space handling, no-results state, and Clear.
- Tested both card and button clicks, navigation back, preserved search, heading focus, restored card focus, scrolling to the top, and restored overview scroll.
- Tested initial dark OS preference, Device/Light/Dark cycling, saved preference across remounts, and live OS preference changes in Device mode.
- No React console warnings/errors occurred in the component tests. No invalid paragraph/button nesting was found. All application JSX uses Chakra components.

## What still needs a real browser check

The supervised preview started, but the cloud browser blocked access (`ERR_BLOCKED_BY_CLIENT`). Therefore this run did not independently verify real browser CSS rendering, horizontal overflow at 320px, native keyboard behavior, remote image loading, or the browser console/network panel.

jsdom does not calculate layout. Its unsupported Chakra CSS-layer parser messages are excluded from the DOM harness; React console warnings and errors are not excluded.

Before submitting for grading, open the app in a browser and check:

1. Overview and long-detail layouts at 320, 375, 768, 1024, and 1440 pixels, including at 200% zoom. Confirm no horizontal scroll or clipped text.
2. All 20 images load and remain legible in both themes.
3. Tab to a recipe button; activate it with Enter and Space. Check the Back button and focus restoration.
4. Clear site preferences and verify the initial theme follows the OS. Cycle all three modes and reload.
5. Open all details with the developer console visible. Confirm no warnings, errors, or failed requests.

## Data limitations

Six records have an empty `dietLabels` array; five have an empty `cautions` array. The interface says `Not provided in the source data.` Empty cautions do not establish that a recipe is free from allergens.

Some supplied labels contain unusual text, including a truncated Korean title. The app preserves the assignment data rather than guessing a replacement. Nutrition values are totals for the entire recipe, rounded to whole source units, not per-serving values.
