"use client";

import { useEffect, useState } from "react";
import { Clock, User } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

interface Entry {
  entry_id: string;
  user_id: string;
  status: string;
  last_seen: string;
  location: string;
  profiles?: {
    id: string;
    full_name: string;
    department: string;
    course: string;
    roll_no: string;
  };
}

export default function DashboardPage() {
  const [entities, setEntities] = useState<Entry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
   const fetchEntities = async () => {
  try {
    setLoading(true);

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      setError("Supabase is not configured. Please add the environment variables.");
      return;
    }

    let { data, error } = await supabase
      .from("entry")
      .select(`
        entry_id,
        user_id,
        status,
        last_seen,
        location,
        profiles (
          id,
          full_name
        )
      `);

    console.log("Joined fetch:", data, error);

    // fallback if join returns nothing
    if ((!data || data.length === 0) && !error) {
      const fallback = await supabase.from("entry").select("*");
      console.log("Fallback fetch:", fallback.data, fallback.error);
      data = fallback.data;
      error = fallback.error;
    }

    if (error) {
      console.error("Supabase query error:", error);
      throw new Error(error.message);
    }

    if (!data || data.length === 0) {
      throw new Error("No entities found in the database.");
    }

    console.log("Fetched entries:", data);
    setEntities(data);
    setSelectedEntry(data[0]);
  } catch (err) {
    console.error("Error fetching entities:", err);
    setError(err instanceof Error ? err.message : "Unknown error");
  } finally {
    setLoading(false);
  }
};


    fetchEntities();
  }, []);

  const handleLoadEntry = (entryId: string) => {
    const entry = entities.find((e) => e.entry_id === entryId);
    if (entry) setSelectedEntry(entry);
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  };

  // ✅ Show states properly
  if (loading)
    return (
      <main className="flex-1 overflow-auto p-6">
        <p className="text-muted-foreground">Loading entities...</p>
      </main>
    );

  if (error)
    return (
      <main className="flex-1 overflow-auto p-6">
        <p className="text-red-500 font-semibold">Error: {error}</p>
      </main>
    );

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
                    {entry.user_id} - {entry.profiles?.full_name}
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
                    {selectedEntry.profiles?.full_name ?? selectedEntry.user_id}
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
