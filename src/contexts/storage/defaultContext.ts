
import { StorageContextType } from './types';

export const DefaultStorageContextValue: StorageContextType = {
  provider: null,
  status: { connected: false },
  isInitializing: true,
  connectProvider: async () => false,
  disconnectProvider: async () => {},
  setProjectContext: () => {},
  setupAutoSync: () => {},
  stopAutoSync: () => {}
};
