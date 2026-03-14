'use client';

import React from 'react';
import { AuthToastStack, type AuthToastVariant } from '@/src/components/AuthToast';

type AuthFeedbackContextValue = {
  setFeedback: (message: string, variant: AuthToastVariant) => void;
  clearFeedback: () => void;
};

const AuthFeedbackContext = React.createContext<AuthFeedbackContextValue | null>(null);

export function AuthFeedbackProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = React.useState('');
  const [variant, setVariant] = React.useState<AuthToastVariant>('success');

  const clearFeedback = React.useCallback(() => {
    setMessage('');
  }, []);

  const setFeedback = React.useCallback((nextMessage: string, nextVariant: AuthToastVariant) => {
    setVariant(nextVariant);
    setMessage(nextMessage);
  }, []);

  const value = React.useMemo(
    () => ({
      setFeedback,
      clearFeedback,
    }),
    [clearFeedback, setFeedback],
  );

  return (
    <AuthFeedbackContext.Provider value={value}>
      <AuthToastStack message={message} variant={variant} onDismiss={clearFeedback} />
      {children}
    </AuthFeedbackContext.Provider>
  );
}

export function useAuthFeedback() {
  const context = React.useContext(AuthFeedbackContext);

  if (!context) {
    throw new Error('useAuthFeedback must be used within an AuthFeedbackProvider');
  }

  return context;
}
