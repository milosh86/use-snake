export enum Direction {
  Left,
  Right,
  Up,
  Down
}

export enum Speed {
  VERY_SLOW = 600,
  SLOW = 400,
  NORMAL = 200,
  FAST = 100,
  FURIOUS = 50
}

export type BoardPosition = [number, number];
export type Snake = Array<BoardPosition>;

export function moveSnake({
  direction,
  snake,
  size
}: {
  direction: Direction;
  snake: Snake;
  size: number;
}) {
  let nextPosition: BoardPosition;
  let [lastRow, lastColumn] = snake[snake.length - 1];

  switch (direction) {
    case Direction.Left:
      nextPosition = [lastRow, lastColumn - 1];
      break;
    case Direction.Right:
      nextPosition = [lastRow, lastColumn + 1];
      break;
    case Direction.Up:
      nextPosition = [lastRow - 1, lastColumn];
      break;
    case Direction.Down:
      nextPosition = [lastRow + 1, lastColumn];
      break;
    default:
      throw new Error("Invalid direction");
  }

  // no go back!
  if (
    snake.length > 1 &&
    isPositionSame(snake[snake.length - 2], nextPosition)
  ) {
    return snake;
  }

  if (
    nextPosition[0] < 0 ||
    nextPosition[0] > size - 1 ||
    nextPosition[1] < 0 ||
    nextPosition[1] > size - 1
  ) {
    throw new Error("WALL_HIT");
  }

  if (isColliding(snake, nextPosition)) {
    throw new Error("SNAKE_HIT");
  }

  return snake.slice(1).concat([nextPosition]);
}

export function eatApple(
  snake: Snake,
  applePosition: BoardPosition,
  positionToAdd: BoardPosition
): Snake {
  if (!applePosition || !positionToAdd) return snake;
  if (isColliding(snake, applePosition)) {
    return [positionToAdd, ...snake];
  }

  return snake;
}

function isPositionSame(p1: BoardPosition, p2: BoardPosition) {
  return p1[0] === p2[0] && p1[1] === p2[1];
}

function isColliding(snake: Snake, p: BoardPosition) {
  return snake.some(snakePart => isPositionSame(snakePart, p));
}

export function getSnakePositionsMap(
  snake: Snake,
  size: number
): { [index: number]: boolean } {
  return snake.reduce((acc, curr) => {
    acc[boardToArrayPosition(curr, size)] = true;
    return acc;
  }, {});
}

export function boardToArrayPosition(bp: BoardPosition, size: number) {
  return bp[0] * size + bp[1];
}

export function getSnakeHeadPosition(snake: Snake, size) {
  return boardToArrayPosition(snake[snake.length - 1], size);
}

export function getCurrentDirection(snake: Snake): Direction {
  if (snake.length < 2) return;

  let head = snake[snake.length - 1];
  let oneAfterHead = snake[snake.length - 2];

  if (head[0] === oneAfterHead[0]) {
    return head[1] > oneAfterHead[1] ? Direction.Right : Direction.Left;
  }

  if (head[1] === oneAfterHead[1]) {
    return head[0] > oneAfterHead[0] ? Direction.Down : Direction.Up;
  }
}

function getRandom(n: number): number {
  return Math.floor(Math.random() * n);
}

export function getNextApple(snake: Snake, size: number) {
  let applePosition: BoardPosition = [getRandom(size), getRandom(size)];
  let attempts = 0;
  while (isColliding(snake, applePosition)) {
    applePosition = [getRandom(size), getRandom(size)];
    attempts++;
    if (attempts === 300) throw new Error("NO PLACE FOR APPLE!");
  }

  return applePosition;
}
