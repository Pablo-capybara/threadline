import { STAGES, type Stage, type TeamMember } from "@/lib/data/types";

import type { ClientFilter } from "./filters";

/**
 * Local, rule-based stand-in for "Ask Threadline". Understands:
 *   - renewals this month / due this month
 *   - renewals in the next N days|weeks, renewals due soon
 *   - stage = X, X stage, "prospects", "in renewal", "active clients"
 *   - owner = X, owned by X, X's clients, assigned to X
 *   - no contact in N days|weeks, not contacted for N days, gone quiet
 * Several intents in one query combine (AND). Anything unrecognised becomes
 * a text search so the user always gets a result.
 */
export type AskResult = { filters: ClientFilter[]; understood: boolean };

const NUMBER_WORDS: Record<string, number> = {
  a: 1, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7,
  eight: 8, nine: 9, ten: 10, fourteen: 14, thirty: 30, sixty: 60, ninety: 90,
};

const NUM = String.raw`(\d+|${Object.keys(NUMBER_WORDS).join("|")})`;
const UNIT = String.raw`(days?|d|weeks?|wks?|w|months?)`;

function toDays(amount: string, unit: string): number {
  const n = Number(amount) || NUMBER_WORDS[amount] || 0;
  if (unit.startsWith("w")) return n * 7;
  if (unit.startsWith("m")) return n * 30;
  return n;
}

const STAGE_PATTERNS: Record<Stage, RegExp> = {
  prospect: /\bprospects?\b/,
  proposal: /\bproposals?\b/,
  active: /\bactive\b/,
  // "renewal" is ambiguous: "renewals this month" is about the date, so only
  // treat it as a stage when the query says so explicitly.
  renewal: /\b(stage\s*(?:=|:|is)?\s*renewal|renewal\s+stage|in\s+renewal)\b/,
};

export function parseAsk(input: string, team: TeamMember[]): AskResult {
  const text = input.toLowerCase().trim().replace(/\s+/g, " ");
  if (!text) return { filters: [], understood: false };

  const filters: ClientFilter[] = [];

  // Renewal timing
  const renewalTopic = /\brenew/.test(text);
  if (renewalTopic && /\bthis month\b/.test(text)) {
    filters.push({ kind: "renewal-this-month" });
  } else if (renewalTopic) {
    const within = text.match(new RegExp(String.raw`\b(?:next|within|in)\s+${NUM}\s*${UNIT}\b`));
    if (within) filters.push({ kind: "renewal-within", days: toDays(within[1], within[2]) });
    else if (/\b(soon|upcoming|coming up|next month)\b/.test(text))
      filters.push({ kind: "renewal-within", days: 30 });
  }

  // Stage
  const explicitStage = text.match(/\bstage\s*(?:=|:|is)?\s*(\w+)/);
  const stageFromExplicit = STAGES.find((s) => explicitStage?.[1]?.startsWith(s));
  const stage = stageFromExplicit ?? STAGES.find((s) => STAGE_PATTERNS[s].test(text));
  if (stage) filters.push({ kind: "stage", stage });

  // Owner: a teammate's full name, or their first name next to an ownership
  // cue ("owner = sarah", "owned by sarah", "sarah's"). A bare first name is
  // not enough because clients can share first names with teammates.
  const owner = team.find((member) => {
    const full = member.name.toLowerCase();
    const first = full.split(" ")[0];
    const cue = String.raw`(?:owner\s*(?:=|:|is)?|owned by|assigned to|managed by|for)`;
    return (
      new RegExp(String.raw`\b${full}\b`).test(text) ||
      new RegExp(String.raw`\b${cue}\s+${first}\b`).test(text) ||
      new RegExp(String.raw`\b${first}'s\b`).test(text)
    );
  });
  if (owner) filters.push({ kind: "owner", ownerId: owner.id });

  // Contact recency
  const noContact = text.match(
    new RegExp(
      String.raw`\b(?:no (?:contact|touch(?:point)?|reply|response)|not (?:contacted|touched|heard from)|haven'?t (?:heard from|contacted|talked to)|quiet)\b.*?\b(?:in|for|over|past|last)?\s*${NUM}\s*${UNIT}\b`,
    ),
  );
  if (noContact) filters.push({ kind: "no-contact", days: toDays(noContact[1], noContact[2]) });
  else if (/\b(gone quiet|going cold|stale|neglected)\b/.test(text))
    filters.push({ kind: "no-contact", days: 14 });

  if (filters.length > 0) return { filters, understood: true };
  return { filters: [{ kind: "text", query: input.trim() }], understood: false };
}

export const ASK_EXAMPLES = [
  "Show renewals due this month",
  "Renewals in the next 60 days",
  "Prospects owned by Sarah",
  "No contact in 7 days",
  "Stage = proposal",
];
