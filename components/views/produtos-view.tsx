"use client";

import { DeleteProductDialog } from "@/components/produtos/produto-delete-dialog";
import { EditProductModal } from "@/components/produtos/produto-edit-modal";
import { AddProductModal } from "@/components/produtos/produto-add-modal";
import { produtoColumns } from "@/components/produtos/produto-columns";
import { useProdutos, Produto } from "@/hooks/use-produtos";
import { DataTable } from "@/components/custom/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

export function ProdutosView() {
  const [inputValue, setInputValue] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");

  const { data: produtos, isLoading, isError, error } = useProdutos(debouncedTerm);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Produto | null>(null);
  const [productIdToDelete, setProductIdToDelete] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const termToSet = inputValue.length >= 3 ? inputValue : "";

    const handler = setTimeout(() => {
      setDebouncedTerm(termToSet);
    }, 700);

    return () => clearTimeout(handler);
  }, [inputValue]);

  const handleEdit = (id: string) => {
    const productToEdit = produtos?.find((prod) => prod.id === id);
    if (productToEdit) {
      setSelectedProduct(productToEdit);
      setIsEditModalOpen(true);
    }
  };

  const handleDelete = (id: string) => {
    setProductIdToDelete(id);
    setIsDeleteModalOpen(true);
  };

  if (isError) {
    return (
      <div className="text-red-500">
        Error: {error?.message || "Failed to load products."}
      </div>
    );
  }

  return (
    <>
      <DataTable
        columns={produtoColumns}
        data={produtos || []}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading}
        searchComponent={
          <Input
            placeholder="Buscar produtos..."
            className="max-w-sm"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        }
        actionButtons={[
          <Button key="new-product" onClick={() => setIsAddModalOpen(true)}>
            Novo Produto
          </Button>,
        ]}
      />

      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
      <EditProductModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        product={selectedProduct}
      />
      <DeleteProductDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        productId={productIdToDelete}
      />
    </>
  );
}