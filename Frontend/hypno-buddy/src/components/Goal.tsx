function GoalItem({ goal, onEdit, onDelete, onCreateSubGoal }) {
    const getStatusClass = (status) => {
        switch (status) {
            case 'Geplant': return 'border border-secondary';
            case 'Umsetzung': return 'border border-primary';
            case 'Erreicht': return 'border border-success';
            default: return 'bg-secondary';
        }
    };

    const getDueDate = (dueDate) => {
        const options: Intl.DateTimeFormatOptions = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
        if (dueDate instanceof Date) {
            return dueDate.toLocaleDateString('de-DE', options);
        }
        else if (typeof dueDate === 'string') {
            return new Date(dueDate).toLocaleDateString('de-DE', options);
        }
        return dueDate;
    }

    return (
        <div className={`card border-2 ${getStatusClass(goal.status)} mb-3`}>
            <div className="card-body">
                <h5 className="card-title">{goal.title}</h5>
                <p className="card-text small text-muted">{getDueDate(goal.dueDate)}</p>
                <p className="card-text" dangerouslySetInnerHTML={{ __html: goal.description }} />
                <button className="btn btn-primary mr-2" onClick={() => onEdit(goal)}>Bearbeiten</button>
                <button className="btn btn-danger m-2" onClick={() => onDelete(goal._id)}>Löschen</button>
                {!goal.isSubGoal && (
                    <button className="btn btn-secondary" onClick={() => onCreateSubGoal(goal._id)}>neues
                        Zwischenziel</button>
                )}

            </div>
        </div>
    );
}

export default GoalItem;
