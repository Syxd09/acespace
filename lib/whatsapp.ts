/**
 * Architectural WhatsApp Liaison Helper
 * Utilities for formatting phone numbers and creating customized WhatsApp consultation links.
 */

export const DEFAULT_WHATSAPP_NUMBER = '+91 98450 12345';
export const DEFAULT_WHATSAPP_DISPLAY = '+91 98450 12345';
export const DEFAULT_WHATSAPP_MESSAGE =
  'Hello Ace Spaces Studio, I would like to consult on architectural material specification for an upcoming project.';

export interface WhatsAppPromptOption {
  id: string;
  label: string;
  icon: string;
  message: string;
}

export const WHATSAPP_CONSULTATION_PROMPTS: WhatsAppPromptOption[] = [
  {
    id: 'samples',
    label: 'Request Specimen Samples',
    icon: '📦',
    message: 'Hello Ace Spaces Studio, I would like to request physical material specimen samples for my project specification.',
  },
  {
    id: 'drawings',
    label: 'Share CAD / Floor Plans',
    icon: '📐',
    message: 'Hello Ace Spaces Studio, I have architectural drawings / CAD files ready and would like a fabrication & material quotation.',
  },
  {
    id: 'pricing',
    label: 'Corian® & Slab Pricing',
    icon: '🏷️',
    message: 'Hello Ace Spaces Studio, I would like to inquire about full-slab sheet dimensions, pricing, and current stockyard inventory in Bangalore.',
  },
  {
    id: 'expert',
    label: 'Speak with Material Architect',
    icon: '💬',
    message: 'Hello Ace Spaces Studio, I am an architect/designer looking for technical guidance on seamless joins and thermoforming capabilities.',
  },
];

export function cleanWhatsAppNumber(phone?: string): string {
  const target = phone || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || DEFAULT_WHATSAPP_NUMBER;
  return target.replace(/[^\d]/g, '');
}

export function generateWhatsAppUrl(phone?: string, text?: string): string {
  const digits = cleanWhatsAppNumber(phone);
  const msg = text || DEFAULT_WHATSAPP_MESSAGE;
  return `https://wa.me/${digits}?text=${encodeURIComponent(msg)}`;
}
