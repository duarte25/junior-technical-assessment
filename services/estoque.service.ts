import * as repository from '@/repositories/estoque.repository';
import { estoque } from '@/generated/prisma/client';

export const getAllEstoque = async (term?: string): Promise<estoque[]> => {
  return repository.findAll(term);
};

export const getEstoqueByIdMovimentacao = async (id: bigint): Promise<estoque | null> => {
  return repository.getEstoqueByIdMovimentacao(id);
};

// export const createCategoria = async (data: Omit<categorias, 'id' | 'criado_em'>): Promise<categorias> => {
//   return repository.create(data);
// };

// export const updateCategoria = async (id: bigint, data: Partial<Omit<categorias, 'id' | 'criado_em'>>): Promise<categorias> => {
//   return repository.update(id, data);
// };

// export const deleteCategoria = async (id: bigint): Promise<categorias> => {
//   return repository.remove(id);
// };
