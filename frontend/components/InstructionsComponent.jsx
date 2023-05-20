import styles from "../styles/InstructionsComponent.module.css";
import Router, { useRouter } from "next/router";
import {useState, useEffect} from 'react';
import {useSigner, useNetwork, useBalance, useContractRead} from 'wagmi';

export default function InstructionsComponent() {
	const router = useRouter();
	return (
		<div className={styles.container}>
			<header className={styles.header_container}>
				<h1>
					create<span>-web3-dapp</span>
				</h1>
				<p>
					Get started by editing this page in{" "}
					<span>/pages/index.js</span>
				</p>
			</header>
		<RequestTokens></RequestTokens>
		<Delegate></Delegate>
		</div>
	);
}

function RequestTokens() {
	const { data: signer } = useSigner();
	const [txData, setTxData] = useState(null);
	const [isLoading, setLoading] = useState(false);
	if (txData) return (
		<div>
			<p>Transaction completed!</p>
			<a href={"https://sepolia.etherscan.io/tx/" + txData.hash} target="_blank">{txData.hash}</a>
		</div>
	)
	if (isLoading) return <p>Requesting tokens to be minted...</p>;
	return (
		<div>
		  <h1>Request tokens to be minted</h1>
		  <button onClick={() => requestTokens(signer, "anything", setLoading, setTxData)}
		  >Request tokens</button>
		</div>
	  );
}

function requestTokens(signer, signature, setLoading, setTxData) {
	setLoading(true);
	const requestOptions = {
		method: 'POST',
		headers: {'Content-Type':'application/json'},
		body: JSON.stringify({address: signer._address, signature: signature})
	};

	fetch('http://localhost:3001/request-token', requestOptions)
	.then(response => response.json())
	.then((data) => {
		setTxData(data);
		setLoading(false);
	});
}
function delegate(signer, signature, setLoading, setTxData) {
	setLoading(true);
	const requestOptions = {
		method: 'POST',
		headers: {'Content-Type':'application/json'},
		body: JSON.stringify({address: signer._address, signature: signature})
	};

	fetch('http://localhost:3001/request-token', requestOptions)
	.then(response => response.json())
	.then((data) => {
		setTxData(data);
		setLoading(false);
	});
}

function Delegate() {
	const { data: signer } = useSigner();
	const [txData, setTxData] = useState(null);
	const [isLoading, setLoading] = useState(false);
	if (txData) return (
		<div>
			<p>Transaction completed!</p>
			<a href={"https://sepolia.etherscan.io/tx/" + txData.hash} target="_blank">{txData.hash}</a>
		</div>
	)
	if (isLoading) return <p>Delegating vote...</p>;
	return (
		<div>
		  <h1>Delegate vote</h1>
		  <button onClick={() => delegate(signer, "anything", setLoading, setTxData)}
		  >Delegate vote</button>
		</div>
	  );
}