import * as React from 'react';
import styles from './styles.module.scss';

export interface ToggleProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange' | 'size'> {
  label?: string;
  error?: boolean;
  helperText?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCheckedChange?: (checked: boolean) => void;
  size?: 'sm' | 'md' | 'lg';
}

const Toggle = React.forwardRef<HTMLInputElement, ToggleProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      disabled,
      onChange,
      onCheckedChange,
      checked,
      size = 'md',
      ...props
    },
    ref
  ) => {
    const toggleId = React.useId();
    const helperTextId = `${toggleId}-helper-text`;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e);
      onCheckedChange?.(e.target.checked);
    };

    return (
      <div className={styles.toggleContainer}>
        <div className={styles.toggleWrapper}>
          <input
            type="checkbox"
            id={toggleId}
            className={`
              ${styles.toggle}
              ${styles[size]}
              ${error ? styles.error : ''}
              ${className || ''}
            `}
            ref={ref}
            disabled={disabled}
            aria-invalid={error}
            aria-describedby={helperText ? helperTextId : undefined}
            checked={checked}
            onChange={handleChange}
            {...props}
          />
          {label && (
            <label
              htmlFor={toggleId}
              className={`
                ${styles.label}
                ${styles[size]}
                ${disabled ? styles.disabled : ''}
              `}>
              {label}
            </label>
          )}
        </div>
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
Toggle.displayName = 'Toggle';

export { Toggle };
