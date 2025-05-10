
import React from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { useWorldsState } from "@/hooks/useWorldsState";
import { Container } from "@/components/ui/container";
import WorldsContent from "../components/WorldsContent";
import WorldModals from "../components/WorldModals";

const WorldbuildingPage = () => {
  const { user } = useAuth();
  const worldsState = useWorldsState(user?.id);
  
  return (
    <Container className="py-8">
      <div className="animate-fade-in">
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
          onSelectWorld={worldsState.setSelectedWorldId}
          onNewWorld={() => worldsState.setIsNewWorldModalOpen(true)}
          onEditWorld={() => worldsState.setIsEditWorldModalOpen(true)}
          onDeleteWorld={() => worldsState.setIsDeleteWorldDialogOpen(true)}
          onDuplicateWorld={worldsState.handleDuplicateWorld}
          onAddCategory={() => worldsState.setSelectedCategory(null) || worldsState.setIsCategoryModalOpen(true)}
          onEditCategory={(category) => {
            worldsState.setSelectedCategory(category);
            worldsState.setIsCategoryModalOpen(true);
          }}
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
          onDeleteWorld={worldsState.handleDeleteWorld}
          onSubmitCategory={worldsState.handleCategorySubmit}
        />
      </div>
    </Container>
  );
};

export default WorldbuildingPage;
