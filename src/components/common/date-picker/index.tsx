import * as React from 'react';
import styles from './styles.module.scss';

export interface DatePickerProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  value?: string;
  error?: boolean;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onValueChange?: (value: string) => void;
  minDate?: string;
  maxDate?: string;
}

const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
  (
    {
      className,
      value,
      error,
      helperText,
      leftIcon,
      rightIcon,
      disabled,
      onChange,
      onValueChange,
      minDate,
      maxDate,
      ...props
    },
    ref
  ) => {
    const datePickerId = React.useId();
    const helperTextId = `${datePickerId}-helper-text`;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      onChange?.(e);
      onValueChange?.(newValue);
    };

    return (
      <div className={styles.datePickerWrapper}>
        {leftIcon && (
          <div className={styles.leftIcon} aria-hidden="true">
            {leftIcon}
          </div>
        )}
        <input
          type="date"
          className={`
            ${styles.datePicker}
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
          min={minDate}
          max={maxDate}
          {...props}
        />
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
DatePicker.displayName = 'DatePicker';

export { DatePicker };
