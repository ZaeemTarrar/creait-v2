import React, { useState, useCallback, useMemo } from "react";
import {
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  Checkbox,
  FormGroup,
  FormControl,
  FormLabel,
  FormHelperText,
  Slider,
  Select,
  MenuItem,
  InputLabel,
  Box,
  Typography,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import type { FormInputProps } from "./FormInput.types";

const FormInput: React.FC<FormInputProps> = ({
  type,
  name,
  label,
  placeholder,
  value: controlledValue,
  defaultValue,
  options = [],
  rangeConfig,
  validation = [],
  required = false,
  className = "",
  containerClassName = "",
  onChange,
  onBlur,
  disabled = false,
  helpText,
  inline = false,
  rows = 3,
}) => {
  const isControlled = controlledValue !== undefined;

  const getInitialValue = (): string | string[] | number => {
    if (defaultValue !== undefined) return defaultValue;

    switch (type) {
      case "checkbox":
        return [];
      case "range":
        return rangeConfig?.min || 0;
      default:
        return "";
    }
  };

  const [internalValue, setInternalValue] = useState<string | string[] | number>(getInitialValue);
  const [touched, setTouched] = useState<boolean>(false);

  const currentValue = isControlled ? controlledValue : internalValue;

  // Memoized validation function that doesn't call setState
  const validateValue = useCallback(
    (valueToValidate: string | string[] | number): { isValid: boolean; error: string } => {
      let validationError = "";

      // Required validation
      if (required) {
        if (
          valueToValidate === "" ||
          valueToValidate === undefined ||
          valueToValidate === null ||
          (Array.isArray(valueToValidate) && valueToValidate.length === 0)
        ) {
          validationError = "This field is required";
        }
      }

      // Only proceed with other validations if we don't have a required error
      if (!validationError && valueToValidate) {
        const valueStr = Array.isArray(valueToValidate)
          ? valueToValidate.join(",")
          : String(valueToValidate);

        for (const rule of validation) {
          switch (rule.type) {
            case "required":
              if (!valueStr.trim()) {
                validationError = rule.message;
              }
              break;
            case "minLength":
              if (typeof rule.value === "number" && valueStr.length < rule.value) {
                validationError = rule.message;
              }
              break;
            case "maxLength":
              if (typeof rule.value === "number" && valueStr.length > rule.value) {
                validationError = rule.message;
              }
              break;
            case "pattern":
              if (rule.value instanceof RegExp && !rule.value.test(valueStr)) {
                validationError = rule.message;
              }
              break;
            case "min":
              if (typeof rule.value === "number" && Number(valueToValidate) < rule.value) {
                validationError = rule.message;
              }
              break;
            case "max":
              if (typeof rule.value === "number" && Number(valueToValidate) > rule.value) {
                validationError = rule.message;
              }
              break;
            default:
              break;
          }

          if (validationError) break;
        }
      }

      return { isValid: !validationError, error: validationError };
    },
    [required, validation]
  );

  // Memoize the current validation result
  const validationResult = useMemo(() => {
    return validateValue(currentValue);
  }, [currentValue, validateValue]);

  // Derive error state from validation result and touched state
  const error = touched ? validationResult.error : "";
  const showError = touched && Boolean(error);

  const handleChange = useCallback(
    (newValue: string | string[] | number) => {
      const validationResult = validateValue(newValue);

      if (!isControlled) {
        setInternalValue(newValue);
      }

      if (onChange) {
        onChange(name, newValue, validationResult.isValid);
      }
    },
    [isControlled, name, onChange, validateValue]
  );

  const handleBlur = useCallback(() => {
    setTouched(true);

    if (onBlur) {
      onBlur(name, currentValue);
    }
  }, [currentValue, name, onBlur]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    handleChange(e.target.value);
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(e.target.value);
  };

  const handleCheckboxChange = (optionValue: string) => {
    const currentArray = Array.isArray(currentValue) ? currentValue : [];
    const newArray = currentArray.includes(optionValue)
      ? currentArray.filter((v) => v !== optionValue)
      : [...currentArray, optionValue];
    handleChange(newArray);
  };

  const handleRangeChange = (_event: Event, newValue: number | number[]) => {
    handleChange(newValue as number);
  };

  const handleDropdownChange = (e: SelectChangeEvent<string | string[]>) => {
    handleChange(e.target.value as string);
  };

  // No useEffect needed - validation is derived from memoized value

  const inputId = `form-input-${name}`;

  const renderInput = () => {
    switch (type) {
      case "text":
      case "email":
      case "password":
        return (
          <TextField
            type={type}
            id={inputId}
            name={name}
            label={label}
            placeholder={placeholder}
            value={(currentValue as string) || ""}
            onChange={handleTextChange}
            onBlur={handleBlur}
            disabled={disabled}
            required={required}
            error={showError}
            helperText={showError ? error : helpText}
            variant="outlined"
            fullWidth
            className={className}
          />
        );

      case "textarea":
        return (
          <TextField
            id={inputId}
            name={name}
            label={label}
            placeholder={placeholder}
            value={(currentValue as string) || ""}
            onChange={handleTextChange}
            onBlur={handleBlur}
            disabled={disabled}
            required={required}
            error={showError}
            helperText={showError ? error : helpText}
            variant="outlined"
            multiline
            rows={rows}
            fullWidth
            className={className}
          />
        );

      case "radio":
        return (
          <FormControl component="fieldset" error={showError} className={className}>
            {label && (
              <FormLabel component="legend">
                {label}
                {required && " *"}
              </FormLabel>
            )}
            <RadioGroup
              name={name}
              value={(currentValue as string) || ""}
              onChange={handleRadioChange}
              onBlur={handleBlur}
              row={inline}
            >
              {options.map((option) => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={<Radio />}
                  label={option.label}
                  disabled={disabled}
                />
              ))}
            </RadioGroup>
            {(showError || helpText) && (
              <FormHelperText error={showError}>{showError ? error : helpText}</FormHelperText>
            )}
          </FormControl>
        );

      case "checkbox":
        return (
          <FormControl component="fieldset" error={showError} className={className}>
            {label && (
              <FormLabel component="legend">
                {label}
                {required && " *"}
              </FormLabel>
            )}
            <FormGroup row={inline}>
              {options.map((option) => {
                const isChecked = Array.isArray(currentValue)
                  ? currentValue.includes(option.value)
                  : false;
                return (
                  <FormControlLabel
                    key={option.value}
                    control={
                      <Checkbox
                        checked={isChecked}
                        onChange={() => handleCheckboxChange(option.value)}
                        onBlur={handleBlur}
                        name={`${name}[]`}
                        value={option.value}
                        disabled={disabled}
                      />
                    }
                    label={option.label}
                  />
                );
              })}
            </FormGroup>
            {(showError || helpText) && (
              <FormHelperText error={showError}>{showError ? error : helpText}</FormHelperText>
            )}
          </FormControl>
        );

      case "range": {
        const rangeValue = typeof currentValue === "number" ? currentValue : rangeConfig?.min || 0;
        return (
          <Box className={className}>
            {label && (
              <Typography gutterBottom>
                {label}
                {required && <span style={{ color: "red" }}> *</span>}
              </Typography>
            )}
            <Slider
              value={rangeValue}
              onChange={handleRangeChange}
              onBlur={handleBlur}
              valueLabelDisplay={rangeConfig?.showValue ? "on" : "auto"}
              valueLabelFormat={(value) =>
                `${rangeConfig?.valuePrefix || ""}${value}${rangeConfig?.valueSuffix || ""}`
              }
              min={rangeConfig?.min || 0}
              max={rangeConfig?.max || 100}
              step={rangeConfig?.step || 1}
              disabled={disabled}
              marks
            />
            {(showError || helpText) && (
              <FormHelperText error={showError}>{showError ? error : helpText}</FormHelperText>
            )}
          </Box>
        );
      }

      case "dropdown":
        return (
          <FormControl fullWidth error={showError} disabled={disabled} className={className}>
            {label && (
              <InputLabel id={`${inputId}-label`} required={required}>
                {label}
              </InputLabel>
            )}
            <Select
              labelId={`${inputId}-label`}
              id={inputId}
              value={(currentValue as string) || ""}
              onChange={handleDropdownChange}
              onBlur={handleBlur}
              label={label}
              variant="outlined"
            >
              <MenuItem value="">
                <em>{placeholder || "Select an option"}</em>
              </MenuItem>
              {options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {(showError || helpText) && (
              <FormHelperText error={showError}>{showError ? error : helpText}</FormHelperText>
            )}
          </FormControl>
        );

      default:
        return null;
    }
  };

  return (
    <Box className={containerClassName} sx={{ mb: 3 }}>
      {renderInput()}

      {(type === "text" || type === "textarea" || type === "email" || type === "password") &&
        typeof currentValue === "string" && (
          <Typography variant="caption" color="textSecondary" align="right" display="block">
            {currentValue.length} characters
          </Typography>
        )}
    </Box>
  );
};

export default FormInput;
