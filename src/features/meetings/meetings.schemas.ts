import { z } from "zod";

export const meetingRequestSchema = z.object({
  fullName: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().max(40).optional(),
  company: z.string().max(160).optional(),
  purpose: z.string().min(10).max(2000),
  preferredDate: z.coerce.date(),
  preferredTime: z.string().regex(/^\d{2}:\d{2}$/),
  duration: z.enum(["MINUTES_15", "MINUTES_30", "MINUTES_45", "MINUTES_60"])
});

export type MeetingRequestInput = z.infer<typeof meetingRequestSchema>;
