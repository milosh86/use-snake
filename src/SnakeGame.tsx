import React, { Fragment } from "react";
import useSnake from "./useSnake";
import { getSnakePositionsMap, getSnakeHeadPosition } from "./snake-utils";

const CELL_WIDTH = 20;

export default function SnakeGame({ size }: { size: number }) {
  let { snake, score, applePosition, isGameOver } = useSnake({ size });

  let snakePositions = getSnakePositionsMap(snake, size);
  let snakeHeadPosition = getSnakeHeadPosition(snake, size);

  let cells = [];
  for (let i = 0; i < size * size; i++) {
    cells.push(
      <Cell
        isActive={snakePositions[i]}
        isHead={snakeHeadPosition === i}
        isApple={applePosition === i}
        key={i}
      />
    );
  }

  return (
    <Fragment>
      {isGameOver ? "GAME OVER!" : null}
      <h1>Score: {score}</h1>
      <div
        style={{
          borderTop: "1px solid lightgray",
          borderRight: "1px solid lightgray",
          margin: "auto",
          display: "flex",
          flexWrap: "wrap",
          width: size * CELL_WIDTH
        }}
      >
        {cells}
      </div>
    </Fragment>
  );
}

function Cell({ isActive, isHead, isApple }) {
  let backgroundColor = "white";
  if (isApple) backgroundColor = "lightgreen";
  if (isActive) backgroundColor = "rgb(255, 48, 115)";
  if (isHead) backgroundColor = "rgb(183, 0, 59)";

  return (
    <div
      style={{
        border: "1px solid lightgray",
        borderTop: "none",
        borderRight: "none",
        height: CELL_WIDTH,
        width: CELL_WIDTH,
        boxSizing: "border-box",
        backgroundColor: backgroundColor
      }}
    />
  );
}
