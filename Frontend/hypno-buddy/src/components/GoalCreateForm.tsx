import React, { useState, useEffect } from 'react';
import { RoadmapGoal } from "../types/Roadmap-Goal.ts";

interface GoalCreateFormProps {
    goalData: RoadmapGoal | null;
    onSave: (goalData: RoadmapGoal) => void;
    onClose: () => void;
}

const GoalCreateForm: React.FC<GoalCreateFormProps> = ({ goalData, onSave, onClose }) => {
    const [id, setId] = useState<string | undefined>(undefined);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('Not Started');
    const [isSubGoal, setIsSubGoal] = useState<boolean>(false);
    const [parentGoalId, setParentGoalId] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (goalData) {
            setId(goalData._id);
            setTitle(goalData.title);
            setDescription(goalData.description);
            setStatus(goalData.status);
            setIsSubGoal(goalData.isSubGoal);
            setParentGoalId(goalData.parentGoalId || undefined);
        } else {
            setId(undefined);
            setTitle('');
            setDescription('');
            setStatus('Not Started');
            setIsSubGoal(false);
            setParentGoalId(undefined);
        }
    }, [goalData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            _id: id,
            title,
            description,
            status,
            isSubGoal,
            parentGoalId,
            // You can add subGoals handling based on your application logic
        });
        onClose();
    };

    const isEditing = goalData !== null;

    return (
        <div className="modal show" tabIndex={-1} role="dialog" style={{ display: 'block' }}>
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{isEditing ? 'Edit Goal' : 'Create Goal'}</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={onClose}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            {/* Title Field */}
                            <div className="form-group">
                                <label>Title</label>
                                <input type="text" className="form-control" value={title}
                                       onChange={e => setTitle(e.target.value)} />
                            </div>
                            {/* Description Field */}
                            <div className="form-group">
                                <label>Description</label>
                                <textarea className="form-control" value={description}
                                          onChange={e => setDescription(e.target.value)}></textarea>
                            </div>
                            {/* Status Field */}
                            <div className="form-group">
                                <label>Status</label>
                                <select className="form-control" value={status}
                                        onChange={e => setStatus(e.target.value)}>
                                    <option value="pending">Not Started</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>
                            {/* IsSubGoal Checkbox */}
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" checked={isSubGoal}
                                       onChange={e => setIsSubGoal(e.target.checked)} id="isSubGoalCheck" />
                                <label className="form-check-label" htmlFor="isSubGoalCheck">
                                    Is Sub Goal
                                </label>
                            </div>
                            {/* Parent Goal ID Field */}
                            {parentGoalId && (
                                <div className="form-group">
                                    <label>Parent Goal ID</label>
                                    <p className="form-control-plaintext">{parentGoalId}</p>
                                </div>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
                            <button type="submit" className="btn btn-primary">{isEditing ? 'Save' : 'Create'}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default GoalCreateForm;
