
import { useState, useEffect } from 'react';
import { getUserStorageSettings } from '@/services/storage';
import { UserStorageSettings } from '@/services/storage/types';

export const useStorageSettings = () => {
  const [settings, setSettings] = useState<UserStorageSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getUserStorageSettings();
      setSettings(data);
    } catch (err) {
      console.error('Error fetching storage settings:', err);
      setError(err instanceof Error ? err : new Error('Failed to load storage settings'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  return {
    settings,
    loading,
    error,
    refreshSettings: loadSettings
  };
};
