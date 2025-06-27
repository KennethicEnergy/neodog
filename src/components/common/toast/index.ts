export { default } from './Toast';
export type { ToastScheme } from './Toast';
import type { ToastScheme } from '@/store/toast.store';

// Utility function to format multiple messages as an array
export const formatToastMessages = (messages: string | string[]): string | string[] => {
  if (Array.isArray(messages)) {
    return messages;
  }
  return messages;
};

// Utility function to create a toast with multiple messages
export const createMultiMessageToast = (
  scheme: ToastScheme,
  title: string,
  messages: string[],
  timeout?: number
) => ({
  scheme,
  title,
  message: messages,
  timeout
});

// Demo function to show multi-message toast usage
export const showMultiMessageToast = (
  addToast: (toast: {
    scheme: ToastScheme;
    title: string;
    message: string | string[];
    timeout?: number;
  }) => void
) => {
  const messages = [
    'Please check the following fields:',
    '• Name is required',
    '• Email must be valid',
    '• Password must be at least 8 characters'
  ];

  addToast(createMultiMessageToast('danger', 'Validation Errors', messages, 5000));
};
