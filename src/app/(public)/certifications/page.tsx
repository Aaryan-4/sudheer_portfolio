import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { SectionHeading } from "@/components/marketing/section-heading";
import { certificationsRepository } from "@/features/certifications/certifications.repository";

export const dynamic = "force-dynamic";

export default async function CertificationsPage() {
  const certifications = await certificationsRepository.listPublic().catch(() => []);

  return (
    <main className="container py-14">
      <SectionHeading title="Certifications" description="Verified professional learning, credentials, and uploaded certificates." />
      <div className="grid gap-4 md:grid-cols-2">
        {certifications.map((certification) => (
          <Card key={certification.id}>
            <CardTitle>{certification.name}</CardTitle>
            <CardDescription className="mt-2">{certification.issuer}</CardDescription>
          </Card>
        ))}
      </div>
      {certifications.length === 0 ? <p className="text-muted-foreground">No certifications have been added yet.</p> : null}
    </main>
  );
}
