import mongoose, { Document, Schema } from 'mongoose';

export interface IAuditLog extends Document {
  teamId: mongoose.Types.ObjectId;
  actorId: mongoose.Types.ObjectId;
  action: string;
  resource: string;
  resourceId?: string;
  meta?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const auditLogSchema = new Schema<IAuditLog>(
  {
    teamId: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
    actorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, required: true },
    resource: { type: String, required: true },
    resourceId: { type: String },
    meta: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

auditLogSchema.index({ teamId: 1, createdAt: -1 });

export const AuditLog = mongoose.model<IAuditLog>('AuditLog', auditLogSchema);
