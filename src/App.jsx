import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home.jsx";
import MediaSearch from "./pages/MediaSearch/MediaSearch.jsx";
import MediaInfo from "./pages/MediaInfo/MediaInfo.jsx";
import PlayMedia from "./pages/PlayMedia/PlayMedia.jsx";
import './index.css'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/approved" element={<Home />} />
        <Route path="/:mediaType/:mediaId" element={<MediaInfo />} />
        <Route path="/play/:mediaType/:mediaId" element={<PlayMedia/>} />
        <Route path="/search" element={<MediaSearch/>} />
      </Routes>
    </BrowserRouter>
  );
}
