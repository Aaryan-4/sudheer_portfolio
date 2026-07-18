export function contactSubmissionTemplate(name: string, message: string): string {
  return `<h1>New contact request</h1><p><strong>${name}</strong> sent a message.</p><p>${message}</p>`;
}

export function meetingStatusTemplate(status: string, details: string): string {
  return `<h1>Meeting ${status}</h1><p>${details}</p>`;
}

export function meetingApprovalTemplate(data: {
  clientName: string;
  date: string;
  time: string;
  duration: string;
  purpose: string;
  googleMeetUrl?: string;
}): string {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: radial-gradient(circle at 20% 30%, rgba(255, 107, 87, 0.1), transparent 50%), radial-gradient(circle at 80% 70%, rgba(59, 130, 246, 0.1), transparent 50%), #090D16; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 24px; color: #F3F4F6;">
      <div style="text-align: center; margin-bottom: 32px;">
        <h2 style="color: #FF6B57; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.02em;">Meeting Confirmed!</h2>
        <div style="width: 50px; height: 3px; background: linear-gradient(90deg, #FF6B57, #E11D48); margin: 12px auto 0 auto; border-radius: 10px;"></div>
      </div>
      <p style="font-size: 15px; line-height: 1.6; color: #E5E7EB;">Hi ${data.clientName},</p>
      <p style="font-size: 15px; line-height: 1.6; color: #9CA3AF;">Your meeting request with <strong>Sudheer Kumar</strong> has been approved. Here are your meeting details:</p>
      
      <div style="background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 16px; padding: 24px; margin: 24px 0;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; font-weight: 600; color: #FF6B57; width: 130px; font-size: 14px;">Date:</td>
            <td style="padding: 8px 0; color: #F3F4F6; font-size: 14px;">${data.date}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: 600; color: #FF6B57; font-size: 14px;">Time:</td>
            <td style="padding: 8px 0; color: #F3F4F6; font-size: 14px;">${data.time}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: 600; color: #FF6B57; font-size: 14px;">Duration:</td>
            <td style="padding: 8px 0; color: #F3F4F6; font-size: 14px;">${data.duration} minutes</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: 600; color: #FF6B57; font-size: 14px;">Purpose:</td>
            <td style="padding: 8px 0; color: #D1D5DB; font-size: 14px; font-style: italic;">"${data.purpose}"</td>
          </tr>
          ${data.googleMeetUrl ? `
          <tr>
            <td style="padding: 8px 0; font-weight: 600; color: #FF6B57; font-size: 14px;">Meeting Link:</td>
            <td style="padding: 8px 0; font-size: 14px;">
              <a href="${data.googleMeetUrl}" target="_blank" style="color: #FF6B57; text-decoration: underline; font-weight: bold;">
                Join Google Meet
              </a>
            </td>
          </tr>
          ` : ""}
        </table>
      </div>

      <p style="font-size: 12px; color: #6B7280; text-align: center; border-top: 1px solid rgba(255, 255, 255, 0.05); padding-top: 20px; margin-top: 32px;">
        Sent automatically by Sudheer's Portfolio Platform.
      </p>
    </div>
  `;
}

export function meetingDeclineTemplate(data: {
  clientName: string;
  date: string;
  time: string;
  purpose: string;
}): string {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #E5E7EB; border-radius: 16px; color: #1F2937;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h2 style="color: #0F2B5B; margin: 0; font-size: 22px;">Meeting Update</h2>
        <div style="width: 40px; height: 3px; background-color: #FF6B57; margin: 8px auto 0 auto; border-radius: 2px;"></div>
      </div>
      <p style="font-size: 15px; line-height: 1.6; color: #4B5563;">Hi ${data.clientName},</p>
      <p style="font-size: 15px; line-height: 1.6; color: #4B5563;">We wanted to let you know that your meeting request with <strong>Sudheer Kumar</strong> for ${data.date} at ${data.time} has been declined. Here were the requested details:</p>
      
      <div style="background-color: #F8FAFC; border: 1px solid #F1F5F9; border-radius: 12px; padding: 18px; margin: 20px 0;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 6px 0; font-weight: 600; color: #0F2B5B; width: 120px; font-size: 14px;">Date:</td>
            <td style="padding: 6px 0; color: #4B5563; font-size: 14px;">${data.date}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: 600; color: #0F2B5B; font-size: 14px;">Time:</td>
            <td style="padding: 6px 0; color: #4B5563; font-size: 14px;">${data.time}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: 600; color: #0F2B5B; font-size: 14px;">Purpose:</td>
            <td style="padding: 6px 0; color: #4B5563; font-size: 14px; font-style: italic;">"${data.purpose}"</td>
          </tr>
        </table>
      </div>

      <p style="font-size: 15px; line-height: 1.6; color: #4B5563;">Please feel free to request another time slot that fits your schedule on the website.</p>

      <p style="font-size: 13px; color: #9CA3AF; text-align: center; border-top: 1px solid #F1F5F9; padding-top: 14px; margin-top: 28px;">
        Sent automatically by Sudheer's Portfolio Platform.
      </p>
    </div>
  `;
}

