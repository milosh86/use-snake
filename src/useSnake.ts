import { useState, useEffect, useRef } from "react";
import {
  Snake,
  Direction,
  Speed,
  moveSnake,
  getCurrentDirection,
  getNextApple,
  BoardPosition,
  eatApple
} from "./snake-utils";
import { useInterval } from "./hooks";

const keyToDirectionMap = {
  ArrowUp: Direction.Up,
  ArrowDown: Direction.Down,
  ArrowLeft: Direction.Left,
  ArrowRight: Direction.Right
};
const forbiddenDirectionMap = {
  [Direction.Up]: Direction.Down,
  [Direction.Down]: Direction.Up,
  [Direction.Left]: Direction.Right,
  [Direction.Right]: Direction.Left
};
const keyToSpeedMap = {
  "1": Speed.VERY_SLOW,
  "2": Speed.SLOW,
  "3": Speed.NORMAL,
  "4": Speed.FAST,
  "5": Speed.FURIOUS
};

export default function useSnake({ size }) {
  let [snake, setSnake] = useState<Snake>([[size / 2, size / 2]]);
  let [speed, setSpeed] = useState<number>(null);
  let [direction, setDirection] = useState<Direction>();
  let [isGameOver, setIsGameOver] = useState<boolean>(false);

  let [applePosition, setApplePosition] = useState<BoardPosition>();
  useEffect(() => {
    if (!applePosition) {
      setApplePosition(getNextApple(snake, size));
    }
  });

  let [score, setScore] = useState<number>(0);
  useEffect(() => {
    if (score > 1000 && speed !== Speed.FURIOUS) {
      setSpeed(Speed.FURIOUS);
      return;
    }

    if (score > 500 && speed !== Speed.FAST) {
      setSpeed(Speed.FAST);
      return;
    }

    if (score > 100 && speed !== Speed.NORMAL) {
      setSpeed(Speed.NORMAL);
      return;
    }

    if (score > 30 && speed !== Speed.SLOW) {
      setSpeed(Speed.SLOW);
      return;
    }
  }, [score]);

  function handleGameOver() {
    setSpeed(null);
    setIsGameOver(true);
  }

  function handleGameStart() {
    setSpeed(Speed.VERY_SLOW);
  }

  useInterval(() => {
    if (direction !== undefined) {
      try {
        let newSnake = eatApple(
          moveSnake({ direction, size, snake }),
          applePosition,
          snake[0]
        );
        setSnake(newSnake);

        if (newSnake.length > snake.length) {
          setApplePosition(undefined);
          setScore(prevScore => prevScore + 10);
        }
      } catch (e) {
        handleGameOver();
      }
    }
  }, speed);

  function handleKeyPress(event: KeyboardEvent) {
    event.preventDefault();
    const { key } = event;
    let newDirection: Direction = keyToDirectionMap[key];
    let currentDirection: Direction = getCurrentDirection(snake);

    if (currentDirection === undefined) {
      // single-box snake
      currentDirection = newDirection;
    }

    if (
      newDirection !== undefined &&
      newDirection !== forbiddenDirectionMap[currentDirection]
    ) {
      setDirection(newDirection);
      if (isGameOver === false && speed === null) {
        handleGameStart();
      }
      return;
    }

    let newSpeed: Speed = keyToSpeedMap[key];
    if (newSpeed !== undefined) {
      setSpeed(newSpeed);
      return;
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  });

  return {
    snake,
    score,
    isGameOver,
    applePosition: applePosition
      ? applePosition[0] * size + applePosition[1]
      : undefined
  };
}
