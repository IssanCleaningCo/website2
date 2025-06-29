export async function onRequest(context) {
  const { request } = context;
  return new Response(JSON.stringify({
    message: 'Minimal function works!',
    method: request.method,
    url: request.url
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
} 