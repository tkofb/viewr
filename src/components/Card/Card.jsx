import './Card.css'
import React from 'react';
import { useNavigate } from "react-router-dom";

const Card = () => {
  let navigate = useNavigate()

  const routeChange = () =>{ 
    navigate('search');
  }

  return (
    <div className='card' onClick={routeChange}>
      <div className="mediaHolder">
        +
      </div>  
    </div>
  )
}

export default Card