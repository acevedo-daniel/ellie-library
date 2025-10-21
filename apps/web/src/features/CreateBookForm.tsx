import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiClient } from "../shared/api/client.js";
import { useToast } from "../components/ToastContext.js";

const BookInputSchema = z.object({
  isbn: z.string().min(3, "ISBN de al menos 3 caracteres."),
  title: z.string().min(1, "El Título es requerido."),
  author: z.string().min(1, "El autor es requerido."),
});
type BookInput = z.infer<typeof BookInputSchema>;

export function CreateBookForm() {
  const qc = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BookInput>({
    resolver: zodResolver(BookInputSchema),
  });

  const toast = useToast();
  const { data: books } = useQuery({
    queryKey: ["books"],
    queryFn: () => apiClient.get<any[]>("/books"),
  });
  const create = useMutation({
    mutationFn: async (body: BookInput) => {
      if (books && books.some((b: any) => b.isbn === body.isbn)) {
        throw new Error("Ya existe un libro con ese ISBN.");
      }
      return await apiClient.post("/books", body);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["books"] });
      reset();
      toast.showToast("El libro se ha creado exitosamente.", "success");
    },
    onError: (err: any) => {
      toast.showToast(err?.message || "Error al crear el libro.", "error");
    },
  });

  return (
    <form
      onSubmit={handleSubmit((d) => create.mutate(d))}
      className="space-y-4"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="isbn" className="label">
            ISBN
          </label>
          <input id="isbn" className="input" {...register("isbn")} />
          {errors.isbn && (
            <p className="text-red-500 text-xs mt-1">{errors.isbn.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="author" className="label">
            Autor
          </label>
          <input id="author" className="input" {...register("author")} />
          {errors.author && (
            <p className="text-red-500 text-xs mt-1">{errors.author.message}</p>
          )}
        </div>
      </div>
      <div>
        <label htmlFor="title" className="label">
          Título
        </label>
        <input id="title" className="input" {...register("title")} />
        {errors.title && (
          <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
        )}
      </div>

      <div className="flex justify-end pt-2">
        <button className="btn btn-primary" disabled={create.isPending}>
          {create.isPending ? "Creando..." : "Añadir libro"}
        </button>
      </div>
      {create.error && (
        <p className="text-red-500 text-sm">
          {(create.error as Error).message}
        </p>
      )}
    </form>
  );
}
