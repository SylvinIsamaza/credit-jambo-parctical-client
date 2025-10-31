'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
  error?: boolean;
}

export function OtpInput({ 
  length = 6, 
  value, 
  onChange, 
  disabled = false, 
  className,
  error = false 
}: OtpInputProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length);
  }, [length]);

  useEffect(() => {
    if (inputRefs.current[activeIndex]) {
      inputRefs.current[activeIndex]?.focus();
    }
  }, [activeIndex]);

  const handleChange = (index: number, inputValue: string) => {
    const newValue = value.split('');
    newValue[index] = inputValue;
    const result = newValue.join('');
    
    onChange(result);

    if (inputValue && index < length - 1) {
      setActiveIndex(index + 1);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!value[index] && index > 0) {
        setActiveIndex(index - 1);
      } else {
        const newValue = value.split('');
        newValue[index] = '';
        onChange(newValue.join(''));
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      setActiveIndex(index - 1);
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      setActiveIndex(index + 1);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').slice(0, length);
    onChange(pastedData);
    
    if (pastedData.length === length) {
      setActiveIndex(length - 1);
    } else {
      setActiveIndex(pastedData.length);
    }
  };

  return (
    <div className={cn('flex gap-2 justify-center', className)}>
      {Array.from({ length }, (_, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={value[index] || ''}
          onChange={(e) => {
            const inputValue = e.target.value.replace(/[^0-9]/g, '');
            handleChange(index, inputValue);
          }}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          onFocus={() => setActiveIndex(index)}
          disabled={disabled}
          className={cn(
            'w-12 h-12 text-center text-lg font-semibold border rounded-lg',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
            'transition-all duration-200',
            error 
              ? 'border-red-500 bg-red-50' 
              : 'border-gray-300 bg-white hover:border-gray-400',
            disabled && 'opacity-50 cursor-not-allowed',
            activeIndex === index && !disabled && 'ring-2 ring-blue-500 border-transparent'
          )}
        />
      ))}
    </div>
  );
}