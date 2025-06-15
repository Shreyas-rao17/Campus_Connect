import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Plus } from 'lucide-react';
import api from '@/lib/axios';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import './EventsPage.css';

interface Event {
  _id?: string;
  title: string;
  start: string;
  end?: string;
  allDay?: boolean;
  description?: string;
}

const fetchEvents = async (): Promise<Event[]> => {
  const { data } = await api.get('/api/events');
  return data;
};

const EventsPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [newEvent, setNewEvent] = useState<Partial<Event>>({
    title: '',
    description: '',
    allDay: true
  });
  
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const { data: events = [], isLoading } = useQuery<Event[]>({
    queryKey: ['events'],
    queryFn: fetchEvents
  });

  const createEventMutation = useMutation({
    mutationFn: (event: Omit<Event, '_id'>) => api.post('/api/events', event),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast({ title: 'Success', description: 'Event created successfully' });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast({ 
        variant: 'destructive', 
        title: 'Error', 
        description: error.response?.data?.message || 'Failed to create event' 
      });
    }
  });

  const handleDateClick = (arg: DateClickArg) => {
    setSelectedDate(arg.date);
    setNewEvent(prev => ({
      ...prev,
      start: arg.date.toISOString(),
      end: arg.date.toISOString()
    }));
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setNewEvent({
      title: '',
      description: '',
      allDay: true
    });
    setSelectedDate(undefined);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.start) return;
    
    createEventMutation.mutate(newEvent as Omit<Event, '_id'>);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-white mb-6">Events Calendar</h1>
      
      <Card className="p-4 glass-card hover-glow">
        <div className={`events-calendar ${isLoading ? 'calendar-loading' : ''}`}>
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={events}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,dayGridWeek'
            }}
            height="auto"
            themeSystem="standard"
            dateClick={handleDateClick}
            eventContent={(arg) => (
              <div className="p-1">
                <div className="font-semibold">{arg.event.title}</div>
                {arg.event.extendedProps.description && (
                  <div className="text-xs opacity-75">{arg.event.extendedProps.description}</div>
                )}
              </div>
            )}
          />
        </div>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="glass-card border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white">
              Add Event for {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : ''}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-white">Event Title</Label>
              <Input
                id="title"
                value={newEvent.title}
                onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                className="glass border-white/20 text-white"
                placeholder="Enter event title"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description" className="text-white">Description</Label>
              <Input
                id="description"
                value={newEvent.description}
                onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                className="glass border-white/20 text-white"
                placeholder="Enter event description"
              />
            </div>

            <DialogFooter>
              <Button
                type="submit"
                className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600"
                disabled={createEventMutation.isPending}
              >
                {createEventMutation.isPending ? 'Creating...' : 'Create Event'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Button
        onClick={() => {
          setSelectedDate(new Date());
          setIsDialogOpen(true);
        }}
        className="add-event-button"
      >
        <Plus className="w-6 h-6" />
      </Button>
    </div>
  );
};

export default EventsPage;
