"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, Loader2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ResumeUploadForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [error, setError] = useState("");
  const [file, setFile] = useState<File | null>(null);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
      setError("");
    }
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!file) {
      setError("Please select a PDF file first.");
      return;
    }

    setLoading(true);
    setError("");
    setStatusText("Requesting Cloudinary upload signature...");

    const formData = new FormData(event.currentTarget);
    const version = Number(formData.get("version"));

    try {
      // 1. Get signed signature from API
      const sigResponse = await fetch("/api/upload", {
        method: "POST",
        body: JSON.stringify({ folder: "resumes" }),
        headers: { "Content-Type": "application/json" }
      });

      if (!sigResponse.ok) {
        const errData = await sigResponse.json().catch(() => ({}));
        throw new Error(errData.error?.message || "Failed to get upload signature.");
      }

      const { data: sigData } = await sigResponse.json();

      // 2. Upload directly to Cloudinary
      setStatusText("Uploading PDF to Cloudinary...");
      const cloudFormData = new FormData();
      cloudFormData.append("file", file);
      cloudFormData.append("api_key", sigData.apiKey);
      cloudFormData.append("timestamp", String(sigData.timestamp));
      cloudFormData.append("signature", sigData.signature);
      cloudFormData.append("folder", sigData.folder);

      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${sigData.cloudName}/auto/upload`;
      const cloudResponse = await fetch(cloudinaryUrl, {
        method: "POST",
        body: cloudFormData
      });

      if (!cloudResponse.ok) {
        const cloudErr = await cloudResponse.json().catch(() => ({}));
        throw new Error(cloudErr.error?.message || "Cloudinary upload failed.");
      }

      const cloudData = await cloudResponse.json();

      // 3. Register resume in our database
      setStatusText("Saving resume version details...");
      const resumeData = {
        version,
        fileName: file.name,
        fileUrl: cloudData.url,
        secureUrl: cloudData.secure_url,
        publicId: cloudData.public_id,
        mimeType: file.type || "application/pdf",
        sizeBytes: cloudData.bytes,
        status: "ACTIVE"
      };

      const saveResponse = await fetch("/api/resume", {
        method: "POST",
        body: JSON.stringify(resumeData),
        headers: { "Content-Type": "application/json" }
      });

      if (!saveResponse.ok) {
        const saveErr = await saveResponse.json().catch(() => ({}));
        throw new Error(saveErr.error?.message || "Failed to save resume details in database.");
      }

      setStatusText("");
      setFile(null);
      // Reset file input
      const fileInput = document.getElementById("resume-file-input") as HTMLInputElement;
      if (fileInput) fileInput.value = "";

      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An error occurred.";
      setError(message);
      setStatusText("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="bg-white p-6 border border-zinc-200/60 rounded-2xl shadow-sm dark:border-zinc-800 dark:bg-zinc-950 space-y-6">
      <h2 className="font-poppins text-lg font-bold text-navy dark:text-white">Upload New Resume</h2>

      {error && (
        <div className="p-4 bg-destructive/10 text-destructive text-sm rounded-lg font-medium">
          {error}
        </div>
      )}

      {statusText && (
        <div className="p-4 bg-blue-50 text-blue-700 text-sm rounded-lg font-medium flex items-center gap-2 dark:bg-blue-950/20 dark:text-blue-400">
          <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
          {statusText}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Resume Version</label>
          <Input name="version" type="number" placeholder="e.g. 1" min="1" required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Select PDF File</label>
          <div className="relative">
            <Input
              id="resume-file-input"
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              required
              className="pr-10"
            />
            {file && (
              <FileText className="absolute right-3 top-2.5 h-5 w-5 text-zinc-400" />
            )}
          </div>
        </div>
      </div>

      <Button type="submit" disabled={loading} className="bg-coral text-white hover:bg-coral/90 rounded-full px-6 py-2 transition-all font-poppins">
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            Upload PDF
          </>
        )}
      </Button>
    </form>
  );
}
