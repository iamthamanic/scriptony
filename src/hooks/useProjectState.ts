
// This file is now replaced by the modular components in the /hooks/project/ folder
// Re-exporting from the new location for backward compatibility
import { useProjectState as useProjectStateNew } from './project/useProjectState';

export const useProjectState = useProjectStateNew;

export default useProjectState;
