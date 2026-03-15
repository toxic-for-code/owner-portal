import React, { useState } from 'react';
import { VenueFormData, PRESET_HIGHLIGHTS } from './formTypes';
import { Label, Textarea, SectionTitle, Chip } from './FormUI';

interface Props {
  form: VenueFormData;
  setForm: React.Dispatch<React.SetStateAction<VenueFormData>>;
  errors: Record<string, string>;
}

export default function Step2Overview({ form, setForm, errors }: Props) {
  const [customHighlight, setCustomHighlight] = useState('');

  const toggleHighlight = (h: string) => {
    setForm(f => ({
      ...f,
      highlights: f.highlights.includes(h) ? f.highlights.filter(x => x !== h) : [...f.highlights, h],
    }));
  };

  const addCustom = () => {
    const val = customHighlight.trim();
    if (val && !form.highlights.includes(val)) {
      setForm(f => ({ ...f, highlights: [...f.highlights, val] }));
    }
    setCustomHighlight('');
  };

  const charCount = form.description.length;

  return (
    <div className="space-y-6">
      <SectionTitle icon="📝" title="Venue Overview & Highlights" subtitle="Help customers understand what makes your venue special." />

      <div>
        <Label required>Venue Description</Label>
        <Textarea
          value={form.description}
          onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          rows={6}
          maxLength={1000}
          placeholder="Describe your venue, its ambience, and what makes it special for weddings or events. Mention surroundings, key highlights, ideal event types…"
          error={errors.description}
        />
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-400">Be descriptive — this is the first thing customers read</span>
          <span className={`text-xs font-medium ${charCount > 900 ? 'text-orange-500' : 'text-gray-400'}`}>
            {charCount}/1000
          </span>
        </div>
      </div>

      <div>
        <Label>Venue Highlights</Label>
        <p className="text-xs text-gray-400 mb-3">Select quick highlights that describe your venue. Customers see these as tags.</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {PRESET_HIGHLIGHTS.map(h => (
            <Chip key={h} label={h} selected={form.highlights.includes(h)} onClick={() => toggleHighlight(h)} color="blue" />
          ))}
        </div>

        {form.highlights.filter(h => !PRESET_HIGHLIGHTS.includes(h)).length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {form.highlights.filter(h => !PRESET_HIGHLIGHTS.includes(h)).map(h => (
              <span key={h} className="flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                {h}
                <button type="button" onClick={() => toggleHighlight(h)} className="hover:text-purple-900 ml-0.5">×</button>
              </span>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <input
            type="text"
            value={customHighlight}
            onChange={e => setCustomHighlight(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCustom(); } }}
            placeholder="Add custom highlight…"
            className="flex-1 px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
          <button
            type="button"
            onClick={addCustom}
            className="px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors"
          >
            + Add
          </button>
        </div>
      </div>

      {form.highlights.length > 0 && (
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
          <p className="text-xs font-semibold text-gray-500 mb-2">SELECTED HIGHLIGHTS ({form.highlights.length})</p>
          <div className="flex flex-wrap gap-2">
            {form.highlights.map(h => (
              <span key={h} className="px-3 py-1 bg-blue-600 text-white rounded-full text-xs font-medium">{h}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
