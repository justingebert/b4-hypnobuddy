import React, { useState, useEffect } from 'react';
import {RoadmapGoal} from "../types/Roadmap-Goal.ts";

interface GoalCommentFormProps {
    onSave: (comment: string, isVisible: boolean) => void;
    onClose: () => void;
}

const GoalCommentForm: React.FC<GoalCommentFormProps> = ({onSave, onClose }) => {
    //TODO: const [writerID, setWriterID] = useState<string | undefined>(undefined);
    const [comment, setComment] = useState<string>('');
    const [isPrivate, setIsPrivate] = useState<boolean>(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(comment, isPrivate);
        //reset the form
        setComment('');
        setIsPrivate(false);
    };

    return (
        <form onSubmit={handleSubmit}>
                {/* Description Field */}
                <div className="form-group">
                    <label>Dein Kommentar:</label>
                    <textarea className="form-control" value={comment} rows={1}
                              onChange={e => setComment(e.target.value)}>
                    </textarea>
                </div>

            {/* Checkbox for Visibility */}
            <div className="form-group">
                <input
                    type="checkbox"
                    id="visibilityCheckbox"
                    checked={isPrivate}
                    onChange={() => setIsPrivate(!isPrivate)}
                />
                <label htmlFor="visibilityCheckbox">Privater Kommentar</label>
            </div>

            <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={onClose}>Zurück</button>
                <button type="submit" className="btn btn-primary">Speichern</button>
            </div>
        </form>
    );
};

export default GoalCommentForm;
