import React from "react";
import Card from "../../components/Card/Card";
import Navbar from "../../components/Navbar/Navbar";
import "./Home.css";
import { useLocation } from "react-router-dom";

const Home = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);


  return (
    <div className="home">
      <Navbar />
      <Card />
    </div>
  );
};

export default Home;
