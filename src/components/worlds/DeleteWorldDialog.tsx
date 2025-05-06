
import React, { useState, useCallback } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from 'lucide-react';

interface DeleteWorldDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => Promise<void>;
  worldName: string;
}

const DeleteWorldDialog = ({ isOpen, onClose, onDelete, worldName }: DeleteWorldDialogProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletionError, setDeletionError] = useState<string | null>(null);
  
  // Dialog'u yalnızca işlem devam etmiyorsa kapatabilme
  const handleCloseDialog = useCallback(() => {
    // Silme işlemi devam ediyorsa kapatmaya izin verme
    if (!isDeleting) {
      setDeletionError(null);
      onClose();
    }
  }, [isDeleting, onClose]);
  
  // Silme işlemini yönet ve kullanıcıya bildirmeden önce bitirme
  const handleDelete = useCallback(async () => {
    if (isDeleting) return; // Çoklu tıklamaları engelle
    
    setIsDeleting(true);
    setDeletionError(null);
    
    try {
      console.log(`"${worldName}" dünyasının silinme işlemi başlıyor...`);
      
      // Silme işlemini tamamla
      await onDelete();
      
      // İşlem başarılı olduğunda state'i temizle ve dialog'u kapat
      setIsDeleting(false);
      handleCloseDialog();
      
    } catch (error) {
      console.error("Dünya silinirken hata:", error);
      
      // Hata mesajını kullanıcıya göster
      let errorMessage = 'Dünya silinirken bir hata oluştu.';
      if (error instanceof Error) {
        errorMessage = `Hata: ${error.message}`;
      }
      setDeletionError(errorMessage);
      
      // Silme durumunu sıfırla
      setIsDeleting(false);
    }
  }, [isDeleting, onDelete, worldName, handleCloseDialog]);

  // Dialog kapalıysa null döndür
  if (!isOpen) {
    return null;
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => {
      if (!open && !isDeleting) {
        handleCloseDialog();
      }
    }}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Dünyayı Sil</AlertDialogTitle>
          <AlertDialogDescription>
            "{worldName}" dünyasını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        {deletionError && (
          <div className="bg-destructive/20 p-3 rounded-md text-sm text-destructive">
            {deletionError}
          </div>
        )}
        
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>İptal</AlertDialogCancel>
          <Button 
            onClick={handleDelete}
            variant="destructive"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Siliniyor...
              </>
            ) : (
              'Sil'
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteWorldDialog;
