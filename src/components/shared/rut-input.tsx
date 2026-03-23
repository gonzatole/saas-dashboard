"use client";

import { forwardRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { esRutValido, formatearRut } from "@/lib/validations/worker";

interface RutInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  value?: string;
  onChange?: (value: string) => void;
  showValidation?: boolean;
}

export const RutInput = forwardRef<HTMLInputElement, RutInputProps>(
  ({ value = "", onChange, showValidation = true, className, onBlur, ...props }, ref) => {
    const [touched, setTouched] = useState(false);

    const clean = value.replace(/[.\-\s]/g, "").toLowerCase();
    const isValid = clean.length >= 8 && esRutValido(value);
    const showError = showValidation && touched && clean.length > 0 && !isValid;
    const showSuccess = showValidation && touched && clean.length >= 8 && isValid;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      // Only allow digits, k/K, dots, dashes
      const filtered = raw.replace(/[^0-9kK.\-]/g, "");
      onChange?.(filtered);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setTouched(true);
      // Auto-format on blur if valid
      const clean = value.replace(/[.\-\s]/g, "").toLowerCase();
      if (clean.length >= 8 && esRutValido(value)) {
        onChange?.(formatearRut(value));
      }
      onBlur?.(e);
    };

    return (
      <div className="relative">
        <Input
          ref={ref}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="12.345.678-9"
          maxLength={12}
          className={cn(
            showError && "border-red-500 focus-visible:ring-red-500",
            showSuccess && "border-emerald-500 focus-visible:ring-emerald-500",
            className
          )}
          {...props}
        />
        {showError && (
          <p className="mt-1 text-xs text-red-500">RUT inválido</p>
        )}
        {showSuccess && (
          <p className="mt-1 text-xs text-emerald-600">RUT válido ✓</p>
        )}
      </div>
    );
  }
);

RutInput.displayName = "RutInput";
