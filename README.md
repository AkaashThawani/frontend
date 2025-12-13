# OGTool Frontend

React + TypeScript frontend for the Organic Growth Tool - manage Reddit campaigns and content calendars.

## Features

- 🚀 Campaign creation and management
- 📅 Interactive calendar workspace
- 🎯 Promotion strategy configuration
- 👥 Persona management
- 📊 Real-time dashboard metrics
- 📝 Content history viewer
- 🔄 Automatic post generation with smart polling
- 🌐 Vercel deployment support

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **Icons**: Lucide React
- **HTTP Client**: Axios

## Quick Start Guide

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create a `.env` file with your API URL:

```env
VITE_API_URL=http://your-backend-url
```

For local development:
```env
VITE_API_URL=http://localhost:8000
```

### 3. Run Development Server

```bash
npm run dev
```

The app will be available at http://localhost:5173

### 4. Set Up Master Data (First-Time Setup)

Before creating campaigns, you need to set up your master data:

1. Navigate to **Settings** page
2. Add **Keywords** - Search queries your target audience uses (e.g., "How do I create presentations faster?")
3. Add **Subreddits** - Communities where your audience hangs out (e.g., "r/productivity")
4. Add **Personas** - Reddit user personas with backstories and tone styles

### 5. Create Your First Campaign

