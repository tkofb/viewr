import './Card.css'
import React from 'react';
import { useNavigate } from "react-router-dom";

const Card = () => {
  let navigate = useNavigate()

  const routeChange = () =>{ 
    let path = `addAnime`; 
    navigate(path);
  }

  return (
    <div className='card' onClick={routeChange}>
      <div className="animeHolder">
        +
      </div>  
    </div>
  )
}

export default Card