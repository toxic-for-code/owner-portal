import React from 'react';
import { VenueFormData, VENUE_TYPES, STATES_LIST } from './formTypes';
import { Label, Input, Select, SectionTitle, Divider, FieldGroup, FieldBox } from './FormUI';

interface Props {
  form: VenueFormData;
  setForm: React.Dispatch<React.SetStateAction<VenueFormData>>;
  errors: Record<string, string>;
}

export default function Step1BasicInfo({ form, setForm, errors }: Props) {
  const set = (field: keyof VenueFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => 
    setForm(f => ({ ...f, [field]: e.target.value }));

  return (
    <div className="space-y-8">
      {/* Basic Details Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
        <SectionTitle 
          icon="🏢" 
          title="Basic Venue Information" 
          subtitle="Start with the essential details of your property." 
        />
        
        <FieldGroup cols={2}>
          <FieldBox>
            <Label required>Venue Name</Label>
            <Input 
              value={form.name} 
              onChange={set('name')} 
              placeholder="e.g. Royal Orchid Banquet" 
              error={errors.name}
            />
          </FieldBox>
          <FieldBox>
            <Label required>Venue Type</Label>
            <Select value={form.venueType} onChange={set('venueType')} error={errors.venueType}>
              <option value="">Select Type</option>
              {VENUE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </Select>
          </FieldBox>
        </FieldGroup>

        <Divider label="Location Details" />
        
        <FieldBox>
          <Label required>Full Address</Label>
          <Input 
            value={form.address} 
            onChange={set('address')} 
            placeholder="Street name, landmark, etc." 
            error={errors.address}
          />
        </FieldBox>

        <FieldGroup cols={3}>
          <FieldBox>
            <Label required>City</Label>
            <Input value={form.city} onChange={set('city')} placeholder="City" error={errors.city} />
          </FieldBox>
          <FieldBox>
            <Label required>State</Label>
            <Select value={form.state} onChange={set('state')} error={errors.state}>
              <option value="">Select State</option>
              {STATES_LIST.map(s => <option key={s} value={s}>{s}</option>)}
            </Select>
          </FieldBox>
          <FieldBox>
            <Label required>Pincode</Label>
            <Input 
              value={form.pincode} 
              onChange={set('pincode')} 
              placeholder="6-digit PIN" 
              error={errors.pincode}
            />
          </FieldBox>
        </FieldGroup>

        <Divider label="Contact Information" />

        <FieldGroup cols={2}>
          <FieldBox>
            <Label required>Owner Contact Number</Label>
            <Input 
              value={form.contactNumber} 
              onChange={set('contactNumber')} 
              placeholder="Mobile number" 
              error={errors.contactNumber}
            />
          </FieldBox>
          <FieldBox>
            <Label required>Owner Email</Label>
            <Input 
              type="email" 
              value={form.ownerEmail} 
              onChange={set('ownerEmail')} 
              placeholder="email@example.com" 
              error={errors.ownerEmail}
            />
          </FieldBox>
        </FieldGroup>

        <Divider label="Nearby Transport (Approx distances)" />

        <FieldGroup cols={3}>
          <FieldBox>
            <Label>Airport (Km)</Label>
            <Input type="number" value={form.nearestAirportKm} onChange={set('nearestAirportKm')} placeholder="Distance" />
          </FieldBox>
          <FieldBox>
            <Label>Railway (Km)</Label>
            <Input type="number" value={form.nearestRailwayKm} onChange={set('nearestRailwayKm')} placeholder="Distance" />
          </FieldBox>
          <FieldBox>
            <Label>Metro (Km)</Label>
            <Input type="number" value={form.nearestMetroKm} onChange={set('nearestMetroKm')} placeholder="Distance" />
          </FieldBox>
        </FieldGroup>
      </div>

      {/* Payment & Payout Card */}
      <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-6 space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full -mr-16 -mt-16 -z-10"></div>
        
        <SectionTitle 
          icon="💰" 
          title="Payment & Payout Setup" 
          subtitle="Provide your payout details so we can transfer booking payments directly to your account." 
        />

        <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex gap-3">
          <span className="text-xl">ℹ️</span>
          <p className="text-xs text-blue-800 leading-relaxed font-medium">
            This section is optional during listing. Payout details can be added later from the Owner Dashboard before receiving bookings.
          </p>
        </div>

        <FieldBox>
          <Label>Preferred Payout Method</Label>
          <Select value={form.payoutMethod} onChange={set('payoutMethod')}>
            <option value="">Select Method</option>
            <option value="Bank Transfer">Bank Transfer (Recommended)</option>
            <option value="UPI ID">UPI ID</option>
          </Select>
        </FieldBox>

        {form.payoutMethod === 'Bank Transfer' && (
          <div className="space-y-4 animate-[fadeIn_0.3s_ease]">
            <Divider label="Bank Account Details" />
            <FieldGroup cols={2}>
              <FieldBox>
                <Label>Account Holder Name</Label>
                <Input value={form.accountHolderName} onChange={set('accountHolderName')} placeholder="Full Name as in Bank" />
              </FieldBox>
              <FieldBox>
                <Label>Bank Name</Label>
                <Input value={form.bankName} onChange={set('bankName')} placeholder="e.g. HDFC Bank" />
              </FieldBox>
            </FieldGroup>

            <FieldGroup cols={2}>
              <FieldBox>
                <Label>Account Number</Label>
                <Input type="password" value={form.accountNumber} onChange={set('accountNumber')} placeholder="Account Number" />
              </FieldBox>
              <FieldBox>
                <Label>Confirm Account Number</Label>
                <Input value={form.accountNumberConfirm} onChange={set('accountNumberConfirm')} placeholder="Re-enter Number" />
                {form.accountNumber && form.accountNumberConfirm && form.accountNumber !== form.accountNumberConfirm && (
                   <span className="text-[10px] text-red-500 font-bold mt-1">Numbers do not match</span>
                )}
              </FieldBox>
            </FieldGroup>

            <FieldGroup cols={3}>
              <FieldBox>
                <Label>IFSC Code</Label>
                <Input value={form.ifscCode} onChange={set('ifscCode')} placeholder="e.g. HDFC0001234" />
              </FieldBox>
              <FieldBox>
                <Label>Branch (Optional)</Label>
                <Input value={form.branchName} onChange={set('branchName')} placeholder="Branch" />
              </FieldBox>
              <FieldBox>
                <Label>Account Type</Label>
                <Select value={form.accountType} onChange={set('accountType')}>
                  <option value="Savings">Savings</option>
                  <option value="Current">Current</option>
                </Select>
              </FieldBox>
            </FieldGroup>
          </div>
        )}

        {form.payoutMethod === 'UPI ID' && (
          <div className="space-y-4 animate-[fadeIn_0.3s_ease]">
            <Divider label="UPI Payout Option" />
            <FieldBox>
              <Label>UPI ID</Label>
              <Input value={form.upiId} onChange={set('upiId')} placeholder="e.g. example@upi" />
              <p className="text-[10px] text-gray-400 mt-1 italic">Verified UPI ID will ensure instant settlement.</p>
            </FieldBox>
          </div>
        )}


        {form.payoutMethod && (
          <div className="pt-4 border-t border-gray-100 mt-6">
            <div className="flex gap-2 items-start text-emerald-700 bg-emerald-50 p-3 rounded-xl border border-emerald-100 shadow-sm">
              <span className="text-sm">🛡️</span>
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider">Secure Encryption</p>
                <p className="text-[10px] leading-relaxed">
                  Your payment details are encrypted and used only for transferring booking payments securely.
                  WeEnYou does not store sensitive credentials without industry-standard encryption.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
