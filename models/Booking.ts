import mongoose, { Schema, Document, Types } from 'mongoose';

export type PaymentStatus = 'unpaid' | 'partial' | 'paid';
export type BookingStatus = 'pending' | 'approved' | 'declined';

export interface IManagerInfo {
  name: string;
  contact?: string;
}

export interface IBooking extends Document {
  hallId: Types.ObjectId;
  ownerId: Types.ObjectId;
  eventDateTime: Date;
  customerName: string;
  customerContact?: string;
  // Payment fields (internal)
  grossAmount: number; // total amount customer paid/will pay (hidden from owner responses)
  commissionPercent: number; // stored for audit; do NOT expose to owner
  commissionAmount: number; // computed; do NOT expose to owner
  amountToOwner: number; // net amount owner should receive (exposed)
  ownerPaidAmount: number; // how much of owner share has been paid
  paymentStatus: PaymentStatus; // derived from ownerPaidAmount vs amountToOwner
  managerAssigned: boolean;
  manager?: IManagerInfo;
  status: BookingStatus;
  ownerDecisionRemark?: string;
  decisionAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ManagerSchema = new Schema<IManagerInfo>({
  name: { type: String, required: true },
  contact: { type: String },
}, { _id: false });

const BookingSchema = new Schema<IBooking>({
  hallId: { type: Schema.Types.ObjectId, ref: 'Hall', required: true },
  ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  eventDateTime: { type: Date, required: true },
  customerName: { type: String, required: true },
  customerContact: { type: String },
  grossAmount: { type: Number, required: true, min: 0 },
  commissionPercent: { type: Number, required: true, min: 0 },
  commissionAmount: { type: Number, required: true, min: 0 },
  amountToOwner: { type: Number, required: true, min: 0 },
  ownerPaidAmount: { type: Number, default: 0, min: 0 },
  paymentStatus: { type: String, enum: ['unpaid', 'partial', 'paid'], default: 'unpaid' },
  managerAssigned: { type: Boolean, default: false },
  manager: { type: ManagerSchema, default: undefined },
  status: { type: String, enum: ['pending', 'approved', 'declined'], default: 'pending' },
  ownerDecisionRemark: { type: String, default: undefined },
  decisionAt: { type: Date, default: undefined },
}, { timestamps: true });

BookingSchema.index({ ownerId: 1, hallId: 1, status: 1, eventDateTime: -1 });

export default mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);