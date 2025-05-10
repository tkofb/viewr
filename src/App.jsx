import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home.jsx";
import MediaSearch from "./pages/MediaSearch/MediaSearch.jsx";
import MediaPlayer from "./pages/MediaPlayer/MediaPlayer.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/approved" element={<Home />} />
        <Route path="/play/:mediaType/:mediaId" element={<MediaPlayer />} />
        <Route path="/search" element={<MediaSearch/>} />
      </Routes>
    </BrowserRouter>
  );
}
