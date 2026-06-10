import { prisma } from "@/lib/db/prisma";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function AdminAuditLogsPage() {
  const logs = await prisma.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 50 }).catch(() => []);

  return (
    <div>
      <h1 className="mb-6 text-3xl font-semibold">Audit Logs</h1>
      <div className="grid gap-3">
        {logs.map((log) => (
          <Card key={log.id}>
            <CardTitle>{log.action}</CardTitle>
            <CardDescription>{log.message}</CardDescription>
          </Card>
        ))}
      </div>
      {logs.length === 0 ? <p className="text-muted-foreground">No audit logs yet.</p> : null}
    </div>
  );
}
