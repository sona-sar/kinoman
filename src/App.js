import { useState } from 'react';
import './App.css';
import Header from "./Header"
import MainBody from "./MainBody"
function App() {
  const [score, setScore] = useState(0);
  const [points, setPoints] = useState(0);
  const setUserScore = (score) => {
    setScore(score);
  }

  const setUserPoints = (points) => {
    setPoints(points);
  }
  return (
    <div className="App">
      <Header score={score} points={points} />
      <MainBody score={score} setScore={setUserScore} points={points} setPoints={setUserPoints} />
    </div>
  );
}

export default App;
