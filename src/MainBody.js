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


function MainBody() {
  
  let generateRandomMovie = () => {
    let num = Math.floor(Math.random()*300);
    let movie = movies.popular_movies[num].movie_name;
    count++;
    console.log(count, movie)
    return movie;
  };
  let currentActors = "";
  let chosenActor = "";
  const [poster, setPoster] = useState("");

  // const [chosenActor, setChosenActor] = useState("")
  const apiKey = "493435e4"

  function checkActor(currentActors, chosenActor){
    if(currentActors.includes(chosenActor) && chosenActor){
      return true;
    }
    else{
      return false;
    }
  }

  const handleInputChange = (event) => {
    chosenActor = event.target.value
  }

  function fetchMovie(){
    const requestOptions = {
      method: "GET",
    };
    if(!currentActors){

    }
    console.log(currentActors, chosenActor)

    console.log(checkActor(currentActors, chosenActor))

    let randomMovie = generateRandomMovie();
    
    fetch(`http://www.omdbapi.com/?t=${randomMovie}&apikey=${apiKey}`, requestOptions)
    
      .then((response) => response.json())
      .then((result) => {

        setPoster(result?.Poster)
        currentActors = result.Actors.split(' ');
        console.log(currentActors)
  
      })
      .catch((error) => {
        console.error(error)
    });


  }




  if(!poster){
    fetchMovie();

  }

  return (
    <div className='MainBody'>
      <Button  variant="contained" className='play-button'>Play</Button>
      <Div className='poster-container'>
        <img src = {poster} alt = ""></img>
      </Div>
      <Div className='play-portion'>
        <Typography>Write down the actor's name below</Typography>
        <TextField onChange = {handleInputChange}
        id="movieSearch" label="enter the name" variant="outlined"  />
        <Button onClick = {fetchMovie} variant="outlined">enter</Button>
        <Button variant="contained">Skip</Button>
        <Button variant="outlined">Hint</Button>

      </Div>
    </div>
  )
}
export default MainBody
