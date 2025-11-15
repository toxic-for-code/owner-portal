import React from 'react';

interface StepProgressBarProps {
  steps: string[];
  currentStep: number;
}

const StepProgressBar: React.FC<StepProgressBarProps> = ({ steps, currentStep }) => {
  return (
    <div className="flex items-center mb-8">
      {steps.map((step, idx) => (
        <div key={step} className="flex items-center">
          <div className={`rounded-full w-8 h-8 flex items-center justify-center font-bold
            ${idx < currentStep ? 'bg-green-500 text-white' : idx === currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
            {idx + 1}
          </div>
          <span className={`ml-2 text-sm font-medium ${idx === currentStep ? 'text-blue-700' : idx < currentStep ? 'text-green-700' : 'text-gray-400'}`}>{step}</span>
          {idx < steps.length - 1 && <span className="mx-2 text-gray-300">→</span>}
        </div>
      ))}
    </div>
  );
};

export default StepProgressBar; 