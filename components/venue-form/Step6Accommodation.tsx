import React from 'react';
import { VenueFormData } from './formTypes';
import { Label, Input, SectionTitle, YesNo, FieldGroup, FieldBox } from './FormUI';

interface Props {
  form: VenueFormData;
  setForm: React.Dispatch<React.SetStateAction<VenueFormData>>;
}

export default function Step6Accommodation({ form, setForm }: Props) {
  const set = (field: keyof VenueFormData) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }));

  return (
    <div className="space-y-5">
      <SectionTitle icon="🛏️" title="Accommodation" subtitle="Do you offer rooms for guests or bridal parties?" />

      <YesNo
        label="Rooms Available at venue?"
        value={form.roomsAvailable}
        onChange={v => setForm(f => ({ ...f, roomsAvailable: v }))}
      />

      {form.roomsAvailable && (
        <div className="border-2 border-blue-100 rounded-xl p-5 bg-blue-50/40 space-y-4 mt-2 animate-[fadeIn_0.3s_ease]">
          <FieldGroup cols={2}>
            <FieldBox>
              <Label>Total Rooms</Label>
              <Input type="number" value={form.totalRooms} onChange={set('totalRooms')} placeholder="e.g. 20" min={0} />
            </FieldBox>
            <FieldBox>
              <Label>Starting Room Price (₹/night)</Label>
              <Input type="number" value={form.startingRoomPrice} onChange={set('startingRoomPrice')} placeholder="e.g. 3000" min={0} />
            </FieldBox>
          </FieldGroup>
          <FieldGroup cols={2}>
            <FieldBox>
              <YesNo
                label="Bridal Suite Available?"
                value={form.bridalSuite}
                onChange={v => setForm(f => ({ ...f, bridalSuite: v }))}
              />
            </FieldBox>
            <FieldBox>
              <Label>Complimentary Rooms for Events</Label>
              <Input type="number" value={form.complimentaryRooms} onChange={set('complimentaryRooms')} placeholder="e.g. 2" min={0} />
            </FieldBox>
          </FieldGroup>
        </div>
      )}

      {form.roomsAvailable === false && (
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm text-gray-500 flex gap-2">
          <span>ℹ️</span>
          <span>No on-site accommodation. You can suggest nearby hotels in your description.</span>
        </div>
      )}
    </div>
  );
}
