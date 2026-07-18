import nodemailer from "nodemailer";

const smtpUser = process.env.SMTP_USER ?? "sudheerkumaraitha@gmail.com";
const smtpPass = process.env.SMTP_PASS ?? "sani odct fggo aomc";

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: smtpUser,
    pass: smtpPass
  }
});

export async function sendEmail(input: {
  to: string;
  subject: string;
  html: string;
}): Promise<void> {
  console.log("DEBUG: Sending email via Gmail SMTP to:", input.to);
  try {
    await transporter.sendMail({
      from: `"Sudheer Kumar" <${smtpUser}>`,
      to: input.to,
      subject: input.subject,
      html: input.html
    });
    console.log("DEBUG: Email sent successfully via Gmail!");
  } catch (error) {
    console.error("🔥 ERROR: Gmail SMTP failed to send:", error);
  }
}
export const resend = null; // Maintained for client backwards compatibility
