import styles from "../styles/InstructionsComponent.module.css";
import Router, { useRouter } from "next/router";
import { useState } from "react";
import { useSigner, erc20ABI, useContract } from "wagmi";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import * as React from "react";
import * as ballotJson from "../abi/TokenizedBallot.json";
import * as tokenJson from "../abi/MyVoteToken.json";
import { ethers, Contract } from "ethers";

export default function InstructionsComponent() {
  return (
    <h1 className="text-black text-3xl font-mono">Token-Lottery FrontEnd</h1>
  );
}
