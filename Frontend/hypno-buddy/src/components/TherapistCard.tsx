import React, { useState } from 'react';
import '../styles/TherapistCard.module.css';

interface TherapistCardProps {
  initialTitle?: string;
}

const TherapistCard: React.FC<TherapistCardProps> = ({ initialTitle = "Enter title here." }) => {
  const [title, setTitle] = useState(initialTitle);
  const [leftTextField, setLeftTextField] = useState("");
  const [rightTextField, setRightTextField] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);

  const handleEditToggle = async () => {
    setIsEditMode((prevMode) => !prevMode);
  };

  const handleSave = async () => {
    setTitle(title);
    setLeftTextField(leftTextField);
    setRightTextField(rightTextField);
    setIsEditMode(false);
  };

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Limit the number of lines to a maximum of 5
    const maxLines = 5;
    const minRows = 3;
    const currentRows = Math.min(
      maxLines,
      Math.max(minRows, (e.target.value.match(/\n/g) || []).length + 1)
    );

    // Update the height of the text area dynamically
    e.target.rows = currentRows;

    // Update the state based on the className
    const className = e.target.className;
    if (className.includes('left')) {
      setLeftTextField(e.target.value);
    } else if (className.includes('right')) {
      setRightTextField(e.target.value);
    }
  };


  const handleClose = async () => {
    // Implement any logic you need when the close button is clicked
    console.log("Card closed");
  };

  return (
    <div className="therapist-card">
      {/* Header Container - Includes title and close button */}
      <div className="therapist-card-header position-relative">
        {/* Close button at the upper right corner of the card */}
        <button className="close-button position-absolute top-0 start-100" onClick={handleClose}>
          &times;
        </button>

        {/* Title Positioned at the top center */}
        {isEditMode ? (
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="editable-title"
            placeholder="Enter title here..."
          />
        ) : (
          <h2 className="therapist-card-title">{title}</h2>
        )}
      </div>

      {/* Containers - Divided into left and right */}
      <div className="therapist-card-container">
        {/* Left Container */}
        <div className="therapist-card-left">
          {/* Subheading for Left Container */}
          <h4>Don't</h4>

          {/* Text Field with Cream background */}
          <textarea
            value={leftTextField}
            onChange={handleTextAreaChange}
            className={`cream-text-field editable left`}
            placeholder="Type here..."
            readOnly={!isEditMode}
            rows={3} // Initial rows
          />
        </div>

        {/* Right Container */}
        <div className="therapist-card-right">
          {/* Subheading for Right Container */}
          <h4>Do</h4>

          {/* Text Field with Cream background */}
          <textarea
            value={rightTextField}
            onChange={handleTextAreaChange}
            className={`cream-text-field editable right`}
            placeholder="Type here..."
            readOnly={!isEditMode}
            rows={3} // Initial rows
          />
        </div>
      </div>

      {/* Button for Edit/Save */}
      <button className="edit-save-button" onClick={isEditMode ? handleSave : handleEditToggle}>
        {isEditMode ? "Save" : "Edit"}
      </button>
    </div>
  );
};

export default TherapistCard;
