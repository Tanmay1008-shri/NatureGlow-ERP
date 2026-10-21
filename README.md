# NatureGlow | Circular Skincare & Enterprise ERP Platform

NatureGlow is a scalable circular skincare brand storefront and 8-module Enterprise Resource Planning (ERP) platform. It showcases our flagship **2-in-1 Papaya Leaf, Coconut Coir, & Honey Face Scrub** alongside future R&D formulations, supply chain traceability, dynamic batch manufacturing, and circular sustainability analytics.

---

## Deploying to Vercel

This project is pre-configured with `vercel.json` for zero-configuration deployment on Vercel.

### Option 1: Deploy via GitHub (Recommended)
1. **Export / Push to GitHub:**
   - Download the project ZIP from AI Studio (or use the GitHub export option) and push the repository to your GitHub account.
2. **Import into Vercel:**
   - Go to [vercel.com/new](https://vercel.com/new) and sign in.
   - Select **Import Git Repository** and choose your `natureglow` repository.
3. **Verify Build Settings (Auto-detected via `vercel.json`):**
   - **Framework Preset:** `Vite`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
4. Click **Deploy**. Your live URL (e.g., `https://natureglow.vercel.app`) will be ready in ~45 seconds.

### Option 2: Deploy via Vercel CLI
1. Install the Vercel CLI globally on your machine:
   ```bash
   npm install -g vercel
   ```
2. Inside the project root directory, run:
   ```bash
   vercel
   ```
3. To deploy directly to production:
   ```bash
   vercel --prod
   ```

---

## Local Development & Testing

```bash
# Install dependencies
npm install

# Start development server at http://localhost:3000
npm run dev

# Run unit tests for business & ERP logic
npx tsx --test src/utils/businessLogic.test.ts

# Build for production
npm run build
```
