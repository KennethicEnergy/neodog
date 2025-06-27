'use client';
import Toast from '@/components/common/toast';
import ToastPortal from '@/components/common/toast/ToastPortal';
import { useToastStore } from '@/store/toast.store';

const ToastProvider = () => {
  const { toasts, removeToast } = useToastStore();
  if (!toasts.length) return null;

  return (
    <ToastPortal>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          scheme={toast.scheme}
          title={toast.title}
          message={toast.message}
          timeout={toast.timeout ?? 4000}
          onDismiss={() => removeToast(toast.id)}
        />
      ))}
    </ToastPortal>
  );
};

export default ToastProvider;
