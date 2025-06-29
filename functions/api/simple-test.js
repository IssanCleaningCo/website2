export async function onRequest(context) {
  const { request } = context;
  return new Response(JSON.stringify({
    message: 'Simple API is working!',
    method: request.method,
    path: new URL(request.url).pathname,
    timestamp: new Date().toISOString()
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
} 