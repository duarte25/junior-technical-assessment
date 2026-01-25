import { EstoqueMovimentacoes } from '@/hooks/use-estoque';
import * as service from '@/services/estoque.service';
import { BusinessError } from '@/lib/errors';
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

    if (error instanceof BusinessError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
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
    if (error instanceof BusinessError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}