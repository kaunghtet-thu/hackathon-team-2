## AstraSemi AI Helper

This is a Next.js app for the hackathon project described in `copilot.md`.

### Module 1 (Operations Overview Dashboard)

- Upload a CSV
- Preview columns, row count, and sample rows
- Get:
    - Plain-English summary
    - Important / unusual findings
    - Top 3 takeaways

The backend computes stats (missing values + numeric min/max/mean) and sends only those stats + a tiny sample to the AI.

## Getting Started

These steps work on Windows, macOS, and Linux. If you’re on Windows, use PowerShell.

### 0) Prereqs

- Node.js 18.17+ or 20+ (recommended). Verify with:

```bash
node -v
```

- Git installed and access to the repository.

### 1) Clone the repo

```bash
git clone https://github.com/kaunghtet-thu/hackathon-team-2.git
cd hackathon-team-2/astra-semi-ai-helper
```

### 2) Install dependencies

```bash
npm install
```

### 3) Configure AI (optional, recommended)

Create a file named `.env.local` in the app folder and add:

```bash
OPENAI_API_KEY=your_key_here
# optional (defaults to gpt-4o-mini)
OPENAI_MODEL=gpt-4o-mini
```

If `OPENAI_API_KEY` is not set, the app still works and returns a safe fallback summary built from local stats.

### 4) Run in dev

```bash
npm run dev
```

Then open http://localhost:3000

Go to /ops and upload a CSV to see the dashboard.

### 5) Build for production (optional)

```bash
npm run build
npm run start
```

This serves the optimized build on http://localhost:3000

### Troubleshooting

- If `npm run dev` fails from the monorepo root, make sure you’re in the app folder:

```bash
cd hackathon-team-2/astra-semi-ai-helper
npm run dev
```

- Large CSVs may render slowly client-side. We can enable table virtualization later if needed.

### API endpoint

The dashboard calls:

- `POST /api/ops/analyze` (multipart/form-data with field `file`)

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
