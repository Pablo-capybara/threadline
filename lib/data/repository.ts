import "server-only";

import { CLIENTS, TEAM } from "./clients";
import type { ClientRow, TeamMember } from "./types";

/**
 * The only seam between the UI and storage. Pages call these functions;
 * components receive plain `ClientRow` / `TeamMember` props.
 *
 * To move to Supabase, implement `ClientRepository` with a query such as
 *   supabase.from("clients").select("*, owner:team_members(*)")
 * and return it from `getRepository()`. No component changes required.
 */
export interface ClientRepository {
  listClients(): Promise<ClientRow[]>;
  getClient(id: string): Promise<ClientRow | null>;
  listTeam(): Promise<TeamMember[]>;
}

/** Simulated latency so the loading skeleton is visible in development. */
const MOCK_LATENCY_MS = Number(process.env.MOCK_LATENCY_MS ?? 350);

const wait = () =>
  MOCK_LATENCY_MS > 0 ? new Promise((r) => setTimeout(r, MOCK_LATENCY_MS)) : Promise.resolve();

function withOwner(clientIndex: number): ClientRow {
  const client = CLIENTS[clientIndex];
  const owner = TEAM.find((m) => m.id === client.ownerId);
  if (!owner) throw new Error(`Unknown owner "${client.ownerId}" for client "${client.id}"`);
  return { ...client, owner };
}

const mockRepository: ClientRepository = {
  async listClients() {
    await wait();
    return CLIENTS.map((_, i) => withOwner(i));
  },
  async getClient(id) {
    await wait();
    const index = CLIENTS.findIndex((c) => c.id === id);
    return index === -1 ? null : withOwner(index);
  },
  async listTeam() {
    return TEAM;
  },
};

export function getRepository(): ClientRepository {
  return mockRepository;
}
