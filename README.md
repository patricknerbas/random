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
