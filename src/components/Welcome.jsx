import React, { useEffect, useState } from "react";
import styled from "styled-components";
import welcome from "../assets/welcome.gif";
import Logout from "./Logout";
import axios from "axios";
import { checkLoginRoute } from "../utils/APIRoutes";

const Welcome = () => {
	const [user, setUser] = useState(undefined);
	useEffect(() => {
		const getUser = async () => {
			const {data} = await axios.get(checkLoginRoute);
			setUser(data.user);
		};
		getUser();
	}, []);

	return (
		<Container>
			<div className="welcome-header">
				<Logout />
			</div>
			<div className="welcome-body">
				<img src={welcome} alt="Welcome gif" />
				{user ? (
					<h1>
						Welcome, <span>{user.username}!</span>
					</h1>
				) : (
					<h1>Welcome!</h1>
				)}
				<h3>Please select a chat to start messaging</h3>
			</div>
		</Container>
	);
};

const Container = styled.div`
	color: var(--primary-text-color);
	.welcome-body {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
    height: 80%;

	}
	.welcome-header {
		display: flex;
		justify-content: end;
		align-items: center;
		padding: 0 2rem;
		height: 5rem;
	}

	span {
		color: var(--secondary-color);
	}
	img {
		height: 30rem;
	}
`;

export default Welcome;
