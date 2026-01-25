import * as repository from '@/repositories/categorias.repository';
import { categorias } from '@/generated/prisma/client';
import { BusinessError } from '@/lib/errors';

export const getAllCategorias = async (term?: string): Promise<categorias[]> => {
  return repository.findAll(term);
};

export const getCategoriaById = async (id: bigint): Promise<categorias | null> => {
  const categoria = await repository.findById(id);
  if (!categoria) throw new BusinessError("Categoria não encontrada", 404);
  return categoria;
};

export const createCategoria = async (data: Omit<categorias, 'id' | 'criado_em'>): Promise<categorias> => {
  if (!data.nome) throw new BusinessError("O nome da categoria é obrigatório", 400);

  const existing = await repository.findByNome(data.nome);

  if (existing) {
    throw new BusinessError(`A categoria "${data.nome}" já existe.`, 400);
  }

  return repository.create(data);
};

export const updateCategoria = async (id: bigint, data: Partial<Omit<categorias, 'id' | 'criado_em'>>): Promise<categorias> => {
  const categoria = await repository.findById(id);
  if (!categoria) throw new BusinessError("Categoria não encontrada para atualização", 404);

  return repository.update(id, data);
};

export const deleteCategoria = async (id: bigint): Promise<categorias> => {
  const categoria = await repository.findById(id);
  if (!categoria) {
    throw new BusinessError("Categoria não encontrada", 404);
  }

  const hasProducts = await repository.hasRelatedProducts(id);

  if (hasProducts) {
    throw new BusinessError("Não é possível excluir: existem produtos vinculados a esta categoria.", 400);
  }

  return repository.remove(id);
};