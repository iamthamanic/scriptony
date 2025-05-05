
import React from 'react';
import NewWorldModal from "./NewWorldModal";
import WorldCategoryModal from "./WorldCategoryModal";
import DeleteWorldDialog from "./DeleteWorldDialog";
import { World, WorldCategory, NewWorldFormData, WorldCategoryFormData } from "@/types";

interface WorldModalsProps {
  isNewWorldModalOpen: boolean;
  isEditWorldModalOpen: boolean;
  isDeleteWorldDialogOpen: boolean;
  isCategoryModalOpen: boolean;
  onCloseNewWorldModal: () => void;
  onCloseEditWorldModal: () => void;
  onCloseDeleteWorldDialog: () => void;
  onCloseCategoryModal: () => void;
  onCreateWorld: (data: NewWorldFormData) => void;
  onUpdateWorld: (data: NewWorldFormData) => void;
  onDeleteWorld: () => Promise<void>;
  onCategorySubmit: (data: WorldCategoryFormData) => void;
  selectedWorld: World | null;
  selectedCategory: WorldCategory | null;
}

const WorldModals = ({
  isNewWorldModalOpen,
  isEditWorldModalOpen,
  isDeleteWorldDialogOpen,
  isCategoryModalOpen,
  onCloseNewWorldModal,
  onCloseEditWorldModal,
  onCloseDeleteWorldDialog,
  onCloseCategoryModal,
  onCreateWorld,
  onUpdateWorld,
  onDeleteWorld,
  onCategorySubmit,
  selectedWorld,
  selectedCategory
}: WorldModalsProps) => {
  return (
    <>
      <NewWorldModal
        isOpen={isNewWorldModalOpen}
        onClose={onCloseNewWorldModal}
        onSubmit={onCreateWorld}
      />
      
      {selectedWorld && (
        <>
          <NewWorldModal
            isOpen={isEditWorldModalOpen}
            onClose={onCloseEditWorldModal}
            onSubmit={onUpdateWorld}
          />
          
          <DeleteWorldDialog
            isOpen={isDeleteWorldDialogOpen}
            onClose={onCloseDeleteWorldDialog}
            onDelete={onDeleteWorld}
            worldName={selectedWorld.name}
          />
          
          <WorldCategoryModal
            isOpen={isCategoryModalOpen}
            onClose={onCloseCategoryModal}
            onSubmit={onCategorySubmit}
            category={selectedCategory || undefined}
          />
        </>
      )}
    </>
  );
};

export default WorldModals;
