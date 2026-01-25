-- CreateEnum
CREATE TYPE "tipo_movimentacao" AS ENUM ('entrada', 'saida');

-- CreateTable
CREATE TABLE "categorias" (
    "id" BIGSERIAL NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "descricao" TEXT,
    "criado_em" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "categorias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "produtos" (
    "id" BIGSERIAL NOT NULL,
    "categoria_id" BIGINT,
    "sku" VARCHAR(50) NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "estoque_minimo" INTEGER DEFAULT 0,
    "marca" VARCHAR(100) DEFAULT 'Generico',
    "criado_em" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "produtos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "estoque" (
    "id" BIGSERIAL NOT NULL,
    "produto_id" BIGINT NOT NULL,
    "quantidade" INTEGER NOT NULL DEFAULT 0,
    "atualizado_em" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "estoque_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "estoque_movimentacoes" (
    "id" BIGSERIAL NOT NULL,
    "produto_id" BIGINT NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "tipo" "tipo_movimentacao" NOT NULL,
    "criado_em" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "estoque_movimentacoes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "produtos_sku_key" ON "produtos"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "estoque_produto_id_key" ON "estoque"("produto_id");

-- AddForeignKey
ALTER TABLE "produtos" ADD CONSTRAINT "produtos_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "categorias"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "estoque" ADD CONSTRAINT "estoque_produto_id_fkey" FOREIGN KEY ("produto_id") REFERENCES "produtos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "estoque_movimentacoes" ADD CONSTRAINT "estoque_movimentacoes_produto_id_fkey" FOREIGN KEY ("produto_id") REFERENCES "produtos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
