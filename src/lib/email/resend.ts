import { Resend } from "resend";

export const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function sendEmail(input: {
  to: string;
  subject: string;
  html: string;
}): Promise<void> {
  // Add these two lines:
  console.log("DEBUG: Checking Resend Status...");
  console.log("DEBUG: RESEND_API_KEY is present:", !!process.env.RESEND_API_KEY);

  if (!resend) {
    console.error("🔥 ERROR: Resend object is null! API Key is missing from environment.");
    return;
  }
  
  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM ?? "Sudheer Portfolio <noreply@example.com>",
      to: input.to,
      subject: input.subject,
      html: input.html
    });
    console.log("DEBUG: Email sent successfully!");
  } catch (error) {
    console.error("🔥 ERROR: Resend failed to send:", error);
  }
}
