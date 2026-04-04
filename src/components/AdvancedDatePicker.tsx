import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, startOfDay, getDaysInMonth, startOfMonth } from "date-fns";
import { cn } from "@/lib/utils";

interface AdvancedDatePickerProps {
  selected?: Date;
  onSelect: (date: Date) => void;
  disabled?: (date: Date) => boolean;
  availableDates?: string[];
  maxDate?: Date;
  minDate?: Date;
}

type PickerMode = "day" | "month" | "year";

export const AdvancedDatePicker = ({
  selected,
  onSelect,
  disabled,
  availableDates,
  maxDate,
  minDate,
}: AdvancedDatePickerProps) => {
  const today = startOfDay(new Date());
  const maxSelectableDate = maxDate ? startOfDay(maxDate) : null;
  const minSelectableDate = minDate ? startOfDay(minDate) : null;
  const [mode, setMode] = useState<PickerMode>("day");

  // Get available years and months from availableDates
  const getAvailableYearsAndMonths = () => {
    if (!availableDates || availableDates.length === 0) {
      return { years: new Set<number>(), monthsByYear: new Map<number, Set<number>>() };
    }

    const years = new Set<number>();
    const monthsByYear = new Map<number, Set<number>>();

    availableDates.forEach(dateStr => {
      const [year, month] = dateStr.split('-').map(Number);
      years.add(year);
      if (!monthsByYear.has(year)) {
        monthsByYear.set(year, new Set());
      }
      monthsByYear.get(year)!.add(month - 1); // Convert to 0-based month
    });

    return { years, monthsByYear };
  };

  const { years: availableYears, monthsByYear: availableMonthsByYear } = getAvailableYearsAndMonths();

  const isBeforeMinDate = (date: Date) => !!minSelectableDate && startOfDay(date) < minSelectableDate;
  const isAfterMaxDate = (date: Date) => !!maxSelectableDate && startOfDay(date) > maxSelectableDate;

  // Initialize to first available date month if current month has no available dates
  const getInitialDate = () => {
    if (selected) {
      const selectedDate = startOfDay(selected);
      if (minSelectableDate && selectedDate < minSelectableDate) return minSelectableDate;
      if (maxSelectableDate && selectedDate > maxSelectableDate) return maxSelectableDate;
      return selected;
    }

    if (availableDates && availableDates.length > 0) {
      const availableMonthsInCurrentYear = availableMonthsByYear.get(today.getFullYear()) || new Set();
      // If current month is not available, find first available month
      if (availableMonthsInCurrentYear.size === 0 || !availableMonthsInCurrentYear.has(today.getMonth())) {
        // Get first available date and use that month
        const firstAvailableDate = new Date(availableDates[0]);
        return firstAvailableDate;
      }
    }

    if (minSelectableDate && today < minSelectableDate) return minSelectableDate;
    if (maxSelectableDate && today > maxSelectableDate) return maxSelectableDate;
    return today;
  };

  const [currentDate, setCurrentDate] = useState(getInitialDate());

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // Handle year selection
  const handleYearSelect = (year: number) => {
    if (maxSelectableDate && year > maxSelectableDate.getFullYear()) return;
    if (minSelectableDate && year < minSelectableDate.getFullYear()) return;

    const newDate = new Date(currentDate);
    newDate.setFullYear(year);
    setCurrentDate(newDate);
    setMode("month");
  };

  // Handle month selection
  const handleMonthSelect = (month: number) => {
    if (maxSelectableDate && currentYear === maxSelectableDate.getFullYear() && month > maxSelectableDate.getMonth()) return;
    if (minSelectableDate && currentYear === minSelectableDate.getFullYear() && month < minSelectableDate.getMonth()) return;

    const newDate = new Date(currentDate);
    newDate.setMonth(month);
    setCurrentDate(newDate);
    setMode("day");
  };

  // Handle day selection
  const handleDaySelect = (day: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(day);
    if (maxSelectableDate && startOfDay(newDate) > maxSelectableDate) return;
    if (minSelectableDate && startOfDay(newDate) < minSelectableDate) return;
    onSelect(newDate);
  };

  // Get days in current month
  const getDays = () => {
    const monthStart = startOfMonth(currentDate);
    const daysInMonth = getDaysInMonth(currentDate);
    const startingDayOfWeek = monthStart.getDay();

    const days = [];
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    // Add days of month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  // Render day picker
  const renderDayPicker = () => {
    const days = getDays();
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const availableMonthsForYear = availableMonthsByYear.get(currentYear) || new Set();

    const handlePrevMonth = () => {
      if (!availableDates || availableDates.length === 0) {
        // No available dates, use normal navigation
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() - 1);
        if (minSelectableDate && startOfDay(newDate) < minSelectableDate) return;
        setCurrentDate(newDate);
        return;
      }

      let newDate = new Date(currentDate);
      let prevMonth = newDate.getMonth() - 1;
      let prevYear = newDate.getFullYear();
      const minYear = Math.min(...Array.from(availableYears));

      // Skip months that don't have available dates
      while (prevYear >= minYear) {
        if (prevMonth < 0) {
          prevMonth = 11;
          prevYear--;
          if (prevYear < minYear) break;
        }
        const monthMonthsAvailable = availableMonthsByYear.get(prevYear) || new Set();
        if (monthMonthsAvailable.size === 0 || monthMonthsAvailable.has(prevMonth)) {
          break;
        }
        prevMonth--;
      }

      if (prevYear >= minYear) {
        newDate.setFullYear(prevYear);
        newDate.setMonth(prevMonth);
        setCurrentDate(newDate);
      }
    };

    const handleNextMonth = () => {
      if (!availableDates || availableDates.length === 0) {
        if (maxSelectableDate) {
          const nextMonthStart = new Date(currentYear, currentMonth + 1, 1);
          if (startOfDay(nextMonthStart) > maxSelectableDate) return;
        }
        // No available dates, use normal navigation
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() + 1);
        if (minSelectableDate && startOfDay(newDate) < minSelectableDate) return;
        setCurrentDate(newDate);
        return;
      }

      let newDate = new Date(currentDate);
      let nextMonth = newDate.getMonth() + 1;
      let nextYear = newDate.getFullYear();
      const maxYear = Math.max(...Array.from(availableYears));

      // Skip months that don't have available dates
      while (nextYear <= maxYear) {
        if (nextMonth > 11) {
          nextMonth = 0;
          nextYear++;
          if (nextYear > maxYear) break;
        }
        const monthMonthsAvailable = availableMonthsByYear.get(nextYear) || new Set();
        if (monthMonthsAvailable.size === 0 || monthMonthsAvailable.has(nextMonth)) {
          break;
        }
        nextMonth++;
      }

      if (nextYear <= maxYear) {
        newDate.setFullYear(nextYear);
        newDate.setMonth(nextMonth);
        setCurrentDate(newDate);
      }
    };

    return (
      <div className="w-80 p-4 bg-card rounded-lg">
        {/* Header with Month/Year and navigation */}
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="p-1 hover:bg-primary/10 rounded-md transition-colors"
          >
            <ChevronLeft className="h-5 w-5 text-foreground" />
          </button>

          <button
            type="button"
            onClick={() => setMode("month")}
            className="px-3 py-1 hover:bg-primary/10 rounded-md transition-colors font-semibold text-foreground"
          >
            {format(currentDate, "MMMM yyyy")}
          </button>

          <button
            type="button"
            onClick={handleNextMonth}
            className="p-1 hover:bg-primary/10 rounded-md transition-colors"
          >
            <ChevronRight className="h-5 w-5 text-foreground" />
          </button>
        </div>

        {/* Day names */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map((day) => (
            <div
              key={day}
              className="h-8 flex items-center justify-center text-xs font-semibold text-muted-foreground"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, idx) => {
            if (day === null) {
              return <div key={`empty-${idx}`} className="h-8"></div>;
            }

            const dateObj = new Date(currentYear, currentMonth, day);
            const isToday =
              day === today.getDate() &&
              currentMonth === today.getMonth() &&
              currentYear === today.getFullYear();
            const isSelected =
              selected &&
              day === selected.getDate() &&
              currentMonth === selected.getMonth() &&
              currentYear === selected.getFullYear();
            const isDisabled = (disabled?.(dateObj) ?? false) || isBeforeMinDate(dateObj) || isAfterMaxDate(dateObj);

            return (
              <button
                key={day}
                type="button"
                onClick={() => handleDaySelect(day)}
                disabled={isDisabled}
                className={cn(
                  "h-8 rounded-md text-sm font-medium transition-colors flex items-center justify-center",
                  isDisabled && "opacity-40 cursor-not-allowed text-muted-foreground",
                  !isDisabled && "cursor-pointer",
                  isSelected &&
                    !isDisabled &&
                    "bg-primary text-primary-foreground font-bold",
                  isToday &&
                    !isSelected &&
                    !isDisabled &&
                    "bg-primary/20 text-primary font-bold",
                  !isSelected &&
                    !isToday &&
                    !isDisabled &&
                    "hover:bg-primary/10 text-foreground"
                )}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  // Render month picker
  const renderMonthPicker = () => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const availableMonthsForYear = availableMonthsByYear.get(currentYear) || new Set();

    return (
      <div className="w-80 p-4 bg-card rounded-lg">
        {/* Header */}
        <div className="flex items-center justify-center mb-4">
          <button
            type="button"
            onClick={() => setMode("year")}
            className="px-3 py-1 hover:bg-primary/10 rounded-md transition-colors font-semibold text-foreground"
          >
            {currentYear}
          </button>
        </div>

        {/* Months grid */}
        <div className="grid grid-cols-3 gap-2">
          {months.map((month, idx) => {
            const isAvailable = availableMonthsForYear.size === 0 || availableMonthsForYear.has(idx);
            const isDisabledMonth =
              (availableDates && availableDates.length > 0 && !isAvailable) ||
              (maxSelectableDate ? currentYear === maxSelectableDate.getFullYear() && idx > maxSelectableDate.getMonth() : false) ||
              (minSelectableDate ? currentYear === minSelectableDate.getFullYear() && idx < minSelectableDate.getMonth() : false);

            return (
              <button
                key={month}
                type="button"
                onClick={() => !isDisabledMonth && handleMonthSelect(idx)}
                disabled={isDisabledMonth}
                className={cn(
                  "py-2 px-3 rounded-md text-sm font-medium transition-colors",
                  isDisabledMonth && "opacity-40 cursor-not-allowed text-muted-foreground",
                  !isDisabledMonth && "cursor-pointer",
                  idx === currentMonth && !isDisabledMonth
                    ? "bg-primary text-primary-foreground font-bold"
                    : !isDisabledMonth && "hover:bg-primary/10 text-foreground"
                )}
              >
                {month.slice(0, 3)}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  // Render year picker
  const renderYearPicker = () => {
    const startYear = Math.floor(currentYear / 10) * 10;
    const years = Array.from({ length: 12 }, (_, i) => startYear + i);

    return (
      <div className="w-80 p-4 bg-card rounded-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={() => {
              const newDate = new Date(currentDate);
              newDate.setFullYear(currentYear - 10);
              if (minSelectableDate && startOfDay(newDate) < minSelectableDate) return;
              setCurrentDate(newDate);
            }}
            className="p-1 hover:bg-primary/10 rounded-md transition-colors"
          >
            <ChevronLeft className="h-5 w-5 text-foreground" />
          </button>

          <div className="text-center font-semibold text-foreground">
            {startYear} - {startYear + 11}
          </div>

          <button
            type="button"
            onClick={() => {
              if (maxSelectableDate && currentYear + 10 > maxSelectableDate.getFullYear()) return;
              const newDate = new Date(currentDate);
              newDate.setFullYear(currentYear + 10);
              if (minSelectableDate && startOfDay(newDate) < minSelectableDate) return;
              setCurrentDate(newDate);
            }}
            className="p-1 hover:bg-primary/10 rounded-md transition-colors"
          >
            <ChevronRight className="h-5 w-5 text-foreground" />
          </button>
        </div>

        {/* Years grid */}
        <div className="grid grid-cols-3 gap-2">
          {years.map((year) => {
            const isAvailable = availableYears.size === 0 || availableYears.has(year);
            const isDisabledYear =
              (availableDates && availableDates.length > 0 && !isAvailable) ||
              (maxSelectableDate ? year > maxSelectableDate.getFullYear() : false) ||
              (minSelectableDate ? year < minSelectableDate.getFullYear() : false);

            return (
              <button
                key={year}
                type="button"
                onClick={() => !isDisabledYear && handleYearSelect(year)}
                disabled={isDisabledYear}
                className={cn(
                  "py-2 px-3 rounded-md text-sm font-medium transition-colors",
                  isDisabledYear && "opacity-40 cursor-not-allowed text-muted-foreground",
                  !isDisabledYear && "cursor-pointer",
                  year === currentYear && !isDisabledYear
                    ? "bg-primary text-primary-foreground font-bold"
                    : !isDisabledYear && "hover:bg-primary/10 text-foreground"
                )}
              >
                {year}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex justify-center">
      {mode === "day" && renderDayPicker()}
      {mode === "month" && renderMonthPicker()}
      {mode === "year" && renderYearPicker()}
    </div>
  );
};

export default AdvancedDatePicker;
