"use client";

import { useState, useEffect } from "react";
import { Calendar, Filter, Download, Loader2, User, MapPin, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

// Define event types as a const array and derive the type from it
const eventTypes = ['wifi', 'Swipe', 'critical', 'entry', 'exit'] as const;
type EventType = typeof eventTypes[number];

interface Profile {
  id: string;
  full_name: string;
  department?: string;
  mobile_no?: string;
}

interface TimelineEvent {
  id: string;
  event_id: string;
  event_type: EventType;
  location_id: string;
  entry_time: string;
  details?: string;
  exit_time: string | null;
  created_at: string;
  user_id: string;
  profile?: Profile;
}

const severityConfig = {
  wifi: {
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    text: "text-blue-700",
    badge: "bg-blue-500/20 text-blue-700",
    button: "bg-blue-500 hover:bg-blue-600"
  },
  Swipe: {
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
    text: "text-yellow-700",
    badge: "bg-yellow-500/20 text-yellow-700",
    button: "bg-yellow-500 hover:bg-yellow-600"
  },
  critical: {
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    text: "text-red-700",
    badge: "bg-red-500/20 text-red-700",
    button: "bg-red-500 hover:bg-red-600"
  },
  entry: {
    bg: "bg-green-500/10",
    border: "border-green-500/20",
    text: "text-green-700",
    badge: "bg-green-500/20 text-green-700",
    button: "bg-green-500 hover:bg-green-600"
  },
  exit: {
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    text: "text-purple-700",
    badge: "bg-purple-500/20 text-purple-700",
    button: "bg-purple-500 hover:bg-purple-600"
  }
};

export default function TimelinePage() {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<EventType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
  const fetchEvents = async () => {
    try {
      setLoading(true);
      console.log('Fetching events from Supabase...');
      
      // Get all events with profile information
      // First, let's get the events without the created_at sort to see what columns exist
      const { data: events, error: eventsError } = await supabase
        .from('events')
        .select(`
          *,
          profiles(*)
        `);
        
      if (eventsError) {
        console.error('Error fetching events:', eventsError);
        setError(`Error loading security events: ${eventsError.message || 'Unknown error'}`);
        setLoading(false);
        return;
      }
      
      console.log('Raw events data from Supabase:', events);
      
      if (!events || events.length === 0) {
        console.log('No events found in database');
        setEvents([]);
        // Set a helpful message in the UI
        setLoading(false);
        return;
      }
      
      // Log the structure of the first event
      if (events.length > 0) {
        console.log('First event structure:', {
          id: events[0].id,
          allKeys: Object.keys(events[0])
        });
      }
      
      // Transform the data to include profile information
      const formattedEvents = events.map((event) => {
        try {
          // Safely extract profile data with defaults
          const profile = event.profiles || {};
          const safeProfile = typeof profile === 'object' && profile !== null ? profile : {};
          
          // Safely extract and convert all profile fields
          const profileId = 'id' in safeProfile ? String(safeProfile.id) : 'unknown';
          const fullName = 'full_name' in safeProfile && safeProfile.full_name ? String(safeProfile.full_name) : 'Unknown User';
          const department = 'department' in safeProfile && safeProfile.department ? String(safeProfile.department) : undefined;
          const mobileNo = 'mobile_no' in safeProfile && safeProfile.mobile_no ? String(safeProfile.mobile_no) : undefined;
          
          // Safely extract and convert all event fields
          const eventId = event?.id ? String(event.id) : '';
          const eventType = event?.event_type && eventTypes.includes(event.event_type as EventType) 
            ? event.event_type 
            : 'wifi';
          
          // Create a safe event object with proper typing
          const safeEvent: TimelineEvent = {
            id: eventId,
            event_id: event?.event_id ? String(event.event_id) : eventId || '',
            event_type: eventType,
            location_id: event?.location_id ? String(event.location_id) : 'unknown',
            entry_time: event?.entry_time ? new Date(event.entry_time).toISOString() : new Date().toISOString(),
            details: event?.details ? String(event.details) : `Event ${eventId || ''}`,
            exit_time: event?.exit_time ? new Date(event.exit_time).toISOString() : null,
            created_at: event?.entry_time ? new Date(event.entry_time).toISOString() : new Date().toISOString(),
            user_id: event?.user_id ? String(event.user_id) : 'system',
            profile: {
              id: profileId,
              full_name: fullName,
              ...(department && { department }),
              ...(mobileNo && { mobile_no: mobileNo })
            }
          };
          
          // Verify all values are serializable
          JSON.parse(JSON.stringify(safeEvent));
          
          return safeEvent;

        } catch (error) {
          console.error('Error processing event:', { error, event });
          // Return a safe default event if there's an error
          return {
            id: 'error',
            event_id: 'error',
            event_type: 'wifi',
            location_id: 'unknown',
            entry_time: new Date().toISOString(),
            details: 'Error loading event',
            exit_time: null,
            created_at: new Date().toISOString(),
            user_id: 'system',
            profile: {
              id: 'error',
              full_name: 'Error',
              department: 'Error',
              mobile_no: undefined
            }
          };
        }
      });
      
      // Sort by entry_time (or created_at if available) in descending order
      formattedEvents.sort((a, b) => 
        new Date(b.entry_time).getTime() - new Date(a.entry_time).getTime()
      );
      
      console.log('Formatted events:', formattedEvents);

      console.log('Formatted events:', formattedEvents);
      setEvents(formattedEvents);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('An unknown error occurred');
      console.error('Error in fetchEvents:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      setError(`Failed to load events: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
    fetchEvents();

    // Set up real-time subscription
    const subscription = supabase
      .channel('events')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'events' }, 
        () => {
          fetchEvents(); // Refresh events when there are changes
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const filteredEvents = events.filter((event) => {
    try {
      // Filter by selected event type
      if (selectedFilter !== 'all' && event.event_type !== selectedFilter) return false;
      
      // Filter by search query if provided
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        const detailsMatch = event.details?.toLowerCase().includes(searchLower) ?? false;
        const userNameMatch = event.profile?.full_name?.toLowerCase().includes(searchLower) ?? false;
        const userIdMatch = event.user_id?.toLowerCase().includes(searchLower) ?? false;
        
        if (!detailsMatch && !userNameMatch && !userIdMatch) return false;
      }
      
      return true;
    } catch (err) {
      console.error('Error filtering event:', { event, error: err });
      return false;
    }
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Security Timeline</h1>
        <p className="text-muted-foreground">
          Chronological view of all security events and activities
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search events by details, name, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            aria-label="Search events"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2"
            onClick={() => {
              setSelectedFilter('all');
              setSearchQuery('');
            }}
          >
            <Filter className="w-4 h-4" />
            Clear Filters
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2"
            disabled={events.length === 0}
            onClick={() => {
              // Implement export functionality here
              console.log('Exporting events:', events);
            }}
          >
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Button
          variant={selectedFilter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedFilter("all")}
        >
          All Events ({events.length})
        </Button>
        {Object.entries({
          critical: 'Critical',
          Swipe: 'Swipes',
          wifi: 'WiFi',
          entry: 'Entries',
          exit: 'Exits'
        }).map(([type, label]) => (
          <Button
            key={type}
            variant={selectedFilter === type ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedFilter(type as EventType)}
            className={selectedFilter === type ? severityConfig[type as keyof typeof severityConfig]?.button || 'bg-gray-500 hover:bg-gray-600' : ''}
          >
            {label} ({events.filter(e => e.event_type === type).length})
          </Button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event, idx) => {
            const eventTime = new Date(event.entry_time);
            const timeString = eventTime.toLocaleTimeString();
            const dateString = eventTime.toLocaleDateString();
            // Create a unique key by combining the event ID and index
            const uniqueKey = `${event.id}-${idx}`;
            
            return (
              <Card key={uniqueKey} className="border border-border">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full ${
                        event.event_type === 'critical' ? 'bg-red-500' : 
                        event.event_type === 'Swipe' ? 'bg-yellow-500' :
                        event.event_type === 'entry' ? 'bg-green-500' :
                        event.event_type === 'exit' ? 'bg-purple-500' : 'bg-blue-500'
                      }`} />
                      {idx < filteredEvents.length - 1 && (
                        <div className="w-0.5 h-20 bg-border mt-2" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{event.event_type.charAt(0).toUpperCase() + event.event_type.slice(1)} Event</h3>
                            <Badge variant="outline" className="ml-2">
                              {event.event_type.toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {typeof event.details === 'string' ? event.details : 'No details available'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-mono text-sm font-semibold">
                            {timeString}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {dateString}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>
                            {String(event.profile?.full_name || 'Unknown User')}
                            <span className="text-xs text-muted-foreground">({String(event.user_id || 'unknown')})</span>
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>Location: {String(event.location_id || 'Unknown')}</span>
                        </div>
                        {event.profile?.department && (
                          <div className="flex items-center gap-1">
                            <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                              {String(event.profile.department || 'No Department')}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-1">No Security Events Found</h3>
            <p className="text-muted-foreground mb-4">
              There are no security events to display. This could mean:
            </p>
            <ul className="text-sm text-muted-foreground max-w-md mx-auto text-left list-disc pl-5 space-y-1">
              <li>No security events have been recorded yet</li>
              <li>There might be an issue with the database connection</li>
              <li>Your query filters might be too restrictive</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}