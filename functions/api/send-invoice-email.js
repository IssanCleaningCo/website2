export async function onRequest(context) {
  if (context.request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const { to, subject, body, filename, pdfBase64 } = await context.request.json();
  if (!to || !subject || !body || !filename || !pdfBase64) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
  }

  // Use Resend REST API directly
  const apiKey = context.env.RESEND_API_KEY;
  const fromEmail = context.env.FROM_EMAIL || 'noreply@yourdomain.com';

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: fromEmail,
        to,
        subject,
        text: body,
        attachments: [
          {
            filename,
            content: pdfBase64,
            contentType: 'application/pdf',
            encoding: 'base64'
          }
        ]
      })
    });
    if (!response.ok) {
      const error = await response.text();
      return new Response(JSON.stringify({ error }), { status: 500 });
    }
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
} 