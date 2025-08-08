import * as React from 'react';
import styles from './styles.module.scss';

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface DateRangePickerProps {
  value?: DateRange;
  onValueChange?: (range: DateRange) => void;
  error?: boolean;
  helperText?: string;
  size?: 'sm' | 'md' | 'lg';
  placeholder?: string;
  disabled?: boolean;
  minDate?: string;
  maxDate?: string;
  className?: string;
}

const DateRangePicker = React.forwardRef<HTMLDivElement, DateRangePickerProps>(
  (
    {
      value,
      onValueChange,
      error,
      helperText,
      size = 'md',
      placeholder = 'Select date range',
      disabled,
      minDate,
      maxDate,
      className
    },
    ref
  ) => {
    const dateRangeId = React.useId();
    const helperTextId = `${dateRangeId}-helper-text`;
    const [isOpen, setIsOpen] = React.useState(false);
    const [currentMonth, setCurrentMonth] = React.useState(() => {
      const today = new Date();
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      return firstDay;
    });
    const [hoveredDate, setHoveredDate] = React.useState<string | null>(null);
    const containerRef = React.useRef<HTMLDivElement>(null);

    // Handle click outside to close calendar
    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false);
          setHoveredDate(null);
        }
      };

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
      }
    }, [isOpen]);

    const handleDateClick = (date: string) => {
      if (disabled) return;

      if (!value?.startDate || (value.startDate && value.endDate)) {
        // Start new range
        const newRange = { startDate: date, endDate: '' };
        onValueChange?.(newRange);
      } else {
        // Complete range
        const startDate = new Date(value.startDate);
        const endDate = new Date(date);

        if (endDate < startDate) {
          // Swap dates if end date is before start date
          const newRange = { startDate: date, endDate: value.startDate };
          onValueChange?.(newRange);
        } else {
          const newRange = { startDate: value.startDate, endDate: date };
          onValueChange?.(newRange);
        }
        setIsOpen(false);
        setHoveredDate(null);
      }
    };

    const handleDateHover = (date: string) => {
      if (!value?.startDate || value.endDate) return;
      setHoveredDate(date);
    };

    const isInRange = (date: string) => {
      if (!value?.startDate) return false;

      const currentDate = new Date(date);
      const startDate = new Date(value.startDate);
      const endDate = value.endDate
        ? new Date(value.endDate)
        : hoveredDate
          ? new Date(hoveredDate)
          : null;

      if (!endDate) return false;

      return currentDate >= startDate && currentDate <= endDate;
    };

    const isStartDate = (date: string) => value?.startDate === date;
    const isEndDate = (date: string) => value?.endDate === date;

    const getDaysInMonth = (date: Date) => {
      return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date) => {
      return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const formatDate = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const isDateDisabled = (date: string) => {
      const currentDate = new Date(date);
      const min = minDate ? new Date(minDate) : null;
      const max = maxDate ? new Date(maxDate) : null;

      return (min && currentDate < min) || (max && currentDate > max);
    };

    const renderCalendar = () => {
      const daysInMonth = getDaysInMonth(currentMonth);
      const firstDay = getFirstDayOfMonth(currentMonth);
      const days: React.ReactNode[] = [];

      // Add empty cells for days before the first day of the month
      for (let i = 0; i < firstDay; i++) {
        days.push(<div key={`empty-${i}`} className={styles.emptyDay} />);
      }

      // Add days of the month
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        const dateString = formatDate(date);
        const isDisabled = isDateDisabled(dateString);
        const inRange = isInRange(dateString);
        const isStart = isStartDate(dateString);
        const isEnd = isEndDate(dateString);

        days.push(
          <button
            key={day}
            className={`
              ${styles.day}
              ${isDisabled ? styles.disabled : ''}
              ${inRange ? styles.inRange : ''}
              ${isStart ? styles.startDate : ''}
              ${isEnd ? styles.endDate : ''}
            `}
            onClick={() => !isDisabled && handleDateClick(dateString)}
            onMouseEnter={() => !isDisabled && handleDateHover(dateString)}
            disabled={isDisabled || false}
            type="button"
            data-date={dateString}
            data-start={isStart ? 'true' : 'false'}
            data-end={isEnd ? 'true' : 'false'}
            data-inrange={inRange ? 'true' : 'false'}>
            {day}
          </button>
        );
      }

      return days;
    };

    const navigateMonth = (direction: 'prev' | 'next') => {
      setCurrentMonth((prev) => {
        const newMonth = new Date(prev);
        if (direction === 'prev') {
          newMonth.setMonth(newMonth.getMonth() - 1);
        } else {
          newMonth.setMonth(newMonth.getMonth() + 1);
        }
        return newMonth;
      });
    };

    const formatDisplayValue = () => {
      if (!value?.startDate) return placeholder;

      const startDate = new Date(value.startDate).toLocaleDateString();
      if (!value.endDate) return `${startDate} - Select end date`;

      const endDate = new Date(value.endDate).toLocaleDateString();
      return `${startDate} - ${endDate}`;
    };

    return (
      <div className={styles.dateRangePickerContainer} ref={ref}>
        <div className={styles.dateRangePickerWrapper} ref={containerRef}>
          <button
            type="button"
            className={`
              ${styles.dateRangePicker}
              ${styles[size]}
              ${error ? styles.error : ''}
              ${disabled ? styles.disabled : ''}
              ${className || ''}
            `}
            onClick={() => !disabled && setIsOpen(!isOpen)}
            disabled={disabled}
            aria-describedby={helperText ? helperTextId : undefined}>
            <span className={styles.displayValue}>{formatDisplayValue()}</span>
            <svg
              className={`${styles.arrow} ${isOpen ? styles.rotated : ''}`}
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2">
              <polyline points="6,9 12,15 18,9" />
            </svg>
          </button>

          {isOpen && !disabled && (
            <div className={styles.calendar}>
              <div className={styles.calendarHeader}>
                <button
                  type="button"
                  className={styles.navButton}
                  onClick={() => navigateMonth('prev')}
                  aria-label="Previous month">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2">
                    <polyline points="15,18 9,12 15,6" />
                  </svg>
                </button>
                <span className={styles.monthYear}>
                  {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
                <button
                  type="button"
                  className={styles.navButton}
                  onClick={() => navigateMonth('next')}
                  aria-label="Next month">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2">
                    <polyline points="9,18 15,12 9,6" />
                  </svg>
                </button>
              </div>

              <div className={styles.calendarGrid}>
                <div className={styles.weekDays}>
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className={styles.weekDay}>
                      {day}
                    </div>
                  ))}
                </div>
                <div className={styles.days}>{renderCalendar()}</div>
              </div>

              {value?.startDate && !value.endDate && (
                <div className={styles.instructions}>Select end date to complete range</div>
              )}
            </div>
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

DateRangePicker.displayName = 'DateRangePicker';

export { DateRangePicker };
