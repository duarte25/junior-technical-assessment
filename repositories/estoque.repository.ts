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

// export const update = async (id: bigint, data: Partial<Omit<categorias, 'id' | 'criado_em'>>): Promise<categorias> => {
//   return prisma.categorias.update({
//     where: { id },
//     data,
//   });
// };

// export const remove = async (id: bigint): Promise<categorias> => {
//   return prisma.categorias.delete({
//     where: { id },
//   });
// };
