"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { TrashIcon } from "@heroicons/react/24/outline";

type Memory = {
  id: number;
  created_at: string;
  text: string;
  qdrant_id: string;
};

export default function MemoriesPage() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMemories = async () => {
    const { data, error } = await supabase
      .from("memories")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) setError(error.message);
    else setMemories(data || []);
    setLoading(false);
  };

  const deleteMemory = async (id: number) => {
    const { error } = await supabase.from("memories").delete().eq("id", id);
    if (error) {
      alert("Fehler beim Löschen: " + error.message);
    } else {
      setMemories((prev) => prev.filter((m) => m.id !== id));
    }
  };

  useEffect(() => {
    fetchMemories();
  }, []);

  if (loading) return <p className="text-gray-500">Lade Erinnerungen…</p>;
  if (error) return <p className="text-red-500">Fehler: {error}</p>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Gespeicherte Erinnerungen</h1>
      {memories.map((m) => (
        <div
          key={m.id}
          className="relative bg-gray-800 text-white rounded-lg p-4 mb-4 shadow-md"
        >
          <button
            onClick={() => deleteMemory(m.id)}
            className="absolute top-2 right-2 text-gray-400 hover:text-red-400"
            title="Löschen"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
          <p className="text-sm text-gray-400 mb-2">
            {new Date(m.created_at).toLocaleString()}
          </p>
          <p>{m.text}</p>
        </div>
      ))}
    </div>
  );
}
