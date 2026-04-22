import { Resend } from 'resend';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const { customerEmail, campaignName, budget } = req.body;

  try {
    // Interne E-Mail
    await resend.emails.send({
      from: 'noreply@managemedia.de',
      to: process.env.INTERNAL_EMAIL,
      subject: `Neue Freigabe erhalten`,
      html: `
        <h2>Neue Freigabe eingegangen</h2>
        <p><strong>Kunden-E-Mail:</strong> ${customerEmail}</p>
        <p><strong>Kampagne:</strong> ${campaignName}</p>
        <p><strong>Budget:</strong> ${budget}</p>
        <p>Die Freigabe wurde soeben bestätigt.</p>
      `,
    });

    // Kunden-E-Mail
    await resend.emails.send({
      from: 'noreply@managemedia.de',
      to: customerEmail,
      subject: `Bestätigung Ihrer Freigabe – Managemedia`,
      html: `
        <h2>Vielen Dank für Ihre Freigabe!</h2>
        <p>Wir bestätigen den Eingang Ihrer verbindlichen Freigabe.</p>
        <p><strong>Kampagne:</strong> ${campaignName}</p>
        <p><strong>Budget:</strong> ${budget}</p>
        <p>Wir werden uns zeitnah bei Ihnen melden.</p>
      `
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
