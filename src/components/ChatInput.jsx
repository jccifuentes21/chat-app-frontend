import React, { useState } from "react";
import styled from "styled-components";
import Picker from "emoji-picker-react";
import { IoMdSend } from "react-icons/io";
import { BsEmojiSmileFill } from "react-icons/bs";

export default function ChatInput({ handleSendMsg, showEmojiPicker, handleEmojiPickerHideShow, hideEmojiPicker }) {
	const [msg, setMsg] = useState("");

	const handleEmojiClick = (event, emoji) => {
		let message = msg;
		message += emoji.emoji;
		setMsg(message);
	};

	const sendChat = (event) => {
		event.preventDefault();
		if (msg.length > 0) {
			handleSendMsg(msg);
			setMsg("");
		}
	};

	return (
		<Container>
			<div className="button-container">
				<div className="emoji">
					<BsEmojiSmileFill onClick={handleEmojiPickerHideShow} />
					{showEmojiPicker && <Picker onEmojiClick={handleEmojiClick} />}
				</div>
			</div>
			<form onClick={hideEmojiPicker} className="input-container" onSubmit={(e) => sendChat(e)}>
				<input
					type="text"
					placeholder="Type a message"
					value={msg}
					onChange={(e) => setMsg(e.target.value)}
				/>
				<button className="submit">
					<IoMdSend />
				</button>
			</form>
		</Container>
	);
}

const Container = styled.div`
	display: grid;
	align-items: center;
	grid-template-columns: 5% 95%;
	background-color: var(--form-background-color);
	padding: 0 2rem;
	@media screen and (min-width: 720px) and (max-width: 1080px) {
		padding: 0 1rem;
		gap: 1rem;
	}
	.button-container {
		display: flex;
		align-items: center;
		color: white;
		gap: 1rem;
		.emoji {
			position: relative;
			svg {
				font-size: 1.5rem;
				color: #ffff00c8;
				cursor: pointer;
			}
			.emoji-picker-react {
				position: absolute;
				top: -350px;
				background-color: var(--background-color);
				box-shadow: 0 5px 10px var(--bg-variant-color-hover);
				border-color: var(--bg-variant-color-hover);
				.emoji-scroll-wrapper::-webkit-scrollbar {
					background-color: var(--bg-variant-color-hover);
					width: 5px;
					&-thumb {
						background-color: var(--background-color);
					}
				}
				.emoji-categories {
					button {
						filter: contrast(0);
					}
				}
				.emoji-search {
					background-color: transparent;
					border-color: var(--bg-variant-color-hover);
				}
				.emoji-group:before {
					background-color: var(--background-color);
				}
			}
		}
	}
	.input-container {
		width: 100%;
		border-radius: 2rem;
		display: flex;
		align-items: center;
		gap: 2rem;
		background-color: #ffffff34;
		input {
			width: 100%;
			background-color: transparent;
			color: var(--primary-text-color);
			border: none;
			padding-left: 1rem;
			font-size: 1.2rem;
			&::selection {
				background-color: #9a86f3;
			}
			&:focus {
				outline: none;
			}
		}
		button {
			cursor: pointer;
			padding: 0.2rem 1.3rem;
			border-radius: 2rem;
			display: flex;
			justify-content: center;
			align-items: center;
			background-color: var(--bg-variant-color-hover);
			border: none;
			@media screen and (min-width: 720px) and (max-width: 1080px) {
				padding: 0.3rem 1rem;
				svg {
					font-size: 1rem;
				}
			}
			svg {
				font-size: 2rem;
				color: white;
			}
		}
	}
`;
