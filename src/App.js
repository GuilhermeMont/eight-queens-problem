import React from 'react';
import './App.css';
import Board from './components/Board/Board'

function App() {


  //Generate 8 random positions for the queens
  function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
  }

  let randomNumbers = [];

  for (let i=0 ; i<8;i++){
    let random = getRandomIntInclusive(0,63);
    while (randomNumbers.includes(random)){
      random = getRandomIntInclusive(0,63);
    }
    randomNumbers.push(random)
  }

  return (
    <div className="App">
      <Board randomQueens={randomNumbers}/>
    </div>
  );
}

export default App;
