import React, {Component} from 'react'
import Queen from './Queen/Queen'
import './Board.css'


class Board extends Component {

    state = {
      queens: [],
    };

    render() {

        //Generate the board and fill with random queens
        let cells = [];
        let lines = [];
        let count = 0;

        for (let i = 1; i < 9; i++) {
            for (let j = 1 + i; j < 9 + i; j++) {
                let hasQueen = this.props.randomQueens.includes(count);
                if (j % 2 === 0) {
                    let cell = <Queen key={Math.random()} id={count} queen={hasQueen} marked={false}/>;
                    cells.push(cell);
                } else {
                    let cell = <Queen key={Math.random()} id={count} even={true} queen={hasQueen}
                                      marked={false}/>;
                    cells.push(cell);
                }
                count++;
            }
            let line = <div key={Math.random()} className={'line'}>{cells}</div>;
            lines.push(line);
            cells = [];
        }

        const sumBack = (n) => {
            if (n === 1) return 0;
            let sum = 0;
            for (let i = 1; i <= n; i++)
                sum += i;
            return sum;
        };

        const sumHorizontal = (line) => {
            let lineScore = 0;
            line.forEach(cell => {
                if (cell.props.queen) {
                    lineScore++
                }
            });
            return sumBack(lineScore)
        };

        const sumVertical = (lines, col) => {
            let verticalScore = 0;
            for (let i = 0; i < lines.length; i++) {
                let cell = lines[i].props.children[col];
                if (cell.props.queen) {
                    verticalScore++
                }
            }
            return sumBack(verticalScore)
        };

        const sumDiagonal = (lines, col) => {
            let downDiagonalScore = 0;
            let upDiagonalScore = 0;

            for (let i = col; i < lines.length; i++) {
                let cell = lines[i].props.children[i - col];
                if (cell.props.queen) {
                    downDiagonalScore++
                }
            }

            for (let i = 1; i < lines.length - col; i++) {
                let cell = lines[i - 1].props.children[i + col];
                if (cell.props.queen) {
                    upDiagonalScore++
                }
            }
            return sumBack(upDiagonalScore) + sumBack(downDiagonalScore);
        };


        const calculateScore = () => {
            let score = 0;
            for (let i = 0; i < lines.length; i++) {
                let line = lines[i].props.children;
                score += sumHorizontal(line) + sumVertical(lines, i) + sumDiagonal(lines, i);
            }
            return score;
        };



        return (
            <div>
                <div id="board">
                    {lines}
                </div>
                <h1>SCORE: {calculateScore()}</h1>
            </div>

        )
    }
}

export default Board