"use client";
import { Card, CardHeader } from "@/components/Card";
import { DraggableArea, Draggable } from "@/components/Draggable";
import { useRef } from "react";

export default function Page() {
  return (
    <>
      <div className="flex w-full gap-10 h-full pl-10 pr-10">
        <Card>
          <CardHeader>
            <h1>Queue</h1>
          </CardHeader>
          <DraggableArea>
            <Draggable>A</Draggable>
            <Draggable>B</Draggable>
            <Draggable>C</Draggable>
            <Draggable>D</Draggable>
            <Draggable>E</Draggable>
            <Draggable>F</Draggable>
            <Draggable>G</Draggable>
            <Draggable>H</Draggable>
            <Draggable>I</Draggable>
            <Draggable>J</Draggable>
            <Draggable>K</Draggable>
            <Draggable>L</Draggable>
            <Draggable>M</Draggable>
            <Draggable>N</Draggable>
            <Draggable>O</Draggable>
            <Draggable>P</Draggable>
            <Draggable>Q</Draggable>
            <Draggable>R</Draggable>
            <Draggable>S</Draggable>
            <Draggable>T</Draggable>
            <Draggable>U</Draggable>
            <Draggable>V</Draggable>
          </DraggableArea>
        </Card>
        <Card>
          <CardHeader>
            <h1>Done</h1>
          </CardHeader>
        </Card>
      </div>
    </>
  );
}
