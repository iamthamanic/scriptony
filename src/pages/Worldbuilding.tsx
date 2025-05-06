
import React from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { useWorldsState } from "@/hooks/useWorldsState";
import WorldsContent from "../components/worlds/WorldsContent";
import WorldModals from "../components/worlds/WorldModals";

const Worldbuilding = () => {
  const { user } = useAuth();
  
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
    handleDuplicateWorld,
    handleCategorySubmit,
    handleDeleteCategory,
    handleReorderCategories
  } = useWorldsState(user?.id);

  React.useEffect(() => {
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
      {/* Main content */}
      <WorldsContent 
        isLoading={isLoading}
        worlds={worlds}
        selectedWorld={selectedWorld}
        onSelectWorld={setSelectedWorldId}
        onNewWorld={() => setIsNewWorldModalOpen(true)}
        onEditWorld={handleEditWorld}
        onDeleteWorld={() => setIsDeleteWorldDialogOpen(true)}
        onDuplicateWorld={handleDuplicateWorld}
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

export default Worldbuilding;
