
import React from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { useWorldsState } from "@/hooks/useWorldsState";
import WorldsContent from "../components/WorldsContent";
import WorldModals from "../components/WorldModals";

const WorldbuildingPage = () => {
  const { user } = useAuth();
  const worldsState = useWorldsState(user?.id);
  
  return (
    <div className="container mx-auto">
      <div className="py-8 px-4 md:px-6 w-full animate-fade-in">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Weltenbau</h1>
          <p className="text-muted-foreground">
            Erstelle und verwalte Welten für deine Geschichten
          </p>
        </header>
        
        <WorldsContent 
          isLoading={worldsState.isLoading}
          worlds={worldsState.worlds}
          selectedWorld={worldsState.selectedWorld}
          onSelectWorld={worldsState.handleSelectWorld}
          onNewWorld={() => worldsState.setIsNewWorldModalOpen(true)}
          onEditWorld={() => worldsState.setIsEditWorldModalOpen(true)}
          onDeleteWorld={() => worldsState.setIsDeleteWorldDialogOpen(true)}
          onDuplicateWorld={worldsState.handleDuplicateWorld}
          onAddCategory={() => worldsState.handleAddCategory()}
          onEditCategory={worldsState.handleEditCategory}
          onDeleteCategory={worldsState.handleDeleteCategory}
          onReorderCategories={worldsState.handleReorderCategories}
        />
        
        <WorldModals
          isNewWorldModalOpen={worldsState.isNewWorldModalOpen}
          isEditWorldModalOpen={worldsState.isEditWorldModalOpen}
          isDeleteWorldDialogOpen={worldsState.isDeleteWorldDialogOpen}
          isCategoryModalOpen={worldsState.isCategoryModalOpen}
          selectedWorld={worldsState.selectedWorld}
          selectedCategory={worldsState.selectedCategory}
          onCloseNewWorldModal={() => worldsState.setIsNewWorldModalOpen(false)}
          onCloseEditWorldModal={() => worldsState.setIsEditWorldModalOpen(false)}
          onCloseDeleteWorldDialog={() => worldsState.setIsDeleteWorldDialogOpen(false)}
          onCloseCategoryModal={() => worldsState.setIsCategoryModalOpen(false)}
          onCreateWorld={worldsState.handleCreateWorld}
          onUpdateWorld={worldsState.handleUpdateWorld}
          onDeleteWorld={worldsState.handleDeleteWorldConfirm}
          onSubmitCategory={worldsState.handleSubmitCategory}
        />
      </div>
    </div>
  );
};

export default WorldbuildingPage;
