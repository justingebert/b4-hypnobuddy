// import {useState} from "react";
// import styles from '../styles/TherapistCard.module.css';
// import { useNavigate } from 'react-router-dom';

// interface TherapistCardProps {
//   initialTitle?: string;
// }

// const TherapistCard: React.FC<TherapistCardProps> = ({ initialTitle = "Enter title here." }) => {
//   const navigate = useNavigate();
//   const [title, setTitle] = useState(initialTitle);
//   const [leftTextField, setLeftTextField] = useState("");
//   const [rightTextField, setRightTextField] = useState("");
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [isLeftField, setIsLeftField] = useState(true); // Added state to track left or right field

//   const handleEditToggle = async () => {
//     setIsEditMode((prevMode) => !prevMode);
//     setIsLeftField(true); // Reset to left field when entering edit mode
//   };

//   const handleSave = async () => {
//     try {
//       const textToSave = isLeftField ? leftTextField : rightTextField;
//       const typeToSave = isLeftField ? "Don't" : 'Do';
  
//       await fetch('http://localhost:3000/dosAndDonts/fears/addDoAndDont', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           fearId: 'YOUR_FEAR_ID', // Replace with the actual fearId
//           type: typeToSave,
//           text: textToSave,
//         }),
//       });
  
//     } catch (error) {
//       console.error('Error saving data:', error);
//     }
//     setIsEditMode(false);
//   };
  
//   const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
//     const maxLines = 5;
//     const minRows = 3;
//     const currentRows = Math.min(
//       maxLines,
//       Math.max(minRows, (e.target.value.match(/\n/g) || []).length + 1)
//     );

//     e.target.rows = currentRows;

//     const className = e.target.className;
//   if (className.includes('left')) {
//     setLeftTextField(e.target.value);
//     setIsLeftField(true);
//   } else if (className.includes('right')) {
//     setRightTextField(e.target.value);
//     setIsLeftField(false);
//   }
//   };


//   const handleClose = async () => {
//     console.log("Card closed");
//     navigate('/dosanddonts');
//   };

//   return (
//     <div className={styles.therapistCard}>
//       {/* Header Container - Includes title and close button */}
//       <div className={`${styles.therapistCardHeader} position-relative`}>
//         {/* Close button at the upper right corner of the card */}
//         <button className={`${styles.closeButton} position-absolute top-0 start-100`} onClick={handleClose}>
//           &times;
//         </button>

//         {/* Title Positioned at the top center */}
//         {isEditMode ? (
//           <input
//             type="text"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             className={styles.editableTitle}
//             placeholder="Enter title here..."
//           />
//         ) : (
//           <h2 className={styles.therapistCardTitle}>{title}</h2>
//         )}
//       </div>

//       {/* Containers - Divided into left and right */}
//       <div className={styles.therapistCardContainer}>
//         {/* Left Container */}
//         <div className={styles.therapistCardLeft}>
//           {/* Subheading for Left Container */}
//           <h4>Don't</h4>

//           {/* Text Field with Cream background */}
//           <textarea
//             value={leftTextField}
//             onChange={handleTextAreaChange}
//             className={`${styles.creamTextField} editable left`}
//             placeholder="Type here..."
//             readOnly={!isEditMode}
//             rows={3} // Initial rows
//           />
//         </div>

//         {/* Right Container */}
//         <div className={styles.therapistCardRight}>
//           {/* Subheading for Right Container */}
//           <h4>Do</h4>

//           {/* Text Field with Cream background */}
//           <textarea
//             value={rightTextField}
//             onChange={handleTextAreaChange}
//             className={`${styles.creamTextField} editable right`}
//             placeholder="Type here..."
//             readOnly={!isEditMode}
//             rows={3} // Initial rows
//           />
//         </div>
//       </div>

//       {/* Button for Edit/Save */}
//       <button className={styles.editSaveButton} onClick={isEditMode ? handleSave : handleEditToggle}>
//         {isEditMode ? "Save" : "Edit"}
//       </button>
//     </div>
//   );
// };

// export default TherapistCard;


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
