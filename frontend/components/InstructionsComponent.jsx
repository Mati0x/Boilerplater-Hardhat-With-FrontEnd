import styles from "../styles/InstructionsComponent.module.css";
import Router, { useRouter } from "next/router";
import {useState, useEffect} from 'react';
import {useSigner, useNetwork, useBalance, useContractRead} from 'wagmi';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import * as React from 'react';

export default function InstructionsComponent() {
	const router = useRouter();
	var optionSelected;
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
		<ShowBalance></ShowBalance>
		<ShowVotes></ShowVotes>
		<OptionsProposals></OptionsProposals>
		</div>
	);
}

function ShowBalance(){
	const { data: signer } = useSigner();
	const [txData, setTxData] = useState(null);
	const [isLoading, setLoading] = useState(false);
	if (txData) return (
		<div>
			<p>Balance of the contract: {txData} </p>
		</div>
	)
	if (isLoading) return <p>Requesting balance...</p>;
	return (
		<div>
		  <h1>Request contract's balance</h1>
		  <button onClick={() => showBalance(signer, setLoading, setTxData)}
		  >Request balance</button>
		</div>
	  );
}
function showBalance(signer, setLoading, setTxData){
	setLoading(true);
	const requestOptions = {
		method: 'GET',
		headers: {'Content-Type':'application/json'}
	};

	fetch('http://localhost:3001/balance/' + signer._address, requestOptions)
	.then(response => response.json())
	.then((data) => {
		setTxData(data);
		setLoading(false);
	});
}

function ShowVotes(){
	const { data: signer } = useSigner();
	const [txData, setTxData] = useState(null);
	const [isLoading, setLoading] = useState(false);
	if (txData) return (
		<div>
			<p>Votes balance of the account: {txData} </p>
		</div>
	)
	if (isLoading) return <p>Requesting votes...</p>;
	return (
		<div>
		  <h1>Request account's votes</h1>
		  <button onClick={() => showVotes(signer, setLoading, setTxData)}
		  >Request account's votes</button>
		</div>
	  );
}
function showVotes(signer, setLoading, setTxData){
	setLoading(true);
	const requestOptions = {
		method: 'GET',
		headers: {'Content-Type':'application/json'}
	};

	fetch('http://localhost:3001/votes/' + signer._address, requestOptions)
	.then(response => response.json())
	.then((data) => {
		setTxData(data);
		setLoading(false);
	});
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
		  <button outline color="primary" onClick={() => requestTokens(signer, "anything", setLoading, setTxData)}
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

	fetch('http://localhost:3001/delegate-vote', requestOptions)
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

function vote(signer, signature, setLoading, setTxData) {
	setLoading(true);
	const requestOptions = {
		method: 'POST',
		headers: {'Content-Type':'application/json'},
		body: JSON.stringify({address: signer._address, signature: signature})
	};

	fetch('http://localhost:3001/cast-vote', requestOptions)
	.then(response => response.json())
	.then((data) => {
		setTxData(data);
		setLoading(false);
	});
}

function Vote() {
	const { data: signer } = useSigner();
	const [txData, setTxData] = useState(null);
	const [isLoading, setLoading] = useState(false);
	if (txData) return (
		<div>
			<p>Transaction completed!</p>
			<a href={"https://sepolia.etherscan.io/tx/" + txData.hash} target="_blank">{txData.hash}</a>
		</div>
	)
	if (isLoading) return <p>wait...</p>;
	return (
		<div>
		  <h1>Cast vote</h1>
		  <button onClick={() => vote(signer, "anything", setLoading, setTxData)}
		  >Cast vote</button>
		</div>
	  );
}

function OptionsProposals() {
	const options = ['Frutilla', 'Vainilla', 'Chocolate']
	const [value, setValue] = React.useState(options[0]);
	const [inputValue, setInputValue] = React.useState('');
	
	return (
		<div>

		<br />
		<Autocomplete
		  value={value}
		  onChange={(event, newValue) => {
			setValue(newValue);
		  }}
		  inputValue={inputValue}
		  onInputChange={(event, newInputValue) => {
			setInputValue(newInputValue);
		  }}
		  id="proposalSelect"
		  options={options}
		  sx={{ width: 300 }}
		  renderInput={(params) => <TextField {...params} label="Proposals" />}
		/>
	  </div>
	);
}