"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X, Trash2, Loader2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

interface Meeting {
  id: string;
  fullName: string;
  email: string;
  preferredDate: Date | string;
  preferredTime: string;
  duration: string;
  purpose: string;
  status: string;
  googleMeetUrl: string | null;
}

interface AdminMeetingsListProps {
  initialMeetings: Meeting[];
}

export function AdminMeetingsList({ initialMeetings }: AdminMeetingsListProps) {
  const router = useRouter();
  const [actionId, setActionId] = useState<string | null>(null);

  async function handleApprove(id: string) {
    if (!confirm("Are you sure you want to approve this meeting?")) return;
    setActionId(id);
    try {
      const response = await fetch(`/api/meetings/${id}/approve`, {
        method: "POST"
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error?.message || "Failed to approve meeting.");
      }
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error approving meeting");
    } finally {
      setActionId(null);
    }
  }

  async function handleReject(id: string) {
    if (!confirm("Are you sure you want to decline this meeting?")) return;
    setActionId(id);
    try {
      const response = await fetch(`/api/meetings/${id}/reject`, {
        method: "POST"
      });
      if (!response.ok) {
        throw new Error("Failed to decline meeting.");
      }
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error declining meeting");
    } finally {
      setActionId(null);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this meeting record permanently?")) return;
    setActionId(id);
    try {
      const response = await fetch(`/api/meetings/${id}`, {
        method: "DELETE"
      });
      if (!response.ok) {
        throw new Error("Failed to delete meeting.");
      }
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error deleting meeting");
    } finally {
      setActionId(null);
    }
  }

  return (
    <div className="grid gap-4">
      {initialMeetings.map((meeting) => {
        const formattedDate = new Date(meeting.preferredDate).toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "numeric"
        });

        return (
          <Card key={meeting.id} className="p-6 border border-zinc-200 bg-white hover:shadow-md transition-all dark:border-zinc-800 dark:bg-zinc-950 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
              <div>
                <CardTitle className="font-poppins text-lg font-bold text-navy dark:text-white flex items-center gap-2 flex-wrap">
                  {meeting.fullName}
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                    meeting.status === "APPROVED"
                      ? "bg-green-100 text-green-800 dark:bg-green-950/30 dark:text-green-400"
                      : meeting.status === "CANCELLED"
                      ? "bg-red-100 text-red-800 dark:bg-red-950/30 dark:text-red-400"
                      : "bg-amber-100 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400"
                  }`}>
                    {meeting.status}
                  </span>
                </CardTitle>
                <CardDescription className="mt-1 font-sans text-sm text-zinc-500">
                  {meeting.email}
                </CardDescription>
              </div>

              <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-100 dark:border-zinc-800">
                <Calendar className="h-4 w-4 text-coral" />
                <span>{formattedDate} at {meeting.preferredTime} ({meeting.duration.replace("MINUTES_", "")} min)</span>
              </div>
            </div>

            <div className="bg-zinc-50 dark:bg-zinc-900/60 p-3 rounded-lg border border-zinc-100 dark:border-zinc-800/80 text-sm">
              <span className="font-semibold text-navy dark:text-white block mb-1">Purpose:</span>
              <p className="text-zinc-600 dark:text-zinc-400 italic">&ldquo;{meeting.purpose}&rdquo;</p>
            </div>

            {meeting.googleMeetUrl && (
              <div className="text-sm">
                <span className="font-semibold text-navy dark:text-white">Meet URL: </span>
                <a href={meeting.googleMeetUrl} target="_blank" rel="noreferrer" className="text-coral hover:underline break-all font-mono">
                  {meeting.googleMeetUrl}
                </a>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
              <div className="flex items-center gap-2">
                {meeting.status === "PENDING" && (
                  <>
                    <Button
                      size="sm"
                      onClick={() => handleApprove(meeting.id)}
                      disabled={actionId !== null}
                      className="bg-green-600 hover:bg-green-700 text-white rounded-full px-4"
                    >
                      {actionId === meeting.id ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-1" />
                      ) : (
                        <Check className="h-4 w-4 mr-1" />
                      )}
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleReject(meeting.id)}
                      disabled={actionId !== null}
                      className="border-zinc-200 text-zinc-700 hover:bg-zinc-50 rounded-full px-4 dark:border-zinc-800 dark:text-zinc-300"
                    >
                      {actionId === meeting.id ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-1" />
                      ) : (
                        <X className="h-4 w-4 mr-1" />
                      )}
                      Decline
                    </Button>
                  </>
                )}
              </div>

              <Button
                size="icon"
                variant="ghost"
                disabled={actionId !== null}
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={() => handleDelete(meeting.id)}
              >
                {actionId === meeting.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          </Card>
        );
      })}
      {initialMeetings.length === 0 && (
        <p className="text-zinc-500 dark:text-zinc-400 font-poppins">No meeting requests yet.</p>
      )}
    </div>
  );
}
