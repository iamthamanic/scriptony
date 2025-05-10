
import React from 'react';
import { World, WorldCategory, WorldCategoryFormData } from "@/types";
import NewWorldModal from "@/components/worlds/NewWorldModal";
import EditWorldModal from "@/components/worlds/EditWorldModal";
import DeleteWorldDialog from "@/components/worlds/DeleteWorldDialog";
import WorldCategoryModal from "@/components/worlds/WorldCategoryModal";
import { NewWorldFormData } from "@/types/worlds/base";

interface WorldModalsProps {
  isNewWorldModalOpen: boolean;
  isEditWorldModalOpen: boolean;
  isDeleteWorldDialogOpen: boolean;
  isCategoryModalOpen: boolean;
  selectedWorld: World | null;
  selectedCategory: WorldCategory | null;
  onCloseNewWorldModal: () => void;
  onCloseEditWorldModal: () => void;
  onCloseDeleteWorldDialog: () => void;
  onCloseCategoryModal: () => void;
  onCreateWorld: (data: NewWorldFormData) => Promise<void>;
  onUpdateWorld: (data: any) => Promise<void>;
  onDeleteWorld: () => Promise<void>;
  onSubmitCategory: (data: WorldCategoryFormData) => Promise<void>;
}

const WorldModals = ({
  isNewWorldModalOpen,
  isEditWorldModalOpen,
  isDeleteWorldDialogOpen,
  isCategoryModalOpen,
  selectedWorld,
  selectedCategory,
  onCloseNewWorldModal,
  onCloseEditWorldModal,
  onCloseDeleteWorldDialog,
  onCloseCategoryModal,
  onCreateWorld,
  onUpdateWorld,
  onDeleteWorld,
  onSubmitCategory
}: WorldModalsProps) => {
  return (
    <>
      {/* New World Modal */}
      <NewWorldModal 
        isOpen={isNewWorldModalOpen}
        onClose={onCloseNewWorldModal}
        onSubmit={onCreateWorld}
      />
      
      {/* Edit World Modal */}
      <EditWorldModal 
        isOpen={isEditWorldModalOpen}
        onClose={onCloseEditWorldModal}
        onSubmit={onUpdateWorld}
        world={selectedWorld}
      />
      
      {/* Delete World Dialog */}
      <DeleteWorldDialog 
        isOpen={isDeleteWorldDialogOpen}
        onClose={onCloseDeleteWorldDialog}
        onDelete={onDeleteWorld}
        world={selectedWorld}
      />
      
      {/* World Category Modal */}
      <WorldCategoryModal 
        isOpen={isCategoryModalOpen}
        onClose={onCloseCategoryModal}
        onSubmit={onSubmitCategory}
        category={selectedCategory}
      />
    </>
  );
};

export default WorldModals;
