import { contactSchema } from "@/features/contacts/contacts.schemas";

describe("contactSchema", () => {
  it("accepts a valid contact payload", () => {
    const result = contactSchema.safeParse({
      name: "Visitor",
      email: "visitor@example.com",
      subject: "Project inquiry",
      message: "I would like to discuss a project with you."
    });

    expect(result.success).toBe(true);
  });

  it("rejects invalid email addresses", () => {
    const result = contactSchema.safeParse({
      name: "Visitor",
      email: "invalid",
      subject: "Project inquiry",
      message: "I would like to discuss a project with you."
    });

    expect(result.success).toBe(false);
  });
});
