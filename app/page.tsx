"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CategoriasView } from "@/components/views/categorias-view";
import { ProdutosView } from "@/components/views/produtos-view";
import { EstoqueView } from "@/components/views/estoque-view";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-24">
      <div className="z-10 w-full max-w-5xl flex flex-col md:flex-row items-center gap-6 mb-12">

        <div className="bg-white rounded-2xl shadow-lg flex items-center justify-center">
          <Image
            src="/logo_fundo.png"
            alt="Logo Gestão de Estoque"
            width={100}
            height={100}
            className="object-contain" 
          />
        </div>

        <div>
          <h1 className="text-4xl font-bold text-white">Gestão de Estoque</h1>
          <p className="text-blue-200/60 text-sm font-mono">Software Professional</p>
        </div>
      </div>

      <div className="w-full max-w-5xl bg-[#f0f4f8] p-6 rounded-xl shadow-2xl text-slate-900">
        <Tabs defaultValue="categorias" className="w-full max-w-5xl">
          <TabsList className="grid w-full grid-cols-3 bg-[#f0f4f8] p-1 h-12 shadow-inner">

            <TabsTrigger
              value="categorias"
              className="data-[state=active]:bg-[#1848a0] data-[state=active]:text-white text-[#102a43] font-semibold transition-all"
            >
              Categorias
            </TabsTrigger>

            <TabsTrigger
              value="produtos"
              className="data-[state=active]:bg-[#1848a0] data-[state=active]:text-white text-[#102a43] font-semibold transition-all"
            >
              Produtos
            </TabsTrigger>

            <TabsTrigger
              value="estoque"
              className="data-[state=active]:bg-[#1848a0] data-[state=active]:text-white text-[#102a43] font-semibold transition-all"
            >
              Estoque
            </TabsTrigger>
          </TabsList>
          <div className="mt-6">
            <TabsContent value="categorias">
              <CategoriasView />
            </TabsContent>
            <TabsContent value="produtos">
              <ProdutosView />
            </TabsContent>
            <TabsContent value="estoque">
              <EstoqueView />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </main>
  );
}