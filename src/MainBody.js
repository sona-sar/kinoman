import React from 'react'
import { useState } from 'react';
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


const Div = styled('div')(({ theme }) => ({
  ...theme.typography.button,
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(1),
}));
let count = 0;


function MainBody({ score, setScore, points, setPoints }) {

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

  function handleEnterPress() {
    if (checkActor(currentActors, chosenActor)) {
      alert("Correct!");
      setChosenActor("");
      setScore(score + 1);
      setPoints(points + 100);
      fetchMovie();
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
  return (
    <div className='MainBody'>
      <Button onClick={fetchMovie} variant="contained" className='play-button'>Play</Button>
      <Div className='poster-container'>
        <img src={poster} alt=""></img>
      </Div>
      <Div className='play-portion'>
        <Typography>Write down the actor's name below</Typography>
        <TextField value={chosenActor} onChange={handleInputChange}
          id="movieSearch" label="enter the name" variant="outlined" />
        <Button onClick={handleEnterPress} variant="outlined">enter</Button>
        <Button variant="contained">Skip</Button>
        <Button variant="outlined">Hint</Button>

      </Div>
    </div>
  )
}
export default MainBody
