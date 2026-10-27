# Brokie

**Level up out of broke.** Landing page prototype for Brokie, an app that shows students (18–25) where their money really goes and turns better spending habits into a game: streaks, XP, levels and weekly challenges, plus funny notifications from Brokie the coin.

Student project for the FinTech Ecosystem and Management course. Front-end only, no backend or bank API; all data is mock data.

## Run locally

```bash
npm install
npm run dev
```

The site runs at http://localhost:8080.

## Where things live

- `src/index.css` / `tailwind.config.ts`: theme (purple / yellow colour tokens, glass and chunky-button classes, animations)
- `src/config/site.ts`: brand copy, hero stats, footer note
- `src/data/transactions.ts`: one mock month for a student in Vilnius
- `src/data/equivalents.ts`: approximate price list for the "that's 10 kg of bananas" jokes
- `src/data/notifications.ts`: Brokie's notifications in Gentle and Savage mode
- `src/components/brand/BrokieMascot.tsx`: the mascot, inline SVG with moods
- `src/components/product/PhoneMockup.tsx`: the app mockup in the hero
- `src/components/*Section.tsx`: page sections, in order in `src/pages/Index.tsx`

## Hosting

`Dockerfile` + `nginx.conf` (update `server_name`).
