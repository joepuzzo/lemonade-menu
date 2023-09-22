import React, { useContext, useEffect, useRef } from "react";

const DraggableContext = React.createContext();

const isAbove = function (nodeA, nodeB) {
  // Get the bounding rectangle of nodes
  const rectA = nodeA.getBoundingClientRect();
  const rectB = nodeB.getBoundingClientRect();

  return rectA.top + rectA.height / 2 < rectB.top + rectB.height / 2;
};

const swap = function (nodeA, nodeB) {
  const parentA = nodeA.parentNode;
  const siblingA = nodeA.nextSibling === nodeB ? nodeA : nodeA.nextSibling;

  // Move `nodeA` to before the `nodeB`
  nodeB.parentNode.insertBefore(nodeA, nodeB);

  // Move `nodeB` to before the sibling of `nodeA`
  parentA.insertBefore(nodeB, siblingA);
};

const mouseMoveHandler = (draggable, swapper) => (e) => {
  const { element, x, y } = draggable;

  // Set position for dragging element
  element.style.position = "absolute";
  element.style.top = `${e.pageY - y}px`; // Add vertical scroll position
  element.style.left = `${e.pageX - x}px`; // Add horizontal scroll position

  const draggingRect = element.getBoundingClientRect();

  if (!draggable.isDraggingStarted) {
    // Update the flag
    draggable.isDraggingStarted = true;

    // Let the placeholder take the height of dragging element
    // So the next element won't move up
    draggable.placeholder = document.createElement("div");
    draggable.placeholder.classList.add("placeholder");
    element.parentNode.insertBefore(draggable.placeholder, element.nextSibling);

    // Set styles on thing being dragged
    element.style.width = `${
      draggable.placeholder.getBoundingClientRect().width
    }px`;

    element.style.border = "1px solid rgb(219,90,69)";

    // Set the placeholder's height
    draggable.placeholder.style.height = `${draggingRect.height}px`;

    // draggable.nextEle = element.nextElementSibling;
    // draggable.nextEle draggable.nextEle.style["margin-top"] = `${draggingRect.height}px`;
  } else {
    // The current order:
    // prevEle
    // draggingEle
    // placeholder
    // nextEle
    const prevEle = element.previousElementSibling;
    const nextEle = element.nextElementSibling;
    // console.log("PREV", prevEle);
    // console.log("NEXT", nextEle);

    // User moves item to the top
    if (prevEle && isAbove(element, prevEle)) {
      // The current order    -> The new order
      // prevEle              -> placeholder
      // draggingEle          -> draggingEle
      // placeholder          -> prevEle
      swap(draggable.placeholder, element);
      swap(draggable.placeholder, prevEle);
      // swap(prevEle, element);
      return;
    }

    // User moves the dragging element to the bottom
    if (nextEle && isAbove(nextEle, element)) {
      // The current order    -> The new order
      // draggingEle          -> nextEle
      // placeholder          -> placeholder
      // nextEle              -> draggingEle
      swap(nextEle, draggable.placeholder);
      swap(nextEle, element);
    }
  }
};

const mouseUpHandler = (draggable, swapper) => () => {
  console.log("Up", draggable);
  // Remove the position styles
  draggable.element.style.removeProperty("top");
  draggable.element.style.removeProperty("left");
  draggable.element.style.removeProperty("position");

  const dragables =
    draggable.element.parentElement.getElementsByClassName("draggable");

  const newIndex = [...dragables].indexOf(draggable.element);

  draggable.element.style.border = "none";
  draggable.element.style.width = "inherit";

  draggable.x = null;
  draggable.y = null;
  draggable.element = null;

  // Remove the handlers of `mousemove` and `mouseup`
  document.removeEventListener("mousemove", draggable.moveHandler);
  document.removeEventListener("mouseup", draggable.upHandler);

  // Remove the placeholder
  draggable.placeholder &&
    draggable.placeholder.parentNode.removeChild(draggable.placeholder);
  // Reset the flag
  // if(draggable.nextEle) draggable.nextEle.style["margin-top"] = "0px";
  draggable.isDraggingStarted = false;

  console.log("CALLING SWAPPER", draggable.index, newIndex);
  if (swapper) swapper(draggable.index, newIndex);
};

export const DraggableArea = ({ children }) => {
  const draggableRef = useRef({});
  const areaRef = useRef();

  const value = {
    draggableRef,
    areaRef
  };

  return (
    <div className="draggable-area" ref={areaRef}>
      <DraggableContext.Provider value={value}>
        {children}
      </DraggableContext.Provider>
    </div>
  );
};

export const Draggable = ({ children, index, swapper }) => {
  const { draggableRef } = useContext(DraggableContext);

  const ref = useRef();

  const mouseDownHandler = function (e) {
    console.log("Down");
    const element = ref.current;

    // Calculate the mouse position
    const rect = element.getBoundingClientRect();
    // let x = e.pageX - rect.left;
    // let y = e.pageY - rect.top;

    let x = e.pageX - rect.left - window.scrollX; // Subtract horizontal scroll position
    let y = e.pageY - rect.top - window.scrollY; // Subtract vertical scroll position

    draggableRef.current = {
      element,
      x,
      y,
      index
    };

    const moveHandler = mouseMoveHandler(draggableRef.current, swapper);
    const upHandler = mouseUpHandler(draggableRef.current, swapper);

    draggableRef.current.moveHandler = moveHandler;
    draggableRef.current.upHandler = upHandler;

    // Attach the listeners to `document`
    document.addEventListener("mousemove", moveHandler);
    document.addEventListener("mouseup", upHandler);
  };

  useEffect(() => {
    const element = ref.current;

    element.addEventListener("mousedown", mouseDownHandler);

    return () => {
      element.removeEventListener("mousedown", mouseDownHandler);
    };
  }, [ref, index]);

  return (
    <div ref={ref} class="draggable">
      {children}
    </div>
  );
};
