export interface EventSpace {
  id: string;
  name: string;
  type: string;
  area: string;
  seatingCapacity: string;
  floatingCapacity: string;
}

export interface PhotoEntry {
  file: File;
  preview: string;
  url: string;
  category: string;
}

export interface VenueFormData {
  // Step 1 – Basic Info
  name: string;
  venueType: string;
  city: string;
  state: string;
  address: string;
  contactNumber: string;
  ownerEmail: string;

  // Payout Details (New)
  payoutMethod: 'Bank Transfer' | 'UPI ID' | '';
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  accountNumberConfirm: string;
  ifscCode: string;
  branchName: string;
  accountType: 'Savings' | 'Current';
  upiId: string;

  // Step 2 – Overview & Highlights
  description: string;
  highlights: string[];

  // Step 3 – Event Spaces
  eventSpaces: EventSpace[];

  // Step 4 – Pricing
  startingPrice: string;
  hallRental: string;
  lawnRental: string;
  fullVenueRental: string;
  pricingType: string;
  gstApplicable: boolean | null;
  gstPercent: string;
  serviceChargePercent: string;

  // Step 5 – Catering & Vendors (Expanded)
  inHouseCatering: boolean | null;
  outsideCateringAllowed: boolean | null;
  vegPlatePrice: string;
  nonVegPlatePrice: string;
  cuisines: string[];
  minGuests: string;
  kitchenForOutsideCaterers: boolean | null;
  foodServiceStyle: string[];
  liveCounters: boolean | null;
  dessertCounters: boolean | null;
  beverageCounters: boolean | null;
  bartendingService: boolean | null;
  alcoholServed: boolean | null;
  outsideAlcoholAllowed: boolean | null;
  corkageCharges: string;

  // Decoration
  inHouseDecorator: boolean | null;
  outsideDecoratorAllowed: boolean | null;
  decorationStartingPrice: string;
  basicDecorPrice: string;
  premiumDecorPrice: string;
  luxuryDecorPrice: string;
  flowerDecorAvailable: boolean | null;
  flowerDecorPrice: string;
  stageSetup: boolean | null;
  mandapSetup: boolean | null;
  lightingDecor: boolean | null;
  themeDecor: boolean | null;
  signageAvailable: boolean | null;

  // Photography
  photographyAllowed: boolean | null;
  outsidePhotographerAllowed: boolean | null;
  inHousePhotographerAvailable: boolean | null;
  photographyStartingPrice: string;
  videographyAvailable: boolean | null;
  cinematicVideography: boolean | null;
  droneAllowed: boolean | null;
  photoBooth: boolean | null;

  // Entertainment
  djAllowed: boolean | null;
  outsideDjAllowed: boolean | null;
  avgDjCost: string;
  liveBandAllowed: boolean | null;
  singerPerformerAllowed: boolean | null;
  dancePerformersAllowed: boolean | null;
  anchorAvailable: boolean | null;
  soundSystemAvailable: boolean | null;
  lightingSetupAvailable: boolean | null;
  fireworksAllowed: boolean | null;
  coldPyroAllowed: boolean | null;

  // Beauty
  bridalMakeupAvailable: boolean | null;
  makeupStartingPrice: string;
  hairstylistAvailable: boolean | null;
  mehendiArtistAvailable: boolean | null;
  groomStylistAvailable: boolean | null;

  // Planning
  weddingPlannerAvailable: boolean | null;
  plannerStartingPrice: string;
  eventCoordinatorAvailable: boolean | null; dayOfManagerAvailable: boolean | null;

  // Hospitality
  hospitalityTeamAvailable: boolean | null;
  transportationAvailable: boolean | null;
  shuttleServiceAvailable: boolean | null;
  hotelTieUps: boolean | null;
  roomBookingAssistance: boolean | null;

  // Religious
  panditAvailable: boolean | null;
  priestAvailable: boolean | null;
  qaziAvailable: boolean | null;
  ritualSuppliesAvailable: boolean | null;
  mandapCeremonySetup: boolean | null;

  // Invitations
  designAssistance: boolean | null;
  digitalInvitationAvailable: boolean | null;
  weddingWebsiteAvailable: boolean | null;
  eventSignageDesign: boolean | null;

  // Gifts
  returnGiftSupplier: boolean | null;
  customizedGifts: boolean | null;
  packagingServices: boolean | null;

  roomsAvailable: boolean | null;
  totalRooms: string;
  startingRoomPrice: string;
  bridalSuite: boolean | null;
  complimentaryRooms: string;

  amenities: string[];
  alcoholAllowed: boolean | null;
  generalOutsideAlcoholAllowed: boolean | null;
  musicTill: string;
  lateNightAllowed: boolean | null;
  cancellationPolicy: string;
  parkingCapacity: string;
  valetParking: boolean | null;
  parkingCharges: string;
  parkingChargesAmount: string;

  photos: PhotoEntry[];
  blockedDates: string[];
  allowReviews: boolean | null;
  nearestAirportKm: string;
  nearestRailwayKm: string;
  nearestMetroKm: string;
  mapEmbedUrl: string;
  pincode: string;
}

