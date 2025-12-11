// Vercel Serverless Function to get analytics statistics using JSONBin.io

const JSONBIN_API_URL = 'https://api.jsonbin.io/v3/b';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get environment variables
  const BIN_ID = process.env.JSONBIN_BIN_ID;
  const API_KEY = process.env.JSONBIN_API_KEY;

  if (!BIN_ID || !API_KEY) {
    return res.status(500).json({ error: 'JSONBin configuration missing' });
  }

  try {
    // Get data from JSONBin
    const response = await fetch(`${JSONBIN_API_URL}/${BIN_ID}/latest`, {
      headers: {
        'X-Master-Key': API_KEY
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch data from JSONBin');
    }

    const jsonData = await response.json();
    const data = jsonData.record || {};

    // Extract click counts
    const totalClicks = data.clicks_total || 0;
    const modelClicks = data.clicks_3d_model || 0;
    const feedbackClicks = data.clicks_feedback || 0;
    const quizClicks = data.clicks_quiz || 0;
    const quizStarts = data.clicks_quiz_start || 0;
    const quizCompletions = data.clicks_quiz_complete || 0;

    // Calculate completion rate (quiz completions / quiz button clicks)
    const completionRate = quizClicks > 0 
      ? ((quizCompletions / quizClicks) * 100).toFixed(2) 
      : 0;

    // Calculate quiz engagement (quiz starts / quiz button clicks)
    const engagementRate = quizClicks > 0
      ? ((quizStarts / quizClicks) * 100).toFixed(2)
      : 0;

    return res.status(200).json({
      success: true,
      stats: {
        totalClicks,
        modelClicks,
        feedbackClicks,
        quizClicks,
        quizStarts,
        quizCompletions,
        completionRate: `${completionRate}%`,
        engagementRate: `${engagementRate}%`
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error getting stats:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
