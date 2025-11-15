import React, { useRef } from 'react';

interface FileUploadProps {
  label: string;
  value: string | File | null;
  onChange: (file: File | null) => void;
  accept?: string;
  tooltip?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ label, value, onChange, accept, tooltip }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  let preview: React.ReactNode = null;
  if (typeof value === 'string' && value) {
    if (value.match(/\.(jpg|jpeg|png|gif)$/i)) {
      preview = <img src={value} alt="preview" className="w-24 h-24 object-cover rounded mb-2" />;
    } else {
      preview = <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{value.split('/').pop()}</a>;
    }
  } else if (value instanceof File) {
    if (value.type.startsWith('image/')) {
      preview = <img src={URL.createObjectURL(value)} alt="preview" className="w-24 h-24 object-cover rounded mb-2" />;
    } else {
      preview = <span className="text-green-700 font-medium mb-2">{value.name}</span>;
    }
  }

  return (
    <div className="mb-4">
      <label className="block font-semibold mb-1">
        {label}
        {tooltip && (
          <span className="ml-1 text-xs text-gray-400" title={tooltip}>ⓘ</span>
        )}
      </label>
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition"
        onClick={() => inputRef.current?.click()}
      >
        <input
          type="file"
          accept={accept}
          ref={inputRef}
          className="hidden"
          onChange={e => {
            if (e.target.files && e.target.files[0]) {
              onChange(e.target.files[0]);
            } else {
              onChange(null);
            }
          }}
        />
        {preview}
        {!value && (
          <span className="text-gray-500">Drag & drop or <span className="text-blue-600 underline">click to upload</span></span>
        )}
        {value && (
          <button
            type="button"
            className="text-red-600 text-xs underline mt-2"
            onClick={e => { e.stopPropagation(); onChange(null); }}
          >Remove</button>
        )}
      </div>
    </div>
  );
};

export default FileUpload; 