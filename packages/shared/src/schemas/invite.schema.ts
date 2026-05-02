import { z } from 'zod';
import { TeamRoleSchema } from './team.schema';

export const InviteSchema = z.object({
  id: z.string().optional(),
  teamId: z.string(),
  email: z.string().email(),
  role: TeamRoleSchema,
  token: z.string(),
  expiresAt: z.date(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type Invite = z.infer<typeof InviteSchema>;

export const CreateInviteSchema = z.object({
  email: z.string().email("Invalid email address"),
  role: TeamRoleSchema.default('Member'),
});

export type CreateInvite = z.infer<typeof CreateInviteSchema>;
