import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../shared/api/client.js";
import { CreateMemberForm } from "../features/CreateMemberForm.js";
import { User, CheckCircle } from "lucide-react";

type Member = { member_id: number; dni: string; name: string };
type Fine = { id: number; member_id: number };

export function MembersPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["members"],
    queryFn: () => apiClient.get<Member[]>("/members"),
  });
  const { data: fines } = useQuery({
    queryKey: ["fines"],
    queryFn: () => apiClient.get<Fine[]>("/fines"),
  });

  const finedMemberIds = new Set((fines ?? []).map((f) => f.member_id));

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Socios</h1>
        <p className="text-neutral-500 mt-1">Gestiona los miembros de Ellie.</p>
      </header>

      <div className="card p-5">
        <CreateMemberForm />
      </div>

      {isLoading && <p className="text-center text-neutral-500">Cargando...</p>}
      {error && <p className="text-red-600">Error al cargar los socios.</p>}

      <div className="grid gap-5 md:grid-cols-2">
        {data?.map((m) => (
          <div key={m.member_id} className="card p-5 flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-neutral-100 flex items-center justify-center">
              <User className="h-5 w-5 text-neutral-500" />
            </div>
            <div className="grow">
              <p className="font-semibold">{m.name}</p>
              <p className="text-sm text-neutral-500">
                DNI {m.dni} · ID {m.member_id}
              </p>
            </div>
            {finedMemberIds.has(m.member_id) ? (
              <span className="text-xs font-medium px-2 py-0.5 rounded bg-neutral-900 text-white">
                Multado
              </span>
            ) : (
              <div className="flex items-center gap-1.5 text-xs text-green-600">
                <CheckCircle className="h-3.5 w-3.5" />
                <span>Activo</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
