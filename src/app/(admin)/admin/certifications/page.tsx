import { certificationsRepository } from "@/features/certifications/certifications.repository";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminCertificationsList } from "@/components/layout/admin-certifications-list";

export const dynamic = "force-dynamic";

export default async function AdminCertificationsPage() {
  const certs = await certificationsRepository.listAdmin().catch(() => []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold">Certifications</h1>
        <Button asChild className="bg-coral text-white hover:bg-coral/90 rounded-full font-poppins">
          <Link href="/admin/certifications/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Certification
          </Link>
        </Button>
      </div>
      <AdminCertificationsList initialCertifications={certs} />
    </div>
  );
}
