import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Goal from "./Goal.tsx";

function QueueView({ goals, onReorder }) {
    const [localGoals, setLocalGoals] = useState(goals);

    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const items = Array.from(localGoals);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setLocalGoals(items);
        onReorder(items); // Update the order in the backend
    };

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="goals">
                {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                        {localGoals.map((goal, index) => (
                            <Draggable key={goal.id} draggableId={goal.id} index={index}>
                                {(provided) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                    >
                                        <Goal goal={goal} />
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
}

export default QueueView;
