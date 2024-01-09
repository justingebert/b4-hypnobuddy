import React from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import Goal from './Goal';

const GoalWithSubgoals = ({ goal, index, onEdit, onDelete, onCreateSubGoal }) => {
    return (
        <Draggable key={goal._id} draggableId={goal._id} index={index} type="goal">
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

                    {/* Droppable area for subgoals */}
                    <Droppable droppableId={goal._id} type="subgoal">
                        {(subProvided) => (
                            <div
                                ref={subProvided.innerRef}
                                {...subProvided.droppableProps}
                                style={{ marginLeft: '20px' }}
                            >
                                {goal.subGoals && goal.subGoals.map((subGoal, subIndex) => (
                                    subGoal && <Draggable key={subGoal._id} draggableId={subGoal._id} index={subIndex} type="subgoal">
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
                                {subProvided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </div>
            )}
        </Draggable>
    );
};

export default GoalWithSubgoals;
