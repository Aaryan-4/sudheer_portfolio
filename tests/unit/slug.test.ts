import { toSlug } from "@/lib/utils/slug";

describe("toSlug", () => {
  it("normalizes a title into a route-safe slug", () => {
    expect(toSlug("My Production Project!")).toBe("my-production-project");
  });
});
