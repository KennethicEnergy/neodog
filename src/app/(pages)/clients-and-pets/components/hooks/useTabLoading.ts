import { useCallback, useState } from 'react';

export const useTabLoading = () => {
  const [tabLoading, setTabLoading] = useState(false);
  const [loadingTab, setLoadingTab] = useState<string>('');

  const startTabLoading = useCallback((tabName: string) => {
    setTabLoading(true);
    setLoadingTab(tabName);
  }, []);

  const stopTabLoading = useCallback(() => {
    setTabLoading(false);
    setLoadingTab('');
  }, []);

  const switchTab = useCallback(
    (tabName: string, onTabChange: (tab: string) => void) => {
      startTabLoading(tabName);
      onTabChange(tabName);

      // Simulate loading time for better UX
      setTimeout(() => {
        stopTabLoading();
      }, 300);
    },
    [startTabLoading, stopTabLoading]
  );

  return {
    tabLoading,
    loadingTab,
    startTabLoading,
    stopTabLoading,
    switchTab
  };
};
