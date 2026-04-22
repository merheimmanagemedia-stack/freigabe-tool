import { Resend } from 'resend';

export async function POST(req) {
  try {
    const body = await req.json();
    const { customerEmail, campaignName, budget } = body;

    const resend = new Resend(process.env.RESEND_API_KEY);

    // Interne E-Mail
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: process.env.INTERNAL_EMAIL,
      subject: "Neue Freigabe erhalten",
      html: `
        <h2>Neue Freigabe eingegangen</h2>
        <p><strong>Kunden-E-Mail:</strong> ${customerEmail}</p>
        <p><strong>Kampagne:</strong> ${campaignName}</p>
        <p><strong>Budget:</strong> ${budget}</p>
      `
    });

    // Kunden-E-Mail
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: customerEmail,
      subject: "Bestätigung Ihrer Freigabe – ManageMedia",
      html: `
        <h2>Vielen Dank für Ihre Freigabe</h2>
        <p>Wir bestätigen den Eingang Ihrer verbindlichen Freigabe.</p>
        <p><strong>Kampagne:</strong> ${campaignName}</p>
        <p><strong>Budget:</strong> ${budget}</p>
      `
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500
    });
  }
}
