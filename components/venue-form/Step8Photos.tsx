import React, { useRef, useState } from 'react';
import { VenueFormData, PhotoEntry, PHOTO_CATEGORIES } from './formTypes';
import { SectionTitle } from './FormUI';

interface Props {
  form: VenueFormData;
  setForm: React.Dispatch<React.SetStateAction<VenueFormData>>;
}

export default function Step8Photos({ form, setForm }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeCategory, setActiveCategory] = useState('Venue');
  const [dragging, setDragging] = useState(false);

  const handleFiles = async (files: File[]) => {
    const images = files.filter(f => f.type.startsWith('image/'));
    if (!images.length) return;

    const newEntries: PhotoEntry[] = images.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      url: '',
      category: activeCategory,
    }));

    setForm(f => ({ ...f, photos: [...f.photos, ...newEntries] }));

    // Upload to server
    const fd = new FormData();
    images.forEach(img => fd.append('file', img));
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      if (res.ok) {
        const data = await res.json();
        const urls: string[] = data.urls || [];
        setForm(f => {
          const updated = [...f.photos];
          let urlIdx = 0;
          for (let i = updated.length - images.length; i < updated.length; i++) {
            if (urls[urlIdx]) updated[i] = { ...updated[i], url: urls[urlIdx++] };
          }
          return { ...f, photos: updated };
        });
      }
    } catch {}
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(Array.from(e.dataTransfer.files));
  };

  const removePhoto = (idx: number) => {
    setForm(f => { const p = [...f.photos]; p.splice(idx, 1); return { ...f, photos: p }; });
  };

  const changeCategory = (idx: number, cat: string) => {
    setForm(f => { const p = [...f.photos]; p[idx] = { ...p[idx], category: cat }; return { ...f, photos: p }; });
  };

  const byCategory = (cat: string) => form.photos.filter(p => p.category === cat);

  return (
    <div className="space-y-5">
      <SectionTitle icon="📸" title="Venue Photos" subtitle="Venues with 10+ photos receive 5× more bookings. Min 5 recommended." />

      {/* Category selector */}
      <div>
        <p className="text-sm font-semibold text-gray-600 mb-2">Upload photos into categories:</p>
        <div className="flex flex-wrap gap-2">
          {PHOTO_CATEGORIES.map(c => (
            <button key={c} type="button"
              onClick={() => setActiveCategory(c)}
              className={`px-3 py-1.5 rounded-full border-2 text-sm font-medium transition-all
                ${activeCategory === c ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-200 text-gray-600 hover:border-blue-300'}`}>
              {c} {byCategory(c).length > 0 && `(${byCategory(c).length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Drop zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200
          ${dragging ? 'border-blue-500 bg-blue-50 scale-[1.01]' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'}`}
      >
        <input type="file" accept="image/*" multiple ref={fileInputRef} className="hidden"
          onChange={e => handleFiles(Array.from(e.target.files || []))} />
        <div className="text-4xl mb-3">{dragging ? '⬇️' : '📷'}</div>
        <p className="font-semibold text-gray-700 mb-1">
          {dragging ? 'Drop images here!' : `Upload to "${activeCategory}"`}
        </p>
        <p className="text-sm text-gray-400">Drag & drop or <span className="text-blue-600 underline">click to browse</span></p>
        <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP supported</p>
      </div>

      {/* Photo grid */}
      {form.photos.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-gray-600 mb-3">
            All uploaded photos ({form.photos.length})
            {form.photos.length < 5 && (
              <span className="ml-2 text-orange-500 text-xs">⚠ Recommend at least 5</span>
            )}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {form.photos.map((p, idx) => (
              <div key={idx} className="relative group rounded-xl overflow-hidden border border-gray-200 aspect-square bg-gray-100">
                <img src={p.preview} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                  <button type="button" onClick={() => removePhoto(idx)}
                    className="self-end bg-red-500 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center hover:bg-red-600">
                    ✕
                  </button>
                  <select
                    value={p.category}
                    onChange={e => changeCategory(idx, e.target.value)}
                    onClick={e => e.stopPropagation()}
                    className="text-xs bg-white/90 rounded-lg px-1 py-0.5 border-0 focus:outline-none cursor-pointer">
                    {PHOTO_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                {/* Category badge */}
                <span className="absolute top-1 left-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {p.category}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
