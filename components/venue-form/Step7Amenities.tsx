import React, { useState } from 'react';
import { VenueFormData, AMENITIES_LIST } from './formTypes';
import { Label, Input, SectionTitle, YesNo, Textarea, Divider } from './FormUI';

interface Props {
  form: VenueFormData;
  setForm: React.Dispatch<React.SetStateAction<VenueFormData>>;
}

export default function Step7Amenities({ form, setForm }: Props) {
  const [customAmenity, setCustomAmenity] = useState('');

  const toggleAmenity = (a: string) =>
    setForm(f => ({
      ...f,
      amenities: f.amenities.includes(a) ? f.amenities.filter(x => x !== a) : [...f.amenities, a],
    }));

  const addCustom = () => {
    const val = customAmenity.trim();
    if (val && !form.amenities.includes(val)) {
      setForm(f => ({ ...f, amenities: [...f.amenities, val] }));
    }
    setCustomAmenity('');
  };

  const allAmenities = [...AMENITIES_LIST, ...form.amenities.filter(a => !AMENITIES_LIST.includes(a))];
  const setBool = (field: keyof VenueFormData) => (v: boolean) => setForm(f => ({ ...f, [field]: v }));

  return (
    <div className="space-y-5">
      <SectionTitle icon="✨" title="Amenities, Policies & Parking" subtitle="Complete details that customers check before booking." />

      {/* Amenities */}
      <div>
        <Label>Amenities Offered</Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
          {allAmenities.map(a => (
            <label key={a} className={`flex items-center gap-2.5 p-3 rounded-xl border-2 cursor-pointer transition-all
              ${form.amenities.includes(a)
                ? 'border-blue-500 bg-blue-50 text-blue-800'
                : 'border-gray-200 hover:border-gray-300 text-gray-700'}`}>
              <input
                type="checkbox"
                checked={form.amenities.includes(a)}
                onChange={() => toggleAmenity(a)}
                className="accent-blue-600 w-4 h-4 flex-shrink-0"
              />
              <span className="text-sm font-medium leading-tight">{a}</span>
            </label>
          ))}
        </div>
        <div className="flex gap-2 mt-3">
          <Input
            value={customAmenity}
            onChange={e => setCustomAmenity(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCustom(); } }}
            placeholder="Add a custom amenity…"
          />
          <button type="button" onClick={addCustom}
            className="px-4 py-3 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors whitespace-nowrap">
            + Add
          </button>
        </div>
      </div>

      <Divider label="Venue Policies" />

      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <YesNo label="Alcohol Allowed?" value={form.alcoholAllowed} onChange={setBool('alcoholAllowed')} />
          <YesNo label="Outside Alcohol Allowed?" value={form.outsideAlcoholAllowed} onChange={setBool('outsideAlcoholAllowed')} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label>Music Allowed Till (Time)</Label>
            <Input type="time" value={form.musicTill} onChange={e => setForm(f => ({ ...f, musicTill: e.target.value }))} />
          </div>
          <div className="flex items-end">
            <YesNo label="Late Night Events Allowed?" value={form.lateNightAllowed} onChange={setBool('lateNightAllowed')} />
          </div>
        </div>
        <div>
          <Label>Cancellation Policy</Label>
          <Textarea
            value={form.cancellationPolicy}
            onChange={e => setForm(f => ({ ...f, cancellationPolicy: e.target.value }))}
            rows={3}
            placeholder="Describe your cancellation and refund policy…"
          />
        </div>
      </div>

      <Divider label="Parking" />

      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label>Parking Capacity (cars)</Label>
            <Input type="number" value={form.parkingCapacity} onChange={e => setForm(f => ({ ...f, parkingCapacity: e.target.value }))} placeholder="e.g. 100" min={0} />
          </div>
          <YesNo label="Valet Parking Available?" value={form.valetParking} onChange={v => setForm(f => ({ ...f, valetParking: v }))} />
        </div>
        <div>
          <Label>Parking Charges</Label>
          <div className="flex gap-3">
            {['Free', 'Paid'].map(opt => (
              <button key={opt} type="button"
                onClick={() => setForm(f => ({ ...f, parkingCharges: opt }))}
                className={`flex-1 py-2.5 rounded-xl border-2 font-semibold text-sm transition-all
                  ${form.parkingCharges === opt
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                {opt === 'Free' ? '🆓 Free' : '💳 Paid'}
              </button>
            ))}
          </div>
        </div>
        {form.parkingCharges === 'Paid' && (
          <div>
            <Label>Parking Charge per Car (₹)</Label>
            <Input type="number" value={form.parkingChargesAmount} onChange={e => setForm(f => ({ ...f, parkingChargesAmount: e.target.value }))} placeholder="e.g. 50" min={0} />
          </div>
        )}
      </div>
    </div>
  );
}
