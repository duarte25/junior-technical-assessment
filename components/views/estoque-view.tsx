"use client";

import { ViewEstoqueModal } from "../estoque/estoque-view-modal";
import { estoqueColumns } from "../estoque/estoque-columns";
import { DataTable } from "@/components/custom/data-table";
import { Estoque, useEstoque } from "@/hooks/use-estoque";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

export function EstoqueView() {
  const [inputValue, setInputValue] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");

  const { data: estoque, isLoading, isError, error } = useEstoque(debouncedTerm);
  const [isViewEstoqueModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedEstoque, setSelectedEstoque] = useState<Estoque | null>(
    null,
  );

  useEffect(() => {
    const termToSet = inputValue.length >= 3 ? inputValue : "";

    const handler = setTimeout(() => {
      setDebouncedTerm(termToSet);
    }, 700);

    return () => clearTimeout(handler);
  }, [inputValue]);

  if (isError) {
    return (
      <div className="text-red-500">
        Error: {error?.message || "Failed to load estoque."}
      </div>
    );
  }

  const handleView = (id: string) => {
    const categoryToEdit = estoque?.find((cat) => cat.id === id);
    if (categoryToEdit) {
      setSelectedEstoque(categoryToEdit);
      setIsViewModalOpen(true);
    }
  };

  return (
    <>
      <DataTable
        columns={estoqueColumns}
        data={estoque || []}
        onView={handleView}
        isLoading={isLoading}
        searchComponent={
          <Input
            placeholder="Buscar no estoque..."
            className="max-w-sm"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        }
      />

      <ViewEstoqueModal
        isOpen={isViewEstoqueModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        stock={selectedEstoque}
      />
    </>
  );
}