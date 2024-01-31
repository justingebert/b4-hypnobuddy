import  { useState, useEffect } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import GoalWithSubgoals from './GoalWithSubgoals';

function QueueList({ goals, onReorder, onEdit, onDelete, onCreateSubGoal }) {
    const [localGoals, setLocalGoals] = useState(goals);

    useEffect(() => {
        setLocalGoals(goals);
    }, [goals]);

    /**
    this used to prevent the strict mode error and now is previnting:
    Cannot find droppable entry with id [goals]
    idk why it should do the same as just palcing the droppable component like:
    <Droppable droppableId="goals" type="goal"> but somehow it doesnt
     **/
    const StrictModeDroppable = ({ children, ...props }) => {
        /*const [enabled, setEnabled] = useState(false);

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
*/
        return <Droppable {...props}>{children}</Droppable>;
    };

    const handleDragEnd = (result) => {
        // Destructure source, destination, and type from result
        const { source, destination, type } = result;
        if (!result.destination) return;

        if (type === 'subgoal') {
            const parentGoalIndex = localGoals.findIndex(goal => goal._id === source.droppableId);
            const parentGoal = localGoals[parentGoalIndex];

            // Reorder subgoals
            const reorderedSubGoals = Array.from(parentGoal.subGoals);
            const [reorderedSubGoal] = reorderedSubGoals.splice(source.index, 1);
            reorderedSubGoals.splice(destination.index, 0, reorderedSubGoal);

            // Update parent subgoals array
            const newParentGoal = { ...parentGoal, subGoals: reorderedSubGoals };

            // Update the local goals array
            const newGoals = Array.from(localGoals);
            newGoals[parentGoalIndex] = newParentGoal;

            setLocalGoals(newGoals);
        } else {
            // Handle goal drag and drop
            const items = Array.from(localGoals);
            const [reorderedItem] = items.splice(result.source.index, 1);
            items.splice(result.destination.index, 0, reorderedItem);

            setLocalGoals(items);
            onReorder(items);
        }
    };

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <StrictModeDroppable droppableId="goals" type="goal">
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
