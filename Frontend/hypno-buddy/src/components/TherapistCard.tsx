import React from 'react';
import styles from '../styles/TherapistCard.module.css';

interface TherapistCardProps {
  initialTitle?: string;
  leftTextField: string;
  rightTextField: string;
  isEditMode: boolean;
  isLeftField: boolean;
  onEditToggle: () => void;
  onSave: () => void;
  onTitleChange: (newTitle: string) => void;
  onTextAreaChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onClose: () => void;
}

function TherapistCard({
  initialTitle = "Enter title here.",
  leftTextField,
  rightTextField,
  isEditMode,
  isLeftField,
  onEditToggle,
  onSave,
  onTitleChange,
  onTextAreaChange,
  onClose,
}: TherapistCardProps) {
  return (
    <div className={styles.therapistCard}>
      {/* Header Container - Includes title and close button */}
      <div className={`${styles.therapistCardHeader} position-relative`}>
        {/* Close button at the upper right corner of the card */}
        <button className={`${styles.closeButton} position-absolute top-0 start-100`} onClick={onClose}>
          &times;
        </button>

        {/* Title Positioned at the top center */}
        {isEditMode ? (
          <input
            type="text"
            value={initialTitle}
            onChange={(e) => onTitleChange(e.target.value)}
            className={styles.editableTitle}
            placeholder="Enter title here..."
          />
        ) : (
          <h2 className={styles.therapistCardTitle}>{initialTitle}</h2>
        )}
      </div>

      {/* Containers - Divided into left and right */}
      <div className={styles.therapistCardContainer}>
        {/* Left Container */}
        <div className={styles.therapistCardLeft}>
          {/* Subheading for Left Container */}
          <h4>Don't</h4>

          {/* Text Field with Cream background */}
          <textarea
            value={leftTextField}
            onChange={onTextAreaChange}
            className={`${styles.creamTextField} editable left`}
            placeholder="Type here..."
            readOnly={!isEditMode}
            rows={3} // Initial rows
          />
        </div>

        {/* Right Container */}
        <div className={styles.therapistCardRight}>
          {/* Subheading for Right Container */}
          <h4>Do</h4>

          {/* Text Field with Cream background */}
          <textarea
            value={rightTextField}
            onChange={onTextAreaChange}
            className={`${styles.creamTextField} editable right`}
            placeholder="Type here..."
            readOnly={!isEditMode}
            rows={3} // Initial rows
          />
        </div>
      </div>

      {/* Button for Edit/Save */}
      <button className={styles.editSaveButton} onClick={isEditMode ? onSave : onEditToggle}>
        {isEditMode ? "Save" : "Edit"}
      </button>
    </div>
  );
}

export default TherapistCard;
