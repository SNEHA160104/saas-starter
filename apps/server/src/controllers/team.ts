import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { Team } from '../models/Team';
import { User } from '../models/User';
import { Invite } from '../models/Invite';
import { AuditLog } from '../models/AuditLog';
import { sendEmail } from '../utils/mailer';
import { CreateTeamSchema, CreateInviteSchema } from 'shared';
import mongoose from 'mongoose';

export const createTeam = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = CreateTeamSchema.parse(req.body);
    const userId = (req as any).user.userId;

    // Check if slug is taken
    const existingTeam = await Team.findOne({ slug: validatedData.slug });
    if (existingTeam) {
      return res.status(409).json({ error: 'Team slug is already taken' });
    }

    const team = new Team({
      name: validatedData.name,
      slug: validatedData.slug,
      ownerId: userId,
      members: [{ userId, role: 'Owner' }],
    });

    await team.save();

    // Update user's currentTeamId if they don't have one
    const user = await User.findById(userId);
    if (user && !user.currentTeamId) {
      user.currentTeamId = team.id;
      await user.save();
    }

    // Audit Log
    await AuditLog.create({
      teamId: team.id,
      actorId: userId,
      action: 'team.created',
      resource: 'team',
      resourceId: team.id,
    });

    res.status(201).json(team);
  } catch (err) {
    next(err);
  }
};

export const getTeam = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // team is injected by requireTeamAndRole middleware
    const team = (req as any).team;
    res.json(team);
  } catch (err) {
    next(err);
  }
};

export const inviteMember = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teamId = req.params.id;
    const actorId = (req as any).user.userId;
    const team = (req as any).team;
    const validatedData = CreateInviteSchema.parse(req.body);

    // Ensure member isn't already in the team
    const existingUser = await User.findOne({ email: validatedData.email });
    if (existingUser) {
      const isMember = team.members.some((m: any) => m.userId.toString() === existingUser.id);
      if (isMember) {
        return res.status(409).json({ error: 'User is already a member of this team' });
      }
    }

    const token = crypto.randomBytes(32).toString('hex');

    const invite = new Invite({
      teamId,
      email: validatedData.email,
      role: validatedData.role,
      token,
      expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48 hours
    });

    await invite.save();

    const inviteUrl = `${process.env.CORS_ORIGIN}/invite?token=${token}`;
    await sendEmail(
      validatedData.email,
      `You've been invited to join ${team.name}`,
      `You have been invited to join ${team.name} as a ${validatedData.role}. Click here to accept: <a href="${inviteUrl}">${inviteUrl}</a>`
    );

    await AuditLog.create({
      teamId,
      actorId,
      action: 'invite.created',
      resource: 'invite',
      resourceId: invite.id,
      meta: { email: validatedData.email, role: validatedData.role },
    });

    res.status(201).json({ message: 'Invite sent successfully' });
  } catch (err) {
    next(err);
  }
};

export const removeMember = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teamId = req.params.id;
    const targetUserId = req.params.uid;
    const actorId = (req as any).user.userId;
    const actorRole = (req as any).memberRole;
    const team = (req as any).team;

    if (actorId === targetUserId) {
      return res.status(400).json({ error: 'You cannot remove yourself using this endpoint. Use leave team.' });
    }

    const targetMember = team.members.find((m: any) => m.userId.toString() === targetUserId);
    if (!targetMember) {
      return res.status(404).json({ error: 'Member not found in team' });
    }

    // Role hierarchy rules for removal
    const roleHierarchy = { Owner: 3, Admin: 2, Member: 1 };
    if (roleHierarchy[actorRole as keyof typeof roleHierarchy] <= roleHierarchy[targetMember.role as keyof typeof roleHierarchy]) {
      return res.status(403).json({ error: 'You do not have permission to remove this member' });
    }

    team.members = team.members.filter((m: any) => m.userId.toString() !== targetUserId);
    await team.save();

    await AuditLog.create({
      teamId,
      actorId,
      action: 'member.removed',
      resource: 'user',
      resourceId: targetUserId,
    });

    res.json({ message: 'Member removed successfully' });
  } catch (err) {
    next(err);
  }
};
