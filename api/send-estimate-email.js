import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    estimateNumber, estimateStatus, clientName, clientAddress, clientEmail, clientPhone,
    estimateDate, validUntil, preparedBy, notes, taxRate, subtotal, taxAmount, total, items,
    pdfBase64, // Destructure the Base64 PDF content
    filename   // Destructure the filename for the attachment
  } = req.body || {};

  if (!clientEmail || !estimateNumber) {
    return res.status(400).json({ error: 'Missing required fields: clientEmail or estimateNumber.' });
  }

  // Build HTML email body
  const itemsHtml = (items || []).map(item => {
    // Sanitize item content to prevent HTML injection if contenteditable fields were edited maliciously
    const description = item.description ? item.description.replace(/<[^>]*>?/gm, '') : '';
    const quantity = item.quantity ? parseFloat(item.quantity.replace(/[^0-9.]/g, '')) : 0;
    const rate = item.rate ? parseFloat(item.rate.replace(/[^0-9.]/g, '')) : 0;
    const amount = item.amount ? item.amount.replace(/<[^>]*>?/gm, '') : ''; // Use the pre-formatted amount

    return `<tr>
      <td style="padding:8px;border:1px solid #eee;">${description}</td>
      <td style="padding:8px;border:1px solid #eee;text-align:center;">${quantity}</td>
      <td style="padding:8px;border:1px solid #eee;text-align:right;">${rate.toFixed(2)}</td>
      <td style="padding:8px;border:1px solid #eee;text-align:right;">${amount}</td>
    </tr>`;
  }).join('');

  const html = `
    <div style="font-family:Inter,sans-serif;max-width:600px;margin:auto;border:1px solid #eee;padding:20px;box-shadow:0 0 10px rgba(0,0,0,0.05);">
      <h2 style="color:#222;text-align:center;border-bottom:1px solid #eee;padding-bottom:10px;">Estimate from Issan Cleaning Co.</h2>
      <p style="margin-top:20px;"><strong>Estimate #:</strong> ${estimateNumber || 'N/A'}<br>
         <strong>Status:</strong> ${estimateStatus || 'N/A'}<br>
         <strong>Date Issued:</strong> ${estimateDate || ''}<br>
         <strong>Valid Until:</strong> ${validUntil || ''}</p>
      <h3>Estimate For:</h3>
      <p><strong>Name:</strong> ${clientName || ''}<br>
         <strong>Address:</strong> ${clientAddress || ''}<br>
         <strong>Email:</strong> ${clientEmail || ''}<br>
         <strong>Phone:</strong> ${clientPhone || ''}</p>
      
      <h3 style="color:#333;margin-top:20px;">Estimate Details:</h3>
      <table style="width:100%;border-collapse:collapse;margin:16px 0;">
        <thead>
          <tr style="background:#f8fafc;color:#666;font-size:14px;">
            <th style="padding:8px;border:1px solid #eee;text-align:left;">Description</th>
            <th style="padding:8px;border:1px solid #eee;text-align:center;">Qty</th>
            <th style="padding:8px;border:1px solid #eee;text-align:right;">Rate</th>
            <th style="padding:8px;border:1px solid #eee;text-align:right;">Amount</th>
          </tr>
        </thead>
        <tbody>${itemsHtml}</tbody>
      </table>
      <div style="text-align:right;margin-top:20px;">
         <p style="font-size:16px;"><strong>Subtotal:</strong> ${subtotal || '$0.00'}</p>
         <p style="font-size:16px;"><strong>Tax (${taxRate || 0}%):</strong> ${taxAmount || '$0.00'}</p>
         <p style="font-size:20px;font-weight:bold;color:#222;padding:10px;background:#f0f0f0;display:inline-block;min-width:200px;">Total: ${total || '$0.00'}</p>
      </div>

      <p style="margin-top:20px;"><strong>Prepared By:</strong> ${preparedBy || 'N/A'}</p>
      <p style="margin-top:10px;"><strong>Notes:</strong> ${notes || 'No additional notes.'}</p>
      <hr style="border:0;border-top:1px solid #eee;margin:25px 0;">
      <p style="font-size:13px;color:#888;text-align:center;">Thank you for considering Issan Cleaning Co.!<br>issancleaningco@gmail.com | (305) 701-3909</p>
    </div>
  `;

  // Prepare attachments array if pdfBase64 is present
  const attachments = [];
  if (pdfBase64) {
    attachments.push({
      filename: filename || `${estimateNumber}.pdf`, // Use filename from client or default
      content: pdfBase64,
    });
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_API_KEY) {
    return res.status(500).json({ error: 'Missing RESEND_API_KEY in environment.' });
  }

  try {
    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Issan Cleaning Co. <info@issancleaningco.com>', // IMPORTANT: Replace with your verified Resend domain email.
        to: [clientEmail],
        subject: `Your Estimate from Issan Cleaning Co. (${estimateNumber})`,
        html,
        attachments, // Pass the attachments array here
      })
    });
    if (!resendRes.ok) {
      const errorData = await resendRes.json(); // Get JSON error details for more verbose debugging
      console.error('Resend API Error:', errorData);
      return res.status(resendRes.status).json({ error: 'Failed to send email via Resend API', details: errorData });
    }
    return res.status(200).json({ message: 'Estimate email sent successfully!' });
  } catch (err) {
    console.error('Server-side email sending error:', err);
    return res.status(500).json({ error: 'Internal server error during email sending', details: err.message });
  }
}