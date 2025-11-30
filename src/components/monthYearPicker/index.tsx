"use client";

import { useState, useEffect } from "react";
import { cn } from "@viasegura/lib/utils";

import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  AlertCircle,
} from "lucide-react";
import { Button } from "@viasegura/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@viasegura/components/ui/popover";
import { MONTHS, MIN_YEAR, MAX_YEAR } from "@viasegura/constants/calendar";

interface MonthYearPickerProps {
  date?: Date;
  setDate: (date: Date) => void;
  className?: string;
}

export function MonthYearPicker({
  date,
  setDate,
  className,
}: MonthYearPickerProps) {
  const [currentYear, setCurrentYear] = useState(
    date ? date.getFullYear() : new Date().getFullYear()
  );
  const [isOpen, setIsOpen] = useState(false);

  const canPrevYear = currentYear > MIN_YEAR;
  const canNextYear = currentYear < MAX_YEAR;

  const handleMonthSelect = (monthIndex: number) => {
    const newDate = new Date(currentYear, monthIndex, 1);
    setDate(newDate);
    setIsOpen(false);
  };

  const handleYearChange = (increment: number) => {
    const newYear = currentYear + increment;
    if (newYear >= MIN_YEAR && newYear <= MAX_YEAR) {
      setCurrentYear(newYear);
    }
  };

  useEffect(() => {
    if (isOpen) {
      if (currentYear < MIN_YEAR) setCurrentYear(MIN_YEAR);
      if (currentYear > MAX_YEAR) setCurrentYear(MAX_YEAR);
    }
  }, [isOpen]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[240px] justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (
            `${MONTHS[date.getMonth()]} de ${date.getFullYear()}`
          ) : (
            <span>Selecione a Data</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0" align="start">
        <div className="flex flex-col space-y-4 p-3">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="icon"
              className={cn("h-7 w-7", !canPrevYear && "opacity-50")}
              onClick={() => handleYearChange(-1)}
              disabled={!canPrevYear}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="font-semibold text-sm">{currentYear}</div>

            <Button
              variant="outline"
              size="icon"
              className={cn("h-7 w-7", !canNextYear && "opacity-50")}
              onClick={() => handleYearChange(1)}
              disabled={!canNextYear}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {MONTHS.map((month, index) => (
              <Button
                key={month}
                variant={
                  date &&
                  date.getMonth() === index &&
                  date.getFullYear() === currentYear
                    ? "default"
                    : "ghost"
                }
                className="h-8 text-xs px-2"
                onClick={() => handleMonthSelect(index)}
              >
                {month.slice(0, 3)}
              </Button>
            ))}
          </div>

          <div className="border-t pt-2 mt-2">
            <div className="flex items-center justify-center text-[10px] text-muted-foreground gap-1.5 bg-muted/50 p-1.5 rounded-md">
              <AlertCircle className="h-3 w-3" />
              <span>
                Dados disponíveis: {MIN_YEAR} a {MAX_YEAR}
              </span>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
