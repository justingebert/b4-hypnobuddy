import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DroppableProps } from 'react-beautiful-dnd';
import Goal from "./Goal.tsx"; // Your Goal component

function QueueList({ goals, onReorder }) {
    const [localGoals, setLocalGoals] = useState(goals);

    // Synchronize localGoals state with goals prop
    useEffect(() => {
        setLocalGoals(goals);
    }, [goals]);

    //function to bypass react strict mode flagging the droppable component
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

    //save the new order of the goals to state
    const handleDragEnd = (result) => {
        if (!result.destination) return;// dropped outside the list

        const items = Array.from(localGoals);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setLocalGoals(items);
        onReorder(items); // Update the order in the backend
    };

    return (
        //DragDropContext is the wrapper for the entire drag and drop functionality
        <DragDropContext onDragEnd={handleDragEnd}>
            {/*//Droppable is the wrapper for the list of draggable items / space where items can be dropped*/}
            <StrictModeDroppable droppableId="goals">
                {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                        {/*//Draggable is the wrapper for each draggable item*/}
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
            </StrictModeDroppable>
        </DragDropContext>
    );
}

export default QueueList;
