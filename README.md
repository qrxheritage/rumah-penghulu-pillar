# Rumah Penghulu Abu Seman - Pillars Educational Website

An interactive educational website about the traditional Malay architecture of Rumah Penghulu Abu Seman, featuring 3D models, videos, quizzes, and analytics tracking.

## Features

- 📱 Responsive design with multi-language support (English, Malay, Chinese)
- 🎨 Interactive 3D model viewer
- 🎬 3D construction animation video
- 📝 Interactive knowledge quiz (4 questions)
- 📊 Visitor engagement analytics with completion tracking
- 💬 Feedback collection via Google Forms

## Setup Instructions

### 1. Set Up JSONBin.io (Free Analytics Storage)

1. Go to [JSONBin.io](https://jsonbin.io) and create a free account
2. After logging in, go to **API Keys** and copy your **X-Master-Key**
3. Create a new bin by clicking **Create a Bin** with this initial data:

```json
{
  "clicks_total": 0,
  "clicks_3d_model": 0,
  "clicks_feedback": 0,
  "clicks_quiz": 0,
  "clicks_quiz_start": 0,
  "clicks_quiz_complete": 0,
  "last_updated": ""
}
```

4. Copy the **Bin ID** from the URL (e.g., `https://jsonbin.io/bin/6761abc...` → the ID is `6761abc...`)

### 2. Configure Environment Variables

Add these environment variables to your Vercel project:

| Variable | Value |
|----------|-------|
| `JSONBIN_BIN_ID` | Your Bin ID from step 3 |
| `JSONBIN_API_KEY` | Your X-Master-Key from step 2 |

**In Vercel Dashboard:**
1. Go to your project → **Settings** → **Environment Variables**
2. Add both variables above
3. Redeploy your project

### 3. Local Development

To run locally with Python:

```bash
python -m http.server 8000
```

Then open http://localhost:8000 in your browser.

To test with Vercel serverless functions locally:

```bash
vercel dev
```

(Note: Set environment variables in `.env.local` file for local development)

### 4. Deploy to Vercel

```bash
vercel --prod
```

Or connect your GitHub repository to Vercel for automatic deployments.

## Analytics Dashboard

Access the analytics dashboard at `/dashboard.html` to view:

| Metric | Description |
|--------|-------------|
| **Total Clicks** | Total clicks on all interactive elements |
| **3D Model Views** | Number of times visitors opened the 3D model |
| **Feedback Submissions** | Number of clicks on feedback button |
| **Quiz Button Clicks** | Visitors who clicked "Take Quiz" on main page |
| **Quiz Started** | Visitors who started answering questions |
| **Quiz Completed** | Visitors who finished the quiz |
| **Completion Rate** | (Quiz Completed ÷ Quiz Button Clicks) × 100% |
| **Engagement Rate** | (Quiz Started ÷ Quiz Button Clicks) × 100% |

## Project Structure

```
rumah-penghulu-pillar/
├── index.html              # Main website with 3D model and content
├── quiz.html               # Interactive knowledge quiz
├── dashboard.html          # Analytics dashboard
├── styles.css              # Main stylesheet
├── public/                 # Static assets
│   ├── pillar_3D_model.glb
│   └── rumah-penghulu-abu-seman-3d.mp4
├── api/                    # Vercel serverless functions
│   ├── track-click.js      # Track button clicks (JSONBin.io)
│   └── get-stats.js        # Retrieve analytics (JSONBin.io)
├── package.json
├── vercel.json             # Vercel configuration
├── SETUP_GUIDE.md          # Detailed setup instructions
├── QUIZ_TRACKING_GUIDE.md  # Quiz analytics documentation
├── LICENSE
└── README.md
```

## How Analytics Work

1. **Button Tracking**: When visitors click on buttons (3D Model, Feedback, Quiz), a tracking event is sent to `/api/track-click`
2. **Quiz Start Tracking**: When a visitor first clicks an answer option in the quiz, `quiz-start` is tracked
3. **Quiz Completion Tracking**: When a visitor submits the quiz and sees results, `quiz-complete` is tracked
4. **Storage**: The serverless function stores the click count in JSONBin.io (free JSON storage)
5. **Dashboard**: The dashboard fetches statistics from `/api/get-stats`

### Key Formulas

- **Completion Rate** = (Quiz Completed ÷ Quiz Button Clicks) × 100%
- **Engagement Rate** = (Quiz Started ÷ Quiz Button Clicks) × 100%

## Environment Variables

| Variable | Description |
|----------|-------------|
| `JSONBIN_BIN_ID` | Your JSONBin.io Bin ID |
| `JSONBIN_API_KEY` | Your JSONBin.io X-Master-Key |

## License

MIT License - Feel free to use this for educational purposes.

## Credits

- Badan Warisan Malaysia - 3D Construction Video
- Traditional Malay Architecture Heritage
