import { estoque, estoque_movimentacoes } from '@/generated/prisma/client';
import * as repository from '@/repositories/estoque.repository';
import { BusinessError } from '@/lib/errors';

export const getAllEstoque = async (term?: string): Promise<estoque[]> => {
  return repository.findAll(term);
};

export const getEstoqueByIdMovimentacao = async (id: bigint): Promise<estoque | null> => {
  return repository.getEstoqueByIdMovimentacao(id);
};

export const createMovimentacaoEstoque = async (data: Omit<estoque_movimentacoes, 'id' | 'criado_em'>): Promise<estoque_movimentacoes> => {
  if (data.tipo === 'saida') {
    const estoqueAtual = await repository.findEstoqueByProdutoId(data.produto_id);
    if (!estoqueAtual || estoqueAtual.quantidade < data.quantidade) {
      throw new BusinessError(`Saldo insuficiente! Estoque atual: ${estoqueAtual?.quantidade || 0}`, 400);
    }
  }
  return repository.createMovimentacao(data as estoque_movimentacoes);
};

export const updateEstoqueMovimentacao = async (id: bigint, data: Partial<Omit<estoque_movimentacoes, 'id' | 'criado_em'>>): Promise<estoque_movimentacoes> => {
  // Pegar a movimentação atual para saber o impacto que ela já causou
  const movAntiga = await repository.findMovimentacaoById(id);
  if (!movAntiga) throw new BusinessError("Movimentação não encontrada", 404);

  // Pegar o estoque real do produto agora
  const estoqueAtual = await repository.findEstoqueByProdutoId(movAntiga.produto_id);
  const saldoAgora = estoqueAtual?.quantidade || 0;

  // Simular o estorno da movimentação antiga
  const estorno = movAntiga.tipo === 'entrada' ? -movAntiga.quantidade : movAntiga.quantidade;

  // Calcular o novo impacto
  const novoTipo = data.tipo || movAntiga.tipo;
  const novaQtd = data.quantidade !== undefined ? data.quantidade : movAntiga.quantidade;
  const novoImpacto = novoTipo === 'entrada' ? novaQtd : -novaQtd;

  // Validar Saldo Atual + Estorno + Novo Impacto não pode ser < 0
  if (saldoAgora + estorno + novoImpacto < 0) {
    throw new BusinessError("Esta alteração deixaria o estoque negativo. Operação cancelada.", 400);
  }

  return repository.updateEstoqueMovimentacao(id, data);
};

export const deleteMovimentacao = async (id: bigint): Promise<estoque_movimentacoes> => {

  const mov = await repository.findMovimentacaoById(id);
  if (!mov) throw new BusinessError("Movimentação não encontrada", 404);

  if (mov.tipo === 'entrada') {
    const estoqueAtual = await repository.findEstoqueByProdutoId(mov.produto_id);
    const saldoResultante = (estoqueAtual?.quantidade || 0) - mov.quantidade;

    if (saldoResultante < 0) {
      throw new BusinessError(
        `Não é possível excluir esta entrada. O saldo atual (${estoqueAtual?.quantidade || 0}) ficaria negativo após o estorno.`,
        400
      );
    }
  }

  return repository.removeMovimentacao(id);
};