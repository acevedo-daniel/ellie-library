import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../shared/api/client.js";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

// Tipos de datos (sin cambios)
type Book = { isbn: string; title: string; author: string; state: string };
type Member = { member_id: number; dni: string; name: string };
type Loan = { id: number; return_date: string | null };

export function Dashboard() {
  const { data: books } = useQuery({
    queryKey: ["books"],
    queryFn: () => apiClient.get<Book[]>("/books"),
  });
  const { data: members } = useQuery({
    queryKey: ["members"],
    queryFn: () => apiClient.get<Member[]>("/members"),
  });
  const { data: loans } = useQuery({
    queryKey: ["loans"],
    queryFn: () => apiClient.get<Loan[]>("/loans"),
  });

  const activeLoans = (loans ?? []).filter((l) => !l.return_date).length;

  return (
    <section className="space-y-8">
      {/* Hero minimalista, enfocado en la tipografía. */}
      <div className="card p-8 text-center">
        <h1 className="text-4xl font-extrabold tracking-tighter md:text-5xl">
          Tu biblioteca sin fricción con Ellie
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-500">
          Un sistema simple para administrar libros, socios y prestamos.
          Construido con herramientas modernas para una experiencia de usuario
          excepcional.
        </p>
        <div className="mt-6 flex justify-center gap-2">
          <Link to="/loans" className="btn btn-primary">
            <span>Crear restamo</span>
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* KPIs con el nuevo estilo de card. */}
      <div className="grid gap-6 md:grid-cols-3">
        <Kpi title="Libros en el catalogo" value={books?.length ?? 0} />
        <Kpi title="Socios registrados" value={members?.length ?? 0} />
        <Kpi title="Prestamos activos" value={activeLoans} />
      </div>
    </section>
  );
}

function Kpi({ title, value }: { title: string; value: number }) {
  return (
    <div className="card p-6">
      <div className="text-sm text-neutral-500">{title}</div>
      <div className="mt-1 text-3xl font-bold tracking-tight">{value}</div>
    </div>
  );
}
