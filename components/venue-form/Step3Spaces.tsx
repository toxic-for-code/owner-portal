import React from 'react';
import { VenueFormData, EventSpace, SPACE_TYPES } from './formTypes';
import { Label, Input, Select, SectionTitle } from './FormUI';

interface Props {
  form: VenueFormData;
  setForm: React.Dispatch<React.SetStateAction<VenueFormData>>;
}

function genId() { return Math.random().toString(36).substr(2, 9); }

export default function Step3Spaces({ form, setForm }: Props) {
  const addSpace = () => {
    const newSpace: EventSpace = { id: genId(), name: '', type: 'Hall', area: '', seatingCapacity: '', floatingCapacity: '' };
    setForm(f => ({ ...f, eventSpaces: [...f.eventSpaces, newSpace] }));
  };

  const updateSpace = (id: string, field: keyof EventSpace, value: string) => {
    setForm(f => ({ ...f, eventSpaces: f.eventSpaces.map(s => s.id === id ? { ...s, [field]: value } : s) }));
  };

  const removeSpace = (id: string) => {
    setForm(f => ({ ...f, eventSpaces: f.eventSpaces.filter(s => s.id !== id) }));
  };

  return (
    <div className="space-y-5">
      <SectionTitle icon="🏟️" title="Event Spaces" subtitle="Add all the event spaces your venue offers. Each is shown separately to customers." />

      {form.eventSpaces.length === 0 && (
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
          <div className="text-4xl mb-3">🏟️</div>
          <p className="text-gray-500 text-sm mb-1">No spaces added yet</p>
          <p className="text-gray-400 text-xs">Click "Add Space" to list your banquet halls, lawns, rooftops, etc.</p>
        </div>
      )}

      {form.eventSpaces.map((space, idx) => (
        <div key={space.id} className="border-2 border-gray-100 rounded-xl p-5 bg-gradient-to-br from-white to-gray-50 relative">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full">Space #{idx + 1}</span>
            <button
              type="button"
              onClick={() => removeSpace(space.id)}
              className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-colors text-sm font-semibold"
            >
              ✕ Remove
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label required>Space Name</Label>
              <Input
                value={space.name}
                onChange={e => updateSpace(space.id, 'name', e.target.value)}
                placeholder="e.g. Grand Ballroom"
              />
            </div>
            <div>
              <Label>Space Type</Label>
              <Select value={space.type} onChange={e => updateSpace(space.id, 'type', e.target.value)}>
                {SPACE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </Select>
            </div>
            <div>
              <Label>Area (sq ft)</Label>
              <Input
                type="number"
                value={space.area}
                onChange={e => updateSpace(space.id, 'area', e.target.value)}
                placeholder="e.g. 5000"
                min={0}
              />
            </div>
            <div>
              <Label>Seating Capacity</Label>
              <Input
                type="number"
                value={space.seatingCapacity}
                onChange={e => updateSpace(space.id, 'seatingCapacity', e.target.value)}
                placeholder="e.g. 300"
                min={0}
              />
            </div>
            <div>
              <Label>Floating Capacity</Label>
              <Input
                type="number"
                value={space.floatingCapacity}
                onChange={e => updateSpace(space.id, 'floatingCapacity', e.target.value)}
                placeholder="e.g. 500"
                min={0}
              />
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addSpace}
        className="w-full py-3.5 border-2 border-dashed border-blue-300 text-blue-600 rounded-xl font-semibold text-sm hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 flex items-center justify-center gap-2"
      >
        <span className="text-lg">+</span> Add Event Space
      </button>

      <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 flex gap-2 text-xs text-amber-700">
        <span>💡</span>
        <span>Examples: Grand Ballroom, Garden Lawn, Poolside Terrace, Conference Hall</span>
      </div>
    </div>
  );
}
