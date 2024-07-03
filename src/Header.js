import React from 'react'
import { useState } from 'react';
import "./Header.css"
import Typography from "@mui/material/Typography";
import { styled } from '@mui/material/styles';

const Div = styled('div')(({ theme }) => ({
  ...theme.typography.button,
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(1),
}));

function Header() {
  const [score, setScore] = useState(0)

  return (
    <div className = "Header">
      <div className='header-container'>
        <Div className='score-section'>
          <Typography className = "high-score">high score: {score} </Typography>
          <Typography className = "the-score">points: {score} </Typography>
        </Div>
        <Typography className = "the-name">KINOMAN</Typography>
      </div>
      
    </div>
  )
}

export default Header
