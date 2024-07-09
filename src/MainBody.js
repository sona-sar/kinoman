import React from 'react'
import { useState, useEffect } from 'react';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import "./MainBody.css"
import TextField from '@mui/material/TextField';
import Button from "@mui/material/Button";
import movies from "./movies.json"
import Typography from "@mui/material/Typography";
import { styled } from '@mui/material/styles';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

const Div = styled('div')(({ theme }) => ({
  ...theme.typography.button,
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(1),
}));
let count = 0;


function MainBody({ score, setScore, points, setPoints, showType }) {
  const [bestScore, setBestScore] = useState(0);
  let type = "11";
  const [currentQuestion, setCurrentQuestion] = useState("")
  const [showQuestion, setShowQuestion] = useState(false)
  const [category, setCategory] = useState("9")

  //9 --> general knowledge

  let generateRandomMovie = () => {
    let num = Math.floor(Math.random() * 300);
    let movie = movies.popular_movies[num].movie_name;
    count++;
    return movie;
  };

  const [poster, setPoster] = useState("");
  const [currentActors, setCurrentActors] = useState([]);
  const [chosenActor, setChosenActor] = useState("");
  const apiKey = "493435e4"

  function checkActor(currentActors, chosenActor) {
    for (let i = 0; i < currentActors.length; i++) {
      if (currentActors[i].toLowerCase() === chosenActor.toLowerCase()) {
        return true;
      }
    }
    return false;
  }

  const handleInputChange = (event) => {
    setChosenActor(event.target.value);
  }

  function fetchMovie() {
    const requestOptions = {
      method: "GET",
    };

    let randomMovie = generateRandomMovie();

    fetch(`http://www.omdbapi.com/?t=${randomMovie}&apikey=${apiKey}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setPoster(result?.Poster)
        setCurrentActors(result?.Actors?.split(',').map(name => name.trim()));
      })
      .catch((error) => {
        console.error(error)
      });
  }

  function fetchRandomQuestion(){
    const requestOptions = {
      method: "GET",
    };

    fetch(`https://opentdb.com/api.php?amount=10&category=${category}&type=boolean`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setCurrentQuestion(result.results[0].question);
        // setShowQuestion(true)
        // alert("You answered 2 questions correct in a row.\nTime for a quick game which can earn you 200 POINTS!!\nNo points are reduced if you answer wrong");
      })
      .catch((error) => {
        console.error(error)
      });
  }

 
  function handleEnterPress() {
    if (checkActor(currentActors, chosenActor)) {
      alert("Correct!");
      setChosenActor("");
      setScore(score + 1);
      setPoints(points + 100);
      setBestScore(bestScore+1)
      fetchMovie();
      if(!poster){
        fetchMovie();
      }
    }
    else {
      alert("Incorrect! Game Over!");
      setPoster("");
      setCurrentActors([]);
      setChosenActor("");
      setScore(0);
      setPoints(0);
    }

  }

  function skipQuestion(){
    if(points>=100){
      setPoints(points-100)
      setChosenActor("");
      setPoster("");
      fetchMovie();
      if(!poster){
        fetchMovie();
      }
    }
    else{
      alert("You have to have at least 100 points! Can't skip :( \n")
    }
  }

  function getHint(){
    if(points>=50){
      setPoints(points-50)
      console.log(currentActors)
      let currMovieActor = currentActors[0].split(' ')[0]
      alert(`The first name of the actor is: ${currMovieActor} \n -50 points`)
    }
    else{
      alert("You have to have at least 50 points! No hints :(")
    }
  }


  const handleAnswer = (answer) => {
    if(answer){
      alert("Correct! +200 points");
      setPoints(points+200)
    }
    else{
      alert("Incorrect! No points added.")
    }
    // setShowQuestion(false)
    setBestScore(0)
    
  }

  // useEffect(() => {
  //   if(bestScore>=2){
  //     fetchRandomQuestion();
  //   }
  // }, [bestScore])

  useEffect(()=>{
    if(!poster){
      fetchMovie();
    }
  })

  // if(!poster){
  //   fetchMovie();
  // }

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);

  };

  const handleCategoryChange = (selectedCategory) => {
    setAnchorEl(null);
    setCategory(selectedCategory)
    fetchRandomQuestion();
  }




  if (bestScore>=2) {
    return (
      <div className="MainBody">
        <Div className="question-component">

          <Typography>Choose the category of the question</Typography>

          <Button
          id="basic-button"
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
        >
          Dashboard
        </Button>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          <MenuItem onClick={()=> handleCategoryChange("9")}>General Knowledge</MenuItem>
          <MenuItem onClick={()=> handleCategoryChange("10")}>Books</MenuItem>
          <MenuItem onClick={()=> handleCategoryChange("11")}>Movies</MenuItem>
          <MenuItem onClick={()=> handleCategoryChange("12")}>Music</MenuItem>
          <MenuItem onClick={()=> handleCategoryChange("10")}>Video Games</MenuItem>
          <MenuItem onClick={()=> handleCategoryChange("10")}>Geography</MenuItem>
        </Menu>

          <Typography>{currentQuestion}</Typography>
          <Button variant="outlined" onClick={() => handleAnswer(true)}>True</Button>
          <Button variant="outlined" onClick={() => handleAnswer(false)}>False</Button>
        </Div>
      </div>
    );
  }

  return (
    <div className='MainBody'>
      <Div className='poster-container'>
        <img src={poster} alt=""></img>
      </Div>
      <Div className='play-portion'>
        <Typography className = "text">Write down the actor's name below</Typography>
        <TextField className = "input" value={chosenActor} onChange={handleInputChange}
          id="movieSearch" label="enter the name" variant="outlined" />
        <Button className='enter button' onClick={handleEnterPress} variant="outlined">enter</Button>
        <Button className = "skip button" variant="outlined" onClick={skipQuestion}>Skip<SkipNextIcon/></Button>
        <Button className = "hint button" variant="outlined" onClick = {getHint}>Hint<TipsAndUpdatesIcon/>
        </Button>

      </Div>
    </div>
  )
}
export default MainBody