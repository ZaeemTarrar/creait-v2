export type InputType =
  | "text"
  | "radio"
  | "checkbox"
  | "range"
  | "dropdown"
  | "textarea"
  | "email"
  | "password";

export interface Option {
  value: string;
  label: string;
}

export interface RangeConfig {
  min: number;
  max: number;
  step?: number;
  showValue?: boolean;
  valuePrefix?: string;
  valueSuffix?: string;
}

export type ValidationRuleType = "required" | "minLength" | "maxLength" | "pattern" | "min" | "max";

export interface ValidationRule {
  type: ValidationRuleType;
  value?: number | string | RegExp;
  message: string;
}

export interface FormInputProps {
  type: InputType;
  name: string;
  label?: string;
  placeholder?: string;
  value?: string | string[] | number;
  defaultValue?: string | string[] | number;
  options?: Option[];
  rangeConfig?: RangeConfig;
  validation?: ValidationRule[];
  required?: boolean;
  className?: string;
  containerClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
  onChange?: (name: string, value: string | string[] | number, isValid: boolean) => void;
  onBlur?: (name: string, value: string | string[] | number) => void;
  disabled?: boolean;
  helpText?: string;
  inline?: boolean;
  rows?: number;
}
