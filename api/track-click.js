// Vercel Serverless Function to track button clicks using JSONBin.io

const JSONBIN_API_URL = 'https://api.jsonbin.io/v3/b';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get environment variables
  const BIN_ID = process.env.JSONBIN_BIN_ID;
  const API_KEY = process.env.JSONBIN_API_KEY;

  if (!BIN_ID || !API_KEY) {
    return res.status(500).json({ error: 'JSONBin configuration missing' });
  }

  try {
    const { buttonType } = req.body;

    if (!buttonType) {
      return res.status(400).json({ error: 'Button type is required' });
    }

    // Get current data from JSONBin
    const getResponse = await fetch(`${JSONBIN_API_URL}/${BIN_ID}/latest`, {
      headers: {
        'X-Master-Key': API_KEY
      }
    });

    if (!getResponse.ok) {
      throw new Error('Failed to fetch data from JSONBin');
    }

    const jsonData = await getResponse.json();
    const data = jsonData.record || getDefaultData();

    // Increment the specific button click count
    const clickKey = `clicks_${buttonType.replace(/-/g, '_')}`;
    data[clickKey] = (data[clickKey] || 0) + 1;
    
    // Also increment total clicks
    data.clicks_total = (data.clicks_total || 0) + 1;

    // Record timestamp
    const timestamp = new Date().toISOString();
    data.last_updated = timestamp;

    // Update JSONBin
    const updateResponse = await fetch(`${JSONBIN_API_URL}/${BIN_ID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': API_KEY
      },
      body: JSON.stringify(data)
    });

    if (!updateResponse.ok) {
      throw new Error('Failed to update JSONBin');
    }

    return res.status(200).json({
      success: true,
      buttonType,
      clickCount: data[clickKey],
      timestamp
    });

  } catch (error) {
    console.error('Error tracking click:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// Default data structure for new bins
function getDefaultData() {
  return {
    clicks_total: 0,
    clicks_3d_model: 0,
    clicks_feedback: 0,
    clicks_quiz: 0,
    clicks_quiz_start: 0,
    clicks_quiz_complete: 0,
    last_updated: new Date().toISOString()
  };
}
