import React, { useState } from 'react';
import { VenueFormData, CUISINES_LIST, FOOD_SERVICE_STYLES } from './formTypes';
import { Label, Input, SectionTitle, YesNo, Divider, Chip, FieldGroup, FieldBox } from './FormUI';

interface Props {
  form: VenueFormData;
  setForm: React.Dispatch<React.SetStateAction<VenueFormData>>;
}

interface CardProps {
  title: string;
  icon: string;
  children: React.ReactNode;
  color: 'orange' | 'pink' | 'purple' | 'blue' | 'emerald' | 'amber';
}

function CollapsibleCard({ title, icon, children, color }: CardProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const colors = {
    orange: 'bg-orange-50 border-orange-100 text-orange-800',
    pink: 'bg-pink-50 border-pink-100 text-pink-800',
    purple: 'bg-purple-50 border-purple-100 text-purple-800',
    blue: 'bg-blue-50 border-blue-100 text-blue-800',
    emerald: 'bg-emerald-50 border-emerald-100 text-emerald-800',
    amber: 'bg-amber-50 border-amber-100 text-amber-800',
  };

  return (
    <div className={`border rounded-2xl overflow-hidden transition-all duration-300 ${colors[color]} mb-4 ${isOpen ? 'shadow-md' : ''}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 flex items-center justify-between font-bold text-sm uppercase tracking-wide cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{icon}</span>
          {title}
        </div>
        <span className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>
      {isOpen && (
        <div className="px-5 pb-6 pt-2 space-y-4 animate-[fadeIn_0.3s_ease]">
          {children}
        </div>
      )}
    </div>
  );
}

export default function Step5Catering({ form, setForm }: Props) {
  const set = (field: keyof VenueFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }));
  
  const setBool = (field: keyof VenueFormData) => (v: boolean) =>
    setForm(f => ({ ...f, [field]: v }));

  const toggleCuisine = (c: string) =>
    setForm(f => ({
      ...f,
      cuisines: f.cuisines.includes(c) ? f.cuisines.filter(x => x !== c) : [...f.cuisines, c],
    }));

  const toggleStyle = (s: string) =>
    setForm(f => ({
      ...f,
      foodServiceStyle: f.foodServiceStyle.includes(s) ? f.foodServiceStyle.filter(x => x !== s) : [...f.foodServiceStyle, s],
    }));

  return (
    <div className="space-y-4">
      <SectionTitle icon="🤝" title="Vendor Services" subtitle="Specify in-house availability and outside vendor policies for all services." />

      {/* 1. Catering Services */}
      <CollapsibleCard title="Catering Services" icon="🍛" color="orange">
        <FieldGroup cols={2}>
          <YesNo label="In-house Catering?" value={form.inHouseCatering} onChange={setBool('inHouseCatering')} />
          <YesNo label="Outside Catering Allowed?" value={form.outsideCateringAllowed} onChange={setBool('outsideCateringAllowed')} />
        </FieldGroup>
        
        {form.inHouseCatering && (
          <div className="space-y-4 pt-2">
            <FieldGroup cols={2}>
              <FieldBox>
                <Label>Veg Plate Price (₹)</Label>
                <Input type="number" value={form.vegPlatePrice} onChange={set('vegPlatePrice')} placeholder="e.g. 600" min={0} />
              </FieldBox>
              <FieldBox>
                <Label>Non-Veg Plate Price (₹)</Label>
                <Input type="number" value={form.nonVegPlatePrice} onChange={set('nonVegPlatePrice')} placeholder="e.g. 900" min={0} />
              </FieldBox>
            </FieldGroup>
            <div>
              <Label>Minimum Guest Requirement</Label>
              <Input type="number" value={form.minGuests} onChange={set('minGuests')} placeholder="e.g. 50" min={0} />
            </div>
            <div>
              <Label>Cuisine Options</Label>
              <div className="flex flex-wrap gap-2 mt-1">
                {CUISINES_LIST.map(c => (
                  <Chip key={c} label={c} selected={form.cuisines.includes(c)} onClick={() => toggleCuisine(c)} color="blue" />
                ))}
              </div>
            </div>
            <div>
              <Label>Food Service Style</Label>
              <div className="flex flex-wrap gap-2 mt-1">
                {FOOD_SERVICE_STYLES.map(s => (
                  <Chip key={s} label={s} selected={form.foodServiceStyle.includes(s)} onClick={() => toggleStyle(s)} color="purple" />
                ))}
              </div>
            </div>
            <FieldGroup cols={3}>
              <YesNo label="Live Counters?" value={form.liveCounters} onChange={setBool('liveCounters')} />
              <YesNo label="Dessert Counters?" value={form.dessertCounters} onChange={setBool('dessertCounters')} />
              <YesNo label="Beverage Counters?" value={form.beverageCounters} onChange={setBool('beverageCounters')} />
            </FieldGroup>
          </div>
        )}

        {form.outsideCateringAllowed && (
          <YesNo label="Kitchen Available for outside caterers?" value={form.kitchenForOutsideCaterers} onChange={setBool('kitchenForOutsideCaterers')} />
        )}

        <Divider label="Alcohol Policy" />
        <FieldGroup cols={2}>
          <YesNo label="Alcohol Served in-house?" value={form.alcoholServed} onChange={setBool('alcoholServed')} />
          <YesNo label="Outside Alcohol Allowed?" value={form.outsideAlcoholAllowed} onChange={setBool('outsideAlcoholAllowed')} />
        </FieldGroup>
        {(form.alcoholServed || form.outsideAlcoholAllowed) && (
          <FieldGroup cols={2}>
            <YesNo label="Bartending Service?" value={form.bartendingService} onChange={setBool('bartendingService')} />
            <FieldBox>
              <Label>Corkage Charges (₹)</Label>
              <Input type="number" value={form.corkageCharges} onChange={set('corkageCharges')} placeholder="e.g. 500" min={0} />
            </FieldBox>
          </FieldGroup>
        )}
      </CollapsibleCard>

      {/* 2. Decoration Services */}
      <CollapsibleCard title="Decoration Services" icon="🌸" color="pink">
        <FieldGroup cols={2}>
          <YesNo label="In-house Decorator?" value={form.inHouseDecorator} onChange={setBool('inHouseDecorator')} />
          <YesNo label="Outside Decorator Allowed?" value={form.outsideDecoratorAllowed} onChange={setBool('outsideDecoratorAllowed')} />
        </FieldGroup>
        
        {(form.inHouseDecorator || form.outsideDecoratorAllowed) && (
          <div className="space-y-4 pt-2">
            <FieldBox>
              <Label>Decoration Starting Price (₹)</Label>
              <Input type="number" value={form.decorationStartingPrice} onChange={set('decorationStartingPrice')} placeholder="e.g. 15000" min={0} />
            </FieldBox>
            <Divider label="Decoration Packages" />
            <FieldGroup cols={3}>
              <FieldBox>
                <Label>Basic Price</Label>
                <Input type="number" value={form.basicDecorPrice} onChange={set('basicDecorPrice')} placeholder="₹" min={0} />
              </FieldBox>
              <FieldBox>
                <Label>Premium Price</Label>
                <Input type="number" value={form.premiumDecorPrice} onChange={set('premiumDecorPrice')} placeholder="₹" min={0} />
              </FieldBox>
              <FieldBox>
                <Label>Luxury Price</Label>
                <Input type="number" value={form.luxuryDecorPrice} onChange={set('luxuryDecorPrice')} placeholder="₹" min={0} />
              </FieldBox>
            </FieldGroup>
            <Divider label="Specialty Services" />
            <FieldGroup cols={2}>
              <YesNo label="Flower Decor?" value={form.flowerDecorAvailable} onChange={setBool('flowerDecorAvailable')} />
              {form.flowerDecorAvailable && (
                <FieldBox>
                  <Label>Flower Decor Starting ₹</Label>
                  <Input type="number" value={form.flowerDecorPrice} onChange={set('flowerDecorPrice')} placeholder="₹" min={0} />
                </FieldBox>
              )}
            </FieldGroup>
            <FieldGroup cols={2}>
              <YesNo label="Stage Setup?" value={form.stageSetup} onChange={setBool('stageSetup')} />
              <YesNo label="Mandap Setup?" value={form.mandapSetup} onChange={setBool('mandapSetup')} />
            </FieldGroup>
            <FieldGroup cols={3}>
              <YesNo label="Lighting?" value={form.lightingDecor} onChange={setBool('lightingDecor')} />
              <YesNo label="Theme Decor?" value={form.themeDecor} onChange={setBool('themeDecor')} />
              <YesNo label="Event Signage?" value={form.signageAvailable} onChange={setBool('signageAvailable')} />
            </FieldGroup>
          </div>
        )}
      </CollapsibleCard>

      {/* 3. Photography */}
      <CollapsibleCard title="Photography & Videography" icon="📸" color="blue">
        <FieldGroup cols={2}>
          <YesNo label="Photography Allowed?" value={form.photographyAllowed} onChange={setBool('photographyAllowed')} />
          <YesNo label="Outside Photographer?" value={form.outsidePhotographerAllowed} onChange={setBool('outsidePhotographerAllowed')} />
        </FieldGroup>
        
        <YesNo label="In-house Photo/Video Available?" value={form.inHousePhotographerAvailable} onChange={setBool('inHousePhotographerAvailable')} />
        
        {form.inHousePhotographerAvailable && (
          <FieldBox>
            <Label>Package Starting Price (₹)</Label>
            <Input type="number" value={form.photographyStartingPrice} onChange={set('photographyStartingPrice')} placeholder="e.g. 25000" min={0} />
          </FieldBox>
        )}

        <FieldGroup cols={2}>
          <YesNo label="Videography?" value={form.videographyAvailable} onChange={setBool('videographyAvailable')} />
          <YesNo label="Cinematic Video?" value={form.cinematicVideography} onChange={setBool('cinematicVideography')} />
        </FieldGroup>
        <FieldGroup cols={2}>
          <YesNo label="Drone Allowed?" value={form.droneAllowed} onChange={setBool('droneAllowed')} />
          <YesNo label="Photo Booth?" value={form.photoBooth} onChange={setBool('photoBooth')} />
        </FieldGroup>
      </CollapsibleCard>

      {/* 4. Entertainment */}
      <CollapsibleCard title="Entertainment Vendors" icon="🎵" color="purple">
        <FieldGroup cols={2}>
          <YesNo label="DJ Allowed?" value={form.djAllowed} onChange={setBool('djAllowed')} />
          <YesNo label="Outside DJ Allowed?" value={form.outsideDjAllowed} onChange={setBool('outsideDjAllowed')} />
        </FieldGroup>
        
        {form.djAllowed && (
          <FieldBox>
            <Label>Average DJ Cost (₹)</Label>
            <Input type="number" value={form.avgDjCost} onChange={set('avgDjCost')} placeholder="e.g. 10000" min={0} />
          </FieldBox>
        )}

        <FieldGroup cols={2}>
          <YesNo label="Live Band Allowed?" value={form.liveBandAllowed} onChange={setBool('liveBandAllowed')} />
          <YesNo label="Singer/Performer?" value={form.singerPerformerAllowed} onChange={setBool('singerPerformerAllowed')} />
        </FieldGroup>
        <FieldGroup cols={2}>
          <YesNo label="Dance Performers?" value={form.dancePerformersAllowed} onChange={setBool('dancePerformersAllowed')} />
          <YesNo label="Anchor / MC?" value={form.anchorAvailable} onChange={setBool('anchorAvailable')} />
        </FieldGroup>
        <FieldGroup cols={2}>
          <YesNo label="Sound System?" value={form.soundSystemAvailable} onChange={setBool('soundSystemAvailable')} />
          <YesNo label="Lighting Setup?" value={form.lightingSetupAvailable} onChange={setBool('lightingSetupAvailable')} />
        </FieldGroup>
        <FieldGroup cols={2}>
          <YesNo label="Fireworks?" value={form.fireworksAllowed} onChange={setBool('fireworksAllowed')} />
          <YesNo label="Cold Pyro / FX?" value={form.coldPyroAllowed} onChange={setBool('coldPyroAllowed')} />
        </FieldGroup>
      </CollapsibleCard>

      {/* 5. Beauty */}
      <CollapsibleCard title="Beauty & Grooming" icon="💄" color="emerald">
        <YesNo label="Bridal Makeup Available?" value={form.bridalMakeupAvailable} onChange={setBool('bridalMakeupAvailable')} />
        {form.bridalMakeupAvailable && (
          <FieldBox>
            <Label>Makeup Package Starting Price (₹)</Label>
            <Input type="number" value={form.makeupStartingPrice} onChange={set('makeupStartingPrice')} placeholder="₹" min={0} />
          </FieldBox>
        )}
        <FieldGroup cols={3}>
          <YesNo label="Hairstylist?" value={form.hairstylistAvailable} onChange={setBool('hairstylistAvailable')} />
          <YesNo label="Mehendi Artist?" value={form.mehendiArtistAvailable} onChange={setBool('mehendiArtistAvailable')} />
          <YesNo label="Groom Stylist?" value={form.groomStylistAvailable} onChange={setBool('groomStylistAvailable')} />
        </FieldGroup>
      </CollapsibleCard>

      {/* 6. Planning */}
      <CollapsibleCard title="Planning & Coordination" icon="📋" color="blue">
        <YesNo label="Wedding Planner Available?" value={form.weddingPlannerAvailable} onChange={setBool('weddingPlannerAvailable')} />
        {form.weddingPlannerAvailable && (
          <FieldBox>
            <Label>Planner Package Starting Price (₹)</Label>
            <Input type="number" value={form.plannerStartingPrice} onChange={set('plannerStartingPrice')} placeholder="₹" min={0} />
          </FieldBox>
        )}
        <FieldGroup cols={2}>
          <YesNo label="Event Coordinator?" value={form.eventCoordinatorAvailable} onChange={setBool('eventCoordinatorAvailable')} />
          <YesNo label="Day-of Manager?" value={form.dayOfManagerAvailable} onChange={setBool('dayOfManagerAvailable')} />
        </FieldGroup>
      </CollapsibleCard>

      {/* 7. Hospitality */}
      <CollapsibleCard title="Guest Hospitality & Logistics" icon="🚐" color="amber">
        <FieldGroup cols={2}>
          <YesNo label="Hospitality Team?" value={form.hospitalityTeamAvailable} onChange={setBool('hospitalityTeamAvailable')} />
          <YesNo label="Transportation?" value={form.transportationAvailable} onChange={setBool('transportationAvailable')} />
        </FieldGroup>
        <FieldGroup cols={2}>
          <YesNo label="Shuttle Services?" value={form.shuttleServiceAvailable} onChange={setBool('shuttleServiceAvailable')} />
          <YesNo label="Valet Parking?" value={form.valetParking} onChange={setBool('valetParking')} />
        </FieldGroup>
        <FieldGroup cols={2}>
          <YesNo label="Hotel Tie-ups?" value={form.hotelTieUps} onChange={setBool('hotelTieUps')} />
          <YesNo label="Room Booking Assist?" value={form.roomBookingAssistance} onChange={setBool('roomBookingAssistance')} />
        </FieldGroup>
      </CollapsibleCard>

      {/* 8. Religious */}
      <CollapsibleCard title="Religious Ceremony Services" icon="🪔" color="orange">
        <FieldGroup cols={3}>
          <YesNo label="Pandit?" value={form.panditAvailable} onChange={setBool('panditAvailable')} />
          <YesNo label="Priest?" value={form.priestAvailable} onChange={setBool('priestAvailable')} />
          <YesNo label="Qazi?" value={form.qaziAvailable} onChange={setBool('qaziAvailable')} />
        </FieldGroup>
        <FieldGroup cols={2}>
          <YesNo label="Ritual Supplies?" value={form.ritualSuppliesAvailable} onChange={setBool('ritualSuppliesAvailable')} />
          <YesNo label="Mandap Setup?" value={form.mandapCeremonySetup} onChange={setBool('mandapCeremonySetup')} />
        </FieldGroup>
      </CollapsibleCard>

      {/* 9. Invitations */}
      <CollapsibleCard title="Invitations & Materials" icon="💌" color="pink">
        <YesNo label="Invitation Design Assist?" value={form.designAssistance} onChange={setBool('designAssistance')} />
        <FieldGroup cols={3}>
          <YesNo label="Digital Invites?" value={form.digitalInvitationAvailable} onChange={setBool('digitalInvitationAvailable')} />
          <YesNo label="Wedding Website?" value={form.weddingWebsiteAvailable} onChange={setBool('weddingWebsiteAvailable')} />
          <YesNo label="Signage Design?" value={form.eventSignageDesign} onChange={setBool('eventSignageDesign')} />
        </FieldGroup>
      </CollapsibleCard>

      {/* 10. Gifts */}
      <CollapsibleCard title="Return Gifts & Souvenirs" icon="🎁" color="blue">
        <YesNo label="Return Gift Supplier?" value={form.returnGiftSupplier} onChange={setBool('returnGiftSupplier')} />
        <FieldGroup cols={2}>
          <YesNo label="Customized Gifts?" value={form.customizedGifts} onChange={setBool('customizedGifts')} />
          <YesNo label="Gift Packaging?" value={form.packagingServices} onChange={setBool('packagingServices')} />
        </FieldGroup>
      </CollapsibleCard>

      <div className="bg-blue-600/10 border border-blue-600/20 rounded-2xl p-5 flex gap-4">
        <span className="text-2xl">📊</span>
        <p className="text-xs text-blue-900 leading-relaxed font-medium">
          Note: These pricing details help our **Cost Estimator Tool** provide accurate quotes to customers, increasing your conversion by 40%.
        </p>
      </div>
    </div>
  );
}
