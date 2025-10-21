import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../shared/api/client.js";

import { useToast } from "../components/ToastContext.js";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function CreateLoanForm() {
  const [memberId, setMemberId] = useState("");
  const [bookIsbn, setBookIsbn] = useState("");
  const [error, setError] = useState<string | null>(null);
  const qc = useQueryClient();
  const toast = useToast();
  // Obtener lista de socios y préstamos activos para validaciones
  const { data: members } = useQuery({
    queryKey: ["members"],
    queryFn: () => apiClient.get<any[]>("/members"),
  });
  const { data: books } = useQuery({
    queryKey: ["books"],
    queryFn: () => apiClient.get<any[]>("/books"),
  });
  const { data: loans } = useQuery({
    queryKey: ["loans"],
    queryFn: () => apiClient.get<any[]>("/loans"),
  });
  // Verificar si el socio está multado
  function isMemberFined(id: string) {
    if (!members) return false;
    const member = members.find(
      (m: any) => String(m.id) === id || m.dni === id
    );
    return member?.fined === true;
  }
  // Verificar si el socio tiene préstamo activo
  function hasActiveLoan(id: string) {
    if (!loans) return false;
    return loans.some(
      (l: any) =>
        (String(l.member_id) === id || l.member?.dni === id) && !l.return_date
    );
  }
  // Verificar si el libro existe
  function bookExists(isbn: string) {
    if (!books) return false;
    return books.some((b: any) => b.isbn === isbn);
  }
  // Verificar si el socio existe
  function memberExists(id: string) {
    if (!members) return false;
    return members.some((m: any) => String(m.id) === id || m.dni === id);
  }
  // Verificar si el libro está prestado actualmente
  function bookHasActiveLoan(isbn: string) {
    if (!loans) return false;
    return loans.some((l: any) => l.book_isbn === isbn && !l.return_date);
  }
  const createMut = useMutation({
    mutationFn: async (data: { member_id: number; book_isbn: string }) =>
      await apiClient.post("/loans", data),
    onSuccess: () => {
      setMemberId("");
      setBookIsbn("");
      setError(null);
      qc.invalidateQueries({ queryKey: ["loans"] });
      toast.showToast("El préstamo se ha registrado exitosamente.", "success");
    },
    onError: (err: any) => {
      setError(err?.message || "Error al crear el préstamo");
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!memberId || !bookIsbn) {
      setError("Debes completar ambos campos.");
      return;
    }
    if (!memberExists(memberId)) {
      setError("El socio no existe.");
      return;
    }
    if (!bookExists(bookIsbn)) {
      setError("El libro no existe.");
      return;
    }
    if (isMemberFined(memberId)) {
      setError("El socio tiene una multa activa y no puede recibir un libro.");
      return;
    }
    if (hasActiveLoan(memberId)) {
      setError("El socio ya tiene un préstamo activo.");
      return;
    }
    if (bookHasActiveLoan(bookIsbn)) {
      setError("El libro ya está prestado actualmente.");
      return;
    }
    createMut.mutate({ member_id: Number(memberId), book_isbn: bookIsbn });
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label
          htmlFor="member"
          className="block text-sm font-medium text-neutral-700"
        >
          Socio
        </label>
        <input
          id="member"
          name="member"
          type="number"
          className="input input-bordered w-full"
          value={memberId}
          onChange={(e) => setMemberId(e.target.value)}
          disabled={createMut.isPending}
        />
      </div>
      <div>
        <label
          htmlFor="book"
          className="block text-sm font-medium text-neutral-700"
        >
          Libro
        </label>
        <input
          id="book"
          name="book"
          type="text"
          className="input input-bordered w-full"
          value={bookIsbn}
          onChange={(e) => setBookIsbn(e.target.value)}
          disabled={createMut.isPending}
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        className="btn btn-primary"
        disabled={createMut.isPending}
      >
        {createMut.isPending ? "Creando..." : "Crear préstamo"}
      </button>
    </form>
  );
}
import { Book, User, ArrowRight, Check } from "lucide-react";

type Loan = {
  id: number;
  member_id: number;
  book_isbn: string;
  start_date: string;
  return_date: string | null;
  member?: { name: string };
  book?: { title: string };
};

export function LoansPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["loans"],
    queryFn: () => apiClient.get<Loan[]>("/loans"),
  });

  const [damagedLoanId, setDamagedLoanId] = useState<number | null>(null);
  const [markingDamaged, setMarkingDamaged] = useState(false);
  const returnMut = useMutation({
    mutationFn: ({ id, damaged }: { id: number; damaged: boolean }) =>
      apiClient.post(`/loans/${id}/return`, { damaged }),
    onSuccess: () => {
      setDamagedLoanId(null);
      setMarkingDamaged(false);
      qc.invalidateQueries({ queryKey: ["loans"] });
      setSuccessMsg("Libro devuelto correctamente.");
      setTimeout(() => setSuccessMsg(""), 2000);
    },
  });

  const activeLoans = data?.filter((l) => !l.return_date) ?? [];
  const returnedLoans = data?.filter((l) => l.return_date) ?? [];

  const [successMsg, setSuccessMsg] = useState("");
  return (
    <section className="space-y-8">
      {successMsg && (
        <p className="text-green-600 text-sm mb-2">{successMsg}</p>
      )}
      {/* Debug: Mostrar estado interno */}
      <div className="text-xs text-red-500 mb-2">
        <div>damagedLoanId: {String(damagedLoanId)}</div>
        <div>markingDamaged: {String(markingDamaged)}</div>
      </div>
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
      <div className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight text-neutral-800">
          Préstamos Activos
        </h2>
        <div className="space-y-3">
          {activeLoans.map((l) => (
            <div
              key={l.id}
              className="card p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-neutral-100 flex items-center justify-center">
                  <Book className="h-5 w-5 text-neutral-500" />
                </div>
                <div>
                  <p className="font-semibold">
                    {l.book?.title ?? l.book_isbn}
                  </p>
                  <p className="text-sm text-neutral-500 flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5" />
                    <span>{l.member?.name ?? l.member_id}</span>
                    <span className="text-neutral-300">|</span>
                    <span>
                      Desde: {new Date(l.start_date).toLocaleDateString()}
                    </span>
                  </p>
                </div>
              </div>
              {damagedLoanId === l.id && markingDamaged ? (
                <div className="flex flex-col gap-2 w-full sm:w-auto">
                  <span className="text-sm">¿El libro está dañado?</span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() =>
                        returnMut.mutate({ id: l.id, damaged: true })
                      }
                      disabled={returnMut.isPending}
                    >
                      Marcar como dañado
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost"
                      onClick={() =>
                        returnMut.mutate({ id: l.id, damaged: false })
                      }
                      disabled={returnMut.isPending}
                    >
                      No está dañado
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  className="btn btn-primary w-full sm:w-auto"
                  onClick={() => {
                    setDamagedLoanId(l.id);
                    setMarkingDamaged(true);
                  }}
                  disabled={returnMut.isPending}
                >
                  <span>
                    {returnMut.isPending
                      ? "Procesando..."
                      : "Registrar devolución"}
                  </span>
                  <ArrowRight className="h-4 w-4 ml-1" />
                </button>
              )}
            </div>
          ))}
          {!isLoading && activeLoans.length === 0 && (
            <div className="card-dashed text-center">
              <p className="text-sm text-neutral-500">
                No hay préstamos activos en este momento.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Historial de Préstamos */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight text-neutral-800">
          Historial
        </h2>
        <div className="space-y-3">
          {returnedLoans.map((l) => (
            <div
              key={l.id}
              className="card p-4 flex items-center justify-between opacity-70"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-neutral-100 flex items-center justify-center">
                  <Book className="h-5 w-5 text-neutral-400" />
                </div>
                <div>
                  <p className="font-semibold text-neutral-600">
                    {l.book?.title ?? l.book_isbn}
                  </p>
                  <p className="text-sm text-neutral-500">
                    Socio: {l.member?.name ?? l.member_id} · Devuelto:{" "}
                    {new Date(l.return_date!).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-medium text-green-700">
                <Check className="h-4 w-4" />
                <span>Finalizado</span>
              </div>
            </div>
          ))}
          {!isLoading && returnedLoans.length === 0 && (
            <div className="card-dashed text-center">
              <p className="text-sm text-neutral-500">
                Aún no hay préstamos en el historial.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
