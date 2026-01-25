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

export async function PUT(
  request: Request, { params }: Params
) {
  try {
    const id = BigInt((await params).id);
    const body = await request.json();
    const { produto_id, quantidade, tipo } = body;

    const updatedEstoque = await service.updateEstoqueMovimentacao(id, { produto_id, quantidade, tipo });
    const updatedEstoqueSerialized = {
      ...updatedEstoque,
      id: updatedEstoque.id.toString(),
      produto_id: updatedEstoque.produto_id.toString(),
    };

    return NextResponse.json(updatedEstoqueSerialized);
  } catch (error) {
    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json({ error: 'Estoque não encontrada para atualização' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Falha ao atualizar estoque' }, { status: 500 });
  }
}