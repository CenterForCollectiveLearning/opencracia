import React from "react";
import classNames from "classnames";
import useTranslation from "next-translate/useTranslation";
import {DragDropContext, Droppable, Draggable} from "react-beautiful-dnd";
import {FiChevronDown, FiChevronUp} from "react-icons/fi";
import {colorContrast} from "d3plus-color";
import {useState} from "react";

import styles from "./DragDrop.module.scss";

const scaleBetween = (unscaledNum, minAllowed, maxAllowed, min, max) =>
  (maxAllowed - minAllowed) * (unscaledNum - min) / (max - min) + minAllowed;

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const getItemColor = (index, length) => {
  // const color = interpolateGnBu((1 - (index / length)));
  let num = 1 - index / length;
  num = scaleBetween(num, 0.4, 1, 0.2, 1);
  const color = `rgba(0, 214, 162, ${num})`;
  return color;
};

const getItemStyle = (isDragging, draggableStyle, index, length) => {
  const color = getItemColor(index, length);
  return {
  // some basic styles to make the items look a bit nicer
    userSelect: "none",

    // change background colour if dragging
    background: isDragging ? "#F6AA66" : "#EAEAEA",
    // color: colorContrast(color),

    // styles we need to apply on draggables
    ...draggableStyle
  };
};

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? "white" : "white",
//   width: 250
});

export default function DragDrop(props) {
  const {callback, data} = props;
  const {lang} = useTranslation("translation");
  const [items, setItems] = useState(
    data.map((d, i) => ({
      ...d,
      id: d.id.toString(),
      pos: i + 1
    }))
  );

  const onDragEnd = result => {
    // dropped outside the list
    if (!result.destination) 
      return;
    const updated = reorder(
      items,
      result.source.index,
      result.destination.index
    );

    callback(updated);
    setItems(updated);
  };

  const onClickMove = (item, move) => {
    const currIndex = items.findIndex(d => d.id === item.id);
    items.forEach((d, i) => {
      if (move === "up" && [currIndex, currIndex - 1].includes(i)) 
        d.pos += currIndex === i ? -1 : 1;
      else if (move === "down" && [currIndex, currIndex + 1].includes(i))
        d.pos += currIndex === i ? 1 : -1;
    });
    items.sort((a, b) => a.pos - b.pos);

    callback(items);
    setItems(items);
  };


  return <DragDropContext onDragEnd={onDragEnd}>
    <Droppable droppableId="droppable">
      {(provided, snapshot) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          style={getListStyle(snapshot.isDraggingOver)}
          className={styles.dragdrop}
        >
          {items.map((d, i, {length}) => (
            <Draggable key={d.id} draggableId={d.id} index={i}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  style={getItemStyle(
                    snapshot.isDragging,
                    provided.draggableProps.style,
                    i,
                    length
                  )}
                  className={styles.draggable}
                >
                  <div
                    style={{
                      backgroundColor: getItemColor(i, length),
                      color: colorContrast(getItemColor(i, length))
                    }}
                    className={styles.rank}>{i + 1}
                  </div>
                  <div
                    className={styles.item}
                  >
                    <div>{d[lang]}</div>
                    <div className={styles.move}>
                      {i > 0 && <button
                        onClick={() => onClickMove(d, "up")}
                        className={classNames(styles.option, styles.up)}
                      >
                        <FiChevronUp />
                      </button>}
                      {(i + 1) < length && <button
                        className={classNames(styles.option, styles.down)}
                        onClick={() => onClickMove(d, "down")}
                      >
                        <FiChevronDown />
                      </button>}
                    </div>
                  </div>
                </div>
              )}
            </Draggable>
          ))}
        </div>
      )}
    </Droppable>
  </DragDropContext>;
}

