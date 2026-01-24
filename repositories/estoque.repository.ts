import { estoque } from '@/generated/prisma/client';
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

// export const findById = async (id: bigint): Promise<categorias | null> => {
//   return prisma.categorias.findUnique({
//     where: { id },
//   });
// };

// export const create = async (data: Omit<categorias, 'id' | 'criado_em'>): Promise<categorias> => {
//   return prisma.categorias.create({
//     data,
//   });
// };

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
