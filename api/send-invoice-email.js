import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    invoiceNumber, invoiceStatus, clientName, clientAddress, clientEmail, clientPhone,
    invoiceDate, dueDate, preparedBy, notes, taxRate, subtotal, taxAmount, total, items
  } = req.body || {};

  if (!clientEmail || !invoiceNumber) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  // Build HTML email body
  const itemsHtml = (items || []).map(item => {
    return `<tr>
      <td style="padding:4px 8px;border:1px solid #eee;">${item.description}</td>
      <td style="padding:4px 8px;border:1px solid #eee;text-align:center;">${item.quantity}</td>
      <td style="padding:4px 8px;border:1px solid #eee;text-align:right;">${item.rate}</td>
      <td style="padding:4px 8px;border:1px solid #eee;text-align:right;">${item.amount}</td>
    </tr>`;
  }).join('');

  const html = `
    <div style="font-family:Inter,sans-serif;max-width:600px;margin:auto;">
      <h2 style="color:#222;">Invoice from Issan Cleaning Co.</h2>
      <p><strong>Invoice #:</strong> ${invoiceNumber}<br>
         <strong>Status:</strong> ${invoiceStatus || 'N/A'}<br>
         <strong>Date Issued:</strong> ${invoiceDate || ''}<br>
         <strong>Due Date:</strong> ${dueDate || ''}</p>
      <h3>Bill To:</h3>
      <p>${clientName}<br>${clientAddress}<br>${clientEmail}<br>${clientPhone}</p>
      <table style="width:100%;border-collapse:collapse;margin:16px 0;">
        <thead>
          <tr style="background:#f8fafc;">
            <th style="padding:4px 8px;border:1px solid #eee;text-align:left;">Description</th>
            <th style="padding:4px 8px;border:1px solid #eee;text-align:center;">Qty</th>
            <th style="padding:4px 8px;border:1px solid #eee;text-align:right;">Rate</th>
            <th style="padding:4px 8px;border:1px solid #eee;text-align:right;">Amount</th>
          </tr>
        </thead>
        <tbody>${itemsHtml}</tbody>
      </table>
      <p><strong>Subtotal:</strong> ${subtotal}<br>
         <strong>Tax (${taxRate || 0}%):</strong> ${taxAmount}<br>
         <strong>Total:</strong> ${total}</p>
      <p><strong>Prepared By:</strong> ${preparedBy}</p>
      <p><strong>Notes:</strong> ${notes}</p>
      <hr>
      <p style="font-size:13px;color:#888;">Thank you for your business!<br>Issan Cleaning Co. | issancleaningco@gmail.com | (305) 701-3909</p>
    </div>
  `;

  // Send email using Resend API
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
        from: 'Issan Cleaning Co. <issancleaningco@gmail.com>',
        to: [clientEmail],
        subject: `Your Invoice from Issan Cleaning Co. (${invoiceNumber})`,
        html,
      })
    });
    if (!resendRes.ok) {
      const error = await resendRes.text();
      return res.status(500).json({ error: 'Failed to send email', details: error });
    }
    return res.status(200).json({ message: 'Invoice email sent!' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to send email', details: err.message });
  }
}
