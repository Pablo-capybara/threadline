import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 p-6 text-center">
      <h1 className="text-title font-semibold">Client not found</h1>
      <Link href="/clients" className="text-body text-muted-foreground underline underline-offset-4 hover:text-foreground">
        Back to all clients
      </Link>
    </div>
  );
}
