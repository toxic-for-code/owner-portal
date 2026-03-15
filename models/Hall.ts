import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IEventSpace {
  name: string;
  type: 'Hall' | 'Lawn' | 'Rooftop' | 'Terrace' | 'Garden';
  area?: number;
  seatingCapacity?: number;
  floatingCapacity?: number;
}

export interface IHall extends Document {
  name: string;
  venueType: string;
  description: string;
  images: string[];
  photoCategories: {
    Venue?: string[];
    Decoration?: string[];
    Rooms?: string[];
    Food?: string[];
    Stage?: string[];
    Other?: string[];
  };
  price: number;
  capacity: number;
  amenities: string[];
  highlights: string[];
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
    nearestAirportKm?: number;
    nearestRailwayKm?: number;
    nearestMetroKm?: number;
    mapEmbedUrl?: string;
  };
  contactNumber?: string;
  ownerEmail?: string;
  
  // Payout Details
  payoutDetails?: {
    payoutMethod: 'Bank Transfer' | 'UPI ID' | '';
    bankDetails?: {
      accountHolderName: string;
      bankName: string;
      accountNumber: string; // Encrypted in real use
      ifscCode: string;
      branchName?: string;
      accountType: 'Savings' | 'Current';
    };
    upiId?: string;
  };

  eventSpaces: IEventSpace[];
  pricing: {
    startingPrice?: number;
    hallRental?: number;
    lawnRental?: number;
    fullVenueRental?: number;
    pricingType?: 'Per Event' | 'Per Day' | 'Per Hour';
    gstApplicable?: boolean;
    gstPercent?: number;
    serviceChargePercent?: number;
  };
  catering: {
    inHouse?: boolean;
    outsideAllowed?: boolean;
    vegPlatePrice?: number;
    nonVegPlatePrice?: number;
    cuisines?: string[];
    minGuests?: number;
    kitchenForOutsideCaterers?: boolean;
    foodServiceStyle?: string[];
    liveCounters?: boolean;
    dessertCounters?: boolean;
    beverageCounters?: boolean;
    bartendingService?: boolean;
    alcoholPolicy?: {
      served?: boolean;
      outsideAllowed?: boolean;
      corkageCharges?: number;
    };
  };
  decoration: {
    inHouseDecorator?: boolean;
    outsideDecoratorAllowed?: boolean;
    startingPrice?: number;
    packages?: {
      basic?: number;
      premium?: number;
      luxury?: number;
    };
    flowerDecor?: {
      available?: boolean;
      startingPrice?: number;
    };
    stageSetup?: boolean;
    mandapSetup?: boolean;
    lightingDecor?: boolean;
    themeDecor?: boolean;
    signageAvailable?: boolean;
  };
  vendors: {
    photography?: {
      allowed?: boolean;
      outsideAllowed?: boolean;
      inHouseAvailable?: boolean;
      startingPrice?: number;
      videography?: boolean;
      cinematic?: boolean;
      droneAllowed?: boolean;
      photoBooth?: boolean;
    };
    entertainment?: {
      djAllowed?: boolean;
      outsideDjAllowed?: boolean;
      avgDjCost?: number;
      liveBandAllowed?: boolean;
      singerPerformerAllowed?: boolean;
      dancePerformersAllowed?: boolean;
      anchorAvailable?: boolean;
      soundSystemAvailable?: boolean;
      lightingSetupAvailable?: boolean;
      fireworksAllowed?: boolean;
      coldPyroAllowed?: boolean;
    };
    beauty?: {
      bridalMakeup?: boolean;
      makeupStartingPrice?: number;
      hairstylist?: boolean;
      mehendiArtist?: boolean;
      groomStylist?: boolean;
    };
    planning?: {
      weddingPlanner?: boolean;
      plannerStartingPrice?: number;
      eventCoordinator?: boolean;
      dayOfManager?: boolean;
    };
    hospitality?: {
      hospitalityTeam?: boolean;
      transportation?: boolean;
      shuttleService?: boolean;
      hotelTieUps?: boolean;
      roomBookingAssistance?: boolean;
    };
    religious?: {
      pandit?: boolean;
      priest?: boolean;
      qazi?: boolean;
      ritualSupplies?: boolean;
      mandapCeremonySetup?: boolean;
    };
    invitations?: {
      designAssistance?: boolean;
      digitalInvites?: boolean;
      weddingWebsite?: boolean;
      eventSignageDesign?: boolean;
    };
    gifts?: {
      returnGiftSupplier?: boolean;
      customizedGifts?: boolean;
      packagingServices?: boolean;
    };
  };
  accommodation: {
    roomsAvailable?: boolean;
    totalRooms?: number;
    startingRoomPrice?: number;
    bridalSuite?: boolean;
    complimentaryRooms?: number;
  };
  policies: {
    alcoholAllowed?: boolean;
    outsideAlcoholAllowed?: boolean;
    musicTill?: string;
    lateNightAllowed?: boolean;
    cancellation?: string;
  };
  parking: {
    capacity?: number;
    valetAvailable?: boolean;
    chargesType?: 'Free' | 'Paid';
    chargesAmount?: number;
  };
  allowReviews?: boolean;
  ownerId: Types.ObjectId;
  status: 'pending' | 'active' | 'inactive';
  availability: Array<{
    date: Date;
    isAvailable: boolean;
  }>;
  blockedDates: Date[];
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

