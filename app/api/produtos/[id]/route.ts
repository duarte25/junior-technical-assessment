import * as service from '@/services/produtos.service';
import { BusinessError } from '@/lib/errors';
import { NextResponse } from 'next/server';

interface Params {
  params: Promise<{ id: string; }>;
}
export async function GET(request: Request, { params }: Params) {
  try {
    const id = BigInt((await params).id);
    const produto = await service.getProdutoById(id);
    if (!produto) {
      return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 });
    }
    const produtoSerialized = JSON.parse(
      JSON.stringify(produto, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value
      )
    );
    return NextResponse.json(produtoSerialized, { status: 200 });
  } catch (error) {
    if (error instanceof BusinessError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const id = BigInt((await params).id);
    const body = await request.json();
    const { sku, nome, categoria_id, estoque_minimo, marca } = body;

    const updatedProduto = await service.updateProduto(id, {
      sku,
      nome,
      categoria_id: categoria_id ? BigInt(categoria_id) : undefined,
      estoque_minimo,
      marca,
    });
    const updatedProdutoSerialized = JSON.parse(
      JSON.stringify(updatedProduto, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value
      )
    );
    return NextResponse.json(updatedProdutoSerialized, { status: 200 });
  } catch (error) {
    if (error instanceof BusinessError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
   
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request, { params }: Params
) {
  try {
    const id = BigInt((await params).id);
    await service.deleteProduto(id);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json({ error: 'Produto não encontrado para exclusão' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Falha ao excluir produto' }, { status: 500 });
  }
}
