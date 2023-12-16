import React from 'react';

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
      <p>Are you sure you want to delete this fear?</p>
      <button onClick={onConfirm}>Yes</button>
      <button onClick={onCancel}>No</button>
    </div>
  );
};

export default DeleteConfirmationModal;
