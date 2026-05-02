import mongoose, { Document, Schema } from 'mongoose';

export interface ITeamMember {
  userId: mongoose.Types.ObjectId;
  role: 'Owner' | 'Admin' | 'Member';
}

export interface ITeam extends Document {
  name: string;
  slug: string;
  ownerId: mongoose.Types.ObjectId;
  plan: 'Free' | 'Pro' | 'Business';
  subscriptionStatus?: string;
  stripeSubscriptionId?: string;
  members: ITeamMember[];
  createdAt: Date;
  updatedAt: Date;
}

const teamSchema = new Schema<ITeam>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    plan: { type: String, enum: ['Free', 'Pro', 'Business'], default: 'Free' },
    subscriptionStatus: { type: String },
    stripeSubscriptionId: { type: String },
    members: [
      {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        role: { type: String, enum: ['Owner', 'Admin', 'Member'], required: true },
      },
    ],
  },
  { timestamps: true }
);

// Indexes for faster lookups
teamSchema.index({ slug: 1 });
teamSchema.index({ 'members.userId': 1 });

export const Team = mongoose.model<ITeam>('Team', teamSchema);
