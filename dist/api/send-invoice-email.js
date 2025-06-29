const { Resend } = require('resend');

exports.handler = async function(event, context) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const { to, subject, body, filename, pdfBase64 } = JSON.parse(event.body || '{}');
    if (!to || !subject || !body || !filename || !pdfBase64) {
        return { statusCode: 400, body: JSON.stringify({ error: 'Missing required fields' }) };
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    try {
        await resend.emails.send({
            from: 'issancleaningco@yourdomain.com', // Use a verified sender from your Resend dashboard
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
        });
        return { statusCode: 200, body: JSON.stringify({ success: true }) };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }
}; 