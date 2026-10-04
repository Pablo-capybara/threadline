/**
 * Domain types shared by the data layer and the UI.
 * Dates are ISO calendar dates ("YYYY-MM-DD"), which map 1:1 onto a
 * Postgres `date` column when this moves to Supabase.
 */

export const STAGES = ["prospect", "proposal", "active", "renewal"] as const;
export type Stage = (typeof STAGES)[number];

export const STAGE_LABELS: Record<Stage, string> = {
  prospect: "Prospect",
  proposal: "Proposal",
  active: "Active",
  renewal: "Renewal",
};

export type AvatarColor = "teal" | "violet" | "blue" | "orange" | "pink";

export type TeamMember = {
  id: string;
  name: string;
  avatarUrl: string | null;
};

export type Client = {
  id: string;
  name: string;
  company: string;
  stage: Stage;
  avatarColor: AvatarColor;
  /** ISO date of the most recent touchpoint. */
  lastContactAt: string;
  /** ISO date the contract renews, or null when there is no contract yet. */
  renewalDate: string | null;
  ownerId: string;
  aiSummary: string;
};

/** A client joined with its owner, which is what list views render. */
export type ClientRow = Client & { owner: TeamMember };
