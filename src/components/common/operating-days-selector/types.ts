export type DayKey = 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat';
export type SimpleOperatingDaysValue = {
  selectedDays: Record<DayKey, boolean>;
  time: { from: string; to: string };
};

export type Props = {
  value: SimpleOperatingDaysValue;
  onChange: (val: SimpleOperatingDaysValue) => void;
  isLoading?: boolean;
  startLabel?: string;
  endLabel?: string;
};
