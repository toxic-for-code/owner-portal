import React, { useState } from 'react';
import { VenueFormData } from './formTypes';
import { SectionTitle, YesNo, Label } from './FormUI';

interface Props {
  form: VenueFormData;
  setForm: React.Dispatch<React.SetStateAction<VenueFormData>>;
}

export default function Step9Availability({ form, setForm }: Props) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const toggleDate = (dateStr: string) => {
    setForm(f => {
      const isBlocked = f.blockedDates.includes(dateStr);
      const newBlocked = isBlocked 
        ? f.blockedDates.filter(d => d !== dateStr)
        : [...f.blockedDates, dateStr];
      return { ...f, blockedDates: newBlocked };
    });
  };

  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    const monthName = currentMonth.toLocaleString('default', { month: 'long' });

    // Header
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10 md:h-12" />);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const dateStr = date.toISOString().split('T')[0];
      const isToday = new Date().toISOString().split('T')[0] === dateStr;
      const isBlocked = form.blockedDates.includes(dateStr);
      const isPast = date < new Date(new Date().setHours(0,0,0,0));

      days.push(
        <button
          key={d}
          type="button"
          disabled={isPast}
          onClick={() => toggleDate(dateStr)}
          className={`h-10 md:h-12 rounded-lg flex items-center justify-center text-sm font-semibold transition-all relative
            ${isPast ? 'text-gray-300 cursor-not-allowed' : 'hover:scale-105'}
            ${isBlocked ? 'bg-red-500 text-white shadow-sm' : isToday ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'bg-white border border-gray-100 text-gray-700 hover:border-blue-300'}
          `}
        >
          {d}
          {isBlocked && <span className="absolute bottom-1 w-1 h-1 bg-white rounded-full"></span>}
        </button>
      );
    }

    return (
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="bg-gray-50 px-4 py-3 border-bottom border-gray-200 flex items-center justify-between">
          <h3 className="font-bold text-gray-800">{monthName} {year}</h3>
          <div className="flex gap-2">
            <button 
              type="button" 
              onClick={() => setCurrentMonth(new Date(year, month - 1))}
              className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
            >
              ←
            </button>
            <button 
              type="button" 
              onClick={() => setCurrentMonth(new Date(year, month + 1))}
              className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
            >
              →
            </button>
          </div>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekdays.map(w => (
              <div key={w} className="text-center text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                {w}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {days}
          </div>
        </div>
        <div className="bg-gray-50 p-3 border-t border-gray-100 flex flex-wrap gap-4 justify-center text-[10px] md:text-xs">
          <div className="flex items-center gap-1.5 text-gray-500">
            <div className="w-3 h-3 rounded bg-white border border-gray-200"></div> Available
          </div>
          <div className="flex items-center gap-1.5 text-gray-500">
            <div className="w-3 h-3 rounded bg-red-500"></div> Blocked / Booked
          </div>
          <div className="flex items-center gap-1.5 text-gray-500">
            <div className="w-3 h-3 rounded bg-blue-50 border border-blue-200"></div> Today
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <SectionTitle 
        icon="📅" 
        title="Availability & Reviews" 
        subtitle="Manage your calendar and set customer interaction preferences." 
      />

      <div className="space-y-4">
        <Label>Availability Calendar</Label>
        <p className="text-xs text-gray-500 mb-2">Click on dates to block them (e.g., if already booked outside WeEnYou or for maintenance).</p>
        {renderCalendar()}
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
        <div className="flex gap-3">
          <span className="text-xl">🛡️</span>
          <div>
            <h4 className="font-bold text-blue-900 text-sm">Instant Booking Control</h4>
            <p className="text-xs text-blue-700 mt-1 leading-relaxed">
              Customers can see these blocked dates. Keeping this updated prevents unnecessary inquiries for busy dates.
            </p>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-100">
        <YesNo 
          label="Allow Customer Reviews?" 
          value={form.allowReviews} 
          onChange={(v) => setForm(f => ({ ...f, allowReviews: v }))} 
        />
        <p className="text-xs text-gray-400 mt-2">
          Public reviews help build trust. We recommend keeping this enabled.
        </p>
      </div>
    </div>
  );
}
