// app/memories/page.tsx oder pages/memories.tsx
import { supabase } from "@/lib/supabaseClient";

export default async function MemoriesPage() {
  const { data: memories, error } = await supabase
    .from("memories")
    .select("*")
    .order("created_at", { ascending: false });

  console.log(memories);

  if (error) return <div>Fehler beim Laden: {error.message}</div>;

  return (
    <div>
      <h1>Memories</h1>
      <ul>
        {memories.map((m: any) => (
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
