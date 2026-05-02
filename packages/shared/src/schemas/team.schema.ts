import { z } from 'zod';

export const TeamRoleSchema = z.enum(['Owner', 'Admin', 'Member']);
export type TeamRole = z.infer<typeof TeamRoleSchema>;

export const TeamMemberSchema = z.object({
  userId: z.string(),
  role: TeamRoleSchema,
});
export type TeamMember = z.infer<typeof TeamMemberSchema>;

export const TeamSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Team name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
  ownerId: z.string(),
  plan: z.enum(['Free', 'Pro', 'Business']).default('Free'),
  subscriptionStatus: z.string().optional(),
  stripeSubscriptionId: z.string().optional(),
  members: z.array(TeamMemberSchema).default([]),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type Team = z.infer<typeof TeamSchema>;

export const CreateTeamSchema = z.object({
  name: z.string().min(2, "Team name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
});

export type CreateTeam = z.infer<typeof CreateTeamSchema>;
