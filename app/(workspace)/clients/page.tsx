import { ClientsView } from "@/components/clients/clients-view";
import { getRepository } from "@/lib/data/repository";
import { getToday } from "@/lib/date";

export const metadata = { title: "Clients · Threadline" };

export default async function ClientsPage() {
  const repo = getRepository();
  const [clients, team] = await Promise.all([repo.listClients(), repo.listTeam()]);
  return <ClientsView clients={clients} team={team} today={getToday()} />;
}
