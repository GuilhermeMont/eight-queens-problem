import React, {Component} from 'react'
import Queen from './Queen/Queen'
import './Board.css'
import * as ReactDOM from "react-dom";


class Board extends Component {

    state = {
        globalScore: 0,
        moves: 0,
        lines: [],
        queens: []
    };

    generateMap = () => {

        return new Promise((resolve, reject) => {

            let cells = [];
            let lines = [];
            let count = 0;
            let queens = [];

            for (let i = 1; i < 9; i++) {
                for (let j = 1 + i; j < 9 + i; j++) {
                    let hasQueen = this.props.randomQueens.includes(count);
                    if (hasQueen) queens.push(count);
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
            this.setState({...this.state, lines: lines, queens: queens});
            resolve();
        });
    };

    returnValues = (obj) => {
        return Object.keys(obj).map((key) => {
            return obj[key];
        })
    };

    sumBack = (n) => {
        if (n === 1) return 0;
        let sum = 0;
        for (let i = 1; i <= n; i++)
            sum += i;
        return sum;
    };

    sumHorizontal = (line) => {
        let lineScore = 0;

        line.forEach(cell => {
            if (cell.props.queen) {
                lineScore++
            }
        });

        return this.sumBack(lineScore)
    };

    sumVertical = (lines, col) => {
        let verticalScore = 0;

        for (let i = 0; i < lines.length; i++) {
            let cell = lines[i].props.children[col];
            if (cell.props.queen) {
                verticalScore++
            }
        }
        return this.sumBack(verticalScore)
    };

    sumDiagonal = (lines, col) => {
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
        return this.sumBack(upDiagonalScore) + this.sumBack(downDiagonalScore);
    };

    calculateScore = (lines) => {
        return new Promise((resolve, reject) => {
            let score = 0;
            for (let i = 0; i < lines.length; i++) {
                let line = lines[i].props.children;
                score += this.sumHorizontal(line) + this.sumVertical(lines, i) + this.sumDiagonal(lines, i);
            }
            return resolve(score);
        })

    };


    returnBestScore = (scoreVertical,scoreHorizontal) => {
        if(scoreVertical && scoreHorizontal) {
            return  scoreVertical.score < scoreHorizontal.score ? scoreVertical : scoreHorizontal;
        }
        else if (scoreVertical && !scoreHorizontal){
            return scoreVertical;
        }
        else if (scoreHorizontal && !scoreVertical){
            return scoreHorizontal
        }
        else {
            console.log('return false');
            return false;
        }
    };

    static getRandomIntInclusive(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
    }

    static check (even,line) {
        if (line % 2 === 0) return !even;
        return even
    }



    hillClimbing = async () => {

        let queens = this.returnValues({...this.state.queens});
        let lines = this.returnValues({...this.state.lines});
        let localMin = {score: 9999};
        let saveOldPos = {line: 0, pos: 0};
        let saveQueen = {oldQueen: 0, newQueen: 0};
        let changed = false;

        for (let queen of queens) {
            let line = parseInt(queen / 8);
            let pos = queen % 8;
            let scoreVertical = await this.moveQueenVertical(lines, line, pos);
            let scoreHorizontal = await this.moveQueenHorizontal(lines,line,pos);
            let score = this.returnBestScore(scoreVertical,scoreHorizontal);
            if (score && score.score < localMin.score) {
                localMin = score;
                saveOldPos.line = line;
                saveOldPos.pos = pos;
                saveQueen = {
                    oldQueen: queen,
                    newQueen: score.line === 0 ? score.pos : score.pos === 0 ? score.line * 8 : (score.line * 8) + score.pos
                };
                changed = true;
            }
        }

        if (changed) {

            if (localMin.line === saveOldPos.line && localMin.pos === saveOldPos.pos){
                localMin.line = Board.getRandomIntInclusive(0,7);
                localMin.pos = Board.getRandomIntInclusive(0,7);
                localMin.even = lines[localMin.line].props.children[localMin.pos].props.even;
            }

            let cell = lines[saveOldPos.line].props.children[saveOldPos.pos];
            lines[saveOldPos.line].props.children[saveOldPos.pos] =
                <Queen even={Board.check(saveQueen.oldQueen % 2 === 0,saveOldPos.line) } id={cell.props.id} marked={true} queen={false}/>;
            lines[localMin.line].props.children[localMin.pos] =
                <Queen even={Board.check(saveQueen.newQueen % 2 === 0,localMin.line)} id={localMin.id} marked={false} queen={true}/>;

            queens[queens.indexOf(saveQueen.oldQueen)] = saveQueen.newQueen;

            console.log('LOCAL MIN',localMin);
            console.log('OLD POS',saveOldPos);
            console.log('OLD POS PROPS',cell);
            console.log('RAINHAS',queens);
            this.setState({...this.state, lines: []});
            this.setState({...this.state, lines: lines, globalScore: localMin.score, queens: queens});
        }


        return true;
    };

    moveQueenVertical = async (lines, line, pos) => {
        let score = 0;
        let changed = false;

        for (let i = 0; i < 8; i++) {
            if (lines[i].props.children[pos].props.queen && line !== i) {
                return false;
            }
        }

        let cell = lines[line].props.children[pos];
        lines[line].props.children[pos] =
            <Queen queen={false} marked={false} even={cell.props.even} id={cell.props.id}/>;

        let bestMove = {
            score: this.state.globalScore,
            line: line,
            pos: pos,
            even: cell.props.even,
            id: cell.props.id
        };

        for (let i = 0; i < lines.length; i++) {
            let oldCell = lines[i].props.children[pos];
            if (line !== i) {
                lines[i].props.children[pos] =
                    <Queen queen={true} id={oldCell.props.id} marked={false} even={oldCell.props.even}/>;

                score = await this.calculateScore(lines);

                if (score < bestMove.score) {
                    bestMove.score = score;
                    bestMove.line = i;
                    bestMove.even = oldCell.props.even;
                    bestMove.id = oldCell.props.id;
                    changed = true;
                }

                lines[i].props.children[pos] =
                    <Queen queen={false} id={oldCell.props.id} marked={false} even={oldCell.props.even}/>;
            }
        }

        lines[line].props.children[pos] =
            <Queen queen={true} marked={false} even={cell.props.even} id={cell.props.id}/>;

        return changed ? bestMove : false;

    };

    moveQueenHorizontal = async (lines, line, pos) => {
        let score = 0;
        let changed = false;

        for (let i = 0; i < 8; i++) {
            if (lines[line].props.children[i].props.queen && pos !== i) {
                return false;
            }
        }

        let cell = lines[line].props.children[pos];
        lines[line].props.children[pos] =
            <Queen queen={false} marked={false} even={cell.props.even} id={cell.props.id}/>;

        let bestMove = {
            score: this.state.globalScore,
            line: line,
            pos: pos,
            even: cell.props.even,
            id: cell.props.id
        };


        for (let i = 0; i < lines.length; i++) {
            let oldCell = lines[line].props.children[i];
            if (line !== i) {
                lines[line].props.children[i] =
                    <Queen queen={true} id={oldCell.props.id} marked={false} even={oldCell.props.even}/>;

                score = await this.calculateScore(lines);

                if (score < bestMove.score) {
                    bestMove.score = score;
                    bestMove.line = i;
                    bestMove.even = oldCell.props.even;
                    bestMove.id = oldCell.props.id;
                    changed = true;
                }

                lines[line].props.children[i] =
                    <Queen queen={false} id={oldCell.props.id} marked={false} even={oldCell.props.even}/>;
            }
        }

        lines[line].props.children[pos] =
            <Queen queen={true} marked={false} even={cell.props.even} id={cell.props.id}/>;

        return changed ? bestMove : false;

    };

    main = () => {
        let limit = 0;
        let count = 0;
        while (this.state.globalScore === 0 || count <= limit) {
            let result = this.hillClimbing();
            console.log(result);
            count++
        }
        return true;
    };

    componentDidMount() {
        this.generateMap().then(async () => {
            let lines = this.returnValues(this.state.lines);
            this.setState({...this.state, globalScore: await this.calculateScore(lines)});
        })
    }


    render() {

        const lines = this.state.lines;


        return (
            <div>
                <div id="board">
                    {lines}
                </div>
                <h1>SCORE: {this.state.globalScore}</h1>
                <button style={{
                    color: 'white',
                    'backgroundColor': 'green',
                    height: '40px',
                    width: '200px',
                    fontSize: '14px'
                }} onClick={(event) => {
                    this.main()
                }}>Next Move
                </button>
            </div>

        )
    }
}

export default Board