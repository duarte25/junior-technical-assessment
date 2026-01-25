import { estoque, estoque_movimentacoes } from '@/generated/prisma/client';
import prisma from '@/lib/db';

export const findAll = async (term?: string): Promise<estoque[]> => {
  return prisma.estoque.findMany({
    where: term
      ? {
        OR: [
          { nome: { contains: term, mode: 'insensitive' } },
          { sku: { contains: term, mode: 'insensitive' } },
        ],
      }
      : undefined,
    include: { produtos: true },
  });
};

// O ID Corresponde a o ID de produto_id
export const getEstoqueByIdMovimentacao = async (id: bigint):Promise<estoque_movimentacoes[]> => {
  return prisma.estoque_movimentacoes.findMany({
    where: {
      produto_id: id
    },
    include: {
      produtos: {
        select: {
          nome: true,
          sku: true
        }
      }
    },
    orderBy: {
      criado_em: 'desc'
    }
  });
};

export const createMovimentacao = async (data: estoque_movimentacoes) => {
  return prisma.$transaction(async (tx) => {
    const mov = await tx.estoque_movimentacoes.create({ data });

    const ajuste = data.tipo === 'entrada' ? data.quantidade : -data.quantidade;

    await tx.estoque.update({
      where: { produto_id: data.produto_id },
      data: {
        quantidade: { increment: ajuste }
      }
    });

    return mov;
  });
};

export const updateEstoqueMovimentacao = async (
  id: bigint, 
  data: Partial<Omit<estoque_movimentacoes, 'id' | 'criado_em'>>
): Promise<estoque_movimentacoes> => {
  return prisma.$transaction(async (tx) => {
    // Busca a movimentação antiga para saber o que existia antes
    const movimentacaoAntiga = await tx.estoque_movimentacoes.findUnique({
      where: { id },
    });

    if (!movimentacaoAntiga) {
      throw new Error('Movimentação não encontrada');
    }

    // Atualiza a movimentação no banco
    const movimentacaoAtualizada = await tx.estoque_movimentacoes.update({
      where: { id },
      data,
    });

    // Calcula o estorno do valor antigo
    // Se era entrada, subtrai. Se era saída, soma (volta ao que era antes) assim como o create
    const estorno = movimentacaoAntiga.tipo === 'entrada' 
      ? -movimentacaoAntiga.quantidade 
      : movimentacaoAntiga.quantidade;

    // Calcula o novo impacto
    // Usa os dados novos (data) ou mantém o antigo se não foi alterado
    const novoTipo = data.tipo || movimentacaoAntiga.tipo;
    const novaQuantidade = data.quantidade !== undefined ? data.quantidade : movimentacaoAntiga.quantidade;
    
    const novoImpacto = novoTipo === 'entrada' ? novaQuantidade : -novaQuantidade;

    // Aplica a diferença líquida no estoque
    // Diferença = o que eu tirei/pus antes + o que eu devo tirar/pôr agora
    const ajusteLiquido = estorno + novoImpacto;

    await tx.estoque.update({
      where: { produto_id: movimentacaoAtualizada.produto_id },
      data: {
        quantidade: { increment: ajusteLiquido }
      }
    });

    return movimentacaoAtualizada;
  });
};

export const findEstoqueByProdutoId = async (produto_id: bigint) => {
  return prisma.estoque.findUnique({
    where: { produto_id }
  });
};

export const findMovimentacaoById = async (id: bigint) => {
  return prisma.estoque_movimentacoes.findUnique({
    where: { id }
  });
};