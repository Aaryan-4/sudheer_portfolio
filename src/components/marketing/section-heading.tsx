export function SectionHeading({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-8 max-w-3xl">
      <h1 className="text-3xl font-semibold tracking-normal sm:text-4xl">{title}</h1>
      {description ? <p className="mt-3 text-muted-foreground">{description}</p> : null}
    </div>
  );
}
