import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IHall extends Document {
  name: string;
  description: string;
  images: string[];
  price: number;
  capacity: number;
  amenities: string[];
  featured?: boolean;
  verified?: boolean;
  location: {
    address: string;
    city: string;
    state: string;
    pincode: string;
    coordinates: {
      type: 'Point';
      coordinates: [number, number];
    };
  };
  ownerId: Types.ObjectId;
  status: 'pending' | 'active' | 'inactive';

  availability: Array<{
    date: Date;
    isAvailable: boolean;
  }>;
  averageRating: number;
  totalReviews: number;
  ratingDistribution: Record<string, number>;
  reviews: Array<{
    userId: Types.ObjectId;
    rating: number;
    comment: string;
    createdAt: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const HallSchema = new Schema<IHall>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  images: { type: [String], default: [] },
  price: { type: Number, required: true, min: 0 },
  capacity: { type: Number, required: true, min: 1 },
  amenities: { type: [String], default: [] },
  featured: { type: Boolean, default: false },
  verified: { type: Boolean, default: false },
  location: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    coordinates: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], required: true, validate: function(v: any) { return v.length === 2; } },
    },
  },
  ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'active', 'inactive'], default: 'pending' },

  availability: [{
    date: { type: Date, required: true },
    isAvailable: { type: Boolean, default: true },
  }],
  averageRating: { type: Number, default: 0, min: 0, max: 5 },
  totalReviews: { type: Number, default: 0, min: 0 },
  ratingDistribution: {
    type: Map,
    of: Number,
    default: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  },
  reviews: [{
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  }],
}, { timestamps: true });

HallSchema.index({ 'location.coordinates': '2dsphere' });
HallSchema.index({ name: 'text', description: 'text', 'location.city': 'text', 'location.state': 'text' });
HallSchema.index({ 'location.city': 1, price: 1, capacity: 1, averageRating: 1, status: 1 });

export default mongoose.models.Hall || mongoose.model<IHall>('Hall', HallSchema);