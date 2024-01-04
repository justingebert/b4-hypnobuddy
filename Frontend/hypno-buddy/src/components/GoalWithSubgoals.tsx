import React from 'react';
import { Draggable, Droppable, DragDropContext } from 'react-beautiful-dnd';
import Goal from './Goal.tsx';

//TODO nested drag and drop context or flatten the data structure
const GoalWithSubgoals = ({ goal, index, onEdit, onDelete, onCreateSubGoal, onSubGoalReorder }) => {
    // Handle drag end event for subgoals
    const handleSubGoalDragEnd = (result) => {
        if (!result.destination) return;

        // Call the provided onSubGoalReorder function with necessary parameters
        onSubGoalReorder(goal._id, result.source.index, result.destination.index);
    };

    return (
        <Draggable key={goal._id} draggableId={goal._id} index={index}>
            {(provided) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="mb-2"
                >
                    <Goal
                        goal={goal}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onCreateSubGoal={onCreateSubGoal}
                    />

                    {/* Nested DragDropContext for subgoals */}
                    <DragDropContext onDragEnd={handleSubGoalDragEnd}>
                        <Droppable droppableId={`subgoals-${goal._id}`} type="subgoal">
                            {(provided) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    style={{ marginLeft: '20px' }}
                                >
                                    {goal.subGoals && goal.subGoals.map((subGoal, subIndex) => (
                                        subGoal && <Draggable key={subGoal._id} draggableId={subGoal._id} index={subIndex}>
                                            {(subProvided) => (
                                                <div
                                                    ref={subProvided.innerRef}
                                                    {...subProvided.draggableProps}
                                                    {...subProvided.dragHandleProps}
                                                    className="mb-2"
                                                >
                                                    <Goal
                                                        goal={subGoal}
                                                        onEdit={onEdit}
                                                        onDelete={onDelete}
                                                        onCreateSubGoal={onCreateSubGoal}
                                                    />
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                </div>
            )}
        </Draggable>
    );
};

export default GoalWithSubgoals;
