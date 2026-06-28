"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

interface Certification {
  id: string;
  name: string;
  issuer: string;
  credentialUrl: string | null;
}

interface AdminCertificationsListProps {
  initialCertifications: Certification[];
}

export function AdminCertificationsList({ initialCertifications }: AdminCertificationsListProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this certification?")) return;

    setDeletingId(id);
    try {
      const response = await fetch(`/api/certifications/${id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error("Failed to delete certification");
      }

      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error deleting certification");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="grid gap-4">
      {initialCertifications.map((cert) => (
        <Card key={cert.id} className="flex items-center justify-between p-6 border border-zinc-200 bg-white hover:shadow-md transition-all dark:border-zinc-800 dark:bg-zinc-950">
          <div>
            <CardTitle className="font-poppins text-lg font-bold text-navy dark:text-white">
              {cert.name}
            </CardTitle>
            <CardDescription className="mt-1 font-sans text-sm text-zinc-500">
              {cert.issuer}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {cert.credentialUrl && (
              <Button
                variant="outline"
                size="icon"
                className="text-zinc-500 hover:text-zinc-700"
                onClick={() => window.open(cert.credentialUrl!, "_blank")}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              disabled={deletingId === cert.id}
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => handleDelete(cert.id)}
            >
              {deletingId === cert.id ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </Button>
          </div>
        </Card>
      ))}
      {initialCertifications.length === 0 && (
        <p className="text-zinc-500 dark:text-zinc-400 font-poppins">No certifications added yet.</p>
      )}
    </div>
  );
}
