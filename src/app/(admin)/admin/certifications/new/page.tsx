import { CertificationForm } from "@/components/forms/certification-form";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewCertificationPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/certifications"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-3xl font-semibold">New Certification</h1>
      </div>
      <CertificationForm />
    </div>
  );
}
