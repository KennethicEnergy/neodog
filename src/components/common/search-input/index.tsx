import * as React from 'react';
import styles from './styles.module.scss';

export interface SearchInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange' | 'size'> {
  error?: boolean;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onValueChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  size?: 'sm' | 'md' | 'lg';
  placeholder?: string;
  clearable?: boolean;
  loading?: boolean;
  suggestions?: string[];
  onSuggestionSelect?: (suggestion: string) => void;
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
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
      onSearch,
      size = 'md',
      placeholder = 'Search...',
      clearable = true,
      loading = false,
      suggestions = [],
      onSuggestionSelect,
      value,
      ...props
    },
    ref
  ) => {
    const searchInputId = React.useId();
    const helperTextId = `${searchInputId}-helper-text`;
    const suggestionsId = `${searchInputId}-suggestions`;
    const [showSuggestions, setShowSuggestions] = React.useState(false);
    const [focusedSuggestion, setFocusedSuggestion] = React.useState(-1);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      onChange?.(e);
      onValueChange?.(newValue);
      setShowSuggestions(suggestions.length > 0 && newValue.length > 0);
      setFocusedSuggestion(-1);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (suggestions.length === 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setFocusedSuggestion((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setFocusedSuggestion((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
          break;
        case 'Enter':
          e.preventDefault();
          if (focusedSuggestion >= 0 && focusedSuggestion < suggestions.length) {
            onSuggestionSelect?.(suggestions[focusedSuggestion]);
            setShowSuggestions(false);
            setFocusedSuggestion(-1);
          } else {
            onSearch?.(value as string);
          }
          break;
        case 'Escape':
          setShowSuggestions(false);
          setFocusedSuggestion(-1);
          break;
      }
    };

    const handleFocus = () => {
      if (suggestions.length > 0 && (value as string)?.length > 0) {
        setShowSuggestions(true);
      }
    };

    const handleBlur = () => {
      // Delay hiding suggestions to allow for clicks
      setTimeout(() => {
        setShowSuggestions(false);
        setFocusedSuggestion(-1);
      }, 150);
    };

    const handleClear = () => {
      const syntheticEvent = {
        target: { value: '' }
      } as React.ChangeEvent<HTMLInputElement>;

      onChange?.(syntheticEvent);
      onValueChange?.('');
      setShowSuggestions(false);
      setFocusedSuggestion(-1);
    };

    const handleSuggestionClick = (suggestion: string) => {
      onSuggestionSelect?.(suggestion);
      setShowSuggestions(false);
      setFocusedSuggestion(-1);
    };

    const defaultLeftIcon = (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
    );

    return (
      <div className={styles.searchInputContainer}>
        <div className={styles.searchInputWrapper}>
          <div className={styles.leftIcon} aria-hidden="true">
            {leftIcon || defaultLeftIcon}
          </div>
          <input
            type="search"
            id={searchInputId}
            className={`
              ${styles.searchInput}
              ${styles[size]}
              ${error ? styles.error : ''}
              ${className || ''}
            `}
            ref={ref}
            disabled={disabled}
            aria-invalid={error}
            aria-describedby={helperText ? helperTextId : undefined}
            aria-autocomplete="list"
            aria-controls={showSuggestions ? suggestionsId : undefined}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            {...props}
          />
          <div className={styles.rightIcons}>
            {loading && (
              <div className={styles.loadingIcon} aria-hidden="true">
                <div className={styles.spinner}></div>
              </div>
            )}
            {clearable && (value as string)?.length > 0 && !loading && (
              <button
                type="button"
                className={styles.clearButton}
                onClick={handleClear}
                aria-label="Clear search">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
            {rightIcon && !loading && !((value as string)?.length > 0 && clearable) && (
              <div className={styles.rightIcon} aria-hidden="true">
                {rightIcon}
              </div>
            )}
          </div>
        </div>

        {showSuggestions && suggestions.length > 0 && (
          <div id={suggestionsId} className={styles.suggestions} role="listbox">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className={`
                  ${styles.suggestion}
                  ${index === focusedSuggestion ? styles.focused : ''}
                `}
                role="option"
                aria-selected={index === focusedSuggestion}
                onClick={() => handleSuggestionClick(suggestion)}>
                {suggestion}
              </div>
            ))}
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
SearchInput.displayName = 'SearchInput';

export { SearchInput };
