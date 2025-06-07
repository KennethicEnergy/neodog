import * as React from 'react';
import styles from './Input.module.scss';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, type = 'text', error, helperText, leftIcon, rightIcon, disabled, ...props },
    ref
  ) => {
    const inputId = React.useId();
    const helperTextId = `${inputId}-helper-text`;

    return (
      <div className={styles.inputWrapper}>
        {leftIcon && (
          <div className={styles.leftIcon} aria-hidden="true">
            {leftIcon}
          </div>
        )}
        <input
          type={type}
          className={`
            ${styles.input} 
            ${error ? styles.error : ''} 
            ${leftIcon ? styles.hasLeftIcon : ''} 
            ${rightIcon ? styles.hasRightIcon : ''} 
            ${className || ''}
          `}
          ref={ref}
          disabled={disabled}
          aria-invalid={error}
          aria-describedby={helperText ? helperTextId : undefined}
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
Input.displayName = 'Input';

export { Input };
