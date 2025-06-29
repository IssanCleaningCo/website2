export async function onRequest(context) {
  const { request } = context;
  return new Response(JSON.stringify({
    message: 'API is working!',
    timestamp: new Date().toISOString(),
    method: request.method,
    url: request.url
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
} 