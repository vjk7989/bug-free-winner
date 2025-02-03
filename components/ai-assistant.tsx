'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  MessageCircle,
  Calendar,
  BrainCircuit,
  X,
  Send,
  Phone,
  Lightbulb,
  Loader2,
  Plus
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { getGeminiResponse, AssistantContext } from '@/lib/gemini';
import { getUpcomingEvents, createCalendarEvent, type CalendarEvent } from '@/lib/calendar';
import { format } from 'date-fns';

export function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ type: 'user' | 'ai', content: string }>>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentContext, setCurrentContext] = useState<AssistantContext>({ type: 'general' });
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [showCalendarView, setShowCalendarView] = useState(false);

  // Fetch calendar events when calendar context is activated
  useEffect(() => {
    if (currentContext.type === 'calendar') {
      fetchCalendarEvents();
    }
  }, [currentContext.type]);

  const fetchCalendarEvents = async () => {
    try {
      const events = await getUpcomingEvents(localStorage.getItem('calendar_token') || '');
      setCalendarEvents(events);
      const eventsMessage = formatEventsMessage(events);
      setMessages(prev => [...prev, { type: 'ai', content: eventsMessage }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        type: 'ai', 
        content: "Please connect your Google Calendar to view and manage your events." 
      }]);
    }
  };

  const formatEventsMessage = (events: CalendarEvent[]) => {
    if (events.length === 0) return "You have no upcoming events.";
    
    return "Your upcoming events:\n" + events.map(event => {
      const start = new Date(event.start.dateTime);
      return `• ${event.summary} - ${format(start, 'MMM d, h:mm a')}`;
    }).join('\n');
  };

  const handleContextButton = (type: AssistantContext['type']) => {
    setCurrentContext({ type });
    setIsOpen(true);
    setShowCalendarView(type === 'calendar');
    
    const contextMessages = {
      strategy: "I'm ready to help you with strategy planning. What would you like to know?",
      calendar: "I can help you manage your calendar. You can:\n• View upcoming events\n• Create new events\n• Get reminders\nWhat would you like to do?",
      call: "I can assist with call management and reminders. How can I help?",
    };
    
    if (type !== 'general') {
      setMessages([{ type: 'ai', content: contextMessages[type] }]);
    }
  };

  const handleCreateEvent = async (eventDetails: string) => {
    try {
      // Parse event details using AI
      const parsedEvent = await getGeminiResponse(
        `Parse this event request into JSON format with summary, description, start, and end dates: ${eventDetails}`,
        { type: 'calendar' }
      );
      
      const eventData = JSON.parse(parsedEvent);
      const newEvent = await createCalendarEvent(
        localStorage.getItem('calendar_token') || '',
        {
          summary: eventData.summary,
          description: eventData.description,
          start: new Date(eventData.start),
          end: new Date(eventData.end),
        }
      );

      setMessages(prev => [...prev, { 
        type: 'ai', 
        content: `✅ Event created: ${newEvent.summary} on ${format(new Date(newEvent.start.dateTime), 'MMM d, h:mm a')}` 
      }]);
      
      // Refresh calendar events
      fetchCalendarEvents();
    } catch (error) {
      setMessages(prev => [...prev, { 
        type: 'ai', 
        content: "Sorry, I couldn't create the event. Please make sure to include event name, date, and time." 
      }]);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    setMessages(prev => [...prev, { type: 'user', content: input }]);
    setIsLoading(true);
    
    try {
      if (currentContext.type === 'calendar' && input.toLowerCase().includes('create')) {
        await handleCreateEvent(input);
      } else {
        const aiResponse = await getGeminiResponse(input, {
          ...currentContext,
          data: currentContext.type === 'calendar' ? { events: calendarEvents } : undefined
        });
        setMessages(prev => [...prev, { type: 'ai', content: aiResponse }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { 
        type: 'ai', 
        content: "I apologize, but I'm having trouble processing your request. Please try again." 
      }]);
    } finally {
      setIsLoading(false);
      setInput('');
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <Card className="w-96 h-[32rem] p-4 flex flex-col shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              {currentContext.type === 'calendar' ? (
                <Calendar className="h-5 w-5 text-primary" />
              ) : (
                <BrainCircuit className="h-5 w-5 text-primary" />
              )}
              <span className="font-semibold">
                {currentContext.type === 'calendar' ? 'Calendar Assistant' : 'AI Assistant'}
              </span>
            </div>
            <div className="flex gap-2">
              {currentContext.type === 'calendar' && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowCalendarView(!showCalendarView)}
                >
                  <Calendar className="h-4 w-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.type === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`rounded-lg p-2 max-w-[80%] ${
                    message.type === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="rounded-lg p-2 bg-muted">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Input
              placeholder={
                currentContext.type === 'calendar'
                  ? "Create event or ask about your schedule..."
                  : "Ask about strategy, reminders..."
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              disabled={isLoading}
            />
            <Button size="icon" onClick={handleSend} disabled={isLoading}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      ) : (
        <div className="flex flex-col gap-2">
          <Button
            size="icon"
            className="rounded-full h-12 w-12 shadow-lg"
            onClick={() => handleContextButton('general')}
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="rounded-full h-10 w-10 shadow-lg"
            onClick={() => handleContextButton('calendar')}
          >
            <Calendar className="h-5 w-5" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="rounded-full h-10 w-10 shadow-lg"
            onClick={() => handleContextButton('strategy')}
          >
            <Lightbulb className="h-5 w-5" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="rounded-full h-10 w-10 shadow-lg"
            onClick={() => handleContextButton('call')}
          >
            <Phone className="h-5 w-5" />
          </Button>
        </div>
      )}
    </div>
  );
} 