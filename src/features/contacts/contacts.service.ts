import { contactSubmissionTemplate } from "@/lib/email/templates";
import { sendEmail } from "@/lib/email/resend";
import { assertRateLimit } from "@/lib/rate-limit/memory-rate-limit";
import { sanitizeText } from "@/lib/security/sanitize";
import { contactsRepository } from "./contacts.repository";
import { contactSchema, type ContactInput } from "./contacts.schemas";

export async function submitContact(input: ContactInput, meta: { ipAddress?: string; userAgent?: string }) {
  assertRateLimit(`contact:${meta.ipAddress ?? input.email}`, 5, 60_000);
  const data = contactSchema.parse({
    name: sanitizeText(input.name),
    email: input.email,
    subject: sanitizeText(input.subject),
    message: sanitizeText(input.message)
  });

  const message = await contactsRepository.create({ ...data, ...meta });

  await sendEmail({
    to: process.env.SMTP_USER ?? "sudheerkumaraitha@gmail.com",
    subject: `Portfolio contact: ${data.subject}`,
    html: contactSubmissionTemplate(data.name, data.message)
  });

  return message;
}
