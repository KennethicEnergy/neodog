'use client';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useModalStore } from '../../store/modal-store';
import '../../styles/modal.css';

export default function ModalProvider() {
  const [mounted, setMounted] = useState(false);
  const modals = useModalStore((state) => state.modals);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || modals.length === 0) return null;

  return createPortal(
    <div className="modal-container">
      {modals.map((modal, index) => (
        <div key={index}>{modal}</div>
      ))}
    </div>,
    document.body
  );
}
