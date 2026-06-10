export function sanitizeText(value: string): string {
  return value.replace(/[<>]/g, "").trim();
}

export function sanitizeOptionalText(value?: string | null): string | undefined {
  if (!value) {
    return undefined;
  }

  return sanitizeText(value);
}
