export { renderers } from '../../../renderers.mjs';

const prerender = false;
let viewCounts = {};
const loadInitialCounts = () => {
  if (Object.keys(viewCounts).length === 0) {
    viewCounts = {
      "qradar101": 142,
      "soclab": 89,
      "solarwinds": 203,
      "soulmate": 67
    };
  }
};
const GET = async ({ params, url }) => {
  const slug = params.slug;
  if (!slug) {
    return new Response(JSON.stringify({ error: "Slug is required" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      }
    });
  }
  loadInitialCounts();
  const count = viewCounts[slug] || 0;
  return new Response(JSON.stringify({ slug, views: count }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
};
const POST = async ({ params, request, url }) => {
  const slug = params.slug;
  if (!slug) {
    return new Response(JSON.stringify({ error: "Slug is required" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      }
    });
  }
  try {
    loadInitialCounts();
    const currentCount = viewCounts[slug] || 0;
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
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      }
    });
  } catch (error) {
    console.error("Error updating view count:", error);
    return new Response(JSON.stringify({ error: "Failed to update view count" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      }
    });
  }
};
const OPTIONS = async () => {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  OPTIONS,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
