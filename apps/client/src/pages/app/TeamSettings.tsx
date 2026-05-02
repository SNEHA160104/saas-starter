import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/lib/api';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Loader2, UserMinus } from 'lucide-react';
import { z } from 'zod';

export default function TeamSettings() {
  const user = useAuthStore((state) => state.user);
  const setAuth = useAuthStore((state) => state.setAuth);
  const queryClient = useQueryClient();
  const [newTeamName, setNewTeamName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');

  // Fetch Team
  const { data: team, isLoading } = useQuery({
    queryKey: ['team', user?.currentTeamId],
    queryFn: async () => {
      if (!user?.currentTeamId) return null;
      const res = await api.get(`/teams/${user.currentTeamId}`);
      return res.data;
    },
    enabled: !!user?.currentTeamId,
  });

  // Create Team Mutation
  const createTeamMutation = useMutation({
    mutationFn: async (name: string) => {
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const res = await api.post('/teams', { name, slug });
      return res.data;
    },
    onSuccess: async (data) => {
      // Refresh user to get currentTeamId
      const meRes = await api.get('/auth/me');
      setAuth(meRes.data, useAuthStore.getState().accessToken as string);
      queryClient.invalidateQueries({ queryKey: ['team'] });
    }
  });

  // Invite Mutation
  const inviteMutation = useMutation({
    mutationFn: async (email: string) => {
      const res = await api.post(`/teams/${team._id}/invite`, { email, role: 'Member' });
      return res.data;
    },
    onSuccess: () => {
      setInviteEmail('');
      alert('Invite sent!');
    }
  });

  if (isLoading) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin" /></div>;

  if (!user?.currentTeamId || !team) {
    return (
      <div className="max-w-md mx-auto mt-12">
        <Card>
          <CardHeader>
            <CardTitle>Create a Team</CardTitle>
            <CardDescription>Get started by creating your first workspace.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Team Name</Label>
              <Input value={newTeamName} onChange={(e) => setNewTeamName(e.target.value)} placeholder="Acme Corp" />
            </div>
            <Button 
              className="w-full" 
              onClick={() => createTeamMutation.mutate(newTeamName)}
              disabled={createTeamMutation.isPending || !newTeamName}
            >
              {createTeamMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Create Team
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Team Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your workspace and members.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Team Profile</CardTitle>
          <CardDescription>Your team's basic information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 max-w-md">
          <div className="space-y-2">
            <Label>Team Name</Label>
            <Input value={team.name} readOnly className="bg-muted" />
          </div>
          <div className="space-y-2">
            <Label>Team URL Slug</Label>
            <Input value={team.slug} readOnly className="bg-muted" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Members</CardTitle>
          <CardDescription>Manage who has access to this team.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mb-6">
            {team.members.map((member: any) => (
              <div key={member.userId} className="flex items-center justify-between p-3 border border-border rounded-lg bg-background">
                <div>
                  <p className="font-medium">{member.userId === user.id ? 'You' : member.userId}</p>
                  <p className="text-xs text-muted-foreground">{member.role}</p>
                </div>
                {member.userId !== user.id && (
                  <Button variant="ghost" size="icon" className="text-destructive">
                    <UserMinus className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-border">
            <h4 className="font-semibold mb-4">Invite new member</h4>
            <div className="flex gap-2 max-w-md">
              <Input 
                placeholder="colleague@company.com" 
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
              <Button 
                onClick={() => inviteMutation.mutate(inviteEmail)}
                disabled={inviteMutation.isPending || !inviteEmail}
              >
                Send Invite
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
