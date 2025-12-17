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

### 1) Install

```bash
npm install
```

### 2) Configure AI (recommended)

Create a file named `.env.local` in the project root (`astra-semi-ai-helper/.env.local`) and add:

```bash
OPENAI_API_KEY=your_key_here
# optional (defaults to gpt-4o-mini)
OPENAI_MODEL=gpt-4o-mini
```

If `OPENAI_API_KEY` is not set, the app still works but uses a local (non-AI) fallback summary.

### 3) Run the dev server

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Open http://localhost:3000 and upload a CSV.

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
