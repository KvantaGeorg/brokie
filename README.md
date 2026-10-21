# Website template

Marketing site template (React + Vite + Tailwind + shadcn/ui + framer-motion), based on an existing landing page with all brand-specific content removed.

## Run locally

```bash
npm install
npm run dev
```

The site runs at http://localhost:8080.

## Rebrand checklist

1. **`src/config/site.ts`**: name, domain, hero text, sign-up / demo links, email, LinkedIn, credit badges.
2. **`index.html`**: page title, description, social preview tags.
3. **Logo**: `src/components/brand/Brand.tsx` renders a text wordmark; swap in an image when you have one. Favicon is `public/favicon.svg`.
4. **Colours and font**: `src/index.css` (CSS variables) and `tailwind.config.ts`.
5. **Section copy**: `src/components/*Section.tsx`, especially `StatementSection`, `HowItWorksSection`, `ProposalsSection`, `BenefitsSection`, `FAQSection`, `SuppliersLine`.
6. **Product mockups**: `src/components/product/*` and `src/components/fx/TabChaos.tsx` contain example data (hotels, suppliers, prices). Example photos load from Unsplash.
7. **Sign-up form**: `src/components/WaitlistSection.tsx` has a `TODO` where the email should be sent to your backend.
8. **Legal pages**: `src/pages/PrivacyPolicy.tsx` and `TermsOfService.tsx` are placeholders.
9. **Hosting**: `Dockerfile` + `nginx.conf` (update `server_name`).

## Pages

`/`, `/problem`, `/how-it-works`, `/proposals`, `/benefits`, `/faq`, `/privacy-policy`, `/terms-of-service`.
