
import React, { useEffect } from 'react';
import { Container } from "@/components/ui/container";
import WorldsContent from "@/components/worlds/WorldsContent";
import WorldModals from "@/components/worlds/WorldModals";
import { useWorldsState } from "@/hooks/useWorldsState";
import { useAuth } from "@/hooks/useAuthState";
import { World, WorldCategory, WorldCategoryFormData } from "@/types";

const WorldbuildingPage = () => {
  const { user } = useAuth();
  const worldsState = useWorldsState(user?.id);
  const {
    worlds,
    selectedWorld,
    isLoading,
    isNewWorldModalOpen,
    isEditWorldModalOpen,
    isDeleteWorldDialogOpen,
    isCategoryModalOpen,
    selectedCategory,
    setSelectedWorldId,
    setIsNewWorldModalOpen,
    setIsEditWorldModalOpen, 
    setIsDeleteWorldDialogOpen,
    setIsCategoryModalOpen,
    handleCreateWorld,
    handleUpdateWorld,
    handleDeleteWorld,
    handleCategorySubmit,
    handleDeleteCategory,
    handleReorderCategories,
    loadWorlds,
    setSelectedCategory,
  } = worldsState;

  // Load worlds on mount and when user changes
  useEffect(() => {
    if (user?.id) {
      loadWorlds();
    }
  }, [user?.id, loadWorlds]);

  const handleAddCategory = () => {
    setSelectedCategory(null);
    setIsCategoryModalOpen(true);
  };
  
  const handleEditCategory = (category: WorldCategory) => {
    setSelectedCategory(category);
    setIsCategoryModalOpen(true);
  };

  return (
    <Container className="py-6 px-4 md:px-6 w-full">
      {/* Main content */}
      <WorldsContent 
        isLoading={isLoading}
        worlds={worlds}
        selectedWorld={selectedWorld}
        onSelectWorld={setSelectedWorldId}
        onNewWorld={() => setIsNewWorldModalOpen(true)}
        onEditWorld={() => setIsEditWorldModalOpen(true)}
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
    </Container>
  );
};

export default WorldbuildingPage;
