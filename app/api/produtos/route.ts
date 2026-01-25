import * as service from '@/services/produtos.service';
import { BusinessError } from '@/lib/errors';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const term = searchParams.get('q') || undefined;

  const produtos = await service.getAllProdutos(term);

  const produtosSerialized = produtos.map(produto =>
    JSON.parse(JSON.stringify(produto, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ))
  );

  return NextResponse.json(produtosSerialized, { status: 200 });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sku, nome, categoria_id, estoque_minimo, marca } = body;

    if (!sku || !nome) {
      return NextResponse.json({ error: 'SKU e Nome são obrigatórios' }, { status: 400 });
    }

    const newProduto = await service.createProduto({
      sku,
      nome,
      categoria_id: categoria_id,
      estoque_minimo,
      marca,
    });
    const newProdutoSerialized = JSON.parse(
      JSON.stringify(newProduto, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value
      )
    );
    return NextResponse.json(newProdutoSerialized, { status: 201 });
  } catch (error) {

    if (error instanceof BusinessError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}
