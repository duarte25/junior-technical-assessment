import { estoque, estoque_movimentacoes } from '@/generated/prisma/client';
import * as repository from '@/repositories/estoque.repository';

export const getAllEstoque = async (term?: string): Promise<estoque[]> => {
  return repository.findAll(term);
};

export const getEstoqueByIdMovimentacao = async (id: bigint): Promise<estoque | null> => {
  return repository.getEstoqueByIdMovimentacao(id);
};

export const createMovimentacaoEstoque = async (data: Omit<estoque_movimentacoes, 'id' | 'criado_em'>): Promise<estoque_movimentacoes> => {
  return repository.createMovimentacao(data);
};