
import React from 'react';
import NewWorldModal from "./NewWorldModal";
import EditWorldModal from "./EditWorldModal";
import WorldCategoryModal from "./WorldCategoryModal";
import DeleteWorldDialog from "./DeleteWorldDialog";
import { World, WorldCategory, WorldFormData, WorldCategoryFormData } from "@/types";

interface WorldModalsProps {
  isNewWorldModalOpen: boolean;
  isEditWorldModalOpen: boolean;
  isDeleteWorldDialogOpen: boolean;
  isCategoryModalOpen: boolean;
  onCloseNewWorldModal: () => void;
  onCloseEditWorldModal: () => void;
  onCloseDeleteWorldDialog: () => void;
  onCloseCategoryModal: () => void;
  onCreateWorld: (data: WorldFormData) => void;
  onUpdateWorld: (data: WorldFormData) => void;
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
          <EditWorldModal
            isOpen={isEditWorldModalOpen}
            onClose={onCloseEditWorldModal}
            onSubmit={onUpdateWorld}
            world={selectedWorld}
          />
          
          <DeleteWorldDialog
            isOpen={isDeleteWorldDialogOpen}
            onClose={onCloseDeleteWorldDialog}
            onDelete={onDeleteWorld}
            world={selectedWorld}
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
