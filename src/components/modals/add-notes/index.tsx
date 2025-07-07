import BaseModal from '@/components/common/base-modal';
import { Button } from '@/components/common/button';
import React, { useState } from 'react';
import styles from './add-notes.module.scss';

interface AddNotesModalProps {
  isEdit?: boolean;
  initialValue?: string;
  onSave: (note: string) => void;
  onCancel: () => void;
}

const AddNotesModal: React.FC<AddNotesModalProps> = ({
  isEdit = false,
  initialValue = '',
  onSave,
  onCancel
}) => {
  const [note, setNote] = useState(initialValue);

  const handleSave = () => {
    onSave(note);
  };

  return (
    <BaseModal onClose={onCancel}>
      <div className={styles.addNoteModalContainer}>
        <h3>{isEdit ? 'Edit Note' : 'Add New Note'}</h3>
        <div className={styles.formGroup}>
          <textarea
            id="note-textarea"
            className={styles.textarea}
            placeholder="Enter your note here..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={5}
          />
        </div>
        <div className={styles.footer}>
          <Button variant="white" onClick={onCancel} className={styles.footerButton}>
            Cancel
          </Button>
          <Button variant="dark" onClick={handleSave} className={styles.footerButton}>
            Save
          </Button>
        </div>
      </div>
    </BaseModal>
  );
};

export default AddNotesModal;
