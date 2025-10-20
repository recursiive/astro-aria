import type { APIRoute } from 'astro';

// This API route should not be prerendered
export const prerender = false;

// Simple in-memory store for view counts
// In production, you'd use a proper database
let viewCounts: Record<string, number> = {};

// Load initial data (in production, load from database)
const loadInitialCounts = () => {
  // Initialize with some realistic counts for demo
  if (Object.keys(viewCounts).length === 0) {
    viewCounts = {
      'qradar101': 142,
      'soclab': 89,
      'solarwinds': 203,
      'soulmate': 67,
    };
  }
};

export const GET: APIRoute = async ({ params, url }) => {
  const slug = params.slug;
  if (!slug) {
    return new Response(JSON.stringify({ error: 'Slug is required' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  loadInitialCounts();
  
  const count = viewCounts[slug] || 0;
  
  return new Response(JSON.stringify({ slug, views: count }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};

export const POST: APIRoute = async ({ params, request, url }) => {
  const slug = params.slug;
  if (!slug) {
    return new Response(JSON.stringify({ error: 'Slug is required' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  try {
    loadInitialCounts();
    
    // Get the current count
    const currentCount = viewCounts[slug] || 0;
    
    // Check if this is an increment request
    const body = await request.json().catch(() => ({}));
    const shouldIncrement = body.increment === true;
    
    if (shouldIncrement) {
      viewCounts[slug] = currentCount + 1;
    }
    
    return new Response(JSON.stringify({ 
      slug, 
      views: viewCounts[slug],
      incremented: shouldIncrement 
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error('Error updating view count:', error);
    
    return new Response(JSON.stringify({ error: 'Failed to update view count' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }
};

export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};
