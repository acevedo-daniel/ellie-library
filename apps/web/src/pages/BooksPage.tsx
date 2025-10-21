import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../shared/api/client.js";
import { CreateBookForm } from "../features/CreateBookForm.js";

type Book = {
  isbn: string;
  title: string;
  author: string;
  state: "AVAILABLE" | "LOANED" | "DAMAGED";
};

// Componente para mostrar el estado con un estilo visual
function StateBadge({ state }: { state: Book["state"] }) {
  const baseClasses = "text-xs px-2 py-0.5 rounded-full font-medium";
  const styles = {
    AVAILABLE: "bg-neutral-200 text-neutral-800",
    LOANED: "bg-neutral-300 text-neutral-800",
    DAMAGED: "bg-neutral-900 text-white",
  };
  return <span className={`${baseClasses} ${styles[state]}`}>{state}</span>;
}

export function BooksPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["books"],
    queryFn: () => apiClient.get<Book[]>("/books"),
  });

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Libros</h1>
        <p className="text-neutral-500 mt-1">
          Añade, edita y gestiona el catálogo de Ellie.
        </p>
      </header>

      {/* El formulario ahora estÃ¡ dentro de un 'card' */}
      <div className="card p-5">
        <CreateBookForm />
      </div>

      {isLoading && <p className="text-center text-neutral-500">Cargando...</p>}
      {error && <p className="text-red-600">Error al cargar los libros.</p>}

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {data?.map((b) => (
          <div key={b.isbn} className="card flex flex-col p-5">
            <div className="grow">
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-semibold text-neutral-900">{b.title}</h3>
                <StateBadge state={b.state} />
              </div>
              <p className="text-sm text-neutral-500">{b.author}</p>
            </div>
            <p className="mt-4 text-xs text-neutral-400">ISBN: {b.isbn}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

