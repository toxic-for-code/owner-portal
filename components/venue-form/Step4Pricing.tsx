import React from 'react';
import { VenueFormData } from './formTypes';
import { Label, Input, Select, SectionTitle, FieldGroup, FieldBox, YesNo, Divider } from './FormUI';

interface Props {
  form: VenueFormData;
  setForm: React.Dispatch<React.SetStateAction<VenueFormData>>;
}

export default function Step4Pricing({ form, setForm }: Props) {
  const set = (field: keyof VenueFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }));

  return (
    <div className="space-y-5">
      <SectionTitle icon="💰" title="Pricing Details" subtitle="Be transparent. Customers decide based on clear pricing." />

      <FieldGroup cols={2}>
        <FieldBox>
          <Label>Starting Venue Price (₹)</Label>
          <Input type="number" value={form.startingPrice} onChange={set('startingPrice')} placeholder="e.g. 50000" min={0} />
        </FieldBox>
        <FieldBox>
          <Label>Pricing Type</Label>
          <Select value={form.pricingType} onChange={set('pricingType')}>
            {['Per Event', 'Per Day', 'Per Hour'].map(t => <option key={t} value={t}>{t}</option>)}
          </Select>
        </FieldBox>
      </FieldGroup>

      <Divider label="Breakdown by Space" />

      <FieldGroup cols={3}>
        <FieldBox>
          <Label>Hall Rental (₹)</Label>
          <Input type="number" value={form.hallRental} onChange={set('hallRental')} placeholder="e.g. 30000" min={0} />
        </FieldBox>
        <FieldBox>
          <Label>Lawn Rental (₹)</Label>
          <Input type="number" value={form.lawnRental} onChange={set('lawnRental')} placeholder="e.g. 20000" min={0} />
        </FieldBox>
        <FieldBox>
          <Label>Full Venue Rental (₹)</Label>
          <Input type="number" value={form.fullVenueRental} onChange={set('fullVenueRental')} placeholder="e.g. 80000" min={0} />
        </FieldBox>
      </FieldGroup>

      <Divider label="Tax & Charges" />

      <FieldGroup cols={2}>
        <FieldBox>
          <YesNo
            label="GST Applicable?"
            value={form.gstApplicable}
            onChange={v => setForm(f => ({ ...f, gstApplicable: v }))}
          />
        </FieldBox>
        {form.gstApplicable && (
          <FieldBox>
            <Label>GST Percentage (%)</Label>
            <Select value={form.gstPercent} onChange={set('gstPercent')}>
              <option value="">Select…</option>
              {['5', '12', '18', '28'].map(p => <option key={p} value={p}>{p}%</option>)}
            </Select>
          </FieldBox>
        )}
      </FieldGroup>

      <FieldGroup>
        <FieldBox>
          <Label>Service Charge (%)</Label>
          <Input type="number" value={form.serviceChargePercent} onChange={set('serviceChargePercent')} placeholder="e.g. 10" min={0} max={100} />
        </FieldBox>
      </FieldGroup>

      <div className="bg-green-50 border border-green-100 rounded-xl p-3 flex gap-2 text-xs text-green-700">
        <span>💡</span>
        <span>Venues with clearly listed pricing receive 3× more inquiries on WeEnYou.</span>
      </div>
    </div>
  );
}
