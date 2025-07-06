import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    invoiceNumber, invoiceStatus, clientName, clientAddress, clientEmail, clientPhone,
    invoiceDate, validUntil, preparedBy, notes, taxRate, subtotal, taxAmount, total, items,
    pdfBase64, // <-- This needs to be destructured here
    filename // <-- And potentially the filename for the attachment
  } = req.body || {};

  if (!clientEmail || !invoiceNumber) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  // Build HTML email body (this can be the main content of the email)
  const itemsHtml = (items || []).map(item => {
    // Ensure item properties are safely accessed and formatted
    const description = item.description ? item.description.replace(/<[^>]*>?/gm, '') : ''; // Sanitize contenteditable HTML
    const quantity = item.quantity ? parseFloat(item.quantity.replace(/[^0-9.]/g, '')) : 0;
    const rate = item.rate ? parseFloat(item.rate.replace(/[^0-9.]/g, '')) : 0;
    const amount = item.amount ? item.amount.replace(/<[^>]*>?/gm, '') : ''; // Use the pre-formatted amount

    return `<tr>
      <td style="padding:4px 8px;border:1px solid #eee;">${description}</td>
      <td style="padding:4px 8px;border:1px solid #eee;text-align:center;">${quantity}</td>
      <td style="padding:4px 8px;border:1px solid #eee;text-align:right;">${rate.toFixed(2)}</td>
      <td style="padding:4px 8px;border:1px solid #eee;text-align:right;">${amount}</td>
    </tr>`;
  }).join('');

  const html = `
    <div style="font-family:Inter,sans-serif;max-width:600px;margin:auto;border:1px solid #eee;padding:20px;box-shadow:0 0 10px rgba(0,0,0,0.05);">
      <h2 style="color:#222;text-align:center;border-bottom:1px solid #eee;padding-bottom:10px;">Invoice from Issan Cleaning Co.</h2>
      <p style="margin-top:20px;"><strong>Invoice #:</strong> ${invoiceNumber || 'N/A'}<br>
         <strong>Status:</strong> ${invoiceStatus || 'N/A'}<br>
         <strong>Date Issued:</strong> ${invoiceDate || ''}<br>
         <strong>Valid Until:</strong> ${validUntil || ''}</p>

      <h3 style="color:#333;margin-top:20px;">Invoice For:</h3>
      <p><strong>Name:</strong> ${clientName || ''}<br>
         <strong>Address:</strong> ${clientAddress || ''}<br>
         <strong>Email:</strong> ${clientEmail || ''}<br>
         <strong>Phone:</strong> ${clientPhone || ''}</p>

      <h3 style="color:#333;margin-top:20px;">Invoice Details:</h3>
      <table style="width:100%;border-collapse:collapse;margin:16px 0;">
        <thead>
          <tr style="background:#f8fafc;color:#666;font-size:14px;">
            <th style="padding:8px;border:1px solid #ddd;text-align:left;">Description</th>
            <th style="padding:8px;border:1px solid #ddd;text-align:center;">Qty</th>
            <th style="padding:8px;border:1px solid #ddd;text-align:right;">Rate</th>
            <th style="padding:8px;border:1px solid #ddd;text-align:right;">Amount</th>
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
      filename: filename || `${invoiceNumber}.pdf`, // Use filename from client or default
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
        from: 'Issan Cleaning Co. <info@issancleaningco.com>', // Use a verified domain for Resend 'from' address
        to: [clientEmail],
        subject: `Your Invoice from Issan Cleaning Co. (${invoiceNumber})`,
        html,
        attachments, // <-- Pass the attachments array here
      })
    });

    if (!resendRes.ok) {
      const errorData = await resendRes.json(); // Get JSON error details
      console.error('Resend API Error:', errorData);
      return res.status(resendRes.status).json({ error: 'Failed to send email via Resend API', details: errorData });
    }

    return res.status(200).json({ message: 'Invoice email sent successfully!' });

  } catch (err) {
    console.error('Server-side email sending error:', err);
    return res.status(500).json({ error: 'Internal server error during email sending', details: err.message });
  }
}