import { BusinessError } from '@/lib/errors';
import * as service from '@/services/estoque.service';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { produto_id, tipo, quantidade } = body;

    if (!quantidade) {
      return NextResponse.json({ error: 'Nome é obrigatório' }, { status: 400 });
    }

    const newMovimentacaoEstoque = await service.createMovimentacaoEstoque({ produto_id, tipo, quantidade });

    const newMovimentacaoEstoqueSerialized = JSON.parse(
      JSON.stringify(newMovimentacaoEstoque, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value
      )
    );
    return NextResponse.json(newMovimentacaoEstoqueSerialized, { status: 201 });
  } catch (error) {
    if (error instanceof BusinessError) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: 'Erro interno no servidor' }, { status: 500 });
  }
}
