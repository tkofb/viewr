import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home.jsx";
import AddAnime from "./pages/AddAnime/AddAnime.jsx";
// import movieInfo from "movie-info";

export default function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/addAnime" element={<AddAnime />} />
      </Routes>
    </BrowserRouter>
  );
}
