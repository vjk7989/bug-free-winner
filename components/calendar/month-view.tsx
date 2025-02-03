'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek
} from 'date-fns';
import { Clock, ChevronLeft, ChevronRight } from "lucide-react";

interface Event {
  id: string;
  title: string;
  date: Date;
  time: string;
  type: 'viewing' | 'meeting' | 'open-house' | 'follow-up' | 'call';
  description: string;
  location?: string;
}

interface MonthViewProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export function MonthView({ selectedDate, onDateChange }: MonthViewProps) {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const savedEvents = localStorage.getItem('calendar_events');
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents).map((event: any) => ({
        ...event,
        date: new Date(event.date)
      })));
    }
  }, []);

  const getEventTypeColor = (type: Event['type']) => {
    switch (type) {
      case 'viewing': return 'bg-blue-100 text-blue-700';
      case 'meeting': return 'bg-purple-100 text-purple-700';
      case 'open-house': return 'bg-green-100 text-green-700';
      case 'follow-up': return 'bg-yellow-100 text-yellow-700';
      case 'call': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handlePrevMonth = () => {
    onDateChange(subMonths(selectedDate, 1));
  };

  const handleNextMonth = () => {
    onDateChange(addMonths(selectedDate, 1));
  };

  // Get all days in the month including days from previous/next months to fill the calendar
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  // Get events for a specific day
  const getDayEvents = (date: Date) => {
    return events.filter(event => isSameDay(new Date(event.date), date));
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="flex justify-center items-center p-4 border-b">
        <Button variant="ghost" size="icon" onClick={handlePrevMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-lg font-semibold px-4">
          {format(selectedDate, 'MMMM yyyy')}
        </h2>
        <Button variant="ghost" size="icon" onClick={handleNextMonth}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 divide-x divide-y">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="p-2 text-center font-medium bg-gray-50">
            {day}
          </div>
        ))}

        {calendarDays.map((day) => (
          <div
            key={day.toISOString()}
            className={`min-h-[120px] p-2 ${
              !isSameMonth(day, selectedDate) ? 'bg-gray-50' : ''
            }`}
          >
            <div className={`text-sm font-medium mb-1 ${
              isSameDay(day, new Date()) ? 'text-blue-600' : 
              !isSameMonth(day, selectedDate) ? 'text-gray-400' : ''
            }`}>
              {format(day, 'd')}
            </div>
            <div className="space-y-1">
              {getDayEvents(day).slice(0, 3).map((event) => (
                <div
                  key={event.id}
                  className={`p-1 rounded text-xs ${getEventTypeColor(event.type)}`}
                >
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{event.time}</span>
                  </div>
                  <div className="font-medium truncate">{event.title}</div>
                </div>
              ))}
              {getDayEvents(day).length > 3 && (
                <div className="text-xs text-gray-500">
                  +{getDayEvents(day).length - 3} more
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 