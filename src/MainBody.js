import React from "react";
import { useState, useEffect } from "react";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "./MainBody.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import movies from "./movies.json";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

const Div = styled("div")(({ theme }) => ({
  ...theme.typography.button,
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(1),
}));

function MainBody({ score, setScore, points, setPoints }) {
  const [bestScore, setBestScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [category, setCategory] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [categoryLocked, setCategoryLocked] = useState(false);

  let generateRandomMovie = () => {
    let num = Math.floor(Math.random() * 300);
    let movie = movies.popular_movies[num].movie_name;
    return movie;
  };

  const [poster, setPoster] = useState("");
  const [currentActors, setCurrentActors] = useState([]);
  const [chosenActor, setChosenActor] = useState("");
  const apiKey = process.env.REACT_APP_API_KEY;
  console.log(apiKey);

  function checkActor(currentActors, chosenActor) {
    const match = currentActors.filter(
      (actor) => actor.toLowerCase() === chosenActor.toLowerCase()
    );
    return match.length > 0;
  }

  const handleInputChange = (event) => {
    setChosenActor(event.target.value);
  };

  let num = 0;

  function fetchMovie() {
    const requestOptions = {
      method: "GET",
    };

    let randomMovie = generateRandomMovie();
    fetch(
      `https://www.omdbapi.com/?t=${randomMovie}&apikey=${apiKey}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        num = 0;
        setPoster(result?.Poster);
        setCurrentActors(result?.Actors?.split(",").map((name) => name.trim()));
      })
      .catch((error) => {
        num++;

        console.error(error);
        if (num <= 3) {
          fetchMovie();
        } else {
          alert("Error");
          num = 0;
        }
      });
  }

  function fetchRandomQuestion(category, setCorrectAnswer, setCurrentQuestion) {
    const requestOptions = {
      method: "GET",
    };

    fetch(
      `https://opentdb.com/api.php?amount=1&category=${category}&type=boolean`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        const parser = new DOMParser();
        const decodedQuestion = parser.parseFromString(
          result.results[0].question,
          "text/html"
        ).body.textContent;

        setCorrectAnswer(result.results[0].correct_answer);
        setCurrentQuestion(decodedQuestion);
      });
  }

  function handleEnterPress() {
    if (checkActor(currentActors, chosenActor)) {
      alert("Correct!");
      setChosenActor("");
      setScore(score + 1);
      setPoints(points + 100);
      setBestScore(bestScore + 1);
      fetchMovie();
      if (!poster) {
        fetchMovie();
      }
    } else {
      alert("Incorrect! Game Over!");
      setPoster("");
      setCurrentActors([]);
      setChosenActor("");
      setScore(0);
      setPoints(0);
      setBestScore(0);
    }
  }

  function skipQuestion() {
    if (points >= 100) {
      setPoints(points - 100);
      setChosenActor("");
      setPoster("");
      fetchMovie();
      if (!poster) {
        fetchMovie();
      }
    } else {
      alert("You have to have at least 100 points! Can't skip :( \n");
    }
  }

  function getHint() {
    if (points >= 50) {
      setPoints(points - 50);
      console.log(currentActors);
      let currMovieActor = currentActors[0].split(" ")[0];
      alert(`The first name of the actor is: ${currMovieActor} \n -50 points`);
    } else {
      alert("You have to have at least 50 points! No hints :(");
    }
  }

  const handleAnswer = (answer) => {
    if (answer === correctAnswer) {
      alert("Correct! +200 points");
      setPoints(points + 200);
    } else {
      alert("Incorrect! No points added.");
    }

    setCategory("");
    setCorrectAnswer("");
    setCurrentQuestion("");
    setBestScore(0);
    setCategoryLocked(false);
  };

  useEffect(() => {
    if (!poster) {
      fetchMovie();
    }
  });

  useEffect(() => {
    if (category !== "") {
      fetchRandomQuestion(category, setCorrectAnswer, setCurrentQuestion);
    }
  }, [category]);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCategoryChange = (selectedCategory) => {
    if (!categoryLocked) {
      setAnchorEl(null);
      setCategory(selectedCategory);
      setCategoryLocked(true);
    }
  };

  if (bestScore % 2 === 0 && bestScore !== 0) {
    return (
      <div className="MainBody">
        <Div className="question-component">
          <Typography className="win-text">
            (You answered 2 questions correct in a row)
          </Typography>
          <Typography className="text choose-category">
            Choose the category of the question
          </Typography>

          <Button
            className="category-button"
            id="basic-button"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
          >
            Choose Category
          </Button>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem onClick={() => handleCategoryChange("9")}>
              General Knowledge
            </MenuItem>
            <MenuItem onClick={() => handleCategoryChange("10")}>
              Books
            </MenuItem>
            <MenuItem onClick={() => handleCategoryChange("11")}>
              Movies
            </MenuItem>
            <MenuItem onClick={() => handleCategoryChange("12")}>
              Music
            </MenuItem>
            <MenuItem onClick={() => handleCategoryChange("15")}>
              Video Games
            </MenuItem>
            <MenuItem onClick={() => handleCategoryChange("22")}>
              Geography
            </MenuItem>
          </Menu>

          <Typography className="question">{currentQuestion}</Typography>
          <Div className="answer-buttons">
            <Button
              className="true-false"
              variant="outlined"
              onClick={() => handleAnswer("True")}
            >
              True
            </Button>
            <Button
              className="true-false"
              variant="outlined"
              onClick={() => handleAnswer("False")}
            >
              False
            </Button>
          </Div>
        </Div>
      </div>
    );
  }

  return (
    <div className="MainBody">
      <Div className="poster-container">
        <img src={poster} alt=""></img>
      </Div>
      <Div className="play-portion">
        <Typography className="text">
          Write down the actor's name below
        </Typography>
        <TextField
          className="input"
          value={chosenActor}
          onChange={handleInputChange}
          id="movieSearch"
          label="enter the name"
          variant="outlined"
        />
        <Button
          className="enter button"
          onClick={handleEnterPress}
          variant="outlined"
        >
          enter
        </Button>
        <Button
          className="skip button"
          variant="outlined"
          onClick={skipQuestion}
        >
          Skip
          <SkipNextIcon />
        </Button>
        <Button className="hint button" variant="outlined" onClick={getHint}>
          Hint
          <TipsAndUpdatesIcon />
        </Button>
      </Div>
    </div>
  );
}
export default MainBody;
