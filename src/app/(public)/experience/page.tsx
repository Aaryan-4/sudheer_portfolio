import { SectionHeading } from "@/components/marketing/section-heading";

export default function ExperiencePage() {
  return (
    <main className="container py-14">
      <SectionHeading title="Experience" description="A timeline-ready page for professional background and achievements." />
      <ol className="max-w-3xl space-y-6 border-l pl-6">
        <li>
          <h2 className="font-semibold">Full-Stack Software Engineering</h2>
          <p className="text-muted-foreground">Building scalable web applications with clean architecture and secure data workflows.</p>
        </li>
        <li>
          <h2 className="font-semibold">Product-Oriented Delivery</h2>
          <p className="text-muted-foreground">Designing interfaces and systems around clear user workflows and measurable outcomes.</p>
        </li>
      </ol>
    </main>
  );
}
