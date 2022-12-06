import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";  
import { loginRoute, checkLoginRoute } from "../utils/APIRoutes";

// import Logo from "../assets/logo.png";

const Login = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    username: "",
    password: "",
  });

  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  useEffect(() => {
    const checkLogin = async () => {
      const { data } = await axios.get(checkLoginRoute);
      if (data.status === true) {
        navigate("/");
      }
    }
    checkLogin();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (handleValidation()) {
      const { username, password } = values;
      const { data } = await axios.post(loginRoute, {
        username,
        password,
      });

      if (data.status === false) {
        toast.error(data.msg, toastOptions);
      } else if (data.status === true) {
        navigate("/");
      }
    }
  };

  const handleValidation = () => {
    const { username, password } = values;
    if (username === "") {
      toast.error("Email & Password is required.", toastOptions);
      return false;
    } else if (password === "") {
      toast.error("Email & Password is required.", toastOptions);
      return false;
    }
    return true;
  };

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  return (
    <>
      <FormContainer>
        <form onSubmit={(event) => handleSubmit(event)}>
          <div className="brand">
            <img src="" alt="" />
            <h1>CHAT</h1>
          </div>
          <input
            type="text"
            placeholder="Username"
            name="username"
            min="3"
            onChange={(e) => handleChange(e)}
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={(e) => handleChange(e)}
          />
          <button type="submit">LOG IN</button>
          <span>
            Don't have an account? <Link to="/register">REGISTER</Link>
          </span>
        </form>
      </FormContainer>
      <ToastContainer />
    </>
  );
};

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: var(--background-color);
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 5rem;
    }
    h1 {
      color: var(--primary-text-color);
      text-transform: uppercase;
    }
  }
  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: var(--form-background-color);
    border-radius: 2rem;
    padding: 3rem 5rem;
    input {
      background-color: transparent;
      padding 1rem;
      border: 0.1rem solid var(--secondary-color);
      border-radius: 0.4rem;
      width: 100%;
      color: var(--primary-text-color);
      font-size: 1rem;
      &:focus { 
        border: 0.1rem solid var(--bg-variant-color);
        outline: none;
      }
    }
    button {
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
    span {
      color: var(--primary-text-color);
      text-transform: uppercase;
      a {
        color: var(--secondary-color);
        text-decoration: none;
        font-weight: bold;
      }
    }
    `;

export default Login;