const EventSpaceSchema = new Schema<IEventSpace>({
  name: { type: String, required: true },
  type: { type: String, enum: ['Hall', 'Lawn', 'Rooftop', 'Terrace', 'Garden'] },
  area: { type: Number },
  seatingCapacity: { type: Number },
  floatingCapacity: { type: Number },
}, { _id: false });

const HallSchema = new Schema<IHall>({
  name: { type: String, required: true },
  venueType: { type: String, default: '' },
  description: { type: String, required: true },
  images: { type: [String], default: [] },
  photoCategories: {
    Venue: { type: [String], default: [] },
    Decoration: { type: [String], default: [] },
    Rooms: { type: [String], default: [] },
    Food: { type: [String], default: [] },
    Stage: { type: [String], default: [] },
    Other: { type: [String], default: [] },
  },
  price: { type: Number, required: true, min: 0 },
  capacity: { type: Number, required: true, min: 1 },
  amenities: { type: [String], default: [] },
  highlights: { type: [String], default: [] },
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
    nearestAirportKm: { type: Number },
    nearestRailwayKm: { type: Number },
    nearestMetroKm: { type: Number },
    mapEmbedUrl: { type: String },
  },
  contactNumber: { type: String },
  ownerEmail: { type: String },
  
  // Payout Details
  payoutDetails: {
    payoutMethod: { type: String, enum: ['Bank Transfer', 'UPI ID', ''], default: '' },
    bankDetails: {
      accountHolderName: { type: String },
      bankName: { type: String },
      accountNumber: { type: String },
      ifscCode: { type: String },
      branchName: { type: String },
      accountType: { type: String, enum: ['Savings', 'Current'] },
    },
    upiId: { type: String },
  },

  eventSpaces: { type: [EventSpaceSchema], default: [] },
  pricing: {
    startingPrice: { type: Number },
    hallRental: { type: Number },
    lawnRental: { type: Number },
    fullVenueRental: { type: Number },
    pricingType: { type: String, enum: ['Per Event', 'Per Day', 'Per Hour'] },
    gstApplicable: { type: Boolean },
    gstPercent: { type: Number },
    serviceChargePercent: { type: Number },
  },
  catering: {
    inHouse: { type: Boolean },
    outsideAllowed: { type: Boolean },
    vegPlatePrice: { type: Number },
    nonVegPlatePrice: { type: Number },
    cuisines: { type: [String], default: [] },
    minGuests: { type: Number },
    kitchenForOutsideCaterers: { type: Boolean },
    foodServiceStyle: { type: [String], default: [] },
    liveCounters: { type: Boolean },
    dessertCounters: { type: Boolean },
    beverageCounters: { type: Boolean },
    bartendingService: { type: Boolean },
    alcoholPolicy: {
      served: { type: Boolean },
      outsideAllowed: { type: Boolean },
      corkageCharges: { type: Number },
    },
  },
  decoration: {
    inHouseDecorator: { type: Boolean },
    outsideDecoratorAllowed: { type: Boolean },
    startingPrice: { type: Number },
    packages: {
      basic: { type: Number },
      premium: { type: Number },
      luxury: { type: Number },
    },
    flowerDecor: {
      available: { type: Boolean },
      startingPrice: { type: Number },
    },
    stageSetup: { type: Boolean },
    mandapSetup: { type: Boolean },
    lightingDecor: { type: Boolean },
    themeDecor: { type: Boolean },
    signageAvailable: { type: Boolean },
  },
  vendors: {
    photography: {
      allowed: { type: Boolean, default: true },
      outsideAllowed: { type: Boolean },
      inHouseAvailable: { type: Boolean },
      startingPrice: { type: Number },
      videography: { type: Boolean },
      cinematic: { type: Boolean },
      droneAllowed: { type: Boolean },
      photoBooth: { type: Boolean },
    },
    entertainment: {
      djAllowed: { type: Boolean, default: true },
      outsideDjAllowed: { type: Boolean },
      avgDjCost: { type: Number },
      liveBandAllowed: { type: Boolean },
      singerPerformerAllowed: { type: Boolean },
      dancePerformersAllowed: { type: Boolean },
      anchorAvailable: { type: Boolean },
      soundSystemAvailable: { type: Boolean },
      lightingSetupAvailable: { type: Boolean },
      fireworksAllowed: { type: Boolean },
      coldPyroAllowed: { type: Boolean },
    },
    beauty: {
      bridalMakeup: { type: Boolean },
      makeupStartingPrice: { type: Number },
      hairstylist: { type: Boolean },
      mehendiArtist: { type: Boolean },
      groomStylist: { type: Boolean },
    },
    planning: {
      weddingPlanner: { type: Boolean },
      plannerStartingPrice: { type: Number },
      eventCoordinator: { type: Boolean },
      dayOfManager: { type: Boolean },
    },
    hospitality: {
      hospitalityTeam: { type: Boolean },
      transportation: { type: Boolean },
      shuttleService: { type: Boolean },
      hotelTieUps: { type: Boolean },
      roomBookingAssistance: { type: Boolean },
    },
    religious: {
      pandit: { type: Boolean },
      priest: { type: Boolean },
      qazi: { type: Boolean },
      ritualSupplies: { type: Boolean },
      mandapCeremonySetup: { type: Boolean },
    },
    invitations: {
      designAssistance: { type: Boolean },
      digitalInvites: { type: Boolean },
      weddingWebsite: { type: Boolean },
      eventSignageDesign: { type: Boolean },
    },
    gifts: {
      returnGiftSupplier: { type: Boolean },
      customizedGifts: { type: Boolean },
      packagingServices: { type: Boolean },
    },
  },
  accommodation: {
    roomsAvailable: { type: Boolean },
    totalRooms: { type: Number },
    startingRoomPrice: { type: Number },
    bridalSuite: { type: Boolean },
    complimentaryRooms: { type: Number },
  },
  policies: {
    alcoholAllowed: { type: Boolean },
    outsideAlcoholAllowed: { type: Boolean },
    musicTill: { type: String },
    lateNightAllowed: { type: Boolean },
    cancellation: { type: String },
  },
  parking: {
    capacity: { type: Number },
    valetAvailable: { type: Boolean },
    chargesType: { type: String, enum: ['Free', 'Paid'] },
    chargesAmount: { type: Number },
  },
  allowReviews: { type: Boolean, default: true },
  ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'active', 'inactive'], default: 'pending' },
  availability: [{
    date: { type: Date, required: true },
    isAvailable: { type: Boolean, default: true },
  }],
  blockedDates: { type: [Date], default: [] },
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