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
  const { sku, nome, categoria_id, estoque_minimo, marca } = data;

  return prisma.produtos.create({
    data: {
      sku,
      nome,
      categoria_id,
      estoque_minimo,
      marca,
    },
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
