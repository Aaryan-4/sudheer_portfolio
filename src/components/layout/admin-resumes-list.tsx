"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

interface Resume {
  id: string;
  version: number;
  fileName: string;
  secureUrl: string;
  status: string;
  downloadCount: number;
}

interface AdminResumesListProps {
  initialResumes: Resume[];
}

export function AdminResumesList({ initialResumes }: AdminResumesListProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this resume version?")) return;

    setDeletingId(id);
    try {
      const response = await fetch(`/api/resume/${id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error("Failed to delete resume");
      }

      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error deleting resume");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="font-poppins text-lg font-bold text-navy dark:text-white">Existing Versions</h2>
      <div className="grid gap-4">
        {initialResumes.map((resume) => (
          <Card key={resume.id} className="flex items-center justify-between p-6 border border-zinc-200 bg-white hover:shadow-md transition-all dark:border-zinc-800 dark:bg-zinc-950">
            <div>
              <CardTitle className="font-poppins text-lg font-bold text-navy dark:text-white">
                Version {resume.version} {resume.status === "ACTIVE" && (
                  <span className="ml-2 text-xs font-semibold text-white bg-green-500 px-2 py-0.5 rounded-full">
                    Active
                  </span>
                )}
              </CardTitle>
              <CardDescription className="mt-1 font-sans text-sm text-zinc-500">
                {resume.fileName} · Downloads: <span className="font-bold">{resume.downloadCount}</span>
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="text-zinc-500 hover:text-zinc-700"
                onClick={() => window.open(resume.secureUrl, "_blank")}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                disabled={deletingId === resume.id}
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={() => handleDelete(resume.id)}
              >
                {deletingId === resume.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          </Card>
        ))}
        {initialResumes.length === 0 && (
          <p className="text-zinc-500 dark:text-zinc-400 font-poppins">No resumes uploaded yet.</p>
        )}
      </div>
    </div>
  );
}
