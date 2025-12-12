# OGTool Frontend

React + TypeScript frontend for the Organic Growth Tool - manage Reddit campaigns and content calendars.

## Features

- Campaign creation and management
- Interactive calendar workspace
- Promotion strategy configuration
- Persona management
- Real-time dashboard metrics
- Content history viewer

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **Icons**: Lucide React
- **HTTP Client**: Axios

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment (Optional)

Create a `.env` file if you need to customize the API URL:

```env
VITE_API_URL=http://localhost:8000
```

### 3. Run Development Server

```bash
npm run dev
```

The app will be available at http://localhost:5173

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
frontend/
├── src/
│   ├── components/       # Reusable components
│   │   ├── ui/          # UI components (Tabs, etc.)
│   │   ├── Layout.tsx   # Main layout
│   │   ├── MetricCard.tsx
│   │   └── CalendarWorkspace.tsx
│   ├── pages/           # Page components
│   │   ├── Dashboard.tsx
│   │   ├── Campaigns.tsx
│   │   ├── NewCampaign.tsx
│   │   ├── CampaignDetails.tsx
│   │   ├── Goals.tsx
│   │   └── Settings.tsx
│   ├── lib/
│   │   └── api.ts       # API client
│   ├── App.tsx
│   └── main.tsx
├── public/
├── index.html
└── package.json
```

## Key Features

### Campaign Management
- Create campaigns with company info and targeting
- Configure promotion strategies (Balanced, Aggressive, Subtle)
- Manage personas with backstories and tone styles

### Calendar Workspace
- Visual calendar view of scheduled posts
- View post and comment details
- Track scheduling across weeks

### Dashboard
- Real-time metrics (campaigns, posts, comments, personas)
- Upcoming activity feed
- System health monitoring

### Settings
- Manage master keywords library
- Manage master subreddits library
- Manage master personas library

## Git Setup

To initialize this as a separate Git repository:

```bash
cd frontend
git init
git add .
git commit -m "Initial commit: OGTool frontend"
git branch -M main
git remote add origin <your-frontend-repo-url>
git push -u origin main
```

## Deployment

Build the production bundle:

```bash
npm run build
```

The `dist/` directory will contain the optimized production build.

### Deploy to Vercel/Netlify

1. Connect your Git repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variable: `VITE_API_URL=<your-backend-url>`

## API Integration

The frontend connects to the backend API. Ensure the backend is running at:
- Development: http://localhost:8000
- Production: Configure via `VITE_API_URL` environment variable

## Health Check

The app includes a startup health check that:
- Polls `/api/health` endpoint
- Shows loading screen while waiting for backend
- Displays error with instructions if backend unavailable
- Auto-retries up to 30 times
