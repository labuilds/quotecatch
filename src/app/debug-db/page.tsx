import { createClient } from "@/utils/supabase/server"

export default async function DebugPage() {
  const supabase = await createClient()
  const { data: calculators, error } = await supabase.from('calculators').select('id, name, deleted_at')
  
  return (
    <div className="p-10 font-mono">
      <h1 className="text-2xl font-semibold mb-4">Database Debug</h1>
      {error && <pre className="text-red-500">{JSON.stringify(error, null, 2)}</pre>}
      <table className="w-full border-collapse border border-slate-200">
        <thead>
          <tr className="bg-slate-100">
            <th className="border p-2">ID</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Deleted</th>
          </tr>
        </thead>
        <tbody>
          {calculators?.map(c => (
            <tr key={c.id}>
              <td className="border p-2">{c.id}</td>
              <td className="border p-2">{c.name}</td>
              <td className="border p-2">{c.deleted_at ? "YES" : "NO"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
