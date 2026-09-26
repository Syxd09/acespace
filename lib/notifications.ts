/**
 * Studio Dispatch & Notification Liaison
 * Handles multi-channel alerts for sample orders, project inquiries, and specifier consultations.
 * Supports:
 * - Direct WhatsApp liaison URL generation with pre-populated order summaries
 * - Webhook notifications (Slack / Discord / Zapier) via NOTIFICATION_WEBHOOK_URL
 * - Resend / SMTP Email dispatch via RESEND_API_KEY
 */

import { SampleOrder, ProjectInquiry } from '@/data/orderStore';
import { cleanWhatsAppNumber, DEFAULT_WHATSAPP_NUMBER } from '@/lib/whatsapp';

export interface NotificationResult {
  whatsappUrl: string;
  webhookSent: boolean;
  emailSent: boolean;
}

/**
 * Format a sample order into a concise, elegant message for WhatsApp and notifications
 */
export function formatSampleOrderMessage(order: SampleOrder): string {
  const customer = order.customer;
  const itemsList = order.items
    .slice(0, 8)
    .map((item, idx) => `  ${idx + 1}. *${item.name}* (${item.collection} · ${item.finish || 'Matte'})`)
    .join('\n');

  const moreNotice = order.items.length > 8 ? `\n  ...and ${order.items.length - 8} more specimen(s)` : '';

  return `*ACE SPACES — NEW SPECIMEN SAMPLE ORDER* 📦
*Order Reference:* ${order.orderNumber}
*Status:* ${order.status.toUpperCase()}

*Architect / Specifier:*
• Name: ${customer.name || 'Anonymous Specifier'}
• Studio / Firm: ${customer.studio || 'Private Practice'}
• Phone: ${customer.phone || 'Not provided'}
• Email: ${customer.email || 'Not provided'}
• City / Location: ${customer.city || 'Bengaluru'} (${customer.pincode || '560038'})
• Project Type: ${customer.projectType || 'Residential / Bespoke'}

*Requested Specimen Swatches (${order.itemCount} items):*
${itemsList}${moreNotice}

*Studio Hotline:* https://acespacesindia.vercel.app/admin`;
}

/**
 * Format a project inquiry into a clear brief message
 */
export function formatInquiryMessage(inquiry: ProjectInquiry): string {
  return `*ACE SPACES — NEW PROJECT BRIEF / INQUIRY* 📐
*Reference:* ${inquiry.inquiryNumber}

*Client / Architect:*
• Name: ${inquiry.name}
• Email: ${inquiry.email}
• Phone: ${inquiry.phone || 'Not provided'}
• Project Typology: ${inquiry.projectType}

*Brief / Message:*
"${inquiry.message}"

*Studio Dashboard:* https://acespacesindia.vercel.app/admin`;
}

/**
 * Dispatches alerts across configured channels (WhatsApp URL, Webhooks, Resend)
 */
export async function notifyOrderSubmitted(order: SampleOrder): Promise<NotificationResult> {
  const formattedText = formatSampleOrderMessage(order);
  const studioPhone = cleanWhatsAppNumber(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || DEFAULT_WHATSAPP_NUMBER);
  const whatsappUrl = `https://wa.me/${studioPhone}?text=${encodeURIComponent(formattedText)}`;

  let webhookSent = false;
  let emailSent = false;

  // 1. Webhook alert (Slack/Discord/Zapier)
  const webhookUrl = process.env.NOTIFICATION_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: formattedText,
          orderId: order.id,
          orderNumber: order.orderNumber,
        }),
      });
      webhookSent = true;
    } catch (err) {
      console.warn('Webhook notification dispatch failed:', err);
    }
  }

  // 2. Resend Email Dispatch (if RESEND_API_KEY is configured)
  const resendApiKey = process.env.RESEND_API_KEY;
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || 'studio@acespaces.in';
  if (resendApiKey) {
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Ace Spaces Dispatch <orders@acespaces.in>',
          to: [adminEmail],
          subject: `[Ace Spaces] New Specimen Order: ${order.orderNumber} (${order.customer.studio || order.customer.name})`,
          text: formattedText,
        }),
      });
      emailSent = true;
    } catch (err) {
      console.warn('Resend email dispatch failed:', err);
    }
  }

  // Always log clear dispatch information to console
  console.log(`[Order Dispatch] Ref: ${order.orderNumber} | Customer: ${order.customer.name} | Items: ${order.itemCount}`);

  return { whatsappUrl, webhookSent, emailSent };
}

/**
 * Dispatches alerts for project inquiries
 */
export async function notifyInquirySubmitted(inquiry: ProjectInquiry): Promise<NotificationResult> {
  const formattedText = formatInquiryMessage(inquiry);
  const studioPhone = cleanWhatsAppNumber(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || DEFAULT_WHATSAPP_NUMBER);
  const whatsappUrl = `https://wa.me/${studioPhone}?text=${encodeURIComponent(formattedText)}`;

  let webhookSent = false;
  let emailSent = false;

  const webhookUrl = process.env.NOTIFICATION_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: formattedText,
          inquiryId: inquiry.id,
          inquiryNumber: inquiry.inquiryNumber,
        }),
      });
      webhookSent = true;
    } catch (err) {
      console.warn('Webhook inquiry dispatch failed:', err);
    }
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || 'studio@acespaces.in';
  if (resendApiKey) {
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Ace Spaces Inquiries <inquiries@acespaces.in>',
          to: [adminEmail],
          subject: `[Ace Spaces] New Architectural Inquiry: ${inquiry.inquiryNumber} (${inquiry.name})`,
          text: formattedText,
        }),
      });
      emailSent = true;
    } catch (err) {
      console.warn('Resend email dispatch failed:', err);
    }
  }

  console.log(`[Inquiry Dispatch] Ref: ${inquiry.inquiryNumber} | Client: ${inquiry.name} | Type: ${inquiry.projectType}`);

  return { whatsappUrl, webhookSent, emailSent };
}
