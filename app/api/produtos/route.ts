import * as service from '@/services/produtos.service';
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

  return NextResponse.json(produtosSerialized);
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
      categoria_id: categoria_id ? BigInt(categoria_id) : null,
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
    console.error(error);
    return NextResponse.json({ error: 'Falha ao criar produto' }, { status: 500 });
  }
}
