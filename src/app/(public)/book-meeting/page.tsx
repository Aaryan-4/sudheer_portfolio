import { MeetingForm } from "@/components/forms/meeting-form";
import { SectionHeading } from "@/components/marketing/section-heading";

export default function BookMeetingPage() {
  return (
    <main className="container grid gap-10 py-14 lg:grid-cols-[0.8fr_1fr]">
      <SectionHeading title="Book a meeting" description="Request a time slot with approval workflow and calendar integration readiness." />
      <MeetingForm />
    </main>
  );
}
