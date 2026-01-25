import { produtos } from '@/generated/prisma/client';
import prisma from '@/lib/db';

export const findAll = async (term?: string): Promise<produtos[]> => {
  return prisma.produtos.findMany({
    where: term
      ? {
        OR: [
          { nome: { contains: term, mode: 'insensitive' } },
          { sku: { contains: term, mode: 'insensitive' } },
        ],
      }
      : undefined, // se não tiver termo, pega tudo
    include: { categorias: true },
  });
};

export const findById = async (id: bigint): Promise<produtos | null> => {
  return prisma.produtos.findUnique({
    where: { id },
    include: { categorias: true },
  });
};

export const create = async (data: Omit<produtos, 'id' | 'criado_em'>): Promise<produtos> => {

  // $transaction para garantir que o estoque seja criado junto com o produto
  return prisma.$transaction(async (tx) => {
    const novoProduto = await tx.produtos.create({
      data: data,
    });

    await tx.estoque.create({
      data: {
        produto_id: novoProduto.id,
        quantidade: 0,
      },
    });

    return novoProduto;
  });
};

export const update = async (id: bigint, data: Partial<Omit<produtos, 'id' | 'criado_em'>>): Promise<produtos> => {
  return prisma.produtos.update({
    where: { id },
    data,
  });
};

export const remove = async (id: bigint): Promise<produtos> => {
  return prisma.produtos.delete({
    where: { id },
  });
};

export const findBySku = async (sku: string): Promise<produtos | null> => {
  return prisma.produtos.findUnique({
    where: { sku },
  });
};