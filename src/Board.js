import React, { useState } from "react";
import Cell from "./Cell";
import "./Board.css";

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

function Board({ nrows = 3, ncols = 3, chanceLightStartsOn = 0.5 }) {
  const [board, setBoard] = useState(createBoard());

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */
  function createBoard() {
    let initialBoard = [];
    let rowCounter = 0;
    let colCounter = 0;

    function arrBools() {
      const arr = [];
      let temp = ncols;
      while (colCounter < ncols) {
        let num = Math.floor(Math.random() * 100);
        if (num <= 100 * chanceLightStartsOn) {
          arr.push({ bool: true, cord: `${rowCounter}-${colCounter}` });
        } else {
          arr.push({ bool: false, cord: `${rowCounter}-${colCounter}` });
        }
        colCounter++;
      }
      ncols = temp;
      return arr;
    }

    while (rowCounter < nrows) {
      initialBoard.push(arrBools());
      colCounter = 0;
      rowCounter++;
    }
    // TODO: create array-of-arrays of true/false values
    return initialBoard;
  }

  function flipCell(e) {
    // Extract target cordinates
    let [x, y] = e.target
      .getAttribute("data-cord")
      .split("-")
      .map((c) => parseInt(c));

    // Deep Copy Array
    const boardCopy = Array.from(board);

    // Get Cordinates of surrounding items
    const surroundingCords = getCords(x, y);
    // Flip boolean values T = F / F = T
    // Set the value in the board
    surroundingCords.forEach((c) => {
      let [a, b] = c;
      boardCopy[a][b].bool = !boardCopy[a][b].bool;
    });
    if (boardCopy.every((row) => row.every((col) => col.bool === false))) {
      return alert("Congratulations, you won!");
    }
    return setBoard(boardCopy);
  }

  function getCords(x, y) {
    // top
    const ax = x - 1 > -1 ? x - 1 : null;
    const ay = y;
    // left
    const bx = x;
    const by = y - 1 > -1 ? y - 1 : null;
    // right
    const cx = x;
    const cy = y + 1 < ncols ? y + 1 : null;
    // bottom
    const dx = x + 1 < nrows ? x + 1 : null;
    const dy = y;

    const surrounding = [
      [ax, ay],
      [bx, by],
      [x, y],
      [cx, cy],
      [dx, dy],
    ];

    // filter out null values
    const cords = surrounding.filter((a) => a[0] !== null && a[1] !== null);
    return cords;
  }

  // if the game is won, just show a winning msg & render nothing else

  // TODO

  // make table board

  // TODO
  return (
    <table>
      <tbody>
        {board.map((r) => {
          return (
            <tr>
              {r.map((e) => (
                <Cell
                  isLit={e.bool}
                  cord={e.cord}
                  flipCellsAroundMe={flipCell}
                />
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default Board;
