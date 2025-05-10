
// This file is now replaced by the modular component in the features/projects folder
// Re-exporting from the new location for backward compatibility
import { useFileUpload as useFileUploadNew } from '@/features/projects/hooks/useFileUpload';

export const useFileUpload = useFileUploadNew;

export default useFileUpload;
