const daysOfWeek = [
  { key: 'sun', label: 'S', name: 'Sunday' },
  { key: 'mon', label: 'M', name: 'Monday' },
  { key: 'tue', label: 'T', name: 'Tuesday' },
  { key: 'wed', label: 'W', name: 'Wednesday' },
  { key: 'thu', label: 'T', name: 'Thursday' },
  { key: 'fri', label: 'F', name: 'Friday' },
  { key: 'sat', label: 'S', name: 'Saturday' }
];

const weekdays = ['mon', 'tue', 'wed', 'thu', 'fri'];
const weekends = ['sat', 'sun'];

export function getOperatingDaysSummary(selectedDays: Record<string, boolean>) {
  const selected = daysOfWeek.filter((d) => selectedDays[d.key]);
  if (selected.length === 7) return 'Every Day';
  if (weekdays.every((d) => selectedDays[d]) && selected.length === 5) return 'Every Weekdays';
  if (weekends.every((d) => selectedDays[d]) && selected.length === 2) return 'Every Weekends';
  if (selected.length > 0) {
    return (
      'Every ' +
      selected
        .map((d) => d.name)
        .join(selected.length === 2 ? ' and ' : ', ')
        .replace(/, ([^,]*)$/, ', and $1')
    );
  }
  return '';
}
