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

    const estoqueSerialized = estoque.map((item: EstoqueMovimentacoes) => ({
      ...item,
      id: item.id.toString(),
      produto_id: item.produto_id.toString(),
    }));

    return NextResponse.json(estoqueSerialized);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
  }
}