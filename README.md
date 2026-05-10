# COINRA — Deploy to Vercel

## One-click deploy

1. Go to vercel.com and sign in
2. Click "Add New Project"
3. Click "Import" and upload this folder (or push to GitHub first)
4. Vercel auto-detects the settings from vercel.json
5. Click Deploy

## Manual settings if needed
- Build command: `npx vite build`
- Output directory: `dist`
- Install command: `npm install --legacy-peer-deps`

## Local development
```
npm install --legacy-peer-deps
npx vite
```
Open http://localhost:5173
