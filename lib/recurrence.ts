/**
 * Recurrence date generation utilities
 */

export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6; // Sunday = 0, Saturday = 6
export type WeekOfMonth = 1 | 2 | 3 | 4 | 5; // 5 = "last"

export const DAYS_OF_WEEK = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
] as const;

export const WEEKS_OF_MONTH = [
  { value: 1, label: '1st' },
  { value: 2, label: '2nd' },
  { value: 3, label: '3rd' },
  { value: 4, label: '4th' },
  { value: 5, label: 'Last' },
] as const;

/**
 * Generate dates for weekly recurring events
 * @param startDate - First event date
 * @param intervalWeeks - Repeat every X weeks (1 = every week, 2 = every other week)
 * @param count - Number of occurrences to generate
 * @returns Array of dates
 */
export function generateWeeklyDates(
  startDate: Date,
  intervalWeeks: number,
  count: number
): Date[] {
  const dates: Date[] = [];
  const current = new Date(startDate);

  for (let i = 0; i < count; i++) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + intervalWeeks * 7);
  }

  return dates;
}

/**
 * Get the Nth occurrence of a specific weekday in a month
 * @param year - Year
 * @param month - Month (0-indexed)
 * @param dayOfWeek - Day of week (0 = Sunday)
 * @param weekOfMonth - Which week (1-4, or 5 for last)
 * @returns Date or null if doesn't exist
 */
function getNthWeekdayOfMonth(
  year: number,
  month: number,
  dayOfWeek: DayOfWeek,
  weekOfMonth: WeekOfMonth
): Date | null {
  if (weekOfMonth === 5) {
    // Last occurrence of the weekday in the month
    // Start from last day of month and work backwards
    const lastDay = new Date(year, month + 1, 0);
    const lastDayOfWeek = lastDay.getDay();

    let diff = lastDayOfWeek - dayOfWeek;
    if (diff < 0) diff += 7;

    const result = new Date(year, month, lastDay.getDate() - diff);
    return result;
  }

  // Find first occurrence of the weekday
  const firstOfMonth = new Date(year, month, 1);
  const firstDayOfWeek = firstOfMonth.getDay();

  let daysUntilTarget = dayOfWeek - firstDayOfWeek;
  if (daysUntilTarget < 0) daysUntilTarget += 7;

  // Add weeks to get to the Nth occurrence
  const targetDay = 1 + daysUntilTarget + (weekOfMonth - 1) * 7;

  // Check if this date is still in the same month
  const result = new Date(year, month, targetDay);
  if (result.getMonth() !== month) {
    return null; // The Nth weekday doesn't exist in this month
  }

  return result;
}

/**
 * Generate dates for monthly recurring events (Nth weekday of each month)
 * @param startDate - First event date (used for time)
 * @param dayOfWeek - Day of week (0 = Sunday)
 * @param weekOfMonth - Which week (1-4, or 5 for last)
 * @param count - Number of occurrences to generate
 * @returns Array of dates
 */
export function generateMonthlyDates(
  startDate: Date,
  dayOfWeek: DayOfWeek,
  weekOfMonth: WeekOfMonth,
  count: number
): Date[] {
  const dates: Date[] = [];
  let year = startDate.getFullYear();
  let month = startDate.getMonth();
  const hours = startDate.getHours();
  const minutes = startDate.getMinutes();

  while (dates.length < count) {
    const date = getNthWeekdayOfMonth(year, month, dayOfWeek, weekOfMonth);

    if (date) {
      // Set the time from the start date
      date.setHours(hours, minutes, 0, 0);

      // Only include dates on or after the start date
      if (date >= startDate || dates.length === 0) {
        dates.push(date);
      }
    }

    // Move to next month
    month++;
    if (month > 11) {
      month = 0;
      year++;
    }

    // Safety check to prevent infinite loops
    if (year > startDate.getFullYear() + 3) break;
  }

  return dates;
}

/**
 * Calculate maximum occurrences allowed (2 years worth)
 * @param recurrenceType - 'weekly' or 'monthly'
 * @param intervalWeeks - For weekly, how many weeks between occurrences
 * @returns Maximum number of occurrences
 */
export function getMaxOccurrences(
  recurrenceType: 'weekly' | 'monthly',
  intervalWeeks: number = 1
): number {
  const twoYearsInWeeks = 104;

  if (recurrenceType === 'monthly') {
    return 24; // 24 months = 2 years
  }

  return Math.floor(twoYearsInWeeks / intervalWeeks);
}

/**
 * Format a recurrence pattern for display
 */
export function formatRecurrencePattern(
  recurrenceType: 'weekly' | 'monthly',
  dayOfWeek: DayOfWeek,
  weekOfMonth?: WeekOfMonth,
  intervalWeeks?: number
): string {
  const dayName = DAYS_OF_WEEK[dayOfWeek].label;

  if (recurrenceType === 'weekly') {
    if (intervalWeeks === 1) {
      return `Every ${dayName}`;
    }
    return `Every ${intervalWeeks} weeks on ${dayName}`;
  }

  if (recurrenceType === 'monthly' && weekOfMonth) {
    const weekLabel = WEEKS_OF_MONTH.find(w => w.value === weekOfMonth)?.label || '';
    return `${weekLabel} ${dayName} of every month`;
  }

  return '';
}

/**
 * Generate a slug suffix from a date
 */
export function generateDateSlugSuffix(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
