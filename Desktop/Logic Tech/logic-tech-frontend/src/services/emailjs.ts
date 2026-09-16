import emailjs from '@emailjs/browser';

/**
 * EmailJS Configuration helper.
 *
 * To connect your EmailJS account:
 * 1. Create a FREE account at https://www.emailjs.com/
 * 2. Create an Email Service (e.g., Gmail, Outlook) → copy the Service ID.
 * 3. Create an Email Template with variables:
 *       {{from_name}}, {{from_email}}, {{subject}}, {{message}}
 *    Copy the Template ID.
 * 4. Go to Account → API Keys and copy your Public Key.
 * 5. Paste all three into `logic-tech-frontend/.env.local`:
 *       VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
 *       VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
 *       VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxxxxxxx
 * 6. Restart the dev server after editing .env.local.
 */

export interface EmailParams extends Record<string, unknown> {
  from_name: string;
  from_email: string;
  subject?: string;
  message: string;
}

/** Possible configuration error codes returned to the UI */
export type EmailErrorCode =
  | 'MISSING_KEYS'
  | 'INVALID_SERVICE'
  | 'INVALID_TEMPLATE'
  | 'INVALID_PUBLIC_KEY'
  | 'NETWORK_ERROR'
  | 'UNKNOWN';

export class EmailJSError extends Error {
  code: EmailErrorCode;
  detail: string;

  constructor(code: EmailErrorCode, message: string, detail = '') {
    super(message);
    this.name = 'EmailJSError';
    this.code = code;
    this.detail = detail;
  }
}

/** Returns a friendly message for each HTTP status from EmailJS */
function interpretEmailJSStatus(status: number, text: string): { code: EmailErrorCode; message: string } {
  switch (status) {
    case 400:
      return {
        code: 'INVALID_TEMPLATE',
        message: 'EmailJS rejected the request — check your Template ID and template variable names ({{from_name}}, {{from_email}}, {{subject}}, {{message}}).',
      };
    case 401:
    case 403:
      return {
        code: 'INVALID_PUBLIC_KEY',
        message: 'EmailJS authentication failed — your Public Key is wrong or expired. Regenerate it at emailjs.com → Account → API Keys.',
      };
    case 404:
      return {
        code: 'INVALID_SERVICE',
        message: 'EmailJS Service or Template not found — double-check your Service ID and Template ID.',
      };
    case 429:
      return {
        code: 'UNKNOWN',
        message: 'EmailJS rate limit reached — you have hit the free-tier limit (200 emails/month). Upgrade your plan at emailjs.com.',
      };
    default:
      return {
        code: 'UNKNOWN',
        message: `EmailJS returned an unexpected error (${status}): ${text}`,
      };
  }
}

/** Check whether real credentials are set in .env or .env.local */
function getCredentials(): { serviceId: string; templateId: string; publicKey: string; isLive: boolean } {
  const serviceId = (import.meta.env.VITE_EMAILJS_SERVICE_ID as string | undefined)?.trim() || '';
  const templateId = (import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string | undefined)?.trim() || '';
  const publicKey  = (import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string | undefined)?.trim() || '';

  const placeholders = ['your_service_id', 'your_template_id', 'your_public_key', ''];
  const isLive = !placeholders.includes(serviceId) && !placeholders.includes(templateId) && !placeholders.includes(publicKey);

  return { serviceId, templateId, publicKey, isLive };
}

export const sendContactEmail = async (
  params: EmailParams
): Promise<{ success: boolean; message: string; isLive: boolean }> => {
  const { serviceId, templateId, publicKey, isLive } = getCredentials();

  // Mode 1: Simulated / Test Mode when keys are still placeholders
  if (!isLive) {
    console.info('[EmailJS Test Mode] Sending contact email simulation:', params);
    await new Promise(r => setTimeout(r, 1000));
    return {
      success: true,
      message: 'Message sent successfully! (Test Mode — Add your real EmailJS keys to .env for live inbox delivery)',
      isLive: false,
    };
  }

  // Mode 2: Live Mode calling EmailJS API
  try {
    await emailjs.send(serviceId, templateId, params, publicKey);
    return {
      success: true,
      message: 'Your message has been sent successfully! We will respond shortly.',
      isLive: true,
    };
  } catch (error: any) {
    if (error?.status && typeof error.status === 'number') {
      const { code, message } = interpretEmailJSStatus(error.status, error.text ?? '');
      console.error(`[EmailJS Error] status=${error.status}`, error);
      throw new EmailJSError(code, message, `status ${error.status}: ${error.text}`);
    }

    if (error instanceof TypeError || error?.message?.includes('fetch')) {
      throw new EmailJSError(
        'NETWORK_ERROR',
        'Could not connect to EmailJS servers. Please check your internet connection.',
        error.message
      );
    }

    console.error('[EmailJS Unknown Error]', error);
    throw new EmailJSError(
      'UNKNOWN',
      error?.message || 'Failed to send message via EmailJS.',
      String(error)
    );
  }
};
