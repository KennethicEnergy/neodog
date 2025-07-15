import * as React from 'react';
import styles from './styles.module.scss';

export interface TimeInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange' | 'size'> {
  error?: boolean;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onValueChange?: (value: string) => void;
  size?: 'sm' | 'md' | 'lg';
}

const TimeInput = React.forwardRef<HTMLInputElement, TimeInputProps>(
  (
    {
      className,
      error,
      helperText,
      leftIcon,
      rightIcon,
      disabled,
      onChange,
      onValueChange,
      size = 'md',
      value,
      ...props
    },
    ref
  ) => {
    const timeInputId = React.useId();
    const helperTextId = `${timeInputId}-helper-text`;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      onChange?.(e);
      onValueChange?.(newValue);
    };

    return (
      <div className={styles.timeInputWrapper}>
        {leftIcon && (
          <div className={styles.leftIcon} aria-hidden="true">
            {leftIcon}
          </div>
        )}
        <input
          type="time"
          className={`
            ${styles.timeInput}
            ${styles[size]}
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
TimeInput.displayName = 'TimeInput';

export { TimeInput };
