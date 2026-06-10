import { ContactForm } from "@/components/forms/contact-form";
import { SectionHeading } from "@/components/marketing/section-heading";

export default function ContactPage() {
  return (
    <main className="container grid gap-10 py-14 lg:grid-cols-[0.8fr_1fr]">
      <SectionHeading title="Contact" description="Send a secure message that appears in the admin contact manager." />
      <ContactForm />
    </main>
  );
}
