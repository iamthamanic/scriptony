
import React, { useEffect, useCallback } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { useWorldsState } from "@/hooks/useWorldsState";
import WorldsContent from "../components/WorldsContent";
import WorldModals from "../components/WorldModals";
import { trackPageView } from '@/lib/trackUsage';

const WorldbuildingPage = () => {
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
    handleReorderCategories,
    deletionState
  } = useWorldsState(user?.id);

  // Always load worlds when component mounts if user exists
  useEffect(() => {
    console.log("Worldbuilding component mounted, userId:", user?.id, "loading worlds");
    if (user?.id) {
      loadWorlds();
    }
  }, [user?.id, loadWorlds]);

  // Add usage tracking
  useEffect(() => {
    trackPageView('worldbuilding');
  }, []);

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

  // Dialog closing handler - prevent closing during deletion
  const handleCloseDeleteDialog = useCallback(() => {
    // Only allow dialog closing if deletion is not in progress
    if (deletionState !== 'deleting') {
      setIsDeleteWorldDialogOpen(false);
    } else {
      console.log("Cannot close dialog during deletion");
    }
  }, [deletionState, setIsDeleteWorldDialogOpen]);

  // Lifecycle effect to close dialog when deletion completes
  useEffect(() => {
    if (deletionState === 'completed') {
      console.log("Deletion completed, closing dialog");
      setIsDeleteWorldDialogOpen(false);
    }
  }, [deletionState, setIsDeleteWorldDialogOpen]);

  console.log("Worldbuilding render - isLoading:", isLoading, "worlds count:", worlds.length, "deletionState:", deletionState);

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
        onCloseDeleteWorldDialog={handleCloseDeleteDialog}
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

export default WorldbuildingPage;
