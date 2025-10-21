import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../components/ToastContext.js";
import { apiClient } from "../shared/api/client.js";
import { CreateLoanForm } from "../features/CreateLoanForm.js";

type Loan = {
  id: number;
  member_id: number;
  book_isbn: string;
  start_date: string;
  return_date: string | null;
  member?: { name: string };
  book?: { title: string };
  fine?: { id: number; amount: number; reason?: string | null } | null;
};

export function LoansPage() {
  const qc = useQueryClient();
  const toast = useToast();
  const { data, isLoading } = useQuery({
    queryKey: ["loans"],
    queryFn: () => apiClient.get<Loan[]>("/loans"),
  });

  const returnMut = useMutation({
    mutationFn: (input: { id: number; damaged: boolean }) =>
      apiClient.post(
        `/loans/${input.id}/return`,
        input.damaged ? { damaged: true } : {}
      ),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["loans"] });
      toast.showToast(
        variables.damaged
          ? "El libro se ha devuelto y se ha aplicado una multa."
          : "El libro se ha devuelto exitosamente.",
        "success"
      );
    },
  });

  const activeLoans = data?.filter((l) => !l.return_date) ?? [];
  const returnedLoans = data?.filter((l) => l.return_date) ?? [];

  return (
    <section className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Préstamos</h1>
        <p className="text-neutral-500 mt-1">
          Registra y gestiona las devoluciones de libros.
        </p>
      </header>

      <div className="card p-5">
        <CreateLoanForm />
      </div>

      {isLoading && <p className="text-center text-neutral-500">Cargando...</p>}

      {/* Préstamos Activos */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Activos</h2>
        <div className="space-y-3">
          {activeLoans.map((l) => (
            <div
              key={l.id}
              className="card p-4 flex items-center justify-between"
            >
              <div>
                <p className="font-semibold">{l.book?.title ?? l.book_isbn}</p>
                <p className="text-sm text-neutral-500">
                  Socio: {l.member?.name ?? l.member_id} · Desde:{" "}
                  {new Date(l.start_date).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => returnMut.mutate({ id: l.id, damaged: false })}
                  disabled={returnMut.isPending}
                >
                  Devolver
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => returnMut.mutate({ id: l.id, damaged: true })}
                  disabled={returnMut.isPending}
                  title="Aplicar multa"
                >
                  Multar
                </button>
              </div>
            </div>
          ))}
          {activeLoans.length === 0 && (
            <p className="text-sm text-neutral-400">
              No hay préstamos activos.
            </p>
          )}
        </div>
      </div>

      {/* Historial de Préstamos */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Historial</h2>
        <div className="space-y-3">
          {returnedLoans.map((l) => (
            <div
              key={l.id}
              className="card p-4 flex items-center justify-between opacity-60"
            >
              <div>
                <p className="font-semibold">{l.book?.title ?? l.book_isbn}</p>
                <p className="text-sm text-neutral-500">
                  Socio: {l.member?.name ?? l.member_id} · Devuelto:{" "}
                  {new Date(l.return_date!).toLocaleDateString()}
                </p>
              </div>
              {l.fine ? (
                <span className="text-xs font-medium px-2 py-0.5 rounded bg-neutral-900 text-white">
                  Multado
                </span>
              ) : (
                <span className="text-xs font-medium text-neutral-500">
                  Finalizado
                </span>
              )}
            </div>
          ))}
          {returnedLoans.length === 0 && (
            <p className="text-sm text-neutral-400">
              No hay préstamos en el historial.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
