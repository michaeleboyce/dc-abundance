import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  dark?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, dark, id, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'block text-sm font-medium mb-1.5',
              dark ? 'text-white' : 'text-neutral-700'
            )}
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full px-4 py-3 rounded-lg border border-neutral-200 bg-white',
            'placeholder:text-neutral-400',
            'focus:outline-none focus:ring-2 focus:ring-accent-500/50 focus:border-accent-500',
            'transition-all duration-200',
            'shadow-sm focus:shadow-md',
            error && 'border-red-500 focus:ring-red-500/50 focus:border-red-500',
            className
          )}
          {...props}
        />
        {error && (
          <p className={cn(
            'mt-1.5 text-sm',
            dark ? 'text-red-300' : 'text-red-500'
          )}>{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