See the [How to Generate a New Campaign](#how-to-generate-a-new-campaign) section below.

---

## How to Generate a New Campaign

### Prerequisites

Before creating a campaign, ensure you have:
- ✅ At least 1 keyword added in Settings
- ✅ At least 1 subreddit added in Settings
- ✅ At least 2 personas added in Settings

### Step-by-Step Campaign Creation

#### Step 1: Navigate to New Campaign

1. Go to the **Campaigns** page
2. Click the **"+ New Campaign"** button

#### Step 2: Company Information

Fill in your company details:
- **Company Name** (required) - Your company's name
- **Company Website** (optional) - Your website URL
- **Company Description** (required) - Detailed description of what your company does and who it serves

💡 *Tip: A detailed company description helps generate more relevant and contextual content.*

#### Step 3: Campaign Basics

Configure your campaign settings:
- **Campaign Name** (required) - Give your campaign a descriptive name (e.g., "Q4 Product Launch")
- **Campaign Type** - Choose from:
  - Brand Awareness
  - Product Launch
  - Lead Generation
  - Community Building
- **Start Date** (required) - When the campaign should begin
- **End Date** (optional) - When the campaign should end

#### Step 4: Targeting & Strategy

Configure targeting and promotion settings:

**Target Search Queries**
- Search and select keywords from your master list
- These are the questions/phrases people search for on Reddit

**Target Subreddits**
- Search and select subreddits from your master list
- These are the communities where posts will be created

**Promotion Strategy**
- **Max Posts Per Week** (1-15) - Maximum number of posts to create weekly
- **Max Comments Per Post** (0-20) - Maximum comments per post
- **Company Mention Rate** (0-100%) - Percentage of comments that mention your company
- **Mention Company In** - Choose where to mention your company:
  - Posts
  - Comments (recommended)
  - Both

**Quick Presets** (optional):
- 🌱 **Conservative**: 5 posts/week, 4 comments/post, 20% mention rate
- ⚖️ **Moderate**: 8 posts/week, 8 comments/post, 40% mention rate
- 📊 **Standard**: 12 posts/week, 12 comments/post, 60% mention rate
- 📢 **Aggressive**: 15 posts/week, 15 comments/post, 80% mention rate

#### Step 5: Select Personas

- Choose at least **2 personas** from your master list
- Click on personas to select/deselect them
- Expand to view full backstories

#### Step 6: Launch Campaign

1. Review your settings
2. Click **"Launch Campaign"**
3. The system will:
   - Create the campaign
   - Automatically generate the first week of content
   - Poll every 5 seconds (up to 2 minutes) until posts are generated
   - Navigate to the campaign calendar when ready

### What Happens After Launch?

**Automatic Content Generation:**
- Posts and comments are generated based on your strategy
- Content is scheduled across the campaign period
- The system uses your personas to create authentic-sounding content

**Viewing Your Campaign:**
- You'll be redirected to the **Campaign Details** page
- View the **Schedule** tab to see the calendar of scheduled posts
- View the **Configuration** tab to review campaign settings
- View the **Personas** tab to see selected personas
- View the **History** tab to see all generated content

**Managing Your Campaign:**
- Click **"Generate Next Week"** to create additional content
- Click **"Refresh"** to reload campaign data if needed
- View post titles, bodies, and scheduled times
- See associated comments for each post

---

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
│   │   ├── Layout.tsx   # Main layout with navigation
│   │   ├── MetricCard.tsx
│   │   ├── LoadingOverlay.tsx
│   │   └── CalendarWorkspace.tsx
│   ├── pages/           # Page components
│   │   ├── Dashboard.tsx      # Metrics & upcoming activity
│   │   ├── Campaigns.tsx      # Campaign list
│   │   ├── NewCampaign.tsx    # 4-step campaign wizard
│   │   ├── CampaignDetails.tsx # Campaign management
│   │   ├── Goals.tsx          # Goals tracking
│   │   └── Settings.tsx       # Master data management
│   ├── lib/
│   │   └── api.ts       # Axios API client
│   ├── App.tsx          # Main app with routing
│   └── main.tsx
├── public/
├── .env                 # Environment configuration
├── vercel.json         # Vercel deployment config
├── index.html
└── package.json
```

## Key Features Deep Dive

### 📊 Dashboard
- **Real-time Metrics**: Active campaigns, total personas, posts, and comments
- **Upcoming Activity**: Next 5 scheduled posts across all campaigns
- **Quick Navigation**: Jump to campaign details

### 🎯 Campaign Management
- **4-Step Wizard**: Intuitive campaign creation process
- **Strategy Presets**: Quick configurations for different growth strategies
- **Smart Polling**: Waits for content generation before navigation (5-second intervals, 2-minute max)
- **Flexible Scheduling**: Configure posting frequency and comment density

### 📅 Calendar Workspace
- **Visual Schedule**: See all posts organized by week
- **Post Details**: View titles, bodies, subreddits, and status
- **Comment Preview**: Expand posts to see associated comments
- **Status Tracking**: Monitor scheduled vs. posted content

### 👥 Persona System
- **Backstory Management**: Rich persona descriptions for authentic content
- **Tone Styles**: Configure communication styles (Professional, Casual, etc.)
- **Multi-Persona Support**: Use multiple personas per campaign for variety

### ⚙️ Settings & Master Data
- **Keywords Library**: Centralized keyword management
- **Subreddits Library**: Curated list of target communities
- **Personas Library**: Reusable persona collection
- **Easy CRUD Operations**: Add, edit, activate/deactivate items

## Troubleshooting

### Posts Not Appearing After Campaign Creation

**Issue**: Navigated to campaign but no posts visible

**Solutions**:
1. Click the **"Refresh"** button (replaced "Pause Campaign")
2. Wait a moment - generation can take 1-2 minutes
3. Check browser console for errors
4. Verify backend is running and accessible

### Backend Connection Issues

**Issue**: "Backend service unavailable" error

**Solutions**:
1. Verify backend is running at the configured `VITE_API_URL`
2. Check `.env` file has correct backend URL
3. Ensure no firewall blocking the connection
4. For production, verify environment variables are set in deployment platform

### Campaign Creation Fails

**Issue**: Error when clicking "Launch Campaign"

**Solutions**:
1. Ensure all required fields are filled (marked with *)
2. Verify you have at least 2 personas selected
3. Check that you have at least 1 keyword and 1 subreddit selected
4. Review browser console for specific error messages

### Vercel 404 on Page Refresh

**Issue**: Get 404 error when refreshing on any route

**Solution**: Ensure `vercel.json` exists with proper rewrites configuration (should already be included in the project).

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

### Build Production Bundle

```bash
npm run build
```

The `dist/` directory will contain the optimized production build.

### Deploy to Vercel

1. Push your code to GitHub
2. Connect repository to Vercel
3. Configure build settings:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
4. Add environment variable:
   - **Name**: `VITE_API_URL`
   - **Value**: Your backend URL (e.g., `https://your-backend.com`)
5. Deploy

### Deploy to Netlify

1. Push your code to GitHub
2. Connect repository to Netlify
3. Configure build settings:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
4. Add environment variable:
   - **Key**: `VITE_API_URL`
   - **Value**: Your backend URL
5. Deploy

The `vercel.json` configuration ensures proper client-side routing on Vercel.

## API Integration

The frontend connects to the backend API using environment variables:

- **Development**: Set `VITE_API_URL=http://localhost:8000` in `.env`
- **Production**: Configure via deployment platform's environment variables

### Key API Endpoints Used

- `GET /api/campaigns` - List campaigns
- `POST /api/campaigns` - Create campaign
- `GET /api/campaigns/:id` - Get campaign details
- `POST /api/campaigns/:id/generate` - Generate posts
- `GET /api/metrics` - Dashboard metrics
- `GET /api/master/keywords` - Get keywords
- `GET /api/master/subreddits` - Get subreddits
- `GET /api/master/personas` - Get personas

## Advanced Features

### Smart Content Generation

The app includes intelligent polling that:
- Monitors post generation progress
- Checks every 5 seconds for up to 2 minutes
- Displays loading overlay with progress message
- Automatically navigates when content is ready
- Handles timeout gracefully if generation takes longer

### Refresh Functionality

- Use the **"Refresh"** button on campaign details page to reload data
- Helpful if content generation completes after timeout
- Updates campaign data including posts and comments

### Calendar Features

- Week-by-week view of scheduled content
- Color-coded post status (Scheduled, Posted)
- Expandable post cards showing full details
- Comment threading under posts

## Health Check System

The app includes a startup health check that:
- Polls `/api/health` endpoint on load
- Shows loading screen while waiting for backend
- Displays error with instructions if backend unavailable
- Auto-retries up to 30 times (every 2 seconds)
- Ensures backend is ready before allowing user interaction

## Contributing

When contributing:
1. Follow the existing code structure
2. Use TypeScript for type safety
3. Follow ESLint rules
4. Test thoroughly before committing
5. Update documentation for new features

## License

[Your License Here]

## Support

For issues or questions:
- Check the troubleshooting section above
- Review backend logs for API errors
- Check browser console for frontend errors
- Report bugs with detailed reproduction steps
