export function contactSubmissionTemplate(name: string, message: string): string {
  return `<h1>New contact request</h1><p><strong>${name}</strong> sent a message.</p><p>${message}</p>`;
}

export function meetingStatusTemplate(status: string, details: string): string {
  return `<h1>Meeting ${status}</h1><p>${details}</p>`;
}
