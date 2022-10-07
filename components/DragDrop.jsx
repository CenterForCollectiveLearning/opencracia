import React, {Component, useCallback} from "react";
import ReactDOM from "react-dom";
import {DragDropContext, Droppable, Draggable} from "react-beautiful-dnd";

import styles from "./DragDrop.module.scss";
import {FiChevronDown, FiChevronUp} from "react-icons/fi";
import classNames from "classnames";
import {interpolateGnBu, interpolatePlasma, interpolateRainbow, interpolateYlGnBu} from "d3-scale-chromatic";
import {colorContrast} from "d3plus-color";

const scaleBetween = (unscaledNum, minAllowed, maxAllowed, min, max) =>
  (maxAllowed - minAllowed) * (unscaledNum - min) / (max - min) + minAllowed;

// a little function to help us with reordering the result
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
  const color = `rgba(62, 54, 154, ${num})`;
  return color;
};

const getItemStyle = (isDragging, draggableStyle, index, length) => {
  const color = getItemColor(index, length);
  return {
  // some basic styles to make the items look a bit nicer
    userSelect: "none",

    // change background colour if dragging
    // index % 2 === 0 ? "#EAEAEA" :
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

export default class DragDrop extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: []
    };
    this.onDragEnd = this.onDragEnd.bind(this);
  }
    
  componentDidMount() {
    const items = this.props.data;

    this.setState({
      items : items.map((d, i) => ({
        ...d,
        id: d.id.toString(),
        pos: i + 1
      }))
    });
  }

  onClickMove(item, move) {
    const {items} = this.state;
    const currIndex = items.findIndex(d => d.id === item.id);
    items.forEach((d, i) => {
      if (move === "up" && [currIndex, currIndex - 1].includes(i)) 
        d.pos += currIndex === i ? -1 : 1;
      else if (move === "down" && [currIndex, currIndex + 1].includes(i))
        d.pos += currIndex === i ? 1 : -1;
    });
    items.sort((a, b) => a.pos - b.pos);

    this.props.callback(items);

    this.setState({
      items
    });
  }

  onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) 
      return;
    

    const items = reorder(
      this.state.items,
      result.source.index,
      result.destination.index
    );

    this.props.callback(items);

    this.setState({
      items
    });
  }

  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
  render() {
    const lang = "fr";

    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
              className={styles.dragdrop}
            >
              {this.state.items.map((item, index, {length}) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style,
                        index,
                        length
                      )}
                      className={styles.draggable}
                    >
                      <div
                        style={{
                          backgroundColor: getItemColor(index, length),
                          color: colorContrast(getItemColor(index, length))
                        }}
                        className={styles.rank}>{index + 1}
                      </div>
                      <div
                        className={styles.item}
                      >
                        <div>{item[lang]}</div>
                        <div className={styles.move}>
                          {index > 0 && <button
                            onClick={() => this.onClickMove(item, "up")}
                            className={classNames(styles.option, styles.up)}
                          >
                            <FiChevronUp />
                          </button>}
                          {(index + 1) < length && <button
                            className={classNames(styles.option, styles.down)}
                            onClick={() => this.onClickMove(item, "down")}
                          >
                            <FiChevronDown />
                          </button>}
                        </div>
                      </div>
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
}

