"use client";

import { DataTable } from "@/components/custom/data-table";
import { Estoque, useEstoque } from "@/hooks/use-estoque";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { estoqueColumns } from "../estoque/estoque-columns";

export function EstoqueView() {
  const [inputValue, setInputValue] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");

  const { data: estoque, isLoading, isError, error } = useEstoque(debouncedTerm);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState<Estoque | null>(
    null,
  );
  const [stockIdToDelete, setStockIdToDelete] = useState<string | null>(
    null,
  );

  console.log("estoque", estoque)

  useEffect(() => {
    const termToSet = inputValue.length >= 3 ? inputValue : "";

    const handler = setTimeout(() => {
      setDebouncedTerm(termToSet);
    }, 700);

    return () => clearTimeout(handler);
  }, [inputValue]);

  // const handleEdit = (id: string) => {
  //   const categoryToEdit = estoque?.find((cat) => cat.id === id);
  //   if (categoryToEdit) {
  //     setSelectedStock(categoryToEdit);
  //     setIsEditModalOpen(true);
  //   }
  // };

  const handleDelete = (id: string) => {
    setStockIdToDelete(id);
    setIsDeleteModalOpen(true);
  };

  if (isError) {
    return (
      <div className="text-red-500">
        Error: {error?.message || "Failed to load estoque."}
      </div>
    );
  }

  return (
    <>
      <DataTable
        columns={estoqueColumns}
        data={estoque || []}
        // onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading}
        searchComponent={
          <Input
            placeholder="Buscar no estoque..."
            className="max-w-sm"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        }
        actionButtons={[
          <Button key="new-category" onClick={() => setIsAddModalOpen(true)}>
            Nova movimentação
          </Button>,
        ]}
      />

      {/* <AddCategoryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      /> */}
      {/* <EditCategoryModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        category={selectedStock}
      />
      <DeleteCategoryDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        categoryId={categoryIdToDelete}
      /> */}
    </>
  );
}