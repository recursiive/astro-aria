import fs from 'fs';
import path from 'path';

// Path to the view count data file - use public directory for better access
const VIEWS_FILE = path.join(process.cwd(), 'public', 'data', 'views.json');

// Ensure the data directory exists
const dataDir = path.dirname(VIEWS_FILE);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Read view counts from JSON file
function readViews() {
  try {
    // Ensure directory exists
    const dataDir = path.dirname(VIEWS_FILE);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    if (fs.existsSync(VIEWS_FILE)) {
      const data = fs.readFileSync(VIEWS_FILE, 'utf8');
      const parsed = JSON.parse(data);
      // Ensure the data structure is correct
      Object.keys(parsed).forEach(slug => {
        if (!Array.isArray(parsed[slug].uniqueViews)) {
          parsed[slug].uniqueViews = [];
        }
      });
      return parsed;
    }
  } catch (error) {
    console.error('Error reading views file:', error);
  }
  return {};
}

// Write view counts to JSON file
function writeViews(viewsData) {
  try {
    fs.writeFileSync(VIEWS_FILE, JSON.stringify(viewsData, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing views file:', error);
    return false;
  }
}

// Generate a simple user fingerprint based on IP and User-Agent
function getUserFingerprint(request) {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';
  
  // Create a simple hash-like identifier (not cryptographically secure, just for basic uniqueness)
  const fingerprint = Buffer.from(`${ip}-${userAgent}`).toString('base64').slice(0, 16);
  return fingerprint;
}

export async function POST({ request, params }) {
  try {
    const body = await request.json();
    const { slug } = body;
    
    if (!slug) {
      return new Response(JSON.stringify({ error: 'Slug is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get user fingerprint
    const userFingerprint = getUserFingerprint(request);
    
    // Read current views data
    const viewsData = readViews();
    
    // Initialize post data if it doesn't exist
    if (!viewsData[slug]) {
      viewsData[slug] = {
        totalViews: 0,
        uniqueViews: [],
        lastViewed: new Date().toISOString()
      };
    }
    
    // Ensure uniqueViews is an array
    if (!Array.isArray(viewsData[slug].uniqueViews)) {
      viewsData[slug].uniqueViews = [];
    }
    
    // Check if this is a new unique viewer
    const isNewViewer = !viewsData[slug].uniqueViews.includes(userFingerprint);
    
    // Increment total views
    viewsData[slug].totalViews += 1;
    
    // Add user to unique viewers array if new
    if (isNewViewer) {
      viewsData[slug].uniqueViews.push(userFingerprint);
    }
    
    // Update last viewed timestamp
    viewsData[slug].lastViewed = new Date().toISOString();
    
    // Save updated data
    const success = writeViews(viewsData);
    
    if (!success) {
      return new Response(JSON.stringify({ error: 'Failed to save view data' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Return the updated view count
    return new Response(JSON.stringify({ 
      success: true,
      totalViews: viewsData[slug].totalViews,
      uniqueViews: viewsData[slug].uniqueViews.length,
      isNewViewer
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
    
  } catch (error) {
    console.error('Error tracking view:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function GET({ params, url }) {
  try {
    const slug = url.searchParams.get('slug');
    
    if (!slug) {
      return new Response(JSON.stringify({ error: 'Slug is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Read current views data
    const viewsData = readViews();
    
    if (!viewsData[slug]) {
      return new Response(JSON.stringify({ 
        totalViews: 0,
        uniqueViews: 0
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify({ 
      totalViews: viewsData[slug].totalViews || 0,
      uniqueViews: viewsData[slug].uniqueViews?.length || 0
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Error getting view count:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
