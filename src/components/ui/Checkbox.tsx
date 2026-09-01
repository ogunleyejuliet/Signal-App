import React from 'react';
import { Check } from 'lucide-react';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(({
  label,
  checked,
  className = '',
  id,
  onChange,
  ...props
}, ref) => {
  const checkboxId = id || (typeof label === 'string' ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <label htmlFor={checkboxId} className="inline-flex items-center gap-2.5 cursor-pointer select-none">
      <div className="relative flex items-center justify-center">
        <input
          id={checkboxId}
          type="checkbox"
          ref={ref}
          checked={checked}
          onChange={onChange}
          className="sr-only"
          {...props}
        />
        <div
          className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
            checked
              ? 'bg-rose-900 border-rose-600 text-white shadow-sm'
              : 'bg-white border-slate-300 hover:border-rose-600'
          }`}
        >
          {checked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
        </div>
      </div>
      {label && <span className="text-sm text-slate-700">{label}</span>}
    </label>
  );
});

Checkbox.displayName = 'Checkbox';
