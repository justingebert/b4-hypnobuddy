import React from 'react';

function NewFearModal({ isOpen, onClose, onSave, fearTitle, onTitleChange }) {
    if (!isOpen) {
        return null;
    }

    const handleSaveClick = () => {
        onSave();
    };

    const handleTitleChange = (e) => {
        onTitleChange(e.target.value);
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-header">
                    <h2>Add New Fear</h2>
                    <button onClick={onClose}>&times;</button>
                </div>
                <div className="modal-body">
                    <label>
                        Fear Title:
                        <input type="text" value={fearTitle} onChange={handleTitleChange} />
                    </label>
                </div>
                <div className="modal-footer">
                    <button onClick={handleSaveClick}>Save</button>
                </div>
            </div>
        </div>
    );
}

export default NewFearModal;
