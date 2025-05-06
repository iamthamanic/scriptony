
import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { deleteWorld } from "@/services/worlds";
import { World } from "@/types";

// Basitleştirilmiş silme durumları
export type DeletionState = 'idle' | 'deleting' | 'completed' | 'error';

export function useWorldDeletion(
  worlds: World[],
  setWorlds: (worlds: World[]) => void,
  setSelectedWorldId: (id: string | null) => void,
  setIsLoading: (loading: boolean) => void,
) {
  const { toast } = useToast();
  const [deletionState, setDeletionState] = useState<DeletionState>('idle');
  
  // Basitleştirilmiş ve düzleştirilmiş dünya silme işlevi
  const handleDeleteWorld = useCallback(async (selectedWorld: World | null): Promise<void> => {
    // Dünya seçilmemişse veya zaten silme işlemi devam ediyorsa engelle
    if (!selectedWorld || deletionState === 'deleting') {
      console.log("Silme işlemi gerçekleştirilemedi - durum:", deletionState, "dünya:", selectedWorld?.id);
      return Promise.resolve();
    }
    
    try {
      // 1. Silme durumunu güncelle
      setDeletionState('deleting');
      
      // 2. Dünya adı ve ID'sini kaydet
      const worldName = selectedWorld.name;
      const worldId = selectedWorld.id;
      
      console.log('Silme işlemi başlatıldı:', worldId);
      
      // 3. Yükleme durumunu ayarla
      setIsLoading(true);
      
      // 4. Gerçek silme işlemini gerçekleştir (önce backend işlemi)
      await deleteWorld(worldId);
      
      // 5. Optimistik UI güncellemesi - dünyayı listeden sil
      const newWorlds = worlds.filter(w => w.id !== worldId);
      setWorlds(newWorlds);
      
      // 6. Kullanıcıyı dünya listesine geri döndür
      setSelectedWorldId(null);
      
      // 7. Başarı durumunu güncelle
      setDeletionState('completed');
      
      // 8. Başarı mesajı göster
      toast({
        title: 'Dünya silindi',
        description: `"${worldName}" dünyası başarıyla silindi.`,
        duration: 3000
      });
      
      // 9. Kısa bir gecikme ekleyerek UI'ın durulmasını sağla
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // 10. Yükleme durumunu kapat
      setIsLoading(false);
      
      // 11. Tamamlama sonrası silme durumunu sıfırla
      setTimeout(() => {
        setDeletionState('idle');
      }, 100);
      
      return Promise.resolve();
      
    } catch (error) {
      console.error('Dünya silinirken hata:', error);
      
      // Hata durumunu güncelle
      setDeletionState('error');
      
      // Hata mesajı göster
      toast({
        title: 'Silme hatası',
        description: error instanceof Error ? error.message : 'Dünya silinirken bir hata oluştu',
        variant: 'destructive',
        duration: 3000
      });
      
      // Yükleme durumunu kapat
      setIsLoading(false);
      
      // Hata sonrası silme durumunu sıfırla
      setTimeout(() => {
        setDeletionState('idle');
      }, 100);
      
      return Promise.reject(error);
    }
  }, [worlds, setWorlds, setSelectedWorldId, toast, setIsLoading, deletionState]);

  return {
    handleDeleteWorld,
    deletionState
  };
}
