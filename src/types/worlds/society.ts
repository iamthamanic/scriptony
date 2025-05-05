
import { Json } from "@/integrations/supabase/types";
import { CategoryItem } from "./items";

// Society category content with social groups
export interface SocietyContent {
  groups: Array<SocialGroup & Record<string, Json>>;
  [key: string]: Json; // Index signature to satisfy Json requirements
}

// Social group extends CategoryItem
export interface SocialGroup extends CategoryItem {
  population?: string;
  characteristics?: string[];
}
