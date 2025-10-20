import type { APIRoute } from 'astro';

// This API route should not be prerendered
export const prerender = false;

// Initial view counts (in production, this would come from a database)
const getInitialCounts = (): Record<string, number> => {
  return {
    'qradar101': 142,
    'soclab': 89,
    'solarwinds': 203,
    'soulmate': 67,
  };
};

export const GET: APIRoute = async ({ params }) => {
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

  const initialCounts = getInitialCounts();
  const count = initialCounts[slug] || 0;
  
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

export const POST: APIRoute = async ({ params, request }) => {
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
    const initialCounts = getInitialCounts();
    const currentCount = initialCounts[slug] || 0;
    
    // Check if this is an increment request
    const body = await request.json().catch(() => ({}));
    const shouldIncrement = body.increment === true;
    
    // For now, we'll simulate incrementing but not persist it
    // In production, this would save to a database
    const newCount = shouldIncrement ? currentCount + 1 : currentCount;
    
    return new Response(JSON.stringify({ 
      slug, 
      views: newCount,
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
