// Vercel serverless function for QuadERP contact-form submissions.
//
// Called best-effort by the form AFTER a successful Formspree submit, so if
// anything here fails the visitor's success state is never affected. Formspree
// still records every submission (kept as the archive/backup). This function
// sends two branded emails via Resend (https://resend.com):
//
//   1. Lead notification  -> the business (well-listed table of all fields).
//   2. Confirmation       -> the person who submitted ("we've got it").
//
// No npm dependency (Node 22 has global fetch). Requires env var
// RESEND_API_KEY. The `from` domain (quaderp.app) must be verified in Resend.
// Where lead notifications are delivered is set by LEAD_NOTIFICATION_EMAIL
// (defaults to info@quaderp.app).

const FROM = 'QuadERP <info@quaderp.app>';
const REPLY_TO = 'info@quaderp.app';
const CALENDLY_URL = 'https://calendly.com/quademdigitalenterprise/quaderp-demo-call';
const WHATSAPP_URL = 'https://wa.me/233530890302';

const ALLOWED_ORIGINS = ['https://quaderp.app', 'https://www.quaderp.app'];

function isAllowedOrigin(req) {
    const origin = req.headers.origin || '';
    const referer = req.headers.referer || '';
    const ok = (v) =>
        ALLOWED_ORIGINS.includes(v) ||
        ALLOWED_ORIGINS.some((o) => v.startsWith(o)) ||
        /^https:\/\/[a-z0-9-]+\.vercel\.app(\/|$)/i.test(v) ||
        v.startsWith('http://localhost');
    return ok(origin) || ok(referer);
}

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

const isValidEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

// Best-effort conversion of a Ghana phone number to a wa.me link.
function waLink(phone) {
    let d = String(phone).replace(/\D/g, '');
    if (!d) return '';
    if (d.startsWith('0')) d = '233' + d.slice(1);
    else if (d.length === 9) d = '233' + d;
    return `https://wa.me/${d}`;
}

async function sendEmail(apiKey, payload) {
    const resp = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });
    if (!resp.ok) {
        const detail = await resp.text().catch(() => '');
        throw new Error(`Resend ${resp.status}: ${detail}`);
    }
    return resp.json().catch(() => ({}));
}

