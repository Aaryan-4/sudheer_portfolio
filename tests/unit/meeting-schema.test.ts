import { meetingRequestSchema } from "@/features/meetings/meetings.schemas";

describe("meetingRequestSchema", () => {
  it("accepts supported meeting durations", () => {
    const result = meetingRequestSchema.safeParse({
      fullName: "Visitor Name",
      email: "visitor@example.com",
      purpose: "Discussing a portfolio project collaboration.",
      preferredDate: "2026-07-01",
      preferredTime: "10:30",
      duration: "MINUTES_30"
    });

    expect(result.success).toBe(true);
  });
});
