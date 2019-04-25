import {
  moveSnake,
  Direction,
  Snake,
  getSnakePositionsMap,
  getCurrentDirection
} from "../snake-utils";

let snake: Snake = [[3, 3], [3, 4], [3, 5], [3, 6], [4, 6]];

describe("moveSnake", () => {
  test("move left", () => {
    let newSnake = moveSnake({ direction: Direction.Left, snake, size: 10 });
    expect(newSnake).toEqual([[3, 4], [3, 5], [3, 6], [4, 6], [4, 5]]);
  });

  test("move right", () => {
    let newSnake = moveSnake({ direction: Direction.Right, snake, size: 10 });
    expect(newSnake).toEqual([[3, 4], [3, 5], [3, 6], [4, 6], [4, 7]]);
  });

  test("move down", () => {
    let newSnake = moveSnake({ direction: Direction.Down, snake, size: 10 });
    expect(newSnake).toEqual([[3, 4], [3, 5], [3, 6], [4, 6], [5, 6]]);
  });

  test("move up - nothing changed", () => {
    let newSnake = moveSnake({ direction: Direction.Up, snake, size: 10 });
    expect(newSnake).toBe(snake);
  });

  test("move sigle-part snake in all directions", () => {
    expect(
      moveSnake({ direction: Direction.Up, snake: [[4, 4]], size: 10 })
    ).toEqual([[3, 4]]);
    expect(
      moveSnake({ direction: Direction.Down, snake: [[4, 4]], size: 10 })
    ).toEqual([[5, 4]]);
    expect(
      moveSnake({ direction: Direction.Left, snake: [[4, 4]], size: 10 })
    ).toEqual([[4, 3]]);
    expect(
      moveSnake({ direction: Direction.Right, snake: [[4, 4]], size: 10 })
    ).toEqual([[4, 5]]);
  });

  test("hit left wall", () => {
    expect(() =>
      moveSnake({ direction: Direction.Left, snake: [[4, 0]], size: 10 })
    ).toThrow("WALL_HIT");
  });

  test("hit right wall", () => {
    expect(() =>
      moveSnake({ direction: Direction.Right, snake: [[4, 9]], size: 10 })
    ).toThrow("WALL_HIT");
  });

  test("hit top wall", () => {
    expect(() =>
      moveSnake({ direction: Direction.Up, snake: [[0, 0]], size: 10 })
    ).toThrow("WALL_HIT");
  });

  test("hit bottom wall", () => {
    expect(() =>
      moveSnake({ direction: Direction.Down, snake: [[9, 0]], size: 10 })
    ).toThrow("WALL_HIT");
  });

  test("snake collision", () => {
    expect(() =>
      moveSnake({
        direction: Direction.Up,
        snake: [[0, 0], [0, 1], [1, 1], [2, 1], [2, 0], [1, 0]],
        size: 10
      })
    ).toThrow("SNAKE_HIT");
  });
});

describe("getSnakePositionsMap", () => {
  it("transforms snake into map of flat array indexes", () => {
    expect(
      getSnakePositionsMap(
        [[1, 1], [1, 2], [2, 2], [2, 3], [3, 3], [4, 3], [4, 4]],
        5
      )
    ).toEqual({
      6: true,
      7: true,
      12: true,
      13: true,
      18: true,
      23: true,
      24: true
    });
  });
});

describe("getCurrentDirection", () => {
  it("returns current snake direction - Right", () => {
    expect(getCurrentDirection([[2, 3], [3, 3], [4, 3], [4, 4]])).toEqual(
      Direction.Right
    );
  });

  it("returns current snake direction - Left", () => {
    expect(getCurrentDirection([[15, 12], [15, 11], [15, 10]])).toEqual(
      Direction.Left
    );
  });

  it("returns current snake direction - Up", () => {
    expect(getCurrentDirection([[6, 4], [5, 4], [4, 4]])).toEqual(Direction.Up);
  });

  it("returns current snake direction - Down", () => {
    expect(getCurrentDirection([[2, 4], [3, 4], [4, 4]])).toEqual(
      Direction.Down
    );
  });

  it("returns undefined if snake lenght is less than 2", () => {
    expect(getCurrentDirection([[2, 4]])).toEqual(undefined);
  });
});
