import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { contactsRepository } from "@/features/contacts/contacts.repository";

export const dynamic = "force-dynamic";

export default async function AdminContactsPage() {
  const messages = await contactsRepository.list().catch(() => []);

  return (
    <div>
      <h1 className="mb-6 text-3xl font-semibold">Contacts</h1>
      <div className="grid gap-3">
        {messages.map((message) => (
          <Card key={message.id}>
            <CardTitle>{message.subject}</CardTitle>
            <CardDescription>{message.email}</CardDescription>
          </Card>
        ))}
      </div>
      {messages.length === 0 ? <p className="text-muted-foreground">No messages yet.</p> : null}
    </div>
  );
}
