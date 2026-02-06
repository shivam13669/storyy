import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatDate, startOfDay, getDaysInMonth, startOfMonth } from "date-fns";
import { cn } from "@/lib/utils";

interface AdvancedDatePickerProps {
  selected?: Date;
  onSelect: (date: Date) => void;
  disabled?: (date: Date) => boolean;
}

type PickerMode = "day" | "month" | "year";

export const AdvancedDatePicker = ({
  selected,
  onSelect,
  disabled,
}: AdvancedDatePickerProps) => {
  const today = startOfDay(new Date());
  const [mode, setMode] = useState<PickerMode>("day");
  const [currentDate, setCurrentDate] = useState(selected || today);

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // Handle year selection
  const handleYearSelect = (year: number) => {
    const newDate = new Date(currentDate);
    newDate.setFullYear(year);
    setCurrentDate(newDate);
    setMode("month");
  };

  // Handle month selection
  const handleMonthSelect = (month: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(month);
    setCurrentDate(newDate);
    setMode("day");
  };

  // Handle day selection
  const handleDaySelect = (day: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(day);
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

    return (
      <div className="w-80 p-4 bg-card rounded-lg">
        {/* Header with Month/Year and navigation */}
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={() => {
              const newDate = new Date(currentDate);
              newDate.setMonth(newDate.getMonth() - 1);
              setCurrentDate(newDate);
            }}
            className="p-1 hover:bg-primary/10 rounded-md transition-colors"
          >
            <ChevronLeft className="h-5 w-5 text-foreground" />
          </button>

          <button
            type="button"
            onClick={() => setMode("month")}
            className="px-3 py-1 hover:bg-primary/10 rounded-md transition-colors font-semibold text-foreground"
          >
            {formatDate(currentDate, "MMMM yyyy")}
          </button>

          <button
            type="button"
            onClick={() => {
              const newDate = new Date(currentDate);
              newDate.setMonth(newDate.getMonth() + 1);
              setCurrentDate(newDate);
            }}
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
            const isDisabled = disabled?.(dateObj) ?? false;

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
          {months.map((month, idx) => (
            <button
              key={month}
              type="button"
              onClick={() => handleMonthSelect(idx)}
              className={cn(
                "py-2 px-3 rounded-md text-sm font-medium transition-colors",
                idx === currentMonth
                  ? "bg-primary text-primary-foreground font-bold"
                  : "hover:bg-primary/10 text-foreground"
              )}
            >
              {month.slice(0, 3)}
            </button>
          ))}
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
              const newDate = new Date(currentDate);
              newDate.setFullYear(currentYear + 10);
              setCurrentDate(newDate);
            }}
            className="p-1 hover:bg-primary/10 rounded-md transition-colors"
          >
            <ChevronRight className="h-5 w-5 text-foreground" />
          </button>
        </div>

        {/* Years grid */}
        <div className="grid grid-cols-3 gap-2">
          {years.map((year) => (
            <button
              key={year}
              type="button"
              onClick={() => handleYearSelect(year)}
              className={cn(
                "py-2 px-3 rounded-md text-sm font-medium transition-colors",
                year === currentYear
                  ? "bg-primary text-primary-foreground font-bold"
                  : "hover:bg-primary/10 text-foreground"
              )}
            >
              {year}
            </button>
          ))}
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
