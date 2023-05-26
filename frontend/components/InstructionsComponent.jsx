import styles from "../styles/InstructionsComponent.module.css";
import Router, { useRouter } from "next/router";
import {useState} from 'react';
import {useSigner, erc20ABI, useContract} from 'wagmi';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import * as React from 'react';
import * as ballotJson from '../abi/TokenizedBallot.json';
import * as tokenJson from '../abi/MyVoteToken.json';
import {ethers, Contract} from 'ethers';

export default function InstructionsComponent() {
	const router = useRouter();
	var optionSelected;
	return (
		<div className={styles.container}>
			<header className={styles.header_container}>
				<h1>
					<span>Vote-web3-dapp</span>
				</h1>
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

async function delegate(signer, tokenContract, setLoading, setTxData, setError){
	if(signer){
	  setLoading(true);
	  tokenContract
	  .connect(signer)
	  .delegate(signer._address)
		 .then((data) => {
		   setTxData(data);
		   setLoading(false);
		   console.log("Delegation succesfully");
		   console.log(data);
		 }).catch((err) => {
			setError(err.reason); 
			setLoading(false);
			console.log(err);
		 });
	}else{
	  alert("Please connect to a wallet");
	}
   }

function Delegate() {
	const { data: signer } = useSigner();
	const [txData, setTxData] = useState(null);
	const [isLoading, setLoading] = useState(false);
	const [errorReason, setError] = React.useState(null);

	if(signer){
		const provider = new ethers.providers.InfuraProvider("goerli", process.env.NEXT_PUBLIC_INFURA_API_KEY);
		const tokenContract = new Contract(process.env.NEXT_PUBLIC_TOKEN_ADDRESS, tokenJson.abi, provider);

		if (txData) return (
			<div>
				<p>Transaction completed!</p>
				<a href={"https://goerli.etherscan.io/tx/" + txData.hash} target="_blank">{txData.hash}</a>
			</div>
		)
		if (isLoading) return <p>Delegating vote...</p>;
		return (
			<div>
			  <h1>Delegate vote</h1>
			  <button onClick={async () => await delegate(signer, tokenContract, setLoading, setTxData, setError)}
			  >Delegate vote</button>
			</div>
		  );
	}
}

async function vote(signer, ballotContract, setLoading, setError, setTxData, proposalId){
	setLoading(true);
	ballotContract
	.connect(signer)
	.vote(proposalId, ethers.utils.parseUnits("1"))
		.then((data) => {
		  setTxData(data);
		  setLoading(false);
		}).catch((err) => {
		 setError(err.reason); 
		 setLoading(false);
		});
  }

function Vote({proposalId, proposalName}) {
	const [txData, setTxData] = React.useState(null);
	const [isLoading, setLoading] = React.useState(false);
	const [errorReason, setError] = React.useState(null);
	const { data:signer} = useSigner();

	if(signer){
		const provider = new ethers.providers.InfuraProvider("goerli", process.env.NEXT_PUBLIC_INFURA_API_KEY);
		const ballotContract = new Contract(process.env.NEXT_PUBLIC_TOKEN_ADDRESS, ballotJson.abi, provider);

		if (txData) return (
			<div>
				<p>Transaction completed!</p>
				<a href={"https://goerli.etherscan.io/tx/" + txData.hash} target="_blank">{txData.hash}</a>
			</div>
		)
		if (isLoading) return <p>wait...</p>;
		return (
			<div>
			  <h1>Cast vote to {proposalName}</h1>
			  <button onClick={async () => await vote(signer, ballotContract, setLoading, setError, setTxData, parseInt(proposalId))}
			  >Cast vote</button>
			</div>
		  );
	}
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
		<Vote proposalId={options.indexOf(inputValue)} proposalName={inputValue}></Vote>
	  </div>
	);
}