// --- Lead notification (to the business) -----------------------------------
function buildNotification(f) {
    const row = (label, valueHtml) =>
        valueHtml
            ? `<tr><td style="padding:11px 16px;font-size:13px;font-weight:600;color:#51607a;background-color:#f8fafc;border-bottom:1px solid #eef1f6;width:36%;vertical-align:top;">${label}</td><td style="padding:11px 16px;font-size:14px;color:#0f172a;border-bottom:1px solid #eef1f6;vertical-align:top;">${valueHtml}</td></tr>`
            : '';

    const wa = waLink(f.phone);
    const heading = f.business_name || f.name || 'New lead';
    const tag = f.plan || f.business_type;
    const dateStr =
        new Date().toLocaleString('en-GB', {
            timeZone: 'Africa/Accra',
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }) + ' GMT';

    const rows =
        row('Name', escapeHtml(f.name)) +
        row('Business', escapeHtml(f.business_name)) +
        row('Email', f.email ? `<a href="mailto:${escapeHtml(f.email)}" style="color:#0090c7;text-decoration:none;">${escapeHtml(f.email)}</a>` : '') +
        row('Phone', f.phone ? `<a href="${wa || 'tel:' + escapeHtml(f.phone)}" style="color:#0090c7;text-decoration:none;">${escapeHtml(f.phone)}</a>` : '') +
        row('Business type', escapeHtml(f.business_type)) +
        row('Locations', escapeHtml(f.locations)) +
        row('Plan interest', f.plan ? `<strong style="color:#0090c7;">${escapeHtml(f.plan)}</strong>` : '<span style="color:#94a3b8;">Not specified</span>') +
        row('Source', escapeHtml(f.source));

    const messageBlock = f.message
        ? `<tr><td style="padding:8px 32px;"><div style="background-color:#f8fafc;border-left:3px solid #00aeef;border-radius:8px;padding:16px 18px;"><p style="margin:0 0 6px 0;font-size:12px;font-weight:700;color:#51607a;text-transform:uppercase;letter-spacing:0.04em;">Message</p><p style="margin:0;font-size:14px;line-height:1.6;color:#0f172a;white-space:pre-wrap;">${escapeHtml(f.message)}</p></div></td></tr>`
        : '';

    const firstName = f.name ? escapeHtml(f.name.split(/\s+/)[0]) : 'lead';
    const waBtn = wa
        ? `<a href="${wa}" style="display:inline-block;background-color:#ffffff;color:#0f172a;font-size:14px;font-weight:600;text-decoration:none;padding:10px 22px;border-radius:999px;border:1px solid #d7dee8;margin:0 6px 8px 0;">WhatsApp</a>`
        : '';
    const replyBtn = f.email
        ? `<a href="mailto:${escapeHtml(f.email)}" style="display:inline-block;background-color:#00aeef;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;padding:11px 22px;border-radius:999px;margin:0 6px 8px 0;">Reply to ${firstName}</a>`
        : '';

    const html = `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>New setup request</title></head>
<body style="margin:0;padding:0;background-color:#f6f8fb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f6f8fb;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(15,23,42,0.06);">
        <tr><td style="background-color:#0d0a28;padding:22px 32px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
            <td style="font-size:20px;font-weight:700;color:#ffffff;letter-spacing:-0.02em;">Quad<span style="color:#00aeef;">ERP</span></td>
            <td align="right" style="font-size:13px;color:#94a3b8;">New setup request</td>
          </tr></table>
        </td></tr>
        <tr><td style="padding:28px 32px 4px 32px;">
          <h1 style="margin:0 0 4px 0;font-size:20px;font-weight:700;color:#0f172a;">${escapeHtml(heading)}</h1>
          <p style="margin:0;font-size:13px;color:#51607a;">Submitted ${dateStr}${tag ? ` (${escapeHtml(tag)})` : ''}</p>
        </td></tr>
        <tr><td style="padding:16px 32px 8px 32px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #eef1f6;border-radius:10px;overflow:hidden;">${rows}</table>
        </td></tr>
        ${messageBlock}
        <tr><td style="padding:12px 32px 32px 32px;">${replyBtn}${waBtn}</td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

    const lines = [
        'NEW QUADERP SETUP REQUEST',
        heading,
        `Submitted ${dateStr}`,
        '',
        `Name: ${f.name}`,
        `Business: ${f.business_name}`,
        `Email: ${f.email}`,
        `Phone: ${f.phone}`,
        `Business type: ${f.business_type}`,
        `Locations: ${f.locations}`,
        `Plan interest: ${f.plan || 'Not specified'}`,
        `Source: ${f.source}`,
    ];
    if (f.message) lines.push('', 'Message:', f.message);
    lines.push('', `Reply: ${f.email}`);
    if (wa) lines.push(`WhatsApp: ${wa}`);
    const text = lines.join('\n');

    const subject = `New QuadERP Request: ${heading}${tag ? ` (${tag})` : ''}`;
    return { html, text, subject };
}

// --- Confirmation (to the submitter) ---------------------------------------
function buildConfirmation({ firstName, plan }) {
    const safeName = escapeHtml(firstName);
    const safePlan = plan ? escapeHtml(plan) : '';
    const planLineHtml = safePlan
        ? `<p style="margin:0 0 24px 0;font-size:15px;line-height:1.6;color:#51607a;text-align:center;">You told us you're interested in the <strong style="color:#0f172a;">${safePlan}</strong> plan, so we'll tailor our follow-up around that.</p>`
        : '';

    const html = `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>We received your request</title></head>
<body style="margin:0;padding:0;background-color:#f6f8fb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f6f8fb;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(15,23,42,0.06);">
        <tr><td style="background-color:#0d0a28;padding:28px 32px;text-align:center;">
          <img src="https://quaderp.app/images/QuadERP_app_icon_1024.png" width="44" height="44" alt="QuadERP" style="display:inline-block;vertical-align:middle;border-radius:10px;">
          <span style="display:inline-block;vertical-align:middle;margin-left:10px;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-0.02em;">Quad<span style="color:#00aeef;">ERP</span></span>
        </td></tr>
        <tr><td style="padding:40px 32px 8px 32px;">
          <div style="width:56px;height:56px;border-radius:50%;background-color:#e6f7fe;text-align:center;line-height:56px;margin:0 auto 20px auto;"><span style="font-size:28px;color:#00aeef;">&#10003;</span></div>
          <h1 style="margin:0 0 12px 0;font-size:24px;font-weight:700;color:#0f172a;text-align:center;">We've got your request!</h1>
          <p style="margin:0 0 24px 0;font-size:16px;line-height:1.6;color:#51607a;text-align:center;">Hi ${safeName}, thanks for reaching out about QuadERP. We've received your details and our team will get back to you within <strong style="color:#0f172a;">24 hours</strong>.</p>
          ${planLineHtml}
        </td></tr>
        <tr><td style="padding:8px 32px;">
          <div style="background-color:#f6f8fb;border-radius:12px;padding:24px;text-align:center;">
            <p style="margin:0 0 12px 0;font-size:13px;font-weight:700;color:#0f172a;text-transform:uppercase;letter-spacing:0.04em;">While you wait</p>
            <p style="margin:0 0 20px 0;font-size:15px;line-height:1.6;color:#51607a;">Want to move faster? Book a free 15-minute demo and we'll walk you through QuadERP live, or message us on WhatsApp.</p>
            <a href="${CALENDLY_URL}" style="display:inline-block;background-color:#00aeef;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;padding:12px 24px;border-radius:999px;margin:0 4px 10px 4px;">Book a Demo Call</a>
            <a href="${WHATSAPP_URL}" style="display:inline-block;background-color:#ffffff;color:#0f172a;font-size:15px;font-weight:600;text-decoration:none;padding:11px 24px;border-radius:999px;border:1px solid #d7dee8;margin:0 4px 10px 4px;">Chat on WhatsApp</a>
          </div>
        </td></tr>
        <tr><td style="padding:28px 32px 36px 32px;text-align:center;">
          <p style="margin:0;font-size:14px;line-height:1.6;color:#51607a;">Questions? Just reply to this email or reach us at <a href="mailto:info@quaderp.app" style="color:#0090c7;text-decoration:none;font-weight:600;">info@quaderp.app</a></p>
          <p style="margin:16px 0 0 0;font-size:12px;line-height:1.6;color:#94a3b8;">QuadERP by Quadem Digital Enterprise<br>Store management for retail, pharmacies &amp; multi-branch businesses.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

    const text = `Hi ${firstName},

Thanks for reaching out about QuadERP. We've received your details and our team will get back to you within 24 hours.
${plan ? `\nYou told us you're interested in the ${plan} plan, so we'll tailor our follow-up around that.\n` : ''}
While you wait, you can:
- Book a free 15-min demo call: ${CALENDLY_URL}
- Chat with us on WhatsApp: ${WHATSAPP_URL}

Questions? Just reply to this email or reach us at info@quaderp.app

The QuadERP Team
Quadem Digital Enterprise`;

    return { html, text };
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    if (!isAllowedOrigin(req)) {
        return res.status(403).json({ error: 'Forbidden' });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'Email service not configured' });
    }

    let body = req.body;
    if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch { body = {}; }
    }
    body = body || {};

    // Honeypot: our form ships an empty _gotcha; a filled one means a bot.
    if (String(body._gotcha || '').trim()) {
        return res.status(200).json({ ok: true, skipped: 'spam' });
    }

    const f = {
        name: String(body.name || '').trim(),
        business_name: String(body.business_name || '').trim(),
        email: String(body.email || '').trim(),
        phone: String(body.phone || '').trim(),
        business_type: String(body.business_type || '').trim(),
        locations: String(body.locations || '').trim(),
        plan: String(body.plan_interest || '').trim(),
        message: String(body.message || '').trim(),
        source: String(body.source || 'QuadERP Landing Page').trim(),
    };

    const notifyTo = process.env.LEAD_NOTIFICATION_EMAIL || 'info@quaderp.app';
    const sends = [];

    // 1. Lead notification to the business (reply goes straight to the lead).
    const notif = buildNotification(f);
    sends.push(
        sendEmail(apiKey, {
            from: FROM,
            to: [notifyTo],
            reply_to: f.email && isValidEmail(f.email) ? f.email : REPLY_TO,
            subject: notif.subject,
            html: notif.html,
            text: notif.text,
        })
    );

    // 2. Confirmation to the submitter (only with a valid email).
    if (f.email && isValidEmail(f.email)) {
        const firstName = f.name ? f.name.split(/\s+/)[0] : 'there';
        const conf = buildConfirmation({ firstName, plan: f.plan });
        sends.push(
            sendEmail(apiKey, {
                from: FROM,
                to: [f.email],
                reply_to: REPLY_TO,
                subject: 'We received your QuadERP request',
                html: conf.html,
                text: conf.text,
            })
        );
    }

    const results = await Promise.allSettled(sends);
    const failed = results.filter((r) => r.status === 'rejected');
    if (failed.length === results.length) {
        return res.status(502).json({ error: 'All sends failed' });
    }
    return res.status(200).json({ ok: true, sent: results.length - failed.length });
}
