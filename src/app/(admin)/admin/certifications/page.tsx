import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { certificationsRepository } from "@/features/certifications/certifications.repository";

export const dynamic = "force-dynamic";

export default async function AdminCertificationsPage() {
  const certifications = await certificationsRepository.listAdmin().catch(() => []);

  return (
    <div>
      <h1 className="mb-6 text-3xl font-semibold">Certifications</h1>
      <div className="grid gap-3">
        {certifications.map((certification) => (
          <Card key={certification.id}>
            <CardTitle>{certification.name}</CardTitle>
            <CardDescription>{certification.issuer}</CardDescription>
          </Card>
        ))}
      </div>
      {certifications.length === 0 ? <p className="text-muted-foreground">No certifications yet.</p> : null}
    </div>
  );
}
