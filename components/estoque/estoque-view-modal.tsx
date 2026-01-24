"use client";

import { estoqueMovimentacoesColumns } from "./estoque-movimentacoes-columns";
import { useEstoqueMovimentacoes } from "@/hooks/use-estoque";
import { BaseModal } from "@/components/custom/base-modal";
import { estoque } from "@/generated/prisma/client";
import { DataTable } from "../custom/data-table";

export function ViewEstoqueModal({
  isOpen,
  onClose,
  stock
}: {
  isOpen: boolean;
  onClose: () => void;
  stock: estoque
}) {

  const { data: estoqueMovimentacoes, isLoading, isError, error } = useEstoqueMovimentacoes(stock?.produto_id ?? "");

  if (isError) {
    return (
      <div className="text-red-500">
        Error: {error?.message || "Failed to load estoque."}
      </div>
    );
  }

  return (
    <BaseModal
      title="Movimentações de estoque"
      description="Preencha movimentações de estoque"
      isOpen={isOpen}
      onClose={onClose}
      className="!max-w-full md:!max-w-[1000px] w-full h-full md:h-auto m-0 md:m-auto rounded-none md:rounded-lg"
    >
      <>
        <DataTable
          columns={estoqueMovimentacoesColumns}
          data={estoqueMovimentacoes || []}
          // onView={handleVie}
          isLoading={isLoading}
        // searchComponent={
        //   <Input
        //     placeholder="Buscar no estoque..."
        //     className="max-w-sm"
        //     value={inputValue}
        //     onChange={(e) => setInputValue(e.target.value)}
        //   />
        // }
        />

        {/* <ViewEstoqueModal
        isOpen={isViewEstoqueModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        stock={selectedEstoque}
      /> */}
      </>
    </BaseModal>
  );
}
