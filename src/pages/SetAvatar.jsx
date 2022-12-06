import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import {
  checkLoginRoute,
  setAvatarRoute,
  setUserRoute,
} from "../utils/APIRoutes";
import loader from "../assets/loader.gif";

export default function SetAvatar() {
  const api = "https://avatars.dicebear.com/api/bottts";
  const navigate = useNavigate();
  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);
  const [loggedUser, setLoggedUser] = useState(undefined);

  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  useEffect(() => {
    const getAvatars = async () => {
      const data = [];
      for (let i = 0; i < 5; i++) {
        const image = `${api}/${Math.round(Math.random() * 1000)}.svg`;
        data.push(image);
      }
      setAvatars(data);
      setIsLoading(false);
    };

    const validateUserExists = async () => {
      const { data } = await axios.get(checkLoginRoute);

      if (!data.status) {
        navigate("/login");
      }
      setLoggedUser(data.user);
      if (data.user.isAvatarImageSet) {
        navigate("/");
      }
    };

    getAvatars();
    validateUserExists();
  }, []);

  const setProfilePicture = async () => {
    if (selectedAvatar === undefined) {
      toast.error("Please select an avatar.", toastOptions);
    } else {
      const { data } = await axios.post(`${setAvatarRoute}/${loggedUser._id}`, {
        image: avatars[selectedAvatar],
      });


      if (data.isSet) {
        loggedUser.isAvatarImageSet = true;
        loggedUser.avatarImage = data.image;
        await axios.post(setUserRoute, {
          user: loggedUser,
        });
        navigate("/");
      } else {
        toast.error("Error setting avatar. Please try again.", toastOptions);
      }
    }
  };

  return (
    <>
      {isLoading ? (
        <Container>
          <img src={loader} alt="loader" className="loader" />
        </Container>
      ) : (
        <Container>
          <div className="title-container">
            <h1>Pick an Avatar as your profile picture</h1>
          </div>
          <div className="avatars">
            {avatars.map((avatar, index) => {
              return (
                <div
                  className={`avatar ${
                    selectedAvatar === index ? "selected" : ""
                  }`}
                  key={avatar}
                >
                  <img
                    src={`${avatar}`}
                    alt="avatar"
                    onClick={() => setSelectedAvatar(index)}
                  />
                </div>
              );
            })}
          </div>
          <button className="submit-btn" onClick={setProfilePicture}>
            Set as avatar
          </button>
          <ToastContainer />
        </Container>
      )}
    </>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 3rem;
  background-color: var(--background-color);
  height: 100vh;
  width: 100vw;
  .loader {
    max-inline-size: 100%;
  }

  .title-container {
    h1 {
      color: var(--primary-text-color);
    }
  }

  .avatars {
    display: flex;
    gap: 2rem;
    .avatar {
      border: 0.4rem solid transparent;
      padding: 0.4rem;
      border-radius: 5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: 0.5s ease-in-out;
      img {
        height: 6rem;
      }
    }
    .selected {
      border: 0.4rem solid var(--secondary-color);
    }
  }
  .submit-btn {
    background-color: var(--bg-variant-color);
    color: var(--primary-text-color);
    padding: 1rem 2rem;
    border: none;
    front-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    transition: 0.5s ease-in-out;
    &:hover {
      background-color: var(--bg-variant-color-hover);
    }
  }
`;
