import * as repository from '@/repositories/produtos.repository';
import { produtos } from '@/generated/prisma/client';
import { BusinessError } from '@/lib/errors';

export const getAllProdutos = async (term?: string): Promise<produtos[]> => {
  return repository.findAll(term);
};

export const getProdutoById = async (id: bigint): Promise<produtos | null> => {
  return repository.findById(id);
};

export const createProduto = async (data: Omit<produtos, 'id' | 'criado_em'>): Promise<produtos> => {
  const { sku } = data;

  const existing = await repository.findBySku(sku);
  
  if (existing) {
    throw new BusinessError(`Já existe um produto cadastrado com o SKU: ${sku}`, 400);
  }

  return repository.create(data);
};

export const updateProduto = async (id: bigint, data: Partial<Omit<produtos, 'id' | 'criado_em'>>): Promise<produtos> => {
  if (data.sku) {
    const existing = await repository.findBySku(data.sku);

    if (existing && existing.id !== id) {
      throw new BusinessError("Este SKU já pertence a outro produto.", 400);
    }
  }
  return repository.update(id, data);
};

export const deleteProduto = async (id: bigint): Promise<produtos> => {
  return repository.remove(id);
};
