import React, { useState, useEffect } from 'react';
import { RoadmapGoal } from "../types/Roadmap-Goal.ts";
import styles from '../styles/Roadmap/GoalForm.module.scss';
import {useGoals} from "../contexts/GoalContext.tsx";
import style from '../styles/Roadmap/buttons.module.scss';

interface GoalCreateFormProps {
    goalData: RoadmapGoal | null;
    onSave: (goalData: RoadmapGoal) => void;
    onClose: () => void;
}

const GoalCreateForm: React.FC<GoalCreateFormProps> = ({ goalData, onSave, onClose, actionType }) => {
    const [id, setId] = useState<string | undefined>(undefined);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
    const [status, setStatus] = useState('Geplant');
    const [isSubGoal, setIsSubGoal] = useState<boolean>(false);
    const [parentGoalId, setParentGoalId] = useState<string | undefined>(undefined);
    const [parentGoalTitle, setParentGoalTitle] = useState<string | undefined>(undefined);

    const { getLocalGoalById } = useGoals();

    useEffect(() => {
        if (goalData) {
            setId(goalData._id);
            setTitle(goalData.title);
            setDescription(goalData.description);
            setDueDate(goalData.dueDate || undefined);
            setStatus(goalData.status);
            setIsSubGoal(goalData.isSubGoal || false);
            setParentGoalId(goalData.parentGoalId || undefined);
            setParentGoalTitle(getLocalGoalById(goalData.parentGoalId || '')?.title || undefined);
        } else {
            setId(undefined);
            setTitle('');
            setDescription('');
            setDueDate(undefined);
            setStatus('Geplant');
            setIsSubGoal(false);
            setParentGoalId(undefined);
        }
    }, [goalData]);


    const handleClose = () => {
        setId(undefined);
        setTitle('');
        setDescription('');
        setDueDate(undefined);
        setStatus('Geplant');
        setIsSubGoal(false);
        setParentGoalId(undefined);
        setParentGoalTitle(undefined);

        onClose();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (title.trim() === '' || description.trim() === '') {
            alert('Please fill in the required fields');
            return;
        }

        onSave({
            _id: id,
            title,
            description,
            dueDate,
            status,
            isSubGoal,
            parentGoalId,
        });
        handleClose();
    };

    const isEditing = goalData !== null && !goalData.isSubGoal;

    return (
        <div className={`modal show `} tabIndex={-1} role="dialog" style={{ display: 'block' }}>
            <div className={`${styles.modalOverlay}`}>
                <div className={`modal-dialog ${styles.modalCustom}`} role="document">
                    <div className={`modal-content  ${styles.modalCustom}`}>
                        <div className={`modal-header ${styles.modalTitleCustom}`}>
                            <h5 className={`modal-title`}>{isEditing ? 'Ziel Bearbeiten' : 'Neues Ziel'}</h5>
                            <button type="button" className={`close ${style.btnDeleteCustom}`} data-dismiss="modal" aria-label="Close" onClick={handleClose}>
                                <span aria-hidden="true" >&times;</span>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className={`modal-body`}>
                                {/* Title Field */}
                                <div className="form-group">
                                    <label>Titel</label>
                                    <input type="text" className="form-control" value={title} required={true}
                                           onChange={e => setTitle(e.target.value)} />
                                </div>
                                {/* Description Field */}
                                <div className="form-group">
                                    <label>Beschreibung</label>
                                    <textarea className="form-control" value={description} required={true}
                                              onChange={e => setDescription(e.target.value)}></textarea>
                                </div>
                                {/* DueDate Field */}
                                <div className="form-group">
                                    <label>Datum (optional)</label>
                                    <input type="date" className="form-control date"
                                           value={dueDate ? new Date(dueDate).toISOString().split('T')[0] : ''}
                                           onChange={(e) => setDueDate(new Date(e.target.value))}
                                    />
                                </div>
                                {/* Status Field */}
                                <div className="form-group">
                                    <label>Status</label>
                                    <select className="form-control" value={status}
                                            onChange={e => setStatus(e.target.value)}>
                                        <option value="Geplant">Geplant</option>
                                        <option value="Umsetzung">Umsetzung</option>
                                        <option value="Erreicht">Erreicht</option>
                                    </select>
                                </div>
                                {/*//this is hidden but values need to be read //TODO remove later*/}
                                {isEditing && (
                                    <div className="form-check">
                                        <input className="form-check-input visually-hidden" type="checkbox" checked={isSubGoal}
                                               onChange={e => setIsSubGoal(e.target.checked)} id="isSubGoalCheck" />
                                        <label className="form-check-label visually-hidden" htmlFor="isSubGoalCheck">
                                            Is Sub Goal
                                        </label>
                                    </div>
                                )}
                                {/* Parent Goal ID Field */}
                                {parentGoalId && (
                                    <div className="form-group">
                                        <label>Parent Goal ID</label>
                                        <p className="form-control-plaintext">{parentGoalTitle}</p>
                                    </div>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className={`btn btn-secondary ${style.btnDeleteCustom}`} onClick={handleClose}>Zurück</button>
                                <button type="submit" className={`btn btn-primary ${style.btnPrimaryCustom}` }>{isEditing ? 'Speichern' : 'Hinzufügen'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GoalCreateForm;
