"use client";

import { DeleteCategoryDialog } from "@/components/categorias/categoria-delete-dialog";
import { EditCategoryModal } from "@/components/categorias/categoria-edit-modal";
import { AddCategoryModal } from "@/components/categorias/categoria-add-modal";
import { categoriaColumns } from "@/components/categorias/categoria-columns";
import { useCategories, Categoria } from "@/hooks/use-categorias";
import { DataTable } from "@/components/custom/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

export function CategoriasView() {
  const [inputValue, setInputValue] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");

  const { data: categories, isLoading, isError, error } = useCategories(debouncedTerm);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Categoria | null>(
    null,
  );
  const [categoryIdToDelete, setCategoryIdToDelete] = useState<string | null>(
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
    const categoryToEdit = categories?.find((cat) => cat.id === id);
    if (categoryToEdit) {
      setSelectedCategory(categoryToEdit);
      setIsEditModalOpen(true);
    }
  };

  const handleDelete = (id: string) => {
    setCategoryIdToDelete(id);
    setIsDeleteModalOpen(true);
  };

  if (isError) {
    return (
      <div className="text-red-500">
        Error: {error?.message || "Failed to load categories."}
      </div>
    );
  }

  return (
    <>
      <DataTable
        columns={categoriaColumns}
        data={categories || []}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading}
         searchComponent={
          <Input
            placeholder="Buscar categorias..."
            className="max-w-sm"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        }
        actionButtons={[
          <Button key="new-category" onClick={() => setIsAddModalOpen(true)}>
            Nova Categoria
          </Button>,
        ]}
      />

      <AddCategoryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
      <EditCategoryModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        category={selectedCategory}
      />
      <DeleteCategoryDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        categoryId={categoryIdToDelete}
      />
    </>
  );
}