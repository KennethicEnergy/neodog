import * as React from 'react';
import styles from './styles.module.scss';

export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  error?: boolean;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onValueChange?: (value: string) => void;
  size?: 'sm' | 'md' | 'lg';
  rows?: number;
  maxLength?: number;
  showCharacterCount?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
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
      rows = 3,
      maxLength,
      showCharacterCount = false,
      value,
      ...props
    },
    ref
  ) => {
    const textareaId = React.useId();
    const helperTextId = `${textareaId}-helper-text`;
    const characterCountId = `${textareaId}-character-count`;

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      onChange?.(e);
      onValueChange?.(newValue);
    };

    const currentLength = typeof value === 'string' ? value.length : 0;

    return (
      <div className={styles.textareaContainer}>
        <div className={styles.textareaWrapper}>
          {leftIcon && (
            <div className={styles.leftIcon} aria-hidden="true">
              {leftIcon}
            </div>
          )}
          <textarea
            id={textareaId}
            className={`
              ${styles.textarea}
              ${styles[size]}
              ${error ? styles.error : ''}
              ${leftIcon ? styles.hasLeftIcon : ''}
              ${rightIcon ? styles.hasRightIcon : ''}
              ${className || ''}
            `}
            ref={ref}
            disabled={disabled}
            aria-invalid={error}
            aria-describedby={
              helperText || (showCharacterCount && maxLength)
                ? `${helperText ? helperTextId : ''} ${showCharacterCount && maxLength ? characterCountId : ''}`.trim()
                : undefined
            }
            value={value}
            onChange={handleChange}
            rows={rows}
            maxLength={maxLength}
            {...props}
          />
          {rightIcon && (
            <div className={styles.rightIcon} aria-hidden="true">
              {rightIcon}
            </div>
          )}
        </div>
        <div className={styles.footer}>
          {helperText && (
            <p
              id={helperTextId}
              className={`${styles.helperText} ${error ? styles.error : ''}`}
              role={error ? 'alert' : undefined}>
              {helperText}
            </p>
          )}
          {showCharacterCount && maxLength && (
            <p id={characterCountId} className={styles.characterCount} aria-live="polite">
              {currentLength}/{maxLength}
            </p>
          )}
        </div>
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea };
