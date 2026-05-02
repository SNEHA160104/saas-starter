import { useAuthStore } from '@/store/authStore';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function Dashboard() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Welcome back, {user?.email}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Free</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">Active</div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
            <CardDescription>Get started with your new workspace</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!user?.currentTeamId ? (
              <div className="p-4 bg-background rounded-lg border border-border flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">Create a Team</h4>
                  <p className="text-sm text-muted-foreground">You need a team to invite members and manage billing.</p>
                </div>
                <Button onClick={() => window.location.href = '/app/team'}>Setup Team</Button>
              </div>
            ) : (
              <div className="p-4 bg-background rounded-lg border border-border flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">Invite Members</h4>
                  <p className="text-sm text-muted-foreground">Grow your workspace by inviting your team.</p>
                </div>
                <Button variant="outline" onClick={() => window.location.href = '/app/team'}>Manage Team</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
