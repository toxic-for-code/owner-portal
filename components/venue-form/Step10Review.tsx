import React from 'react';
import { VenueFormData, STEPS } from './formTypes';
import { SectionTitle, Divider } from './FormUI';

interface Props {
  form: VenueFormData;
  submitError?: string;
}

const SummaryItem = ({ label, value, icon }: { label: string; value: React.ReactNode; icon?: string }) => (
  <div className="flex flex-col gap-1 p-3 bg-white border border-gray-100 rounded-xl shadow-sm">
    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
      {icon && <span>{icon}</span>} {label}
    </span>
    <span className="text-sm font-semibold text-gray-800">
      {value === true ? 'Yes' : value === false ? 'No' : value || <span className="text-gray-300 italic">N/A</span>}
    </span>
  </div>
);

const VendorSummary = ({ title, icon, active, price, details }: { title: string; icon: string; active: boolean | null; price?: any; details?: string }) => {
  if (active === false) return null;
  return (
    <div className="p-3 bg-white border border-gray-100 rounded-xl flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-2">
        <span className="text-lg">{icon}</span>
        <span className="text-xs font-bold text-gray-700">{title}</span>
      </div>
      <div className="text-right">
        {price && <span className="block text-[10px] font-black text-emerald-600">Starting ₹{price}</span>}
        {details && <span className="block text-[8px] text-gray-400 uppercase font-black">{details}</span>}
        {!price && !details && <span className="text-[10px] font-bold text-blue-600 italic">Available</span>}
      </div>
    </div>
  );
};

const maskStr = (str: string) => {
  if (!str) return 'N/A';
  if (str.length < 8) return str.replace(/./g, 'X');
  return 'XXXX-' + str.slice(-4);
};

export default function Step10Review({ form, submitError }: Props) {

  return (
    <div className="space-y-6">
      <SectionTitle 
        icon="🚀" 
        title="Review & Submit" 
        subtitle="Double check all details. This is how customers will see your venue." 
      />

      <div className="bg-gray-50 rounded-2xl p-4 md:p-6 border border-gray-200 space-y-6">
        {/* Header Summary */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          {form.photos.length > 0 ? (
            <img 
              src={form.photos[0].preview} 
              className="w-full md:w-32 h-32 object-cover rounded-xl shadow-md border-2 border-white" 
              alt="Venue preview" 
            />
          ) : (
            <div className="w-full md:w-32 h-32 bg-gray-200 rounded-xl flex items-center justify-center text-gray-400">
              No Photo
            </div>
          )}
          <div>
            <h3 className="text-xl font-bold text-gray-900">{form.name || 'Untitled Venue'}</h3>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              📍 {form.city}, {form.state}
            </p>
            <div className="flex gap-2 mt-2">
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-md uppercase">
                {form.venueType || 'New Listing'}
              </span>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-md uppercase">
                Starting ₹{form.startingPrice || '0'}
              </span>
            </div>
          </div>
        </div>

        <Divider label="Venue Overview" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <SummaryItem label="Spaces" value={`${form.eventSpaces.length} Added`} icon="🏟️" />
          <SummaryItem label="Rooms" value={form.roomsAvailable ? `${form.totalRooms} Rooms` : 'No'} icon="🛏️" />
          <SummaryItem label="Parking" value={`${form.parkingCapacity || '0'} Cars`} icon="🚗" />
          <SummaryItem label="Payout" value={form.payoutMethod || 'Pending'} icon="💳" />
        </div>

        {form.payoutMethod && (
          <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl space-y-2">
            <h4 className="text-[10px] font-black text-emerald-700 uppercase tracking-widest flex items-center gap-1">
              🏦 Payout Method: {form.payoutMethod}
            </h4>
            <p className="text-sm font-bold text-gray-700">
              {form.payoutMethod === 'Bank Transfer' 
                ? `${form.bankName} (${maskStr(form.accountNumber)})` 
                : form.upiId}
            </p>
          </div>
        )}

        <Divider label="Comprehensive Vendor Summary" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <VendorSummary 
            title="Catering" icon="🍛" active={form.inHouseCatering} 
            price={form.vegPlatePrice} details={`${form.cuisines.length} Cuisines`} 
          />
          <VendorSummary 
            title="Decoration" icon="🌸" active={form.inHouseDecorator} 
            price={form.decorationStartingPrice} details="In-house available" 
          />
          <VendorSummary 
            title="Photography" icon="📸" active={form.inHousePhotographerAvailable} 
            price={form.photographyStartingPrice} details={form.videographyAvailable ? 'Video Incl.' : undefined} 
          />
          <VendorSummary 
            title="Entertainment" icon="🎵" active={form.djAllowed} 
            price={form.avgDjCost} details="DJ / Sound" 
          />
          <VendorSummary 
            title="Beauty & Grooming" icon="💄" active={form.bridalMakeupAvailable} 
            price={form.makeupStartingPrice} details="Bridal Makeup" 
          />
          <VendorSummary 
            title="Coordination" icon="📋" active={form.weddingPlannerAvailable} 
            price={form.plannerStartingPrice} details="Planner / Manager" 
          />
           <VendorSummary 
            title="Logistics" icon="🚐" active={form.hospitalityTeamAvailable} 
            details="Shuttle / Valet" 
          />
           <VendorSummary 
            title="Religious" icon="🪔" active={form.panditAvailable} 
            details="Ceremony Setup" 
          />
        </div>

        {submitError && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm flex gap-2">
            <span>⚠️</span> {submitError}
          </div>
        )}
      </div>

      <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex gap-3">
        <span className="text-xl">📝</span>
        <p className="text-xs text-amber-800 leading-relaxed">
          By submitting, you agree to our Terms of Service. Your venue will be reviewed by our team and will be live within 24-48 hours.
        </p>
      </div>
    </div>
  );
}
