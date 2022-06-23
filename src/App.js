import * as React from "react";
import { ethers } from "ethers";
import "./App.css";

export default function App() {
	const wave = () => {};

	return (
		<div className='mainContainer'>
			<div className='dataContainer'>
				<div className='header'>
					hey there! gm
					<span role='img' aria-label='wave'>
						👋
					</span>
				</div>

				<div className='bio'>I'm Vijeth and I build web apps!</div>
				<div className='bio'> Connect your Ethereum wallet and wave at me!</div>

				<button className='waveButton' onClick={wave}>
					Wave at Me
				</button>
			</div>
		</div>
	);
}
