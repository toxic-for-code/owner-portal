import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Head from 'next/head';

import { INITIAL_FORM, STEPS, VenueFormData } from '../components/venue-form/formTypes';
import Step1BasicInfo from '../components/venue-form/Step1BasicInfo';
import Step2Overview from '../components/venue-form/Step2Overview';
import Step3Spaces from '../components/venue-form/Step3Spaces';
import Step4Pricing from '../components/venue-form/Step4Pricing';
import Step5Catering from '../components/venue-form/Step5Catering';
import Step6Accommodation from '../components/venue-form/Step6Accommodation';
import Step7Amenities from '../components/venue-form/Step7Amenities';
import Step8Photos from '../components/venue-form/Step8Photos';
import Step9Availability from '../components/venue-form/Step9Availability';
import Step10Review from '../components/venue-form/Step10Review';

const STORAGE_KEY = 'weenyou_venue_draft';

export default function ListYourHall() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<VenueFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Load draft from localStorage
  useEffect(() => {
    const draft = localStorage.getItem(STORAGE_KEY);
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        // Don't restore photos as File objects can't be serialized
        setForm({ ...INITIAL_FORM, ...parsed, photos: [] });
      } catch (e) {
        console.error('Failed to load draft', e);
      }
    }
  }, []);

  // Save draft on change
  useEffect(() => {
    const { photos, ...rest } = form;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
  }, [form]);

  // Auth Guard (Owner only)
  useEffect(() => {
    if (status === 'unauthenticated') router.push('/signin');
    if (status === 'authenticated' && (session?.user as any)?.role !== 'owner') {
      router.push('/dashboard');
    }
  }, [status, session, router]);

  const validateStep = () => {
    const newErrors: Record<string, string> = {};
    if (step === 0) {
      if (!form.name.trim()) newErrors.name = 'Venue name is required';
      if (!form.venueType) newErrors.venueType = 'Select a venue type';
      if (!form.city.trim()) newErrors.city = 'City is required';
      if (!form.state) newErrors.state = 'State is required';
      if (!form.address.trim()) newErrors.address = 'Address is required';
      if (!form.contactNumber.trim()) newErrors.contactNumber = 'Contact is required';
      if (!form.ownerEmail.trim()) newErrors.ownerEmail = 'Email is required';
      if (!form.pincode.trim()) newErrors.pincode = 'Pincode is required';
      
      // Payout validation (Optional but if filled, must be correct)
      if (form.payoutMethod === 'Bank Transfer') {
        if (form.accountNumber !== form.accountNumberConfirm) {
          newErrors.accountNumberMatch = 'Account numbers do not match';
        }
      }
    } else if (step === 1) {
      if (!form.description.trim()) newErrors.description = 'Description is required';
      else if (form.description.length < 50) newErrors.description = 'Description is too short (min 50 chars)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const next = () => {
    if (validateStep()) {
      setStep(s => Math.min(s + 1, STEPS.length - 1));
      // Removed window.scrollTo to prevent jumping
    }
  };

  const back = () => {
    setStep(s => Math.max(s - 1, 0));
    // Removed window.scrollTo to prevent jumping
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError('');

    try {
      // Prepare payload
      const payload = {
        name: form.name,
        venueType: form.venueType,
        description: form.description,
        contactNumber: form.contactNumber,
        ownerEmail: form.ownerEmail,
        
        // Payout Details
        payoutDetails: {
          payoutMethod: form.payoutMethod,
          bankDetails: form.payoutMethod === 'Bank Transfer' ? {
            accountHolderName: form.accountHolderName,
            bankName: form.bankName,
            accountNumber: form.accountNumber,
            ifscCode: form.ifscCode,
            branchName: form.branchName,
            accountType: form.accountType,
          } : undefined,
          upiId: form.payoutMethod === 'UPI ID' ? form.upiId : undefined,
        },

        address: form.address,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
        nearestAirportKm: Number(form.nearestAirportKm),
        nearestRailwayKm: Number(form.nearestRailwayKm),
        nearestMetroKm: Number(form.nearestMetroKm),
        mapEmbedUrl: form.mapEmbedUrl,
        highlights: form.highlights,
        amenities: form.amenities,
        eventSpaces: form.eventSpaces.map(({ id, name, type, area, seatingCapacity, floatingCapacity }) => ({
          name,
          type: type as any,
          area: Number(area),
          seatingCapacity: Number(seatingCapacity),
          floatingCapacity: Number(floatingCapacity)
        })),
        pricing: {
          startingPrice: Number(form.startingPrice),
          hallRental: Number(form.hallRental),
          lawnRental: Number(form.lawnRental),
          fullVenueRental: Number(form.fullVenueRental),
          pricingType: form.pricingType,
          gstApplicable: form.gstApplicable,
          gstPercent: Number(form.gstPercent),
          serviceChargePercent: Number(form.serviceChargePercent),
        },
        catering: {
          inHouse: form.inHouseCatering,
          outsideAllowed: form.outsideCateringAllowed,
          vegPlatePrice: Number(form.vegPlatePrice),
          nonVegPlatePrice: Number(form.nonVegPlatePrice),
          cuisines: form.cuisines,
          minGuests: Number(form.minGuests),
          kitchenForOutsideCaterers: form.kitchenForOutsideCaterers,
          foodServiceStyle: form.foodServiceStyle,
          liveCounters: form.liveCounters,
          dessertCounters: form.dessertCounters,
          beverageCounters: form.beverageCounters,
          bartendingService: form.bartendingService,
          alcoholPolicy: {
            served: form.alcoholServed,
            outsideAllowed: form.outsideAlcoholAllowed,
            corkageCharges: Number(form.corkageCharges),
          },
        },
        decoration: {
          inHouseDecorator: form.inHouseDecorator,
          outsideDecoratorAllowed: form.outsideDecoratorAllowed,
          startingPrice: Number(form.decorationStartingPrice),
          packages: {
            basic: Number(form.basicDecorPrice),
            premium: Number(form.premiumDecorPrice),
            luxury: Number(form.luxuryDecorPrice),
          },
          flowerDecor: {
            available: form.flowerDecorAvailable,
            startingPrice: Number(form.flowerDecorPrice),
          },
          stageSetup: form.stageSetup,
          mandapSetup: form.mandapSetup,
          lightingDecor: form.lightingDecor,
          themeDecor: form.themeDecor,
          signageAvailable: form.signageAvailable,
        },
        vendors: {
          photography: {
            allowed: form.photographyAllowed,
            outsideAllowed: form.outsidePhotographerAllowed,
            inHouseAvailable: form.inHousePhotographerAvailable,
            startingPrice: Number(form.photographyStartingPrice),
            videography: form.videographyAvailable,
            cinematic: form.cinematicVideography,
            droneAllowed: form.droneAllowed,
            photoBooth: form.photoBooth,
          },
          entertainment: {
            djAllowed: form.djAllowed,
            outsideDjAllowed: form.outsideDjAllowed,
            avgDjCost: Number(form.avgDjCost),
            liveBandAllowed: form.liveBandAllowed,
            singerPerformerAllowed: form.singerPerformerAllowed,
            dancePerformersAllowed: form.dancePerformersAllowed,
            anchorAvailable: form.anchorAvailable,
            soundSystemAvailable: form.soundSystemAvailable,
            lightingSetupAvailable: form.lightingSetupAvailable,
            fireworksAllowed: form.fireworksAllowed,
            coldPyroAllowed: form.coldPyroAllowed,
          },
          beauty: {
            bridalMakeup: form.bridalMakeupAvailable,
            makeupStartingPrice: Number(form.makeupStartingPrice),
            hairstylist: form.hairstylistAvailable,
            mehendiArtist: form.mehendiArtistAvailable,
            groomStylist: form.groomStylistAvailable,
          },
          planning: {
            weddingPlanner: form.weddingPlannerAvailable,
            plannerStartingPrice: Number(form.plannerStartingPrice),
            eventCoordinator: form.eventCoordinatorAvailable,
            dayOfManager: form.dayOfManagerAvailable,
          },
          hospitality: {
            hospitalityTeam: form.hospitalityTeamAvailable,
            transportation: form.transportationAvailable,
            shuttleService: form.shuttleServiceAvailable,
            hotelTieUps: form.hotelTieUps,
            roomBookingAssistance: form.roomBookingAssistance,
          },
          religious: {
            pandit: form.panditAvailable,
            priest: form.priestAvailable,
            qazi: form.qaziAvailable,
            ritualSupplies: form.ritualSuppliesAvailable,
            mandapCeremonySetup: form.mandapCeremonySetup,
          },
          invitations: {
            designAssistance: form.designAssistance,
            digitalInvites: form.digitalInvitationAvailable,
            weddingWebsite: form.weddingWebsiteAvailable,
            eventSignageDesign: form.eventSignageDesign,
          },
          gifts: {
            returnGiftSupplier: form.returnGiftSupplier,
            customizedGifts: form.customizedGifts,
            packagingServices: form.packagingServices,
          },
        },
        accommodation: {
          roomsAvailable: form.roomsAvailable,
          totalRooms: Number(form.totalRooms),
          startingRoomPrice: Number(form.startingRoomPrice),
          bridalSuite: form.bridalSuite,
          complimentaryRooms: Number(form.complimentaryRooms),
        },
        policies: {
          alcoholAllowed: form.alcoholAllowed,
          outsideAlcoholAllowed: form.generalOutsideAlcoholAllowed,
          musicTill: form.musicTill,
          lateNightAllowed: form.lateNightAllowed,
          cancellation: form.cancellationPolicy,
        },
        parking: {
          capacity: Number(form.parkingCapacity),
          valetAvailable: form.valetParking,
          chargesType: form.parkingCharges,
          chargesAmount: Number(form.parkingChargesAmount),
        },
        blockedDates: form.blockedDates.map(d => new Date(d)),
        allowReviews: form.allowReviews !== false,
        images: form.photos.map(p => p.url).filter(Boolean),
        photoCategories: {
          Venue: form.photos.filter(p => p.category === 'Venue').map(p => p.url).filter(Boolean),
          Decoration: form.photos.filter(p => p.category === 'Decoration').map(p => p.url).filter(Boolean),
          Rooms: form.photos.filter(p => p.category === 'Rooms').map(p => p.url).filter(Boolean),
          Food: form.photos.filter(p => p.category === 'Food').map(p => p.url).filter(Boolean),
          Stage: form.photos.filter(p => p.category === 'Stage').map(p => p.url).filter(Boolean),
          Other: form.photos.filter(p => p.category === 'Other').map(p => p.url).filter(Boolean),
        }
      };

      const res = await fetch('/api/halls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        localStorage.removeItem(STORAGE_KEY);
        setShowSuccessModal(true);
      } else {
        const data = await res.json();
        setSubmitError(data.message || 'Something went wrong while listing your venue.');
      }
    } catch (err) {
      setSubmitError('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === 'loading') return null;

  const renderStep = () => {
    switch (step) {
      case 0: return <Step1BasicInfo form={form} setForm={setForm} errors={errors} />;
      case 1: return <Step2Overview form={form} setForm={setForm} errors={errors} />;
      case 2: return <Step3Spaces form={form} setForm={setForm} />;
      case 3: return <Step4Pricing form={form} setForm={setForm} />;
      case 4: return <Step5Catering form={form} setForm={setForm} />;
      case 5: return <Step6Accommodation form={form} setForm={setForm} />;
      case 6: return <Step7Amenities form={form} setForm={setForm} />;
      case 7: return <Step8Photos form={form} setForm={setForm} />;
      case 8: return <Step9Availability form={form} setForm={setForm} />;
      case 9: return <Step10Review form={form} submitError={submitError} />;
      default: return null;
    }
  };

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Head>
        <title>List Your Venue - WeEnYou</title>
      </Head>

      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 pt-24 pb-48 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
            List Your Venue
          </h1>
          <p className="text-blue-100 text-base md:text-lg max-w-2xl mx-auto opacity-90 leading-relaxed font-medium">
            Join 500+ premium venues on WeEnYou and grow your business with confirmed bookings and high-quality leads.
          </p>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 -mt-32 pb-20 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl shadow-blue-900/5 mb-6 overflow-hidden border border-white">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
              Step {step + 1} of {STEPS.length}
            </span>
            <span className="text-xs font-black text-blue-600">
              {Math.round(progress)}% Complete
            </span>
          </div>
          
          <div className="h-1.5 w-full bg-gray-100 relative">
            <div 
              className="absolute top-0 left-0 h-full bg-blue-600 transition-all duration-500 ease-out shadow-[0_0_10px_rgba(37,99,235,0.4)]"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <div className="overflow-x-auto no-scrollbar bg-gray-50/50">
            <div className="flex px-4 py-4 min-w-max md:grid md:grid-cols-10 md:px-2">
              {STEPS.map((s, idx) => (
                <div 
                  key={idx} 
                  className={`flex flex-col items-center gap-1.5 px-3 transition-opacity duration-300 ${idx === step ? 'opacity-100 scale-110' : idx < step ? 'opacity-60' : 'opacity-30'}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-sm
                    ${idx === step ? 'bg-blue-600 text-white ring-4 ring-blue-100' : idx < step ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-500'}`}
                  >
                    {idx < step ? '✓' : s.icon}
                  </div>
                  <span className={`text-[9px] font-extrabold uppercase tracking-tighter text-center whitespace-nowrap
                    ${idx === step ? 'text-blue-600' : 'text-gray-400'}`}>
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-blue-900/5 p-6 md:p-10 border border-white min-h-[500px] flex flex-col">
          <div className="flex-1">
            {renderStep()}
          </div>

          <div className="mt-12 flex items-center justify-between pt-8 border-t border-gray-100">
            <button
              onClick={back}
              disabled={step === 0}
              className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-sm transition-all
                ${step === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100 active:scale-95'}`}
            >
              ← <span className="hidden sm:inline">Back to previous step</span><span className="sm:hidden">Back</span>
            </button>

            {step === STEPS.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-emerald-600 text-white px-10 py-4 rounded-2xl font-black text-base shadow-lg shadow-emerald-200 hover:bg-emerald-700 active:scale-95 transition-all flex items-center gap-3"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Listing Venue...
                  </>
                ) : (
                  <>Submit & Go Live 🚀</>
                )}
              </button>
            ) : (
              <button
                onClick={next}
                className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black text-base shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all flex items-center gap-2 group"
              >
                Continue <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
            )}
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-400 text-xs font-semibold">
            Need help listing your venue? 
            <a href="/contact" className="text-blue-600 ml-1 hover:underline">Contact our support team</a>
          </p>
        </div>
      </main>

      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-blue-900/40 backdrop-blur-md animate-[fadeIn_0.3s_ease]">
          <div className="bg-white rounded-[40px] shadow-2xl max-w-md w-full p-8 md:p-12 text-center relative overflow-hidden animate-[slideUp_0.4s_ease]">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-blue-500"></div>
            <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-8 shadow-inner">
              🎉
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-4 leading-tight">Submission Successful!</h2>
            <p className="text-gray-600 text-lg mb-10 leading-relaxed font-medium">
              Your venue is now being reviewed by our team. You can manage your listing and track inquiries from your dashboard.
            </p>
            <button
              onClick={() => router.push('/dashboard')}
              className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}