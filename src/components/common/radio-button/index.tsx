import * as React from 'react';
import styles from './styles.module.scss';

export interface RadioButtonProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  label?: string;
  error?: boolean;
  helperText?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCheckedChange?: (checked: boolean) => void;
}

const RadioButton = React.forwardRef<HTMLInputElement, RadioButtonProps>(
  (
    { className, label, error, helperText, disabled, onChange, onCheckedChange, checked, ...props },
    ref
  ) => {
    const radioId = React.useId();
    const helperTextId = `${radioId}-helper-text`;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e);
      onCheckedChange?.(e.target.checked);
    };

    return (
      <div className={styles.radioContainer}>
        <div className={styles.radioWrapper}>
          <input
            type="radio"
            id={radioId}
            className={`
              ${styles.radio}
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
              htmlFor={radioId}
              className={`
                ${styles.label}
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
RadioButton.displayName = 'RadioButton';

export { RadioButton };
