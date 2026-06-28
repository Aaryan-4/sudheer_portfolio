import { certificationsRepository } from "@/features/certifications/certifications.repository";
import { CertificationsClient } from "@/components/marketing/certifications-client";

export const dynamic = "force-dynamic";

export default async function CertificationsPage() {
  const certifications = await certificationsRepository.listPublic().catch(() => []);

  return <CertificationsClient certifications={certifications} />;
}
