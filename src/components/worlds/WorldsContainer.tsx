
import React, { useEffect } from 'react';
import AppHeader from "../AppHeader";
import WorldsContent from "./WorldsContent";
import WorldModals from "./WorldModals";
import { useWorldsState } from "@/hooks/useWorldsState";

interface WorldsContainerProps {
  user: any;
}

const WorldsContainer = ({ user }: WorldsContainerProps) => {
  const {
    worlds,
    selectedWorld,
    selectedWorldId,
    isLoading,
    isNewWorldModalOpen,
    isEditWorldModalOpen,
    isDeleteWorldDialogOpen,
    isCategoryModalOpen,
    selectedCategory,
    loadWorlds,
    setSelectedWorldId,
    setIsNewWorldModalOpen,
    setIsEditWorldModalOpen, 
    setIsDeleteWorldDialogOpen,
    setIsCategoryModalOpen,
    setSelectedCategory,
    handleCreateWorld,
    handleUpdateWorld,
    handleDeleteWorld,
    handleCategorySubmit,
    handleDeleteCategory,
    handleReorderCategories
  } = useWorldsState(user?.id);

  // Load worlds on mount and when user changes
  useEffect(() => {
    loadWorlds();
  }, [user]);

  const handleEditWorld = () => {
    if (!selectedWorld) return;
    setIsEditWorldModalOpen(true);
  };

  const handleAddCategory = () => {
    setSelectedCategory(null);
    setIsCategoryModalOpen(true);
  };

  const handleEditCategory = (category: any) => {
    setSelectedCategory(category);
    setIsCategoryModalOpen(true);
  };

  return (
    <div className="py-6 px-4 md:px-6 w-full">
      <header className="mb-8">
        <AppHeader 
          onNewProject={() => setIsNewWorldModalOpen(true)} 
          accountName={user?.email?.split('@')[0] || "Demo User"}
        />
      </header>
      
      {/* Main content */}
      <WorldsContent 
        isLoading={isLoading}
        worlds={worlds}
        selectedWorld={selectedWorld}
        onSelectWorld={setSelectedWorldId}
        onNewWorld={() => setIsNewWorldModalOpen(true)}
        onEditWorld={handleEditWorld}
        onDeleteWorld={() => setIsDeleteWorldDialogOpen(true)}
        onAddCategory={handleAddCategory}
        onEditCategory={handleEditCategory}
        onDeleteCategory={handleDeleteCategory}
        onReorderCategories={handleReorderCategories}
      />
      
      {/* Modals */}
      <WorldModals
        isNewWorldModalOpen={isNewWorldModalOpen}
        isEditWorldModalOpen={isEditWorldModalOpen}
        isDeleteWorldDialogOpen={isDeleteWorldDialogOpen}
        isCategoryModalOpen={isCategoryModalOpen}
        onCloseNewWorldModal={() => setIsNewWorldModalOpen(false)}
        onCloseEditWorldModal={() => setIsEditWorldModalOpen(false)}
        onCloseDeleteWorldDialog={() => setIsDeleteWorldDialogOpen(false)}
        onCloseCategoryModal={() => {
          setIsCategoryModalOpen(false);
          setSelectedCategory(null);
        }}
        onCreateWorld={handleCreateWorld}
        onUpdateWorld={handleUpdateWorld}
        onDeleteWorld={handleDeleteWorld}
        onCategorySubmit={handleCategorySubmit}
        selectedWorld={selectedWorld}
        selectedCategory={selectedCategory}
      />
    </div>
  );
};

export default WorldsContainer;
