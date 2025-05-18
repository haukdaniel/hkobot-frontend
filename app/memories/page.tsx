"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function MemoriesPage() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMemories = async () => {
      const { data, error } = await supabase
        .from("memories")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        setError(error.message);
      } else {
        setMemories(data || []);
      }

      setLoading(false);
    };

    fetchMemories();
  }, []);

  if (loading) return <p>Lade Erinnerungen…</p>;
  if (error) return <p>Fehler: {error}</p>;

  return (
    <div>
      <h1>Memories</h1>
      <ul>
        {memories.map((m) => (
          <li key={m.id}>
            <p>
              <strong>{new Date(m.created_at).toLocaleString()}</strong>
            </p>
            <p>{m.text}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

type Memory = {
  id: number;
  created_at: string;
  text: string;
  qdrant_id: string;
};
