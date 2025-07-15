import * as React from 'react';
import styles from './styles.module.scss';

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  label?: string;
  error?: boolean;
  helperText?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCheckedChange?: (checked: boolean) => void;
  indeterminate?: boolean;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      disabled,
      onChange,
      onCheckedChange,
      indeterminate,
      checked,
      ...props
    },
    ref
  ) => {
    const checkboxId = React.useId();
    const helperTextId = `${checkboxId}-helper-text`;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e);
      onCheckedChange?.(e.target.checked);
    };

    // Handle indeterminate state
    React.useEffect(() => {
      if (ref && typeof ref === 'object' && ref.current) {
        ref.current.indeterminate = indeterminate || false;
      }
    }, [indeterminate, ref]);

    return (
      <div className={styles.checkboxContainer}>
        <div className={styles.checkboxWrapper}>
          <input
            type="checkbox"
            id={checkboxId}
            className={`
              ${styles.checkbox}
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
              htmlFor={checkboxId}
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
Checkbox.displayName = 'Checkbox';

export { Checkbox };
