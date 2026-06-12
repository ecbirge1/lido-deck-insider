# Lido Deck Insider — Launch Handoff

## Completed

- High-quality homepage with cruise/ocean visual system
- Searchable full Carnival fleet directory
- Side-by-side ship comparison tool
- Full guides for Mardi Gras, Carnival Celebration, Carnival Jubilee, Carnival Vista, Carnival Horizon, and Carnival Breeze
- Personalized Ship Matcher
- Cabin Risk Checker
- Cruise Cost Calculator
- Complete cabin-selection guide
- Complete embarkation-day planning system
- Complete port-day risk and timing system
- Printable Calm Embarkation Checklist
- Complete eight-page Cruise Planning Toolkit PDF
- Toolkit sales page with one full worksheet preview
- Mobile-responsive layouts
- Sitemap, robots rules, privacy policy, disclosure, About page, and independent-site disclaimers
- Protected download and compatibility routes
- Obsolete ship-library route redirected to the fleet directory
- Static-site validator retained as a manual GitHub Action

## External account connections still required

### 1. Stripe checkout

Create a $19 one-time Stripe product and Payment Link for the Complete Cruise Planning Toolkit. Replace the placeholder checkout target on `products/cruise-planning-toolkit.html` with the live Stripe Payment Link.

### 2. Private PDF delivery

The paid PDF must remain outside the public GitHub Pages repository. Connect the successful Stripe payment to a private file-delivery method before enabling checkout.

### 3. Email delivery

Connect a newsletter/email provider before transmitting or storing subscriber addresses remotely. Until then, the checklist form opens the printable checklist immediately and stores the entered address only in the visitor's browser.

## Current pre-launch behavior

- All planning tools work entirely in the browser.
- The free checklist opens immediately after form submission.
- The paid product page clearly states that Stripe checkout is pending.
- No live payment is accepted.
- No subscriber address is transmitted to Lido Deck Insider.

## Commercial assets

- Product: **Complete Cruise Planning Toolkit**
- Price: **$19 one-time**
- Format: **Eight-page printable PDF**
- License: **Personal reuse across future cruises**
- Lead magnet: **The Calm Embarkation Checklist**
