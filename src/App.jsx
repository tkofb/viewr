import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home.jsx";
import AddAnime from "./pages/AddAnime/AddAnime.jsx";
import AnimePlayer from "./pages/AnimePlayer/AnimePlayer.jsx";

export default function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/anime" element={<AnimePlayer />} />
        <Route path="/addAnime" element={<AddAnime />} />
      </Routes>
    </BrowserRouter>
  );
}
