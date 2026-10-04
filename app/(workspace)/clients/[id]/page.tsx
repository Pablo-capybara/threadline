import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { SparkleIcon } from "@/components/icons";
import { ClientAvatar, OwnerBadge, StageBadge } from "@/components/clients/primitives";
import { getRepository } from "@/lib/data/repository";
import { formatDate } from "@/lib/date";

type Params = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Params) {
  const client = await getRepository().getClient((await params).id);
  return { title: `${client?.name ?? "Client"} · Threadline` };
}

export default async function ClientPage({ params }: Params) {
  const client = await getRepository().getClient((await params).id);
  if (!client) notFound();

  return (
    <div className="flex flex-col gap-6 p-6">
      <Link
        href="/clients"
        className="flex w-fit items-center gap-1.5 rounded-xs text-body text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" strokeWidth={1.75} />
        All clients
      </Link>

      <header className="flex items-center gap-3">
        <ClientAvatar name={client.name} color={client.avatarColor} className="size-10 rounded-sm text-body" />
        <div className="flex flex-col gap-0.5">
          <h1 className="text-title font-semibold text-foreground">{client.name}</h1>
          <p className="text-body text-muted-foreground">{client.company}</p>
        </div>
        <div className="ml-2">
          <StageBadge stage={client.stage} />
        </div>
      </header>

      <dl className="grid max-w-xl grid-cols-[140px_1fr] gap-x-4 gap-y-3 text-body">
        <dt className="text-muted-foreground">Owner</dt>
        <dd><OwnerBadge owner={client.owner} /></dd>
        <dt className="text-muted-foreground">Last contact</dt>
        <dd className="tabular-nums">{formatDate(client.lastContactAt)}</dd>
        <dt className="text-muted-foreground">Renewal date</dt>
        <dd className="tabular-nums">{client.renewalDate ? formatDate(client.renewalDate) : "—"}</dd>
        <dt className="text-muted-foreground">AI summary</dt>
        <dd className="flex items-center gap-1.5">
          <SparkleIcon width={12} height={12} className="shrink-0 text-ai" />
          {client.aiSummary}
        </dd>
      </dl>

      <p className="text-body text-subtle-foreground">
        The full client timeline (notes, tasks, emails) will live here.
      </p>
    </div>
  );
}
