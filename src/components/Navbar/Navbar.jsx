import React, { useEffect, useState } from "react";
import "./Navbar.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Navbar = ({ sessionId }) => {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(sessionId);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const getUserInfo = async () => {
      const userInfo = await axios.post(
        `http://localhost:8080/getAccountInfo`,
        {
          sessionId: loggedIn,
        }
      );

      console.log(userInfo.data);
      setUserInfo(userInfo.data);
    };

    if (sessionId) {
      getUserInfo();
    }
    setLoggedIn(sessionId);
  }, [sessionId]);

  const handleSession = async () => {
    const tokenResponse = await axios.get(
      `http://localhost:8080/approveSession`
    );
    const tokenData = tokenResponse.data;

    const redirect_url = "http://localhost:5173/approved";
    const url = `https://www.themoviedb.org/authenticate/${tokenData["request_token"]}?redirect_to=${redirect_url}`;
    window.location.href = url;
  };

  const onAlienClick = () => {
    navigate("/");
  };

  const logout = async () => {
    try {
      const loggingOut = await axios.post(`http://localhost:8080/logout`, {
        sessionId: sessionId,
      });

      if (loggingOut.data.success) {
        localStorage.removeItem("sessionId");
        setLoggedIn(false);
      } else {
        console.log("Wasn't Able to Log Out");
      }
    } catch (error) {
      console.log("Wasn't Able to Delete Session from Server");
    }
  };

  const handleUserInfo = () => {
    const avatar_path = userInfo.avatar.tmdb.avatar_path;
    // const avatar_path = null;
    const img_path = `https://image.tmdb.org/t/p/original/${avatar_path}`;

    if (avatar_path) {
    }

    return (
      <>
        <div className="userInfo">
          <div className="avatarAndName">
            {avatar_path ? (
              <img src={img_path} alt="user avatar" className="avatar" />
            ) : (
              <div className="backupAvatar">
                {userInfo.username[0].toUpperCase()}
              </div>
            )}
            <div className="userName">{userInfo.username}</div>
          </div>
        </div>
        <button onClick={logout}>logout</button>
      </>
    );
  };

  return (
    <nav>
      <img src="alien.svg" alt="logo" onClick={onAlienClick} />
      {loggedIn && userInfo ? (
        handleUserInfo()
      ) : (
        <button onClick={handleSession}>login</button>
      )}
    </nav>
  );
};

export default Navbar;
