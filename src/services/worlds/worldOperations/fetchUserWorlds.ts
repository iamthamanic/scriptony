
import { World } from "@/types/worlds/base";
import { fetchWorlds } from "./fetchWorlds";
import { getCurrentUser } from "./utils";

/**
 * Fetches all worlds for the current user
 * @returns Array of worlds
 */
export const fetchUserWorlds = async (): Promise<World[]> => {
  try {
    // Get current user
    const { data } = await getCurrentUser();
    if (!data.user) {
      throw new Error('User not authenticated');
    }

    // Fetch worlds using the user ID
    return await fetchWorlds(data.user.id);
  } catch (error) {
    console.error('Error in fetchUserWorlds:', error);
    return [];
  }
};
