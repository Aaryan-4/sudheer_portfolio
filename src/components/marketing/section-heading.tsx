export function SectionHeading({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-12 max-w-3xl font-poppins">
      <div className="mb-3 h-1 w-12 rounded bg-coral" />
      <h1 className="font-sora text-3xl font-extrabold tracking-tight text-navy dark:text-white sm:text-4xl">
        {title}
      </h1>
      {description ? (
        <p className="mt-3 font-sans text-base leading-relaxed text-zinc-500 dark:text-zinc-400">
          {description}
        </p>
      ) : null}
    </div>
  );
}
