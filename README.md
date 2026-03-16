# MyCineVault 🎬

Your personal movie tracking PWA (Progressive Web App).

## Features

- 📋 **Watchlist** - Track movies you want to watch
- ✅ **Watched List** - Keep a record of movies you've seen
- ⭐ **Star Ratings** - Rate movies 1-5 stars
- 🌐 **Language Tags** - Categorize by language
- 🎬 **Genre Tags** - Categorize by genre
- 🎬 **Director & Cast** - Optional movie details
- 📝 **Notes** - Add personal notes for each movie
- 🔍 **Search & Filter** - Find movies by title, language, genre, or rating
- 📱 **Install as App** - Add to home screen on any device
- 💾 **Offline Support** - Works without internet
- 🌙 **Dark Theme** - Easy on the eyes

## How to Run Locally

1. **Using Python (recommended):**
   ```bash
   cd c:\Work\personal\Rimdb
   python -m http.server 8080
   ```
   Then open http://localhost:8080

2. **Using Node.js:**
   ```bash
   npx serve
   ```
   Then open http://localhost:3000

3. **Using VS Code Live Server:**
   - Install "Live Server" extension
   - Right-click `index.html` → "Open with Live Server"

## How to Install as App

### On Mobile (Android/iOS):
1. Open the app in Chrome/Safari
2. Tap the menu (⋮ or share icon)
3. Select "Add to Home Screen" or "Install App"
4. The app will appear on your home screen!

### On Desktop (Chrome/Edge):
1. Open the app in browser
2. Click the install icon (⊕) in the address bar
3. Click "Install"

## Deploying Online (Free)

### Option 1: GitHub Pages
1. Create a GitHub repository
2. Push all files to the repo
3. Go to Settings → Pages
4. Select "main" branch as source
5. Your app will be live at `https://yourusername.github.io/reponame`

### Option 2: Netlify
1. Go to netlify.com
2. Drag and drop your project folder
3. Done! Free HTTPS hosting

### Option 3: Vercel
1. Go to vercel.com
2. Import from GitHub or upload folder
3. Done! Free hosting with custom domain option

## Tech Stack

- HTML5
- Tailwind CSS (via CDN)
- Vanilla JavaScript
- Service Worker (offline support)
- LocalStorage (data persistence)
- PWA Manifest (installable)

## Data Storage

All your movie data is stored locally in your browser's LocalStorage. 
- Data persists across sessions
- Data is private to your device
- To backup: Export from DevTools → Application → LocalStorage

## Icons

Replace the placeholder icons in `/icons/` folder with actual PNG icons:
- icon-72.png (72x72)
- icon-96.png (96x96)
- icon-128.png (128x128)
- icon-144.png (144x144)
- icon-152.png (152x152)
- icon-192.png (192x192)
- icon-384.png (384x384)
- icon-512.png (512x512)

You can generate these from the SVG icon using tools like:
- https://realfavicongenerator.net
- https://www.pwabuilder.com/imageGenerator
