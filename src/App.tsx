import { useEffect, useRef, useState } from 'react';
import './App.css';
import AppleLogo from './applePixels.png'
import Monitor from './oldMonitor.png'
import useInterval from './useInterverl';


const canvasX = 1000;
const canvasY = 1000;
const initialSnake = [[4,10],[4,10]]
const initialApple = [14,10];
const Scale =50;
const timeDelay = 100;


function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [snake,setSnake] = useState(initialSnake); 
  const [apple,setApple] = useState(initialApple); 
  const [direaction,setDireaction] = useState([0,-1]);
  const [delay,setDelay] = useState<number | null>(null)
  const [gameover,SetGameover] = useState(false)
  const [score,setScore] = useState(0);


  useInterval(()=> runGame(),delay)
  
  useEffect(()=>{
    let fruit = document.getElementById("fruit") as HTMLCanvasElement
    if(canvasRef.current){
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      if(ctx){
        ctx.setTransform(Scale, 0, 0, Scale,0,0)
        ctx.clearRect(0,0,window.innerWidth,window.innerHeight)
        ctx.fillStyle = "#a3d001";
        snake.forEach(([x,y])=> ctx.fillRect(x,y,1,1))
        ctx.drawImage(fruit,apple[0],apple[1],1,1)
      }
    }
  },[snake,apple,gameover])
 
  function handleSetScore(){
    if(score>Number(localStorage.getItem("snakeScore"))){
      localStorage.setItem("snakeScore",JSON.stringify(score))
    }
  }

  function Play(){
    setSnake(initialSnake)
    setApple(initialApple)
    setDireaction([1,0])
    setDelay(timeDelay)
    setScore(0)
    SetGameover(false)
  }

  function checkCollision(head:number[]){
    for(let i=0;i<head.length;i++){
      if(head[i]<0 || head[i] * Scale >= canvasX) return true;
    }
    for(const s of snake){
      if(head[0] === s[0] && head[1]===s[1]) return true
    }
    return false;
  }

  function appleAte(newSnake:number[][]){
    let coord = apple.map(()=> Math.floor(Math.random()*canvasX/Scale))
    if(newSnake[0][0]=== apple[0] && newSnake[0][1] === apple[1]){
      let newApple = coord;
      setScore(score+1);
      setApple(newApple)
      return true
    }
    return false;
  }

  const runGame = () =>{
    const newSnake = [...snake];
    const newSnakeHead = [newSnake[0][0] + direaction[0], newSnake[0][1] + direaction[1]];
    newSnake.unshift(newSnakeHead);
    if(checkCollision(newSnakeHead)){
      setDelay(null)
      SetGameover(true);
      handleSetScore()
    }
    if(!appleAte(newSnake)){
      newSnake.pop()
    }
    setSnake(newSnake);
  }

  function changeDireaction(e:React.KeyboardEvent<HTMLDivElement>){
    switch(e.key){
      case "ArrowLeft":
        setDireaction([-1,0])
        break;
      case "ArrowRight":
        setDireaction([1,0])
        break;
      case "ArrowUp":
        setDireaction([0,-1])
        break;
      case "ArrowDown":
        setDireaction([0,1])
        break;
    }
  }

  return (
    <div onKeyDown={(e)=> changeDireaction(e)}>
     <img id="fruit" src={AppleLogo} alt="Fruit" width="30" />
     <img src={Monitor} alt="bg" width="4000" className='monitor' />
     <canvas className='playArea' ref={canvasRef} width={`${canvasX}px`} height={`${canvasY}px`}/>
     {gameover && <div className='gameOver'>Game Over</div>}
     <button onClick={Play} className="playButton">Play</button>
     <div className="scoreBox">
      <h2>Score: {score}</h2>
      <h2>High Score: {localStorage.getItem('snackScore')}</h2>
     </div>
    </div>
  );
}

export default App;
