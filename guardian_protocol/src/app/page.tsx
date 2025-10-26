"use client";

import { useEffect, useState } from "react";
import { Clock, User } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

interface Profile {
  id: string;
  full_name: string;
  department?: string;
  course?: string;
  roll_no?: string;
}

interface LocationData {
  name: string;
  id: string;
}

interface Entry {
  entry_id: string;
  user_id: string;
  status: string;
  last_seen: string;
  location: string | LocationData;
  profiles: Profile[];
}

export default function DashboardPage() {
  const [entities, setEntities] = useState<Entry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Helper function to safely access nested properties
  const getSafeValue = (obj: any, path: string, defaultValue: any = 'N/A') => {
    return path.split('.').reduce((acc, part) => acc && acc[part] !== undefined ? acc[part] : defaultValue, obj);
  };

  useEffect(() => {
    const processEntries = (entries: any[]): Entry[] => {
      if (!Array.isArray(entries)) {
        console.warn("Expected array but got:", entries);
        return [];
      }

      console.log("Processing entries:", entries);
      
      return entries.map(entry => {
        // Ensure profiles is an array and has the correct structure
        let profiles: Profile[] = [];
        if (Array.isArray(entry.profiles)) {
          profiles = entry.profiles.map((profile: any) => ({
            id: profile?.id || '',
            full_name: profile?.full_name || 'Unknown',
            department: profile?.department,
            course: profile?.course,
            roll_no: profile?.roll_no
          }));
        } else if (entry.profiles && typeof entry.profiles === 'object') {
          // Handle case where profiles is a single object instead of array
          profiles = [{
            id: entry.profiles.id || '',
            full_name: entry.profiles.full_name || 'Unknown',
            department: entry.profiles.department,
            course: entry.profiles.course,
            roll_no: entry.profiles.roll_no
          }];
        }
        
        // Handle location which could be a string or JSON object
        let location = 'Unknown';
        try {
          if (typeof entry.location === 'string') {
            // Try to parse if it's a JSON string
            const parsedLocation = JSON.parse(entry.location);
            location = parsedLocation?.name || 'Unknown';
          } else if (entry.location && typeof entry.location === 'object') {
            // If it's already an object, use the name property
            location = entry.location.name || 'Unknown';
          }
        } catch (e) {
          console.warn('Error parsing location:', e);
        }

        // Ensure all required fields have proper defaults
        return {
          entry_id: entry.entry_id || '',
          user_id: entry.user_id || 'unknown',
          status: entry.status || 'unknown',
          last_seen: entry.last_seen || new Date().toISOString(),
          location: location,
          profiles
        };
      });
    };

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
          throw new Error("Supabase is not configured. Please add the environment variables.");
        }

        // First try to fetch with profile join
        const { data, error: queryError } = await supabase
          .from("entry")
          .select(`
            entry_id,
            user_id,
            status,
            last_seen,
            location,
            profiles (
              id,
              full_name,
              department,
              course,
              roll_no
            )
          `);

        console.log("Initial query results:", { data, queryError });

        if (queryError) throw queryError;

        // If we have data from the first query, use it
        if (data && data.length > 0) {
          console.log("Using data from initial query");
          const processedEntries = processEntries(data);
          setEntities(processedEntries);
          setSelectedEntry(processedEntries[0] || null);
          return;
        }

        // If no data from first query, try fallback without join
        console.log("No data from initial query, trying fallback...");
        const { data: fallbackData, error: fallbackError } = await supabase
          .from("entry")
          .select("*");
          
        if (fallbackError) throw fallbackError;
        
        if (fallbackData && fallbackData.length > 0) {
          console.log("Using fallback data:", fallbackData);
          const processedEntries = processEntries(fallbackData);
          setEntities(processedEntries);
          setSelectedEntry(processedEntries[0] || null);
          return;
        }

        // If we get here, no data was found in either query
        setError('No security entities found in the database. The system will show sample data.');
        setEntities([]);
        setSelectedEntry(null);
        
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred");
        setEntities([]);
        setSelectedEntry(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLoadEntry = (entryId: string) => {
    const entry = entities.find((e) => e.entry_id === entryId);
    if (entry) {
      setSelectedEntry(entry);
    }
  };

  // Safely get profile property with fallbacks
  const getProfileValue = (entry: Entry, key: keyof Profile): string => {
    try {
      // Special handling for location field
      if (key === 'location') {
        const location = entry.location;
        if (!location) return 'N/A';
        
        // If location is already a string, return it
        if (typeof location === 'string') return location;
        
        // If location is an object with a name property, return the name
        if (typeof location === 'object' && location !== null && 'name' in location) {
          return location.name || 'N/A';
        }
        
        return 'N/A';
      }
      
      // Handle profile fields
      if (!entry?.profiles?.length) return 'N/A';
      const profile = entry.profiles[0];
      const value = profile?.[key as keyof typeof profile];
      
      // If value is an object, stringify it
      if (value && typeof value === 'object') {
        return JSON.stringify(value);
      }
      
      return value !== undefined && value !== null ? String(value) : 'N/A';
    } catch (error) {
      console.error('Error getting profile value:', error);
      return 'N/A';
    }
  };

  const formatDate = (dateString: string | undefined | null): string => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? 'Invalid date' : date.toLocaleString();
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Date error';
    }
  };

  // ✅ Show states properly
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                {error} Displaying sample data for demonstration purposes.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedEntry)
    return (
      <main className="flex-1 overflow-auto p-6">
        <p className="text-muted-foreground">No entries found.</p>
      </main>
    );

  const statusColor =
    selectedEntry.status === "active"
      ? "bg-green-500/10 text-green-700"
      : selectedEntry.status === "inactive"
      ? "bg-gray-500/10 text-gray-700"
      : "bg-yellow-500/10 text-yellow-700";

  return (
    <main className="flex-1 overflow-auto p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Entry Resolution Dashboard</h1>
          <p className="text-muted-foreground">
            Query and monitor unified entry profiles across all data sources
          </p>
        </div>

        {/* Entry Selector */}
        <Card>
          <CardHeader>
            <CardTitle>Select Entry</CardTitle>
            <CardDescription>Choose an entry to view its unified profile</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <select
                className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-foreground"
                value={selectedEntry.entry_id}
                onChange={(e) => handleLoadEntry(e.target.value)}
              >
                {entities.map((entry) => (
                  <option key={entry.entry_id} value={entry.entry_id}>
                    {`${entry.user_id} - ${entry.profiles?.[0]?.full_name || 'Unknown'}`}
                  </option>
                ))}
              </select>
              <Button onClick={() => handleLoadEntry(selectedEntry.entry_id)}>Load Entry</Button>
            </div>
          </CardContent>
        </Card>

        {/* Status Banner */}
        <div className={`${statusColor} border border-current/20 rounded-lg p-4 flex items-start gap-3`}>
          <User className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold capitalize">Entry Status: {selectedEntry.status}</p>
            <p className="text-sm">Last seen {formatDate(selectedEntry.last_seen)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Unified Entry Profile</CardTitle>
                <CardDescription>Entry ID: {selectedEntry.user_id}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-2">Primary Name</p>
                  <p className="text-lg font-semibold text-foreground">
                    {String(selectedEntry.profiles?.[0]?.full_name || selectedEntry.user_id || 'Unknown')}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Entry Metadata</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <p className="text-sm text-muted-foreground">Entry Id</p>
                  <p className="font-mono text-sm">{selectedEntry.entry_id}</p>
                  <p className="text-sm text-muted-foreground">Last Seen</p>
                  <p className="font-mono text-sm">{formatDate(selectedEntry.last_seen)}</p>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-mono text-sm">{selectedEntry.location}</p>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-mono text-sm">{selectedEntry.status}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Status</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge className={`${statusColor} capitalize`}>{selectedEntry.status}</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Last Seen
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground">{formatDate(selectedEntry.last_seen)}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
