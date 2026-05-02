import mongoose, { Document, Schema } from 'mongoose';

export interface IInvite extends Document {
  teamId: mongoose.Types.ObjectId;
  email: string;
  role: 'Owner' | 'Admin' | 'Member';
  token: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const inviteSchema = new Schema<IInvite>(
  {
    teamId: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    role: { type: String, enum: ['Owner', 'Admin', 'Member'], default: 'Member' },
    token: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

inviteSchema.index({ token: 1 });
inviteSchema.index({ teamId: 1, email: 1 });

export const Invite = mongoose.model<IInvite>('Invite', inviteSchema);
