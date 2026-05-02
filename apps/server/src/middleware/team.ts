import { Request, Response, NextFunction } from 'express';
import { Team } from '../models/Team';

const roleHierarchy = {
  Owner: 3,
  Admin: 2,
  Member: 1,
};

export const requireTeamAndRole = (minRole: 'Owner' | 'Admin' | 'Member') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user?.userId;
      // We expect teamId to be in route params (e.g., /api/teams/:id) or query, but typically params.
      const teamId = req.params.id || req.headers['x-team-id'] || req.body.teamId;

      if (!userId || !teamId) {
        return res.status(400).json({ error: 'User ID and Team ID are required' });
      }

      const team = await Team.findById(teamId);
      if (!team) {
        return res.status(404).json({ error: 'Team not found' });
      }

      const member = team.members.find((m) => m.userId.toString() === userId);
      if (!member) {
        return res.status(403).json({ error: 'Forbidden: You are not a member of this team' });
      }

      if (roleHierarchy[member.role] < roleHierarchy[minRole]) {
        return res.status(403).json({ error: `Forbidden: Requires ${minRole} role` });
      }

      // Inject team and member role into req for downstream use
      (req as any).team = team;
      (req as any).memberRole = member.role;

      next();
    } catch (err) {
      next(err);
    }
  };
};
