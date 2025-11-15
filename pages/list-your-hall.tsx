import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

const STEPS = [
  'Venue Details',
  'Location',
  'Pricing',
  'Amenities',
  'Photos',
  'Review & Submit',
];

const AMENITIES = [
  'Parking',
  'Air Conditioning',
  'Wi-Fi',
  'Catering',
  'Stage',
  'Audio/Visual Equipment',
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const ListYourHall: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    name: '',
    description: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    price: '',
    capacity: '',
    amenities: [...AMENITIES],
    customAmenities: [] as string[],
    selectedAmenities: [] as string[],
    photos: [] as File[],
    photoPreviews: [] as string[],
    photoUrls: [] as string[],
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  // Auth check
  useEffect(() => {
    if (status === 'loading') return;
    if (!session || (session.user as any)?.role !== 'owner') {
      router.replace('/signup');
      return;
    }
  }, [session, status, router]);

  // Validation logic for each step
  const validateStep = () => {
    let errs: { [key: string]: string } = {};
    if (step === 0) {
      if (!form.name.trim()) errs.name = 'Venue name is required.';
      if (!form.description.trim()) errs.description = 'Description is required.';
    } else if (step === 1) {
      if (!form.address.trim()) errs.address = 'Address is required.';
      if (!form.city.trim()) errs.city = 'City is required.';
      if (!form.state.trim()) errs.state = 'State is required.';
      if (!form.pincode.trim()) errs.pincode = 'Pincode is required.';
      else if (!/^\d{6}$/.test(form.pincode)) errs.pincode = 'Pincode must be 6 digits.';
    } else if (step === 2) {
      if (!form.price.trim()) errs.price = 'Price is required.';
      else if (Number(form.price) < 500) errs.price = 'Minimum price is 500.';
      if (!form.capacity.trim()) errs.capacity = 'Capacity is required.';
      else if (Number(form.capacity) < 50) errs.capacity = 'Minimum capacity is 50.';
    } else if (step === 3) {
      if (form.selectedAmenities.length === 0) errs.amenities = 'Select at least one amenity.';
    } else if (step === 4) {
      if (form.photos.length === 0) errs.photos = 'Upload at least one photo.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Step navigation
  const nextStep = () => {
    if (validateStep()) setStep((s) => s + 1);
  };
  const prevStep = () => setStep((s) => s - 1);

  // Form field change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  // Amenities
  const handleAmenityChange = (amenity: string) => {
    setForm((f) => {
      const selected = f.selectedAmenities.includes(amenity)
        ? f.selectedAmenities.filter((a) => a !== amenity)
        : [...f.selectedAmenities, amenity];
      return { ...f, selectedAmenities: selected };
    });
  };
  const [customAmenity, setCustomAmenity] = useState('');
  const addCustomAmenity = () => {
    const trimmed = customAmenity.trim();
    if (trimmed && !form.amenities.includes(trimmed)) {
      setForm((f) => ({
        ...f,
        amenities: [...f.amenities, trimmed],
        selectedAmenities: [...f.selectedAmenities, trimmed],
        customAmenities: [...f.customAmenities, trimmed],
      }));
      setCustomAmenity('');
    }
  };

  // Photos
  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length) {
      setForm((f) => ({
        ...f,
        photos: [...f.photos, ...files],
        photoPreviews: [
          ...f.photoPreviews,
          ...files.map((file) => URL.createObjectURL(file)),
        ],
      }));
      // Upload files to /api/upload
      const formData = new FormData();
      files.forEach((file) => formData.append('file', file));
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        console.log('Upload response (handlePhotoChange):', data);
        setForm((f) => ({
          ...f,
          photoUrls: [...f.photoUrls, ...(data.urls || [])],
        }));
      }
    }
  };
  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith('image/'));
    if (files.length) {
      setForm((f) => ({
        ...f,
        photos: [...f.photos, ...files],
        photoPreviews: [
          ...f.photoPreviews,
          ...files.map((file) => URL.createObjectURL(file)),
        ],
      }));
      // Upload files to /api/upload
      const formData = new FormData();
      files.forEach((file) => formData.append('file', file));
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        console.log('Upload response (handleDrop):', data);
        setForm((f) => ({
          ...f,
          photoUrls: [...f.photoUrls, ...(data.urls || [])],
        }));
      }
    }
  };
  const removePhoto = (idx: number) => {
    setForm((f) => {
      const newPhotos = [...f.photos];
      const newPreviews = [...f.photoPreviews];
      newPhotos.splice(idx, 1);
      newPreviews.splice(idx, 1);
      return { ...f, photos: newPhotos, photoPreviews: newPreviews };
    });
  };

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess('');
    if (step < STEPS.length - 1) {
      nextStep();
      return;
    }
    console.log('Submitting hall with images:', form.photoUrls);
    const payload = {
      name: form.name,
      description: form.description,
      images: form.photoUrls, // Use uploaded URLs
      price: Number(form.price),
      capacity: Number(form.capacity),
      amenities: form.selectedAmenities,
      address: form.address,
      city: form.city,
      state: form.state,
      pincode: form.pincode,
    };
    console.log('Payload to /api/halls:', payload);
    try {
      const res = await fetch('/api/halls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json();
        setSubmitError(data.message || 'Failed to submit hall');
      } else {
        setShowModal(true);
        setSubmitSuccess('Hall submitted successfully!');
      }
    } catch (err) {
      setSubmitError('Failed to submit hall');
    }
  };
  const handleModalClose = () => {
    setShowModal(false);
    router.push('/dashboard');
  };

  // Step content
  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Let's start with your venue details</h2>
            <div>
              <label className="block font-medium">Venue Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Grand Palace Hall"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block font-medium">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                className="mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe your venue, its ambiance, and what makes it special."
                rows={4}
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Where is your venue located?</h2>
            <div>
              <label className="block font-medium">Address</label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                className="mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Street address"
              />
              {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block font-medium">City</label>
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  className="mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="City"
                />
                {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
              </div>
              <div>
                <label className="block font-medium">State</label>
                <input
                  type="text"
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  className="mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="State"
                />
                {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
              </div>
              <div>
                <label className="block font-medium">Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  value={form.pincode}
                  onChange={handleChange}
                  className="mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="6-digit pincode"
                  maxLength={6}
                />
                {errors.pincode && <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>}
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Pricing & Capacity</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium">Price (per event)</label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  className="mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. 5000"
                  min={500}
                />
                {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
              </div>
              <div>
                <label className="block font-medium">Capacity</label>
                <input
                  type="number"
                  name="capacity"
                  value={form.capacity}
                  onChange={handleChange}
                  className="mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. 200"
                  min={50}
                />
                {errors.capacity && <p className="text-red-500 text-sm mt-1">{errors.capacity}</p>}
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Amenities</h2>
            <p className="text-gray-600">Select all amenities your venue offers. Add custom ones if needed!</p>
            <div className="flex flex-wrap gap-3">
              {form.amenities.map((amenity) => (
                <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.selectedAmenities.includes(amenity)}
                    onChange={() => handleAmenityChange(amenity)}
                    className="accent-blue-600"
                  />
                  <span>{amenity}</span>
                </label>
              ))}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <input
                type="text"
                value={customAmenity}
                onChange={(e) => setCustomAmenity(e.target.value)}
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add custom amenity"
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustomAmenity(); } }}
              />
              <button
                type="button"
                onClick={addCustomAmenity}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Add
              </button>
            </div>
            {errors.amenities && <p className="text-red-500 text-sm mt-1">{errors.amenities}</p>}
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Upload Photos</h2>
            <p className="text-gray-600">Showcase your venue! Drag and drop or click to upload images.</p>
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition"
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
            >
              <input
                type="file"
                accept="image/*"
                multiple
                ref={fileInputRef}
                className="hidden"
                onChange={handlePhotoChange}
              />
              <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4a1 1 0 011-1h8a1 1 0 011 1v12m-4 4h-4a1 1 0 01-1-1v-4h6v4a1 1 0 01-1 1z" /></svg>
              <span className="text-gray-500">Drag & drop or <span className="text-blue-600 underline">click to upload</span></span>
            </div>
            {form.photoPreviews.length > 0 && (
              <div className="flex flex-wrap gap-4 mt-4">
                {form.photoPreviews.map((src, idx) => (
                  <div key={idx} className="relative w-32 h-32">
                    <img src={src} alt={`Venue photo ${idx + 1}`} className="object-cover w-full h-full rounded" />
                    <button
                      type="button"
                      onClick={() => removePhoto(idx)}
                      className="absolute top-1 right-1 bg-white bg-opacity-80 rounded-full p-1 hover:bg-red-100"
                    >
                      <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
            {errors.photos && <p className="text-red-500 text-sm mt-1">{errors.photos}</p>}
          </div>
        );
      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Review & Submit</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Venue Details</h3>
              <p><span className="font-medium">Name:</span> {form.name}</p>
              <p><span className="font-medium">Description:</span> {form.description}</p>
              <h3 className="font-semibold mt-4 mb-2">Location</h3>
              <p><span className="font-medium">Address:</span> {form.address}</p>
              <p><span className="font-medium">City:</span> {form.city}</p>
              <p><span className="font-medium">State:</span> {form.state}</p>
              <p><span className="font-medium">Pincode:</span> {form.pincode}</p>
              <h3 className="font-semibold mt-4 mb-2">Pricing</h3>
              <p><span className="font-medium">Price:</span> ₹{form.price}</p>
              <p><span className="font-medium">Capacity:</span> {form.capacity}</p>
              <h3 className="font-semibold mt-4 mb-2">Amenities</h3>
              <p>{form.selectedAmenities.join(', ')}</p>
              <h3 className="font-semibold mt-4 mb-2">Photos</h3>
              <div className="flex flex-wrap gap-2">
                {form.photoPreviews.map((src, idx) => (
                  <img key={idx} src={src} alt={`Preview ${idx + 1}`} className="w-16 h-16 object-cover rounded" />
                ))}
              </div>
            </div>
            {submitError && <div className="text-red-600 text-center text-sm mb-2">{submitError}</div>}
            {submitSuccess && <div className="text-green-600 text-center text-sm mb-2">{submitSuccess}</div>}
          </div>
        );
      default:
        return null;
    }
  };



  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full bg-white shadow z-20">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="WeEnYou Logo" width={36} height={36} className="h-9 w-9 object-contain" />
            <span className="text-lg sm:text-xl font-bold tracking-tight text-blue-700">WeEnYou Hall Owner Portal</span>
          </div>
          <a href="/dashboard" className="ml-auto">
            <div className="flex items-center gap-2 border border-gray-200 rounded-full px-6 py-2 bg-white hover:shadow transition cursor-pointer">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A9 9 0 1112 21a8.963 8.963 0 01-6.879-3.196z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              <span className="font-semibold text-lg text-gray-700">Welcome, Guest</span>
            </div>
          </a>
        </div>
      </nav>

      {/* Main content */}
      <main className="pt-20 max-w-5xl mx-auto px-4 pb-16">
        {/* Hero */}
        <section className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">List Your Hall</h1>
          <p className="text-lg md:text-xl text-gray-600 mb-4">Reach thousands of event planners and grow your business.</p>
          <span className="inline-flex items-center bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            Trusted by 500+ venues
          </span>
        </section>

        {/* Why list with us */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-3 text-center">Why list with us?</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto text-left">
            <li className="flex items-start gap-2">
              <span className="mt-1 text-blue-600">•</span>
              <span>Get discovered by thousands of event organizers every month</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 text-blue-600">•</span>
              <span>Easy-to-use dashboard to manage bookings and inquiries</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 text-blue-600">•</span>
              <span>Dedicated support team to help you succeed</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 text-blue-600">•</span>
              <span>No hidden fees – transparent pricing</span>
            </li>
          </ul>
        </section>

        {/* Stepper */}
        <section className="mb-8">
          <ol className="flex flex-wrap items-center justify-center gap-2 md:gap-4">
            {STEPS.map((label, idx) => (
              <li key={label} className="flex items-center">
                <div className={classNames(
                  'rounded-full w-8 h-8 flex items-center justify-center font-bold',
                  idx === step ? 'bg-blue-600 text-white' : idx < step ? 'bg-blue-200 text-blue-800' : 'bg-gray-200 text-gray-500',
                )}>{idx + 1}</div>
                <span className={classNames(
                  'ml-2 text-sm font-medium',
                  idx === step ? 'text-blue-700' : idx < step ? 'text-blue-600' : 'text-gray-400',
                )}>{label}</span>
                {idx < STEPS.length - 1 && <span className="mx-2 text-gray-300">→</span>}
              </li>
            ))}
          </ol>
        </section>

        {/* Form */}
        {step < STEPS.length - 1 ? (
          <div className="bg-white/60 backdrop-blur-md rounded-2xl shadow-xl p-6 md:p-10 border border-white/40">
            {renderStep()}
            <div className="flex justify-between mt-8">
              {step > 0 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
                >
                  Back
                </button>
              )}
              <div className="flex-1" />
              <button
                type="button"
                onClick={nextStep}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              >
                Next
              </button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white/60 backdrop-blur-md rounded-2xl shadow-xl p-6 md:p-10 border border-white/40"
          >
            {renderStep()}
            <div className="flex justify-between mt-8">
              {step > 0 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
                >
                  Back
                </button>
              )}
              <div className="flex-1" />
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
              >
                Submit
              </button>
            </div>
          </form>
        )}
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full text-center">
            <h2 className="text-2xl font-bold mb-4">Your hall is under review</h2>
            <p className="mb-6">Our team will verify your submission before it goes live. Thank you for listing with us!</p>
            <button
              onClick={handleModalClose}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Go to Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListYourHall;