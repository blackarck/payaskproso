# Payroll by AskProso — Managed Payroll Front Page

An AI-augmented, modern, SaaS-based managed payroll landing page for **Payroll by AskProso** (`pay.askproso.ai`).

Built for organizations looking to completely hand over their payroll journey to AskProso's licensed bureau team and autonomous AI.

---

## Highlights & Features

1. **Brand Identity & Aesthetic:**
   - **Core Heritage:** Traditional AskProso Electric Ruby (`#E20E3C` / `#B50B30`) paired with typography (`Plus Jakarta Sans`, `Inter`, `Fraunces`, `JetBrains Mono`).
   - **Modern Variation:** Enhanced with Electric Indigo (`#6366F1`) representing deterministic engine math and Mint Emerald (`#10B981`) representing zero-defect bank disbursements and compliance.
   - **Light / Dark Modes:** Default is clean, luminous high-contrast light mode with an instant 1-click toggle to a dark obsidian glassmorphism theme (`#090D16`).

2. **The 4-Step Handover Journey:**
   - Step 1: Hand Over Inputs (HRMS/Biometric/Excel).
   - Step 2: Continuous Shadow Runs (Calculations run in background daily).
   - Step 3: One-Click Sign-Off (Maker-Checker approval with Step-Up security).
   - Step 4: Direct Bank Disbursal & Statutory Challan Filing.

3. **Interactive Demos & Tools:**
   - **Live Shadow Run & Health Index Simulator:** Interactive toggle between "Client Executive View" and "Proso Bureau Engine" behind-the-scenes with 98% Health Index.
   - **Interactive Copilot Explainer:** Click sample queries ("Why did Rahul's net pay increase?", "Old vs New tax regime", "Imran's salary hold") to see instant grounded DAG explanations.
   - **Interactive Multi-Country Matrix:**
     - 🇮🇳 **India (Live Now):** 28 States PT, PF/ESI capping, 115BAC regime optimization, quarterly 24Q e-TDS returns, Form 16 Part A/B, and HDFC/ICICI/SBI/Axis/Kotak bank file generation.
     - 🇺🇸 **United States (Coming Soon):** Federal/state withholding, W-2/1099, 401(k), Nacha ACH direct deposit.
     - 🇬🇧 **United Kingdom (Coming Soon):** HMRC RTI FPS/EPS, PAYE & National Insurance, Auto-Enrolment pensions, BACS.
   - **Dynamic ROI & Savings Calculator:** Sliders for team size and current spend calculating monthly HR hours saved, spend comparison, and annual net savings.
   - **Interactive FAQ Accordion** and **Consultation / Migration Booking Modal**.

---

## File Structure

```
paysite/
├── index.html       # Complete, responsive landing page with Tailwind CDN & Lucide icons
├── styles.css       # Theme variables, Aurora mesh gradients, custom range sliders & animations
├── app.js           # Client-side reactivity: theme toggle, ROI calculator, simulator, FAQ, modal
├── package.json     # Vite runner scripts for development and building
├── vite.config.js   # Vite server and build settings
└── README.md        # Documentation
```

---

## How to Run & Preview

### Option 1: Direct Browser (Zero Build)
Simply double click or open `index.html` in any modern web browser. All styles and icons are served via CDN and relative assets.

### Option 2: Using Vite
Inside the `paysite` folder:
```bash
npm install
npm run dev
```
The site will start at `http://localhost:3000`.

### Option 3: Production Build
```bash
npm run build
```
Generates a static deployment package in `paysite/dist/` ready for Vercel, Netlify, Cloudflare Pages, or AWS S3.