export const INITIAL_FORM: VenueFormData = {
  name: '', venueType: '', city: '', state: '', address: '',
  contactNumber: '', ownerEmail: '', 
  
  // Payout Initial
  payoutMethod: '',
  accountHolderName: '', bankName: '', accountNumber: '', accountNumberConfirm: '',
  ifscCode: '', branchName: '', accountType: 'Savings',
  upiId: '',

  description: '', highlights: [],
  eventSpaces: [],
  startingPrice: '', hallRental: '', lawnRental: '', fullVenueRental: '',
  pricingType: 'Per Event', gstApplicable: null, gstPercent: '', serviceChargePercent: '',
  inHouseCatering: null, outsideCateringAllowed: null,
  vegPlatePrice: '', nonVegPlatePrice: '', cuisines: [], minGuests: '',
  kitchenForOutsideCaterers: null, foodServiceStyle: [],
  liveCounters: null, dessertCounters: null, beverageCounters: null, bartendingService: null,
  alcoholServed: null, outsideAlcoholAllowed: null, corkageCharges: '',
  inHouseDecorator: null, outsideDecoratorAllowed: null, decorationStartingPrice: '',
  basicDecorPrice: '', premiumDecorPrice: '', luxuryDecorPrice: '',
  flowerDecorAvailable: null, flowerDecorPrice: '',
  stageSetup: null, mandapSetup: null, lightingDecor: null, themeDecor: null, signageAvailable: null,
  photographyAllowed: null, outsidePhotographerAllowed: null, inHousePhotographerAvailable: null,
  photographyStartingPrice: '', videographyAvailable: null, cinematicVideography: null,
  droneAllowed: null, photoBooth: null,
  djAllowed: null, outsideDjAllowed: null, avgDjCost: '',
  liveBandAllowed: null, singerPerformerAllowed: null, dancePerformersAllowed: null,
  anchorAvailable: null, soundSystemAvailable: null, lightingSetupAvailable: null,
  fireworksAllowed: null, coldPyroAllowed: null,
  bridalMakeupAvailable: null, makeupStartingPrice: '', hairstylistAvailable: null,
  mehendiArtistAvailable: null, groomStylistAvailable: null,
  weddingPlannerAvailable: null, plannerStartingPrice: '', eventCoordinatorAvailable: null, dayOfManagerAvailable: null,
  hospitalityTeamAvailable: null, transportationAvailable: null, shuttleServiceAvailable: null,
  hotelTieUps: null, roomBookingAssistance: null,
  panditAvailable: null, priestAvailable: null, qaziAvailable: null,
  ritualSuppliesAvailable: null, mandapCeremonySetup: null,
  designAssistance: null, digitalInvitationAvailable: null, weddingWebsiteAvailable: null, eventSignageDesign: null,
  returnGiftSupplier: null, customizedGifts: null, packagingServices: null,
  roomsAvailable: null, totalRooms: '', startingRoomPrice: '', bridalSuite: null, complimentaryRooms: '',
  amenities: [], alcoholAllowed: null, generalOutsideAlcoholAllowed: null,
  musicTill: '', lateNightAllowed: null, cancellationPolicy: '',
  parkingCapacity: '', valetParking: null, parkingCharges: 'Free', parkingChargesAmount: '',
  photos: [], blockedDates: [], allowReviews: null,
  nearestAirportKm: '', nearestRailwayKm: '', nearestMetroKm: '',
  mapEmbedUrl: '', pincode: '',
};

export const FOOD_SERVICE_STYLES = ['Buffet', 'Plated Service', 'Live Counters', 'Family Style'];
export const VENUE_TYPES = ['Banquet Hall', 'Lawn', 'Resort', 'Hotel', 'Farmhouse', 'Convention Center', 'Rooftop', 'Other'];
export const SPACE_TYPES = ['Hall', 'Lawn', 'Rooftop', 'Terrace', 'Garden'];
export const CUISINES_LIST = ['North Indian', 'South Indian', 'Mughlai', 'Continental', 'Chinese', 'Jain Food', 'Multi-cuisine'];
export const PRESET_HIGHLIGHTS = [
  'Scenic location', 'AC banquet hall', 'Large lawn', 'Indoor + outdoor space',
  'Ample parking', 'Near airport', 'Riverside view', 'Heritage property',
  'Swimming pool', 'Rooftop venue', 'Valet parking', 'DJ setup available',
];
export const AMENITIES_LIST = [
  'Air Conditioning', 'Power Backup', 'Parking', 'WiFi', 'Bridal Room',
  'Stage', 'Lighting', 'Wheelchair Accessible', 'Changing Rooms',
  'Elevator', 'Generator Backup', 'CCTV', 'First Aid', 'Fire Safety',
];
export const PHOTO_CATEGORIES = ['Venue', 'Decoration', 'Rooms', 'Food', 'Stage', 'Other'];
export const STATES_LIST = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Puducherry',
];

export const STEPS = [
  { label: 'Basic Info', icon: '🏛️' },
  { label: 'Overview', icon: '📝' },
  { label: 'Spaces', icon: '🏟️' },
  { label: 'Pricing', icon: '💰' },
  { label: 'Catering & Vendors', icon: '🍽️' },
  { label: 'Accommodation', icon: '🛏️' },
  { label: 'Amenities', icon: '✨' },
  { label: 'Photos', icon: '📸' },
  { label: 'Availability', icon: '📅' },
  { label: 'Review & Submit', icon: '🚀' },
];
