import { NextResponse } from 'next/server';
import * as service from '@/services/categorias.service';
import { BusinessError } from '@/lib/errors';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const term = searchParams.get('q') || undefined;

  const categorias = await service.getAllCategorias(term);

  const categoriasSerialized = categorias.map(categoria =>
    JSON.parse(JSON.stringify(categoria, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ))
  );

  return NextResponse.json(categoriasSerialized, { status: 200 });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nome, descricao } = body;
    if (!nome) {
      return NextResponse.json({ error: 'Nome é obrigatório' }, { status: 400 });
    }
    const newCategoria = await service.createCategoria({ nome, descricao });
    const newCategoriaSerialized = {
      ...newCategoria,
      id: newCategoria.id.toString()
    };
    return NextResponse.json(newCategoriaSerialized, { status: 201 });
  } catch (error) {
    if (error instanceof BusinessError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}
