# AstraSemi AI Helper App  
## Hackathon Project Summary

### Project Overview
This project is a lightweight AI-powered web application designed to help AstraSemi employees quickly understand operational data, workplace documents, and semiconductor-related images. The app targets new and non-technical staff by transforming raw, fragmented information into clear, actionable insights using AI.

The focus is **clarity, speed, and usability**, not deep technical analysis.

---

## Tech Stack
- **Frontend:** Next.js (App Router) + TypeScript + Tailwind CSS  
- **Backend:** Next.js API Routes (Node.js runtime)  
- **AI Integration:** OpenAI API (text + vision models)  
- **Data Parsing:** PapaParse (CSV handling)  
- **Storage:** None (in-memory only, hackathon-safe)

---

## Module 1: Operations Overview Dashboard (Mandatory)

### Problem
Operational data often exists as raw spreadsheets that are difficult for new employees to interpret quickly.

### Solution
An AI-powered dashboard that converts CSV files into clear summaries and insights.

### Features
- Upload a CSV file (e.g., shipment or operations data)
- Preview column names, row count, and sample rows
- Automatic analysis producing:
  - Plain-English summary
  - Important or unusual findings
  - Top 3 key takeaways

### How It Works
1. User uploads CSV
2. Backend parses the file and computes basic statistics:
   - Row count and column names
   - Missing values per column
   - Min/max/mean for numeric fields
3. Only computed stats and a small data sample are sent to the AI
4. AI returns structured JSON used to render results

### Value
- Reduces spreadsheet anxiety for new staff
- Highlights issues without manual analysis
- Encourages data-driven awareness

---

## Module 2: Semiconductor Document Interpreter (Mandatory)

### Problem
Short technical messages and notes are often unclear, especially to new or cross-functional employees.

### Solution
An AI assistant that rewrites semiconductor-related text into simple, understandable language.

### Features
- Paste a text snippet (e.g., internal notes, updates)
- AI generates:
  - Simple summary
  - Key points explained clearly
  - Suggested follow-up actions
  - Clarifying questions (if needed)
- Optional:
  - Manager-friendly update
  - Professional email draft

### Design Principles
- Focus on communication clarity
- No technical diagnosis or defect analysis
- Beginner-friendly language only

### Value
- Improves internal communication
- Saves time rewriting messages
- Reduces misunderstandings across teams

---

## Module 3: Semiconductor Image Identifier (Mandatory)

### Problem
New employees may not recognize semiconductor tools, components, or materials from images.

### Solution
An AI-powered image explanation tool that provides general, non-technical descriptions.

### Features
- Upload an image from a provided sample set
- Image preview before analysis
- AI explains:
  - What the object likely is
  - What it is used for
  - Its role in the semiconductor process
- Includes a mandatory disclaimer:
  > “This explanation is general and not a technical assessment.”

### Constraints
- No defect detection
- No deep technical claims
- Confidence level indicated (low/medium/high)

### Value
- Improves onboarding confidence
- Encourages learning without risk
- Reduces reliance on senior staff for basic questions

---

## Architecture Summary
- Single Next.js application
- Modular pages per feature
- API routes handle all AI interactions
- Strict JSON responses to ensure UI stability
- No persistent storage to keep deployment simple

---

## Key Strengths
- Beginner-focused UX
- Clear separation of concerns
- Safe AI usage with guardrails
- Scalable design for future modules
- Suitable for real workplace adoption

---

## Intended Impact
This app demonstrates how a simple AI assistant can:
- Help employees understand information faster
- Improve clarity in daily communication
- Reduce onboarding friction in semiconductor operations

---

## Notes
- Designed for hackathon constraints
- Production-ready structure, simplified logic
- Easily extensible with additional modules
