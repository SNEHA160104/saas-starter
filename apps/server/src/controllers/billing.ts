import { Request, Response, NextFunction } from 'express';
import { stripe } from '../utils/stripe';
import { Team } from '../models/Team';
import { User } from '../models/User';
import { AuditLog } from '../models/AuditLog';

// Helpers to map price IDs to plans (these would be ENV vars in real app)
const PLAN_MAP: Record<string, 'Free' | 'Pro' | 'Business'> = {
  price_free: 'Free',
  price_pro: 'Pro',
  price_business: 'Business',
};

export const checkout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { priceId, teamId } = req.body;
    const userId = (req as any).user.userId;

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    // Verify user is owner
    const member = team.members.find(m => m.userId.toString() === userId);
    if (!member || member.role !== 'Owner') {
      return res.status(403).json({ error: 'Only team owners can manage billing' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Create or use Stripe Customer
    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { userId: user.id },
      });
      customerId = customer.id;
      user.stripeCustomerId = customerId;
      await user.save();
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.CORS_ORIGIN}/billing?success=true`,
      cancel_url: `${process.env.CORS_ORIGIN}/billing?canceled=true`,
      client_reference_id: team.id,
      subscription_data: {
        metadata: {
          teamId: team.id,
        },
      },
    });

    res.json({ url: session.url });
  } catch (err) {
    next(err);
  }
};

export const portal = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;

    const user = await User.findById(userId);
    if (!user || !user.stripeCustomerId) {
      return res.status(400).json({ error: 'No billing account found for this user' });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${process.env.CORS_ORIGIN}/billing`,
    });

    res.json({ url: session.url });
  } catch (err) {
    next(err);
  }
};

export const webhook = async (req: Request, res: Response, next: NextFunction) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    // req.body must be raw string or buffer for stripe webhook verification
    event = stripe.webhooks.constructEvent(
      req.body,
      sig as string,
      process.env.STRIPE_WEBHOOK_SECRET || 'whsec_dummy'
    );
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any;
        const teamId = session.client_reference_id || session.subscription_data?.metadata?.teamId;
        const subscriptionId = session.subscription;

        if (teamId && subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          const priceId = subscription.items.data[0].price.id;
          const plan = PLAN_MAP[priceId] || 'Free';

          await Team.findByIdAndUpdate(teamId, {
            stripeSubscriptionId: subscriptionId,
            plan,
            subscriptionStatus: subscription.status,
          });

          await AuditLog.create({
            teamId,
            actorId: teamId, // System action, but linking to team for indexing
            action: 'billing.subscription_created',
            resource: 'subscription',
            resourceId: subscriptionId,
            meta: { plan, status: subscription.status },
          });
        }
        break;
      }
      case 'customer.subscription.updated': {
        const subscription = event.data.object as any;
        const teamId = subscription.metadata.teamId;

        if (teamId) {
          const priceId = subscription.items.data[0].price.id;
          const plan = PLAN_MAP[priceId] || 'Free';

          await Team.findByIdAndUpdate(teamId, {
            plan,
            subscriptionStatus: subscription.status,
          });
        }
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as any;
        const teamId = subscription.metadata.teamId;

        if (teamId) {
          await Team.findByIdAndUpdate(teamId, {
            plan: 'Free',
            subscriptionStatus: 'canceled',
            stripeSubscriptionId: null,
          });

          await AuditLog.create({
            teamId,
            actorId: teamId,
            action: 'billing.subscription_canceled',
            resource: 'subscription',
            resourceId: subscription.id,
          });
        }
        break;
      }
      case 'invoice.paid': {
        // Can be used to extend access or record payments
        break;
      }
      case 'invoice.payment_failed': {
        const invoice = event.data.object as any;
        const subscriptionId = invoice.subscription;
        
        if (subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId as string);
          const teamId = subscription.metadata.teamId;
          
          if (teamId) {
            await Team.findByIdAndUpdate(teamId, {
              subscriptionStatus: 'past_due',
            });
          }
        }
        break;
      }
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (err) {
    console.error('Error processing webhook', err);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
};
