import { SectionHeading } from "@/components/marketing/section-heading";

export default function AboutPage() {
  return (
    <main className="container py-14">
      <SectionHeading title="About Sudheer" description="A focused profile for engineering, product thinking, and delivery discipline." />
      <div className="max-w-3xl space-y-4 text-muted-foreground">
        <p>
          Sudheer Kumar is presented through this platform as a full-stack software professional with emphasis on clean architecture,
          reliable delivery, secure systems, and polished user experiences.
        </p>
        <p>
          The platform is designed to evolve from a personal portfolio into a small SaaS-style operating system for content, scheduling,
          analytics, resume distribution, and professional communication.
        </p>
      </div>
    </main>
  );
}
