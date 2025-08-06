import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Search, X } from 'lucide-react';
import { format } from 'date-fns';

interface ReceiptSearchFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  classFilter: string;
  onClassFilterChange: (value: string) => void;
  termFilter: string;
  onTermFilterChange: (value: string) => void;
  sessionFilter: string;
  onSessionFilterChange: (value: string) => void;
  dateFrom: Date | undefined;
  onDateFromChange: (date: Date | undefined) => void;
  dateTo: Date | undefined;
  onDateToChange: (date: Date | undefined) => void;
  amountFrom: string;
  onAmountFromChange: (value: string) => void;
  amountTo: string;
  onAmountToChange: (value: string) => void;
  onClearFilters: () => void;
}

const ReceiptSearchFilter: React.FC<ReceiptSearchFilterProps> = ({
  searchTerm,
  onSearchChange,
  classFilter,
  onClassFilterChange,
  termFilter,
  onTermFilterChange,
  sessionFilter,
  onSessionFilterChange,
  dateFrom,
  onDateFromChange,
  dateTo,
  onDateToChange,
  amountFrom,
  onAmountFromChange,
  amountTo,
  onAmountToChange,
  onClearFilters,
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Search & Filter Receipts</h3>
        <Button onClick={onClearFilters} variant="outline" size="sm" className="gap-2">
          <X className="h-4 w-4" />
          Clear All
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Search by student name */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by student name..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Class filter */}
        <Select value={classFilter} onValueChange={onClassFilterChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select class" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-classes">All Classes</SelectItem>
            <SelectItem value="Nursery 1">Nursery 1</SelectItem>
            <SelectItem value="Nursery 2">Nursery 2</SelectItem>
            <SelectItem value="Reception">Reception</SelectItem>
            <SelectItem value="Year 1">Year 1</SelectItem>
            <SelectItem value="Year 2">Year 2</SelectItem>
            <SelectItem value="Year 3">Year 3</SelectItem>
            <SelectItem value="Year 4">Year 4</SelectItem>
            <SelectItem value="Year 5">Year 5</SelectItem>
            <SelectItem value="Year 6">Year 6</SelectItem>
          </SelectContent>
        </Select>

        {/* Term filter */}
        <Select value={termFilter} onValueChange={onTermFilterChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select term" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-terms">All Terms</SelectItem>
            <SelectItem value="First Term">First Term</SelectItem>
            <SelectItem value="Second Term">Second Term</SelectItem>
            <SelectItem value="Third Term">Third Term</SelectItem>
          </SelectContent>
        </Select>

        {/* Session filter */}
        <Select value={sessionFilter} onValueChange={onSessionFilterChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select session" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-sessions">All Sessions</SelectItem>
            <SelectItem value="2023/2024">2023/2024</SelectItem>
            <SelectItem value="2024/2025">2024/2025</SelectItem>
            <SelectItem value="2025/2026">2025/2026</SelectItem>
          </SelectContent>
        </Select>

        {/* Date from */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateFrom ? format(dateFrom, "PPP") : "From date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={dateFrom}
              onSelect={onDateFromChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {/* Date to */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateTo ? format(dateTo, "PPP") : "To date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={dateTo}
              onSelect={onDateToChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {/* Amount from */}
        <Input
          type="number"
          placeholder="Min amount"
          value={amountFrom}
          onChange={(e) => onAmountFromChange(e.target.value)}
        />

        {/* Amount to */}
        <Input
          type="number"
          placeholder="Max amount"
          value={amountTo}
          onChange={(e) => onAmountToChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default ReceiptSearchFilter;