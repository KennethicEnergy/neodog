import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
import { endOfDay, format, isWithinInterval, startOfDay } from 'date-fns';
import React, { useState } from 'react';
import { DateRange, DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import styles from './date-range-picker.module.scss';

export interface DateRangeValue {
  startDate: Date | null;
  endDate: Date | null;
}

interface DateRangePickerProps {
  value?: DateRangeValue;
  onChange?: (range: DateRangeValue) => void;
  minDate?: Date;
  maxDate?: Date;
  placeholder?: string;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  value: externalValue,
  onChange: externalOnChange,
  minDate,
  maxDate,
  placeholder = 'Select date range'
}) => {
  const [internalValue, setInternalValue] = useState<DateRangeValue>({
    startDate: null,
    endDate: null
  });

  // Use external value if provided, otherwise use internal state
  const value = externalValue !== undefined ? externalValue : internalValue;
  const onChange = externalOnChange || setInternalValue;

  const handleSelect = (range: DateRange | undefined) => {
    if (range?.from) {
      const newRange = {
        startDate: range.from,
        endDate: range.to || null
      };
      onChange(newRange);

      // Close the picker when both dates are selected
      if (range.to) {
        // The popover will close automatically when clicking outside
      }
    }
  };

  const getLabel = () => {
    if (value.startDate && value.endDate) {
      return `${format(value.startDate, 'MMM dd, yyyy')} - ${format(value.endDate, 'MMM dd, yyyy')}`;
    } else if (value.startDate) {
      return `${format(value.startDate, 'MMM dd, yyyy')} - Select end date`;
    }
    return placeholder;
  };

  // Convert our DateRangeValue to react-day-picker's DateRange format
  const selectedRange: DateRange | undefined = value.startDate
    ? {
        from: value.startDate,
        to: value.endDate || undefined
      }
    : undefined;

  // Build disabled dates array
  const disabledDates = [];
  if (minDate) {
    disabledDates.push({ before: minDate });
  }
  if (maxDate) {
    disabledDates.push({ after: maxDate });
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button type="button" className={styles.datePickerButton} aria-label="Select date range">
          {getLabel()}
        </button>
      </PopoverTrigger>
      <PopoverContent className={styles.calendarPopover} align="start">
        <DayPicker
          mode="range"
          selected={selectedRange}
          onSelect={handleSelect}
          disabled={disabledDates.length > 0 ? disabledDates : undefined}
          numberOfMonths={2}
          defaultMonth={value.startDate || new Date()}
          modifiers={{
            selected: (date) => {
              if (!selectedRange?.from || !selectedRange?.to) return false;
              return isWithinInterval(date, {
                start: startOfDay(selectedRange.from),
                end: endOfDay(selectedRange.to)
              });
            }
          }}
          modifiersStyles={{
            selected: {
              backgroundColor: '#2563eb',
              color: 'white'
            }
          }}
        />
      </PopoverContent>
    </Popover>
  );
};

export default DateRangePicker;
