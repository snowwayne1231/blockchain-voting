import React from "react";
import { useEffect, useState } from "react";
import {
  getChairperson,
  connectWallet
} from "./util/interact.js";

// import alchemylogo from "./alchemylogo.svg";

const VoteCon = () => {
  //state variables
  const [chairpersonAddress, setChairpersonAddress] = useState("");
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("No connection to the network.");
  const [voteIndex, setVote] = useState(0);
  const [isVoted, setIsVoted] = useState(false);
  const [voteWeight, setWeight] = useState(0);

  //called only once
  useEffect(() => {
    async function fetchChairPerson() {
      const personAddress = await getChairperson();
      setChairpersonAddress(personAddress);
    }
    fetchChairPerson();
  }, []);

  // function addSmartContractListener() {
    
  // }

  function addWalletListener() {
    
  }

  const connectWalletPressed = async () => {
    const walletResponse = await connectWallet();
    setStatus(walletResponse.status);
    setWallet(walletResponse.address);
    setWeight(parseInt(walletResponse.voter.weight));
    setVote(parseInt(walletResponse.voter.vote));
    setIsVoted(Boolean(walletResponse.voter.voted));
    console.log('walletResponse: ', walletResponse.voter);
    // setMessage()
  };

  const onUpdatePressed = async () => {
    
  };

  const onClickRequestVoteRight = async () => {

  }

  //the UI of our component
  return (
    <div id="container">
      {/* <img id="logo" src={alchemylogo}></img> */}
      <h1>區塊鏈投票系統</h1>
      <p>Chair Address: {chairpersonAddress}</p>
      <button id="walletButton" onClick={connectWalletPressed}>
        {walletAddress.length > 0 ? (
          "Connected: " + String(walletAddress)
        ) : (
          <span>Connect Wallet</span>
        )}
      </button>

      {walletAddress.length > 0 ? (
        <div>
          <table><tbody>
            <tr>
              <th>已投候選人：</th>
              <td>{isVoted ? voteIndex : '無'}</td>
            </tr>
            <tr>
              <th>投票權：</th>
              <td>{voteWeight === 1 ? '有' : '無'} {voteWeight === 0 ? <button onClick={onClickRequestVoteRight}>驗證身份</button>: ''}</td>
            </tr>
          </tbody></table>
          
          <p id="status">{status}</p>

          <button id="publish" onClick={onUpdatePressed}>
            Update
          </button>
        </div>
        ) : (
        <div>{message}</div>
      )}
    </div>
  );
};

export default VoteCon;
