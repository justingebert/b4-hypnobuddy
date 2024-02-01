import React from 'react';
import styles from '../styles/TherapistCard.module.scss';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onCancel,
  onConfirm,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="delete-confirmation-modal">
      <br />
      <p>Sind Sie sicher, dass sie diese Angst löschen möchten?</p>
        <button onClick={onConfirm} className={styles.confirmButton}>Ja</button>
        <button onClick={onCancel} className={styles.confirmButton}>Abbrechen</button>
    </div>
  );
};

export default DeleteConfirmationModal;
