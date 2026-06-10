import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { SectionHeading } from "@/components/marketing/section-heading";

const skills = ["Next.js", "React", "TypeScript", "PostgreSQL", "Prisma", "Security", "DevOps", "Product Design"];

export default function SkillsPage() {
  return (
    <main className="container py-14">
      <SectionHeading title="Skills" description="Technical capabilities grouped around modern product engineering." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {skills.map((skill) => (
          <Card key={skill}>
            <CardTitle>{skill}</CardTitle>
            <CardDescription className="mt-2">Applied in production-style portfolio workflows.</CardDescription>
          </Card>
        ))}
      </div>
    </main>
  );
}
