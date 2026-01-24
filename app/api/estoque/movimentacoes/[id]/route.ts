import { EstoqueMovimentacoes } from '@/hooks/use-estoque';
import * as service from '@/services/estoque.service';
import { NextResponse } from 'next/server';

interface Params {
  params: Promise<{ id: string; }>;
}

export async function GET(
  request: Request,
  { params }: Params
) {
  try {

    const id = BigInt((await params).id);
    const estoque = await service.getEstoqueByIdMovimentacao(id);

    if (!estoque || estoque.length === 0) {
      return NextResponse.json({ error: 'Movimentações não encontradas' }, { status: 404 });
    }

    const estoqueSerialized = estoque.map((item: EstoqueMovimentacoes) => ({
      ...item,
      id: Number(item.id),
      produto_id: Number(item.produto_id),
    }));
    return NextResponse.json(estoqueSerialized);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
  }
}