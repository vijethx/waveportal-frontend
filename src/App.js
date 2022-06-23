/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./App.css";
import abi from "./utils/WavePortal.json";

export default function App() {
	const [currentAccount, setCurrentAccount] = useState("");
	const [allWaves, setAllWaves] = useState([]);
	const [waverMessage, setWaverMessage] = useState("gm");

	const contractAddress = "0xDACfe2375AB4f4Bf28F434aC3Cb950ee5D9f09C0";
	const contractABI = abi.abi;

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
				getAllWaves();
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

	const wave = async () => {
		try {
			const { ethereum } = window;

			if (ethereum) {
				const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner();
				const wavePortalContract = new ethers.Contract(
					contractAddress,
					contractABI,
					signer
				);

				let count = await wavePortalContract.getTotalWaves();
				console.log("Retrieved total wave count....", count.toNumber());

				const waveTxn = await wavePortalContract.wave(waverMessage);
				console.log("Mining...", waveTxn.hash);
				await waveTxn.wait();
				console.log("Mined...", waveTxn.hash);
				count = await wavePortalContract.getTotalWaves();
				console.log("Retrieved total wave count....", count.toNumber());
			} else {
				console.log("Ethereum object doesn't exist");
			}
		} catch (error) {
			console.log(error);
		}
	};

	const getAllWaves = async () => {
		try {
			const { ethereum } = window;
			if (ethereum) {
				const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner();
				const wavePortalContract = new ethers.Contract(
					contractAddress,
					contractABI,
					signer
				);

				const waves = await wavePortalContract.getAllWaves();

				let wavesCleaned = [];
				waves.forEach((wave) => {
					wavesCleaned.push({
						address: wave.waver,
						timestamp: new Date(wave.timestamp * 1000),
						message: wave.message,
					});
				});
				setAllWaves(wavesCleaned);
			} else {
				console.log("Ethereum object doesn't exist");
			}
		} catch (error) {}
	};

	useEffect(() => {
		checkIfWalletIsConnected();
	}, []);
	return (
		<div className='mainContainer'>
			<div className='dataContainer'>
				<div className='header'>hey there! gm 👋</div>

				<div className='bio'>I'm Vijeth and I build web apps!</div>
				<div className='bio'>
					{" "}
					Connect your Polygon (Testnet) wallet and wave at me!
				</div>
				<input
					type='text'
					style={{ marginTop: "16px" }}
					name='waverMessage'
					placeholder='gm'
					value={waverMessage}
					onChange={(e) => setWaverMessage(e.target.value)}
				/>
				{currentAccount ? (
					<button className='waveButton' onClick={wave}>
						Wave at Me 👋
					</button>
				) : (
					<button className='waveButton' onClick={connectWallet}>
						👉 Connect Wallet 👈
					</button>
				)}

				{allWaves.map((wave, index) => {
					return (
						<div
							key={index}
							style={{
								backgroundColor: "OldLace",
								marginTop: "16px",
								padding: "8px",
							}}>
							<div>Address: {wave.address}</div>
							<div>Time: {wave.timestamp.toString()}</div>
							<div>Message: {wave.message}</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
