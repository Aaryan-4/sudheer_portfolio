"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function CertificationForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const certificationData = {
      name: String(formData.get("name")),
      issuer: String(formData.get("issuer")),
      issueDate: String(formData.get("issueDate")),
      expirationDate: String(formData.get("expirationDate") || "") || null,
      credentialUrl: String(formData.get("credentialUrl") || ""),
      certificateUrl: String(formData.get("certificateUrl") || ""),
      sortOrder: Number(formData.get("sortOrder") || 0)
    };

    try {
      const response = await fetch("/api/certifications", {
        method: "POST",
        body: JSON.stringify(certificationData),
        headers: { "Content-Type": "application/json" }
      });

      if (!response.ok) {
        const resData = await response.json().catch(() => ({}));
        throw new Error(resData.error?.message || "Failed to create certification.");
      }

      router.push("/admin/certifications");
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An error occurred.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 max-w-2xl bg-white p-8 border border-zinc-200/60 rounded-2xl shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      {error && (
        <div className="p-4 bg-destructive/10 text-destructive text-sm rounded-lg font-medium">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Certification Name</label>
          <Input name="name" placeholder="e.g. AWS Certified Solutions Architect" required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Issuer / Organization</label>
          <Input name="issuer" placeholder="e.g. Amazon Web Services" required />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Issue Date</label>
          <Input name="issueDate" type="date" required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Expiration Date (Optional)</label>
          <Input name="expirationDate" type="date" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Credential URL</label>
          <Input name="credentialUrl" type="url" placeholder="https://..." />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Certificate PDF/Image URL</label>
          <Input name="certificateUrl" type="url" placeholder="https://..." />
        </div>
      </div>

      <div className="space-y-2 max-w-xs">
        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Sort Order</label>
        <Input name="sortOrder" type="number" defaultValue="0" min="0" required />
      </div>

      <Button type="submit" disabled={loading} className="bg-coral text-white hover:bg-coral/90 rounded-full px-6 py-2 transition-all font-poppins">
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating...
          </>
        ) : (
          <>
            <Plus className="mr-2 h-4 w-4" />
            Add Certification
          </>
        )}
      </Button>
    </form>
  );
}
