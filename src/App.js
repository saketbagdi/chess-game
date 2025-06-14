import "./App1.css"
import { useState,useEffect } from 'react'
import { Chessboard } from 'react-chessboard'
import { Chess } from 'chess.js'

function App(){
  const[game, setGame]= useState(new Chess())
  const[winner, setWinner]= useState(new Chess())
  const[gameOver,setGameOver]=useState(false)

  function safeGameMutate(modify){
    setGame((g)=>{
      const update= {...g}
      modify(update)
      return update
    })
  }
  function makeRandomMove(){
    const possibleMove = game.moves()
    if(game.game_over() || game.in_draw() || possibleMove.length===0){
      setGameOver(true)
      const winner = game.turn()==='w'?'Black': 'White'
      setWinner(winner)
      return
    }
    const randomIndex=Math.floor(Math.random()*possibleMove.length)
    safeGameMutate((game)=>{
      game.move(possibleMove[randomIndex])
    })
  }
  function onDrop(source,target){
    if(gameOver) return false;
    let move=null
    safeGameMutate((game)=>{
      move=game.move({
        from: source, to: target, promotion:'q',
      })
    })
    if (move === null) return false
    setTimeout(makeRandomMove, 200)
    return true
  }
  function restartGame(){
    setGame(new Chess())
    setGameOver(false)
    setWinner(null)
  }
  useEffect(()=>{
    function handleKeyPress(event){
      if(event.key === 'Enter'){
        restartGame()
      }
    }
    window.addEventListener('keydown', handleKeyPress)
    return()=>{
      window.removeEventListener('keydown', handleKeyPress)
    }
  },[])
  return(
    <div className='app'>
      <div className='header'>
        <div className='game-info'>
          <h1>Chess Game</h1>
        </div>
      </div>
      <div className="chessboard-container">
        <Chessboard position={game.fen()} onPieceDrop={onDrop}/>
        {gameOver &&(
          <div className="game-over">
            <p>Game Over</p>
            <p>Winner:{winner}</p>
            <p>Press Enter to restart</p>
          </div>
        )}
      </div>
    </div>
  )
}
export default App