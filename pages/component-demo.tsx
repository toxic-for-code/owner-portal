import React, { useState } from 'react';
import BookingApprovalCard from '../components/BookingApprovalCard';

export default function ComponentDemo() {
  const [remark, setRemark] = useState('');
  return (
    <div className="min-h-screen bg-[#f8f9fa] py-12">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">Booking Request Card Preview</h1>
        <BookingApprovalCard
          bookingId="BK-20241115-001"
          statusText="pending_owner_confirmation"
          statusClass="bg-yellow-100 text-yellow-800"
          eventText="Wedding Reception • 250 guests • 24 Dec 2025"
          hallName="WeEnYou Grand Hall"
          customerName="Aarav Sharma"
          customerPhone="+91 98765 43210"
          customerEmail="aarav.sharma@example.com"
          paymentStatus="Payment Initiated"
          amountToOwner={50000}
          advancePaid={15000}
          dueAmount={35000}
          managerText="Priya Singh ( +91 91234 56789 )"
          remark={remark}
          onRemarkChange={setRemark}
          onApprove={() => alert('Approve clicked')}
          onDecline={() => alert('Decline clicked')}
          showActions={true}
          bookingUrl="#"
        />
      </div>
    </div>
  );
}