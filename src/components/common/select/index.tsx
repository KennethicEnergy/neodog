import * as React from 'react';
import styles from './styles.module.scss';

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  options: SelectOption[];
  placeholder?: string;
  error?: boolean;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onValueChange?: (value: string) => void;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      options,
      placeholder = 'Select an option',
      error,
      helperText,
      leftIcon,
      rightIcon,
      disabled,
      onChange,
      onValueChange,
      value,
      ...props
    },
    ref
  ) => {
    const selectId = React.useId();
    const helperTextId = `${selectId}-helper-text`;

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newValue = e.target.value;
      onChange?.(e);
      onValueChange?.(newValue);
    };

    return (
      <div className={styles.selectWrapper}>
        {leftIcon && (
          <div className={styles.leftIcon} aria-hidden="true">
            {leftIcon}
          </div>
        )}
        <select
          className={`
            ${styles.select}
            ${error ? styles.error : ''}
            ${leftIcon ? styles.hasLeftIcon : ''}
            ${rightIcon ? styles.hasRightIcon : ''}
            ${className || ''}
          `}
          ref={ref}
          disabled={disabled}
          aria-invalid={error}
          aria-describedby={helperText ? helperTextId : undefined}
          value={value}
          onChange={handleChange}
          {...props}>
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>
        {rightIcon && (
          <div className={styles.rightIcon} aria-hidden="true">
            {rightIcon}
          </div>
        )}
        {helperText && (
          <p
            id={helperTextId}
            className={`${styles.helperText} ${error ? styles.error : ''}`}
            role={error ? 'alert' : undefined}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);
Select.displayName = 'Select';

export { Select };
