import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as z from "zod";

// Zod Schemas
export const createEstoqueSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  descricao: z.string().optional(),
});

export const updateEstoqueSchema = z.object({
  id: z.string(),
  nome: z.string().min(1, "Nome é obrigatório").optional(),
  descricao: z.string().optional(),
});

// Types
export type Estoque = {
  id: string; // Prisma BigInt is serialized as string
  atualizado_em: Date;
  produto_id: string;
  quantidade: number;
};

export type EstoqueMovimentacoes = {
  id: string;
  criado_em: Date;
  produto_id: string;
  quantidade: number;
  tipo: string;
};

export type CreateEstoquePayload = z.infer<typeof createEstoqueSchema>;

export type UpdateEstoquePayload = z.infer<typeof updateEstoqueSchema>;

// API Functions
const fetchEstoque = async (searchTerm = ""): Promise<Estoque[]> => {

  const url = `/api/estoque${searchTerm ? `?q=${encodeURIComponent(searchTerm)}` : ""}`;

  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }
  return response.json();
};

const fetchEstoqueByIdMovimentacao = async (id: string): Promise<EstoqueMovimentacoes[]> => {
  const response = await fetch(`/api/estoque/movimentacoes/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch category with ID ${id}`);
  }
  return response.json();
};

// React Query Hooks
export const useEstoque = (searchTerm = "") => {
  return useQuery<Estoque[], Error>({
    queryKey: ["estoque", searchTerm],
    queryFn: () => fetchEstoque(searchTerm),
  });
};

export const useEstoqueMovimentacoes = (id: string) => {
  return useQuery<EstoqueMovimentacoes[], Error>({
    queryKey: ["estoqueMovimentacoes", id],
    queryFn: () => fetchEstoqueByIdMovimentacao(id),
    enabled: !!id, 
  });
};

// export const useCreateCategory = () => {
//   const queryClient = useQueryClient();
//   return useMutation<Categoria, Error, CreateCategoriaPayload>({
//     mutationFn: createCategory,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["categorias"] });
//     },
//   });
// };

// export const useUpdateCategory = () => {
//   const queryClient = useQueryClient();
//   return useMutation<Categoria, Error, UpdateCategoriaPayload>({
//     mutationFn: updateCategory,
//     onSuccess: (data) => {
//       queryClient.invalidateQueries({ queryKey: ["categorias"] });
//       queryClient.invalidateQueries({ queryKey: ["categorias", data.id] });
//     },
//   });
// };

// export const useDeleteCategory = () => {
//   const queryClient = useQueryClient();
//   return useMutation<void, Error, string>({
//     mutationFn: deleteCategory,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["categorias"] });
//     },
//   });
// };
