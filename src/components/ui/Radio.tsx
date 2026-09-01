import React from 'react';

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode;
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(({
  label,
  checked,
  className = '',
  id,
  onChange,
  ...props
}, ref) => {
  const radioId = id || (typeof label === 'string' ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <label htmlFor={radioId} className="inline-flex items-center gap-2.5 cursor-pointer select-none">
      <div className="relative flex items-center justify-center">
        <input
          id={radioId}
          type="radio"
          ref={ref}
          checked={checked}
          onChange={onChange}
          className="sr-only"
          {...props}
        />
        <div
          className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
            checked
              ? 'border-rose-600 bg-white shadow-sm'
              : 'bg-white border-slate-300 hover:border-rose-600'
          }`}
        >
          {checked && <div className="w-2.5 h-2.5 rounded-full bg-rose-600" />}
        </div>
      </div>
      {label && <span className="text-sm text-slate-700">{label}</span>}
    </label>
  );
});

Radio.displayName = 'Radio';
