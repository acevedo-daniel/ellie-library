import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiClient } from "../shared/api/client.js";
import { useToast } from "../components/ToastContext.js";

const MemberInputSchema = z.object({
  dni: z.string().min(6, "DNI de al menos 6 caracteres."),
  name: z.string().min(1, "El nombre es requerido."),
});
type MemberInput = z.infer<typeof MemberInputSchema>;

export function CreateMemberForm() {
  const qc = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MemberInput>({
    resolver: zodResolver(MemberInputSchema),
  });

  const toast = useToast();
  const create = useMutation({
    mutationFn: async (body: MemberInput) => {
      try {
        return await apiClient.post("/members", body);
      } catch (err: any) {
        if (err?.message?.includes("DNI")) {
          throw new Error("Ya existe un socio con ese DNI.");
        }
        throw err;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["members"] });
      reset();
      toast.showToast("El socio se ha registrado exitosamente.", "success");
    },
    onError: (err: any) => {
      toast.showToast(err?.message || "Error al registrar el socio.", "error");
    },
  });

  return (
    <form
      onSubmit={handleSubmit((d) => create.mutate(d))}
      className="space-y-4"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="label">DNI</label>
          <input className="input" {...register("dni")} />
          {errors.dni && (
            <p className="text-red-500 text-xs mt-1">{errors.dni.message}</p>
          )}
        </div>
        <div>
          <label className="label">Nombre completo</label>
          <input className="input" {...register("name")} />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button className="btn btn-primary" disabled={create.isPending}>
          {create.isPending ? "Creando..." : "Añadir socio"}
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
