# Second Look (used-car check) and Quizloop

## Second Look: `car/`

A mobile-first web app for checking a used car before buying it.

1. **The car:** make, model, year, mileage, asking price and what similar cars are listed for.
2. **Guided walkaround:** 13 photo tiles (7 required) with where-to-stand tips. Photos are shrunk in the browser before upload.
3. **12 quick questions** from the paperwork and the test drive (yes / no / not sure).
4. **Report:** a verdict (Looks good / Negotiate / Walk away) with a condition score, the issues found (checklist, price, photos), an odometer-vs-listing check, questions for the seller, things for a mechanic, a suggested opening offer, and annotated photos. Save as PDF or share. Past checks are kept on the phone.

### AI photo inspection: `api/analyze.ts`

A Vercel Function that sends the labelled photos to Claude (`claude-opus-5-5`, structured JSON output, server-side refusal fallback) and returns per-photo findings, the odometer reading, warning lights, seller questions and mechanic checks.

- Deploy the repo on Vercel and set `ANTHROPIC_API_KEY` in the project's environment variables.
- On a host without the function (GitHub Pages), the app still works and builds the report from the checklist and price only, saying so in the report.
- Before running ads to it: add payments (each check costs an API call) and rate limiting on `/api/analyze`.

`npm install && npm run typecheck` checks the function.

---

# Quizloop

Quiz funnels built for Meta advertisers. Send ad traffic to a 60-second quiz, give each visitor a personal result with its own offer, capture the email, and report every step to the Meta Pixel.

## What's here

| File | What it is |
|---|---|
| `index.html` | Landing page for ads: live demo quiz, features, pricing, waitlist |
| `app.html` | The builder: templates, editor, live phone preview, Meta event log, publish |
| `f.html` | The live funnel visitors take. The funnel is stored (compressed) in the link's `#` part |
| `assets/quiz.js` | Shared engine: data model, templates, link encoding, quiz player, Pixel and webhook tracking |

## Tracking

| Funnel step | Meta event |
|---|---|
| Quiz finished | `CompleteRegistration` |
| Email captured | `Lead` |
| Offer button clicked | `InitiateCheckout` |
| Every step | `Quiz_*` custom events |

Leads and finished quizzes are POSTed as JSON (email, result, answers, UTM tags) to the funnel's webhook URL.

## Prototype limits

- Funnels are saved in the builder's browser (no accounts yet).
- Waitlist emails are stored locally until `WAITLIST_URL` in `index.html` points at a form endpoint.
- Next: accounts + database, Stripe subscriptions, Conversions API, analytics, AI quiz writer.

The previous Pocket Arcade games are kept on the `games-archive` branch.
