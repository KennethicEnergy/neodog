import React from 'react';
import styles from './styles.module.scss';
import type { DayKey, Props } from './types';
import { getOperatingDaysSummary } from './utils';
export * from './types';

const daysOfWeek = [
  { key: 'sun', label: 'S', name: 'Sunday' },
  { key: 'mon', label: 'M', name: 'Monday' },
  { key: 'tue', label: 'T', name: 'Tuesday' },
  { key: 'wed', label: 'W', name: 'Wednesday' },
  { key: 'thu', label: 'T', name: 'Thursday' },
  { key: 'fri', label: 'F', name: 'Friday' },
  { key: 'sat', label: 'S', name: 'Saturday' }
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
          <input
            type="time"
            value={time.from}
            onChange={(e) => handleTimeChange('from', e.target.value)}
            disabled={isLoading}
            className={styles.timeInput}
          />
        </div>
        <div className={styles.timeInputCol}>
          <label className={styles.timeInputLabel}>{endLabel}</label>
          <input
            type="time"
            value={time.to}
            onChange={(e) => handleTimeChange('to', e.target.value)}
            disabled={isLoading}
            className={styles.timeInput}
          />
        </div>
      </div>
    </div>
  );
};

export default OperatingDaysSelector;
