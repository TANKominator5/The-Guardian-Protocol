"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, ChevronRight, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/supabase/config";

interface Entity {
  entry_id: string;
  user_id: string;
  status: string;
  last_seen: string;
  location: any;
}

export default function EntitiesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "SAFE" | "ALERT">(
    "ALL"
  );
  const [entities, setEntities] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch entities from database
  useEffect(() => {
    const fetchEntities = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('entry')
          .select('*')
          .order('last_seen', { ascending: false });

        if (error) {
          throw error;
        }

        setEntities(data || []);
      } catch (err) {
        console.error('Error fetching entities:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch entities');
      } finally {
        setLoading(false);
      }
    };

    fetchEntities();
  }, []);

  const filteredEntities = entities.filter((entry) => {
    const matchesSearch =
      entry.entry_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.user_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (entry.location && JSON.stringify(entry.location).toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      statusFilter === "ALL" || entry.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const safeCount = entities.filter((e) => e.status === "SAFE").length;
  const alertCount = entities.filter((e) => e.status === "ALERT").length;

  return (
    <main className="flex-1 overflow-auto p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Entities</h1>
          <p className="text-muted-foreground">
            Monitor and manage all unified entry profiles across the system
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total Entities
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {loading ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      entities.length
                    )}
                  </p>
                </div>
                <div className="text-3xl font-bold text-muted-foreground/30">
                  👥
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Safe Status</p>
                  <p className="text-2xl font-bold text-green-600">
                    {loading ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      safeCount
                    )}
                  </p>
                </div>
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Alerts</p>
                  <p className="text-2xl font-bold text-red-600">
                    {loading ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      alertCount
                    )}
                  </p>
                </div>
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle>Search & Filter</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by entry ID, user ID, or location..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              <Button
                variant={statusFilter === "ALL" ? "default" : "outline"}
                onClick={() => setStatusFilter("ALL")}
                size="sm"
              >
                All Entities
              </Button>
              <Button
                variant={statusFilter === "SAFE" ? "default" : "outline"}
                onClick={() => setStatusFilter("SAFE")}
                size="sm"
              >
                Safe
              </Button>
              <Button
                variant={statusFilter === "ALERT" ? "default" : "outline"}
                onClick={() => setStatusFilter("ALERT")}
                size="sm"
              >
                Alerts
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Entities Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              Entities ({filteredEntities.length} of {entities.length})
            </CardTitle>
            <CardDescription>
              Click on any entry to view detailed profile and timeline
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error ? (
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <p className="text-red-600 font-semibold mb-2">Error loading entities</p>
                <p className="text-muted-foreground">{error}</p>
                <Button 
                  onClick={() => window.location.reload()} 
                  variant="outline" 
                  className="mt-4"
                >
                  Retry
                </Button>
              </div>
            ) : loading ? (
              <div className="text-center py-8">
                <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Loading entities...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground">
                        Entry ID
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground">
                        Name
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground">
                        Confidence
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground">
                        Location
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground">
                        Last Seen
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEntities.length > 0 ? (
                      filteredEntities.map((entry) => (
                        <tr
                          key={entry.entry_id}
                          className="border-b border-border hover:bg-muted/50 transition-colors"
                        >
                          <td className="py-3 px-4">
                            <span className="font-mono font-semibold text-foreground">
                              {entry.entry_id}
                            </span>
                          </td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-semibold text-foreground">
                              User ID: {entry.user_id}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Entry ID: {entry.entry_id}
                            </p>
                          </div>
                        </td>
                          <td className="py-3 px-4">
                            <Badge
                              variant={
                                entry.status === "SAFE"
                                  ? "default"
                                  : "destructive"
                              }
                            >
                              {entry.status}
                            </Badge>
                          </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-muted rounded-full h-2">
                              <div
                                className="bg-blue-500 h-2 rounded-full"
                                style={{
                                  width: '85%', // Default confidence for now
                                }}
                              />
                            </div>
                            <span className="text-xs font-semibold">
                              85%
                            </span>
                          </div>
                        </td>
                          <td className="py-3 px-4">
                            <span className="text-foreground">
                              {entry.location ? 
                                (typeof entry.location === 'string' ? entry.location : JSON.stringify(entry.location)) 
                                : 'Unknown'
                              }
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-muted-foreground">
                              {entry.last_seen}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <Link href={`/entry/${entry.entry_id}`}>
                              <Button variant="ghost" size="sm" className="gap-1">
                                View
                                <ChevronRight className="w-4 h-4" />
                              </Button>
                            </Link>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="py-8 text-center">
                          <p className="text-muted-foreground">
                            {entities.length === 0 
                              ? "No entities found in the database" 
                              : "No entities found matching your search criteria"
                            }
                          </p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
