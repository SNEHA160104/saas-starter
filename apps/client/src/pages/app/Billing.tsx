import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { Check, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    description: 'Perfect for getting started and small side projects.',
    features: ['Up to 3 team members', 'Basic analytics', 'Community support'],
    priceId: 'price_free',
  },
  {
    name: 'Pro',
    price: '$29',
    description: 'For professionals and growing teams that need more power.',
    features: ['Up to 10 team members', 'Advanced analytics', 'Priority email support', 'Custom domain'],
    priceId: 'price_pro',
    popular: true,
  },
  {
    name: 'Business',
    price: '$99',
    description: 'For large teams and enterprises with advanced needs.',
    features: ['Unlimited team members', 'Custom reporting', '24/7 phone support', 'SSO & Advanced Security'],
    priceId: 'price_business',
  },
];

export default function Billing() {
  const [searchParams] = useSearchParams();
  const [alert, setAlert] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (searchParams.get('success')) {
      setAlert({ type: 'success', message: 'Subscription successfully updated! Thank you.' });
    }
    if (searchParams.get('canceled')) {
      setAlert({ type: 'error', message: 'Checkout was canceled. No changes were made.' });
    }
  }, [searchParams]);

  const { data: team, isLoading: isTeamLoading } = useQuery({
    queryKey: ['team', user?.currentTeamId],
    queryFn: async () => {
      if (!user?.currentTeamId) return null;
      const res = await api.get(`/teams/${user.currentTeamId}`);
      return res.data;
    },
    enabled: !!user?.currentTeamId,
  });

  const checkoutMutation = useMutation({
    mutationFn: async (priceId: string) => {
      const res = await api.post('/billing/checkout', { priceId, teamId: team._id });
      return res.data;
    },
    onSuccess: (data) => {
      window.location.href = data.url;
    },
    onError: () => {
      setAlert({ type: 'error', message: 'Failed to initiate checkout. Please try again later.' });
    }
  });

  const portalMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post('/billing/portal');
      return res.data;
    },
    onSuccess: (data) => {
      window.location.href = data.url;
    },
    onError: () => {
      setAlert({ type: 'error', message: 'Failed to access billing portal.' });
    }
  });

  if (isTeamLoading) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin" /></div>;

  if (!team) {
    return (
      <div className="text-center p-12 bg-card rounded-2xl border border-border">
        <h2 className="text-xl font-bold mb-2">Create a Team First</h2>
        <p className="text-muted-foreground mb-6">You need to create a team before you can manage billing.</p>
        <Button onClick={() => window.location.href = '/app/team'}>Go to Team Settings</Button>
      </div>
    );
  }

  const isOwner = team.members.find((m: any) => m.userId === user?.id)?.role === 'Owner';

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Billing & Plans</h1>
        <p className="text-muted-foreground mt-2">Manage your subscription and billing details.</p>
      </div>

      {alert && (
        <div className={`p-4 rounded-lg flex items-center gap-3 border ${alert.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400' : 'bg-destructive/10 border-destructive/20 text-destructive'}`}>
          {alert.type === 'success' ? <Sparkles className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="font-medium">{alert.message}</span>
        </div>
      )}

      <Card className="bg-card/50 backdrop-blur-md">
        <CardHeader>
          <CardTitle>Current Plan: <span className="text-primary">{team.plan}</span></CardTitle>
          <CardDescription>
            {team.subscriptionStatus === 'active' 
              ? 'Your subscription is active and in good standing.' 
              : 'You are currently on the free tier.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {team.stripeSubscriptionId && isOwner && (
            <Button variant="outline" onClick={() => portalMutation.mutate()} disabled={portalMutation.isPending}>
              {portalMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Manage Subscription (Stripe Portal)
            </Button>
          )}
          {!isOwner && (
            <p className="text-sm text-muted-foreground">Only the team owner can manage billing settings.</p>
          )}
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mt-8">
        {PLANS.map((plan) => (
          <div 
            key={plan.name} 
            className={`relative flex flex-col p-6 rounded-2xl bg-card border ${plan.popular ? 'border-primary shadow-xl shadow-primary/10' : 'border-border shadow-sm'} transition-all hover:shadow-lg`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-0 right-0 mx-auto w-fit px-3 py-1 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Most Popular
              </div>
            )}
            
            <div className="mb-6">
              <h3 className="text-xl font-bold">{plan.name}</h3>
              <p className="text-muted-foreground text-sm mt-2 h-10">{plan.description}</p>
            </div>
            
            <div className="mb-6">
              <span className="text-4xl font-bold">{plan.price}</span>
              <span className="text-muted-foreground">/mo</span>
            </div>
            
            <ul className="space-y-3 mb-8 flex-1">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm">
                  <Check className="w-5 h-5 text-green-500 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Button 
              variant={plan.popular ? 'default' : 'outline'} 
              className="w-full mt-auto"
              disabled={checkoutMutation.isPending || plan.name === team.plan || !isOwner}
              onClick={() => {
                if (plan.priceId !== 'price_free') {
                  checkoutMutation.mutate(plan.priceId);
                }
              }}
            >
              {checkoutMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              {plan.name === team.plan ? 'Current Plan' : (plan.priceId === 'price_free' ? 'Included' : 'Upgrade')}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
