import { supabase } from "@/lib/supabaseClient";

export const revalidate = 0; // 每次请求都去 Supabase 拿最新

export default async function TestSupabasePage() {
  const { data, error } = await supabase.from("test").select("*").limit(20);

  if (error) {
    return (
      <div className="p-6 text-red-600">Error: {error.message}</div>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-24">
      <h1 className="text-2xl font-bold mb-6">Supabase 测试页面</h1>
      <div className="space-y-4">
        {data?.map((row: any) => (
          <article
            key={row.id}
            className="border rounded-lg p-4 hover:bg-zinc-50 transition"
          >
            <h2 className="text-lg font-semibold">{row.Title}</h2>
            <p className="text-sm text-zinc-500">{row.Author}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
