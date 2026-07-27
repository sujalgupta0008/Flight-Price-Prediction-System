# PRD — Flight Price Predictor UI Upgrade (AeroPredict)

## Original Problem Statement
User has a working Flask website for flight price prediction (ML pipeline in ../Models/flight_price_pipeline.pkl). Everything works; user only wanted the UI upgraded to a "next level modern 3D website" look.

## User Choices
- Style: Dark futuristic — glassmorphism, glowing accents, animated 3D plane/globe background
- Keep same Flask structure (index.html + style.css + script.js) so files can be copied directly
- Dummy prediction OK for preview (real .pkl stays in user's project)

## Architecture
- Flask app at /app/flight_app/ (app.py, templates/index.html, static/style.css, static/script.js)
- Served on port 3000 via supervisor program `flask_ui` (React frontend stopped intentionally)
- 3D globe: Globe.gl CDN (earth-dark texture, animated flight arcs between Indian cities, auto-rotate, cyan atmosphere)
- Fonts: Outfit (headings), Manrope (body), JetBrains Mono (data/price)
- app.py tries joblib.load of the real pipeline; falls back to demo_predict heuristic (PREVIEW ONLY — user's original predict logic preserved exactly)
- Fixed user's Jinja bugs: `{ url_for(...) }` → `{{ url_for(...) }}`, `{ prediction_text }` → `{{ prediction_text }}`

## What's Implemented (June 2026)
- Asymmetric split layout: hero (badge, gradient headline, stats) left, crystal glass form panel right
- Bento-grid form with dark-native inputs, neon cyan focus glow, custom select chevrons
- Gradient Predict button with hover glow + loading spinner state
- Glowing prediction result box with scan animation, JetBrains Mono price
- Staggered entrance reveals, responsive (stacks at 1080px, single-column form at 560px)
- data-testid on all interactive/result elements

## Testing
- iteration_1.json: backend 100% (5/5 pytest), frontend 100% — no issues
- Regression suite: /app/backend/tests/test_flight_predict.py

## Backlog / Next
- P1: Preserve form values after prediction (re-fill from form_data)
- P2: Server-side validation (source != destination, no past dates)
- P2: Prediction history / price trend chart
