
import { createContext, useContext } from 'react';
import { StorageContextType } from './types';
import { DefaultStorageContextValue } from './defaultContext';

export const StorageContext = createContext<StorageContextType>(DefaultStorageContextValue);

export const useStorage = () => useContext(StorageContext);
