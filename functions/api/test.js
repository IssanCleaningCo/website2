export async function onRequest(context) {
  try {
    // Cloudflare Workers do not support require, so we can't test Resend module loading here
    return new Response(JSON.stringify({
      message: 'API is working!',
      method: context.request.method,
      path: new URL(context.request.url).pathname,
      environment: context.env.NODE_ENV || 'development',
      note: 'Resend module loading cannot be tested in Cloudflare Workers.'
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: 'Function crashed',
      message: error.message,
      stack: error.stack
    }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500
    });
  }
} 