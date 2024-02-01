import React, { useState, useEffect, useContext } from 'react';
import styles from '../styles/RoadmapPage.module.scss';

interface GoalCommentFormProps {
    onSave: (comment: string, isVisible: boolean, goalID: any) => void;
    goalID: string;
}

const GoalCommentForm: React.FC<GoalCommentFormProps> = ({ onSave, goalID }) => {
    const [comment, setComment] = useState<string>('');
    const [isPrivate, setIsPrivate] = useState<boolean>(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Check if the comment is empty
        if (comment.trim() === '') {
            console.error('Comment cannot be empty!');
            return;
        }
        onSave(comment, isPrivate, goalID);
        //reset the form
        setComment('');
        setIsPrivate(false);
    };

    return (
        <form onSubmit={handleSubmit} className="mt-3">
            <div className="d-flex justify-content-between">
                <div className="form-group flex-grow-1 mr-2">
                    <textarea className="form-control"
                        value={comment}
                        rows={1}
                        onChange={e => setComment(e.target.value)}>
                    </textarea>
                </div>

                <div className="form-group ">
                    <button type="submit" className={styles.btn}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chat-left-dots" viewBox="0 0 16 16">
                            <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
                            <path d="M5 6a1 1 0 1 1-2 0 1 1 0 0 1 2 0m4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Checkbox for Visibility */}
            <div className="form-group form-check">
                <input
                    type="checkbox"
                    className="form-check-input"
                    id="visibilityCheckbox"
                    checked={isPrivate}
                    onChange={() => setIsPrivate(!isPrivate)}
                />
                <label className="form-check-label" htmlFor="visibilityCheckbox">Privater Kommentar</label>
            </div>
        </form>
    );
};

export default GoalCommentForm;
