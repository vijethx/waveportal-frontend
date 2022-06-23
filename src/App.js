/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./App.css";

export default function App() {
	const [currentAccount, setCurrentAccount] = useState("");

	const checkIfWalletIsConnected = async () => {
		try {
			const { ethereum } = window;
			if (!ethereum) {
				console.log("Make sure you have metamask");
			} else {
				console.log("We have the Ethereum Object", ethereum);
			}

			const accounts = await ethereum.request({ method: "eth_accounts" });

			if (accounts.length !== 0) {
				console.log("Authorised account:", accounts[0]);
				setCurrentAccount(accounts[0]);
			} else {
				console.log("No authorized account found");
			}
		} catch (error) {
			console.log(error);
		}
	};

	const connectWallet = async () => {
		try {
			const { ethereum } = window;
			if (!ethereum) {
				alert("Get Metamask!");
				return;
			}
			const accounts = await ethereum.request({
				method: "eth_requestAccounts",
			});
			console.log("Connected", accounts[0]);
			setCurrentAccount(accounts[0]);
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		checkIfWalletIsConnected();
	}, []);

	const wave = () => {};

	return (
		<div className='mainContainer'>
			<div className='dataContainer'>
				<div className='header'>hey there! gm 👋</div>

				<div className='bio'>I'm Vijeth and I build web apps!</div>
				<div className='bio'> Connect your Ethereum wallet and wave at me!</div>

				{currentAccount ? (
					<button className='waveButton' onClick={wave}>
						Wave at Me 👋
					</button>
				) : (
					<button className='waveButton' onClick={connectWallet}>
						👉 Connect Wallet 👈
					</button>
				)}
			</div>
		</div>
	);
}
