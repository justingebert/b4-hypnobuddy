import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, DroppableProps } from 'react-beautiful-dnd';
import GoalWithSubgoals from './GoalWithSubgoals';

function QueueList({ goals, onReorder, onEdit, onDelete, onCreateSubGoal }) {
    const [localGoals, setLocalGoals] = useState(goals);

    useEffect(() => {
        setLocalGoals(goals);
    }, [goals]);

    const StrictModeDroppable = ({ children, ...props }: DroppableProps) => {
        const [enabled, setEnabled] = useState(false);

        useEffect(() => {
            const animation = requestAnimationFrame(() => setEnabled(true));

            return () => {
                cancelAnimationFrame(animation);
                setEnabled(false);
            };
        }, []);

        if (!enabled) {
            return null;
        }

        return <Droppable {...props}>{children}</Droppable>;
    };

    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const items = Array.from(localGoals);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setLocalGoals(items);
        onReorder(items);
    };

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <StrictModeDroppable droppableId="goals">
                {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="container">
                        {localGoals.map((goal, index) => (
                            <GoalWithSubgoals
                                key={goal._id}
                                goal={goal}
                                index={index}
                                onEdit={onEdit}
                                onDelete={onDelete}
                                onCreateSubGoal={onCreateSubGoal}
                            />
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </StrictModeDroppable>
        </DragDropContext>
    );
}

export default QueueList;
