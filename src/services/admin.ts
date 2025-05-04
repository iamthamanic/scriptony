
import { supabase } from "@/integrations/supabase/client";

export const validateUnlockCode = async (code: string): Promise<{ 
  success: boolean; 
  tier?: string; 
  isAdmin?: boolean; 
  message?: string 
}> => {
  try {
    // Check if the code exists
    const { data, error } = await supabase
      .from('unlock_codes')
      .select('*')
      .eq('code', code)
      .single();
      
    if (error || !data) {
      return { 
        success: false, 
        message: "Ungültiger Code" 
      };
    }

    // Check if the code has expired
    if (data.expiry_at && new Date(data.expiry_at) < new Date()) {
      return { 
        success: false, 
        message: "Dieser Code ist abgelaufen" 
      };
    }

    // Check if it's a single-use code and has been used already
    const userId = (await supabase.auth.getUser()).data.user?.id;
    if (!userId) {
      return {
        success: false,
        message: "Nutzer nicht authentifiziert"
      };
    }
    
    if (data.is_single_use && data.used_by && data.used_by.includes(userId)) {
      return { 
        success: false, 
        message: "Du hast diesen Code bereits verwendet" 
      };
    }

    // Update the used_by array to include current user
    await supabase
      .from('unlock_codes')
      .update({ 
        used_by: data.used_by ? [...data.used_by, userId] : [userId] 
      })
      .eq('id', data.id);

    // Update user projects with admin status or tier upgrade
    if (data.is_admin || data.tier_level !== 'free') {
      const { error: projectsError } = await supabase
        .from('projects')
        .update({
          is_admin: data.is_admin,
          subscription_tier: data.tier_level
        })
        .eq('user_id', userId);
        
      if (projectsError) {
        console.error('Error updating projects:', projectsError);
      }
    }

    return { 
      success: true, 
      tier: data.tier_level,
      isAdmin: data.is_admin,
      message: "Code erfolgreich eingelöst!" 
    };
  } catch (error) {
    console.error("Error validating unlock code:", error);
    return { 
      success: false, 
      message: "Ein Fehler ist aufgetreten" 
    };
  }
};
