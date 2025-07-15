import React from 'react';
import { TimeInput } from '../time-input';
import styles from './styles.module.scss';
import type { DayKey, Props } from './types';
import { getOperatingDaysSummary } from './utils';
export * from './types';

const daysOfWeek = [
  { key: 'sun', label: 'SUN', name: 'Sunday' },
  { key: 'mon', label: 'MON', name: 'Monday' },
  { key: 'tue', label: 'TUE', name: 'Tuesday' },
  { key: 'wed', label: 'WED', name: 'Wednesday' },
  { key: 'thu', label: 'THU', name: 'Thursday' },
  { key: 'fri', label: 'FRI', name: 'Friday' },
  { key: 'sat', label: 'SAT', name: 'Saturday' }
];

const OperatingDaysSelector: React.FC<Props> = ({
  value,
  onChange,
  isLoading,
  startLabel = 'Start Time',
  endLabel = 'End Time'
}) => {
  const { selectedDays, time } = value;

  const handleDayToggle = (key: DayKey) => {
    onChange({
      selectedDays: { ...selectedDays, [key]: !selectedDays[key] },
      time
    });
  };

  const handleTimeChange = (field: 'from' | 'to', val: string) => {
    onChange({
      selectedDays,
      time: { ...time, [field]: val }
    });
  };

  const summary = getOperatingDaysSummary(selectedDays);

  return (
    <div className={styles.operatingDaysContainer}>
      <div className={styles.operatingDaysLabelRow}>
        <p className={styles.operatingDaysLabel}>Operating Days</p>
        <span className={styles.operatingDaysSummary}>{summary || 'Select days'}</span>
      </div>
      <div className={styles.dayButtonsRow}>
        {daysOfWeek.map((day) => (
          <button
            key={day.key}
            type="button"
            className={
              selectedDays[day.key as DayKey] ? styles.selectedDayButton : styles.dayButton
            }
            onClick={() => handleDayToggle(day.key as DayKey)}
            disabled={isLoading}>
            {day.label}
          </button>
        ))}
      </div>
      <div className={styles.timeInputsRow}>
        <div className={styles.timeInputCol}>
          <label className={styles.timeInputLabel}>{startLabel}</label>
          <TimeInput
            value={time.from}
            onValueChange={(val) => handleTimeChange('from', val)}
            disabled={isLoading}
          />
        </div>
        <div className={styles.timeInputCol}>
          <label className={styles.timeInputLabel}>{endLabel}</label>
          <TimeInput
            value={time.to}
            onValueChange={(val) => handleTimeChange('to', val)}
            disabled={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default OperatingDaysSelector;
