import React from 'react';

interface LabelProps { children: React.ReactNode; required?: boolean; }
export function Label({ children, required }: LabelProps) {
  return (
    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
      {children}{required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> { error?: string; }
export function Input({ error, className = '', ...props }: InputProps) {
  return (
    <>
      <input
        {...props}
        className={`w-full px-4 py-3 border-2 rounded-xl text-gray-900 bg-white transition-[border-color,box-shadow] duration-200
          focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100
          placeholder:text-gray-400 text-base
          ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : 'border-gray-200 hover:border-gray-300'}
          ${className}`}
      />
      {error && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><span>⚠</span>{error}</p>}
    </>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> { error?: string; }
export function Select({ error, className = '', children, ...props }: SelectProps) {
  return (
    <>
      <select
        {...props}
        className={`w-full px-4 py-3 border-2 rounded-xl text-gray-900 bg-white transition-all duration-200 appearance-none
          focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base cursor-pointer
          ${error ? 'border-red-400' : 'border-gray-200 hover:border-gray-300'}
          ${className}`}
      >
        {children}
      </select>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> { error?: string; }
export function Textarea({ error, className = '', ...props }: TextareaProps) {
  return (
    <>
      <textarea
        {...props}
        className={`w-full px-4 py-3 border-2 rounded-xl text-gray-900 bg-white transition-[border-color,box-shadow] duration-200 resize-none
          focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100
          placeholder:text-gray-400 text-base
          ${error ? 'border-red-400' : 'border-gray-200 hover:border-gray-300'}
          ${className}`}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </>
  );
}

interface YesNoProps {
  value: boolean | null;
  onChange: (v: boolean) => void;
  label?: string;
}
export function YesNo({ value, onChange, label }: YesNoProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && <Label>{label}</Label>}
      <div className="flex gap-3">
        {[true, false].map((v) => (
          <button
            key={String(v)}
            type="button"
            onClick={() => onChange(v)}
            className={`flex-1 py-2.5 px-4 rounded-xl font-semibold text-sm border-2 transition-all duration-200
              ${value === v
                ? v ? 'bg-emerald-500 border-emerald-500 text-white shadow-md' : 'bg-red-500 border-red-500 text-white shadow-md'
                : 'border-gray-200 text-gray-600 hover:border-gray-300 bg-white'}`}
          >
            {v ? '✓ Yes' : '✕ No'}
          </button>
        ))}
      </div>
    </div>
  );
}

interface SectionTitleProps { icon: string; title: string; subtitle?: string; }
export function SectionTitle({ icon, title, subtitle }: SectionTitleProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-1">
        <span className="text-2xl">{icon}</span>
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">{title}</h2>
      </div>
      {subtitle && <p className="text-gray-500 text-sm ml-11">{subtitle}</p>}
    </div>
  );
}

interface FieldGroupProps { children: React.ReactNode; cols?: 1 | 2 | 3; }
export function FieldGroup({ children, cols = 1 }: FieldGroupProps) {
  const colClass = cols === 3 ? 'grid-cols-1 sm:grid-cols-3' : cols === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1';
  return <div className={`grid ${colClass} gap-4`}>{children}</div>;
}

export function FieldBox({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

interface ChipProps {
  label: string;
  selected: boolean;
  onClick: () => void;
  color?: 'blue' | 'purple' | 'green';
}
export function Chip({ label, selected, onClick, color = 'blue' }: ChipProps) {
  const colors = {
    blue: selected ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600',
    purple: selected ? 'bg-purple-600 text-white border-purple-600' : 'border-gray-200 text-gray-600 hover:border-purple-300',
    green: selected ? 'bg-emerald-600 text-white border-emerald-600' : 'border-gray-200 text-gray-600 hover:border-emerald-300',
  };
  return (
    <button type="button" onClick={onClick}
      className={`px-3 py-1.5 rounded-full border-2 text-sm font-medium transition-all duration-200 ${colors[color]}`}>
      {label}
    </button>
  );
}

interface DividerProps { label: string; }
export function Divider({ label }: DividerProps) {
  return (
    <div className="flex items-center gap-3 my-5">
      <div className="flex-1 h-px bg-gray-200" />
      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</span>
      <div className="flex-1 h-px bg-gray-200" />
    </div>
  );
}
