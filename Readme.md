# LeetCode Buddy

A Chrome extension that lets you compare LeetCode profiles side-by-side with detailed statistics, difficulty breakdowns, and visual charts.

## Features

- **Profile Comparison**: Compare two LeetCode users side-by-side
- **Detailed Statistics**: View total problems solved, difficulty breakdown (Easy/Medium/Hard), rankings, and acceptance rates
- **Visual Charts**: Interactive line charts showing difficulty-based comparison
- **Side Panel UI**: Clean, dark-themed interface that opens in Chrome's side panel
- **Google OAuth**: Optional authentication with Google (or skip for guest access)
- **Real-time Data**: Fetches live data from LeetCode profiles

## Tech Stack

### Frontend (Extension)

- **Framework**: WXT
- **UI Library**: React 19 + TypeScript
- **Styling**: Tailwind CSS v4
- **Components**: shadcn/ui
- **Charts**: EvilCharts
- **Build Tool**: Vite

### Backend (API)

- **Runtime**: Node.js + Express
- **Language**: TypeScript
- **Authentication**: Passport.js (Google OAuth 2.0), JWT
- **Session Management**: express-session
- **Deployment**: Vercel (Serverless)

## Project Structure

```
leetcode-buddy/
├── extension/          # Chrome extension (frontend)
│   ├── src/
│   │   ├── entrypoints/
│   │   │   ├── background.ts      # Service worker
│   │   │   ├── content.ts         # Content script
│   │   │   └── sidepanel/         # Side panel UI
│   │   │       └── pages/
│   │   │           ├── Login.tsx  # Authentication page
│   │   │           ├── ProfileInput.tsx  # Username input
│   │   │           └── Chart.tsx  # Comparison view
│   │   ├── services/
│   │   │   └── api.ts             # API client
│   │   └── components/            # Reusable UI components
│   └── wxt.config.ts              # Extension configuration
│
└── backend/           # Express API server
    ├── auth/                      # Passport configuration
    ├── config/                    # Environment config
    ├── controllers/               # Request handlers
    ├── middlewares/               # Auth middleware
    ├── routes/                    # API routes
    ├── utils/                     # JWT utilities
    ├── scrapper.ts                # LeetCode data fetcher
    └── server.ts                  # Main server file
```

## Setup & Installation

### Prerequisites

- Node.js 18+ and pnpm
- Chrome browser
- Google Cloud Console account (for OAuth)

### Backend Setup

1. Navigate to backend directory:

```bash
cd backend
npm install
```

2. Start development server:

```bash
pnpm run dev
```

Backend will run on `http://localhost:3001`

### Extension Setup

1. Navigate to extension directory:

```bash
cd extension
pnpm install
```

3. Start development server:

```bash
pnpm run dev
```

Extension dev server will run on `http://localhost:3000`

### Load Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **Developer mode** (toggle in top right)
3. Click **Load unpacked**
4. Select the folder: `extension/dist/chrome-mv3-dev`
5. The extension icon should appear in your toolbar

## Usage 📖

1. Click the **LeetCode Buddy** extension icon in Chrome
2. Side panel opens on the right
3. Click **Continue without login** (or login with Google)
4. Enter two LeetCode usernames (e.g., `tourist` and `jiangly`)
5. Click **Compare**
6. View detailed comparison with:
   - Total problems solved
   - Easy/Medium/Hard breakdown
   - Global rankings
   - Acceptance rates
   - Interactive difficulty comparison chart

## Development Commands

### Extension

```bash
pnpm run dev          # Start dev server with hot reload
pnpm run build        # Build production extension
```

### Backend

```bash
pnpm install
pnpm run dev           # Start dev server with tsx watch
```

## Features in Detail

### Authentication

- Google OAuth 2.0 login
- Guest mode (skip login)
- JWT-based session management
- Secure token storage in Chrome storage

### Profile Comparison

- Real-time validation of usernames
- Fetches live data from LeetCode
- Side-by-side stats display
- Color-coded difficulty indicators

### Chart Visualization

- Interactive line chart
- Difficulty comparison (Easy/Medium/Hard/Total)
- Responsive design
- GitHub-inspired dark theme

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Acknowledgments

- Built with [WXT](https://wxt.dev/) - Modern Chrome Extension Framework
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)

---

Made for the competitive programming community
