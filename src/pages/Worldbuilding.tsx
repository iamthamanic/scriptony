
import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import AppHeader from "../components/AppHeader";
import WorldsList from "../components/worlds/WorldsList";
import WorldDetail from "../components/worlds/WorldDetail";
import NewWorldModal from "../components/worlds/NewWorldModal";
import WorldCategoryModal from "../components/worlds/WorldCategoryModal";
import DeleteWorldDialog from "../components/worlds/DeleteWorldDialog";
import { World, WorldCategory, NewWorldFormData, WorldCategoryFormData } from "../types";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { fetchUserWorlds, createWorld, updateWorld, deleteWorld, createWorldCategory, updateWorldCategory, deleteWorldCategory, updateCategoryOrder } from "../services/worlds";

const Worldbuilding = () => {
  const [worlds, setWorlds] = useState<World[]>([]);
  const [selectedWorldId, setSelectedWorldId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNewWorldModalOpen, setIsNewWorldModalOpen] = useState(false);
  const [isEditWorldModalOpen, setIsEditWorldModalOpen] = useState(false);
  const [isDeleteWorldDialogOpen, setIsDeleteWorldDialogOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<WorldCategory | null>(null);
  const [accountSettingsOpen, setAccountSettingsOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const selectedWorld = selectedWorldId ? worlds.find(w => w.id === selectedWorldId) : null;

  useEffect(() => {
    if (!user) {
      setWorlds([]);
      setSelectedWorldId(null);
      setIsLoading(false);
      return;
    }
    
    const loadWorlds = async () => {
      try {
        setIsLoading(true);
        const worldsData = await fetchUserWorlds();
        setWorlds(worldsData);
        if (worldsData.length > 0 && !selectedWorldId) {
          setSelectedWorldId(worldsData[0].id);
        }
      } catch (error) {
        console.error('Error loading worlds:', error);
        toast({
          title: 'Fehler beim Laden',
          description: 'Welten konnten nicht geladen werden.',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadWorlds();
  }, [user, toast]);

  const handleCreateWorld = async (data: NewWorldFormData) => {
    try {
      const newWorld = await createWorld(data);
      setWorlds([newWorld, ...worlds]);
      setSelectedWorldId(newWorld.id);
      setIsNewWorldModalOpen(false);
      
      toast({
        title: 'Welt erstellt',
        description: `"${data.name}" wurde erfolgreich erstellt.`
      });
    } catch (error) {
      console.error('Error creating world:', error);
      toast({
        title: 'Fehler',
        description: 'Die Welt konnte nicht erstellt werden.',
        variant: 'destructive'
      });
    }
  };

  const handleEditWorld = async () => {
    if (!selectedWorld) return;
    
    setIsEditWorldModalOpen(true);
  };

  const handleUpdateWorld = async (data: NewWorldFormData) => {
    if (!selectedWorld) return;
    
    try {
      const updatedWorld = await updateWorld(selectedWorld.id, data);
      setWorlds(worlds.map(w => w.id === updatedWorld.id ? updatedWorld : w));
      setIsEditWorldModalOpen(false);
      
      toast({
        title: 'Welt aktualisiert',
        description: `"${data.name}" wurde erfolgreich aktualisiert.`
      });
    } catch (error) {
      console.error('Error updating world:', error);
      toast({
        title: 'Fehler',
        description: 'Die Welt konnte nicht aktualisiert werden.',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteWorld = async () => {
    if (!selectedWorld) return;
    
    try {
      await deleteWorld(selectedWorld.id);
      const newWorlds = worlds.filter(w => w.id !== selectedWorld.id);
      setWorlds(newWorlds);
      setSelectedWorldId(newWorlds.length > 0 ? newWorlds[0].id : null);
      setIsDeleteWorldDialogOpen(false);
      
      toast({
        title: 'Welt gelöscht',
        description: `"${selectedWorld.name}" wurde erfolgreich gelöscht.`
      });
    } catch (error) {
      console.error('Error deleting world:', error);
      toast({
        title: 'Fehler',
        description: 'Die Welt konnte nicht gelöscht werden.',
        variant: 'destructive'
      });
    }
  };

  const handleAddCategory = () => {
    setSelectedCategory(null);
    setIsCategoryModalOpen(true);
  };

  const handleEditCategory = (category: WorldCategory) => {
    setSelectedCategory(category);
    setIsCategoryModalOpen(true);
  };

  const handleCategorySubmit = async (data: WorldCategoryFormData) => {
    if (!selectedWorld) return;
    
    try {
      if (selectedCategory) {
        // Update existing category
        const updatedCategory = await updateWorldCategory(selectedCategory.id, data);
        const updatedWorld = {
          ...selectedWorld,
          categories: selectedWorld.categories.map(c => 
            c.id === updatedCategory.id ? updatedCategory : c
          )
        };
        
        setWorlds(worlds.map(w => w.id === updatedWorld.id ? updatedWorld : w));
        
        toast({
          title: 'Kategorie aktualisiert',
          description: `"${data.name}" wurde erfolgreich aktualisiert.`
        });
      } else {
        // Create new category
        const newCategory = await createWorldCategory(selectedWorld.id, data);
        const updatedWorld = {
          ...selectedWorld,
          categories: [...selectedWorld.categories, newCategory]
        };
        
        setWorlds(worlds.map(w => w.id === updatedWorld.id ? updatedWorld : w));
        
        toast({
          title: 'Kategorie erstellt',
          description: `"${data.name}" wurde erfolgreich erstellt.`
        });
      }
      
      setIsCategoryModalOpen(false);
      setSelectedCategory(null);
    } catch (error) {
      console.error('Error with category:', error);
      toast({
        title: 'Fehler',
        description: 'Die Kategorie konnte nicht gespeichert werden.',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!selectedWorld) return;
    
    try {
      await deleteWorldCategory(categoryId);
      const updatedWorld = {
        ...selectedWorld,
        categories: selectedWorld.categories.filter(c => c.id !== categoryId)
      };
      
      setWorlds(worlds.map(w => w.id === updatedWorld.id ? updatedWorld : w));
      
      toast({
        title: 'Kategorie gelöscht',
        description: 'Die Kategorie wurde erfolgreich gelöscht.'
      });
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: 'Fehler',
        description: 'Die Kategorie konnte nicht gelöscht werden.',
        variant: 'destructive'
      });
    }
  };

  const handleReorderCategories = async (reorderedCategories: WorldCategory[]) => {
    if (!selectedWorld) return;
    
    try {
      await updateCategoryOrder(reorderedCategories);
      const updatedWorld = {
        ...selectedWorld,
        categories: reorderedCategories
      };
      
      setWorlds(worlds.map(w => w.id === updatedWorld.id ? updatedWorld : w));
    } catch (error) {
      console.error('Error reordering categories:', error);
      toast({
        title: 'Fehler',
        description: 'Die Reihenfolge konnte nicht gespeichert werden.',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <header className="mb-8">
        <AppHeader 
          onNewProject={() => {}} 
          onOpenAccountSettings={() => setAccountSettingsOpen(true)}
          accountName={user?.email?.split('@')[0] || "Demo User"}
        />
      </header>
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-12 w-12 animate-spin text-anime-purple mb-4" />
          <p className="text-lg text-muted-foreground">Welten werden geladen...</p>
        </div>
      ) : selectedWorld ? (
        <WorldDetail
          world={selectedWorld}
          onBack={() => setSelectedWorldId(null)}
          onEditWorld={() => setIsEditWorldModalOpen(true)}
          onDeleteWorld={() => setIsDeleteWorldDialogOpen(true)}
          onAddCategory={handleAddCategory}
          onEditCategory={handleEditCategory}
          onDeleteCategory={handleDeleteCategory}
          onReorderCategories={handleReorderCategories}
        />
      ) : (
        <WorldsList
          worlds={worlds}
          onSelectWorld={setSelectedWorldId}
          onNewWorld={() => setIsNewWorldModalOpen(true)}
        />
      )}
      
      {/* Modals */}
      <NewWorldModal
        isOpen={isNewWorldModalOpen}
        onClose={() => setIsNewWorldModalOpen(false)}
        onSubmit={handleCreateWorld}
      />
      
      {selectedWorld && (
        <>
          <NewWorldModal
            isOpen={isEditWorldModalOpen}
            onClose={() => setIsEditWorldModalOpen(false)}
            onSubmit={handleUpdateWorld}
          />
          
          <DeleteWorldDialog
            isOpen={isDeleteWorldDialogOpen}
            onClose={() => setIsDeleteWorldDialogOpen(false)}
            onDelete={handleDeleteWorld}
            worldName={selectedWorld.name}
          />
          
          <WorldCategoryModal
            isOpen={isCategoryModalOpen}
            onClose={() => {
              setIsCategoryModalOpen(false);
              setSelectedCategory(null);
            }}
            onSubmit={handleCategorySubmit}
            category={selectedCategory || undefined}
          />
        </>
      )}
    </div>
  );
};

export default Worldbuilding;
