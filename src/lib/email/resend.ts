import { Resend } from "resend";

export const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function sendEmail(input: {
  to: string;
  subject: string;
  html: string;
}): Promise<void> {
  if (!resend) {
    return;
  }

  await resend.emails.send({
    from: process.env.EMAIL_FROM ?? "Sudheer Portfolio <noreply@example.com>",
    to: input.to,
    subject: input.subject,
    html: input.html
  });
}
