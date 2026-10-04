export function PlaceholderPage({ title, description }: { title: string; description?: string }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-1 p-6 text-center">
      <h1 className="text-title font-semibold text-foreground">{title}</h1>
      <p className="max-w-sm text-body text-muted-foreground text-pretty">
        {description ?? "This section isn't built yet."}
      </p>
    </div>
  );
}
