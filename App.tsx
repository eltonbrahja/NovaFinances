
import React, { useState, useEffect, useCallback } from 'react';
import { UserType, Transaction, FinanceState } from './types';
import { STORAGE_KEY_USER_TYPE, STORAGE_KEY_TRANSACTIONS, STORAGE_KEY_THEME } from './constants';
import SplashScreen from './components/SplashScreen';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  const [appState, setAppState] = useState<FinanceState>({
    userType: UserType.UNSET,
    transactions: [],
    balance: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const init = () => {
      const savedType = localStorage.getItem(STORAGE_KEY_USER_TYPE) as UserType;
      const savedTransactions = localStorage.getItem(STORAGE_KEY_TRANSACTIONS);
      const savedTheme = localStorage.getItem(STORAGE_KEY_THEME);
      
      const transactions = savedTransactions ? JSON.parse(savedTransactions) : [];
      
      setAppState({
        userType: savedType || UserType.UNSET,
        transactions: transactions,
        balance: 0,
      });
      
      const shouldBeDark = savedTheme === 'dark';
      setIsDarkMode(shouldBeDark);
      if (shouldBeDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }

      setIsLoading(false);
    };
    init();
  }, []);

  const toggleTheme = useCallback(() => {
    setIsDarkMode(prev => {
      const newVal = !prev;
      localStorage.setItem(STORAGE_KEY_THEME, newVal ? 'dark' : 'light');
      if (newVal) document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
      return newVal;
    });
  }, []);

  const handleSetUserType = useCallback((type: UserType) => {
    localStorage.setItem(STORAGE_KEY_USER_TYPE, type);
    setAppState(prev => ({ ...prev, userType: type }));
  }, []);

  const handleAddTransaction = useCallback((tx: Transaction) => {
    setAppState(prev => {
      const updated = [tx, ...prev.transactions];
      localStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify(updated));
      return { ...prev, transactions: updated };
    });
  }, []);

  const handleImportTransactions = useCallback((txs: Transaction[]) => {
    setAppState(prev => {
      const updated = [...txs, ...prev.transactions];
      localStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify(updated));
      return { ...prev, transactions: updated };
    });
  }, []);

  const handleReset = useCallback(() => {
    // Ritorna immediatamente alla schermata iniziale (selezione profilo)
    localStorage.removeItem(STORAGE_KEY_USER_TYPE);
    setAppState(prev => ({ ...prev, userType: UserType.UNSET }));
  }, []);

  if (isLoading) return null;

  return (
    <div className="min-h-screen transition-colors duration-700 bg-soft-bg dark:bg-[#020617]">
      {appState.userType === UserType.UNSET ? (
        <SplashScreen onSelectType={handleSetUserType} />
      ) : (
        <Dashboard 
          state={appState} 
          isDarkMode={isDarkMode}
          onToggleTheme={toggleTheme}
          onAddTransaction={handleAddTransaction}
          onImportTransactions={handleImportTransactions}
          onReset={handleReset}
        />
      )}
    </div>
  );
};

export default App;
