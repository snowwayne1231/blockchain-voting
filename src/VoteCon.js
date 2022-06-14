import React from "react";
import { useEffect, useState } from "react";
import {
  VoteContract,
  getChairperson,
  connectWallet,
  giveValidateID,
  validete,
  vote,
  candidateNames
} from "./util/interact.js";

// import alchemylogo from "./alchemylogo.svg";

const VoteCon = () => {
  //state variables
  const [chairpersonAddress, setChairpersonAddress] = useState("");
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");
  // const [message, setMessage] = useState("No connection to the network.");
  const [voteIndex, setVote] = useState(0);
  const [isVoted, setIsVoted] = useState(false);
  const [voteWeight, setWeight] = useState(0);
  const [savedId, setId] = useState("");

  //called only once
  useEffect(() => {
    async function fetchChairPerson() {
      const personAddress = await getChairperson().catch(err => {
        console.log('getChairperson: ', err);
      });
      setChairpersonAddress(personAddress);
    }
    fetchChairPerson();
    addContractListener();
  }, []);

  // function addSmartContractListener() {
    
  // }

  function addContractListener() {
    VoteContract.events.SendMessage({}, (error, data) => {
      if (error) {
        setStatus("😥 " + error.message);
      } else {
        window._codedata = data;
        console.log('SendMessage event data: ', data);
      }
    });
  }

  const connectWalletPressed = async () => {
    const walletResponse = await connectWallet().catch(err => {
      console.log('connectWallet: ', err);
    });;
    setStatus(walletResponse.status);
    setWallet(walletResponse.address);
    if (walletResponse.voter && walletResponse.voter.delegate) {
      setWeight(parseInt(walletResponse.voter.weight));
      setVote(parseInt(walletResponse.voter.vote));
      setIsVoted(Boolean(walletResponse.voter.voted));
      console.log('walletResponse: ', walletResponse.voter);
    }
    // setMessage()
  };

  const onClickVote = async () => {
    const choose = window.prompt('請輸入想投的候選人代號： \r\n' + candidateNames.map((name, idx) => `${idx} => ${name}`).join('\r\n'));
    if (choose >= 0) {
      const voteRes = await vote(choose).catch(err => {
        console.log('vote err: ', err);
      });
      console.log('voteRes: ', voteRes);
      if (voteRes) {
        setIsVoted(true);
        setVote(choose);
      }
    }
  };

  const onClickRequestVoteRight = async () => {
    const idnum = window.prompt('請輸入身分證字號: '); // 應加身分證檢查算法
    const phonenum = window.prompt('請輸入手機號: ');
    if (idnum && phonenum) {
      if (await giveValidateID(phonenum, idnum)) {
        setId(idnum);
        window.alert('請從手機接收驗證碼驗證. ');
      }
    }
  }

  const onClickSendCode = async () => {
    const code = window.prompt('請輸入驗證碼: ');
    if (code && await validete(savedId, code)) {
      setWeight(1);
    }
  }

  //the UI of our component
  return (
    <div id="container">
      {/* <img id="logo" src={alchemylogo}></img> */}
      <h1>區塊鏈投票系統</h1>
      <div>
        <p>Chair Address: {chairpersonAddress}</p>
        <button id="walletButton" onClick={connectWalletPressed}>
          {walletAddress.length > 0 ? (
            "Connected: " + String(walletAddress)
          ) : (
            <span>Connect Wallet</span>
          )}
        </button>
      </div>
      {walletAddress.length > 0 ? (
        <div>
          <table><tbody>
            <tr>
              <th>投票權：</th>
              <td>{voteWeight === 1 ? '有' : '無'} {voteWeight === 0 ? <div><button onClick={onClickRequestVoteRight}>驗證身份</button><button onClick={onClickSendCode}>輸入驗證碼</button></div>: ''}</td>
            </tr>
            <tr>
              <th>已投候選人：</th>
              <td>{isVoted && candidateNames[voteIndex] ? candidateNames[voteIndex] : '無'}</td>
            </tr>
            <tr>
              <th>候選人清單：</th>
              <td>{candidateNames.map((name, idx) => <p key={idx}>{idx}. {name}</p>)}</td>
            </tr>
          </tbody></table>
          
          {voteWeight === 1 ?
            isVoted === false ? 
              <div>
                <button id="publish" onClick={onClickVote}>
                  投票
                </button>
                <p id="status">{status}</p>
              </div>
              :
              <div>
                👆🏽 已經投好票了
              </div>
            :
            <div>
              <p>尚未取得投票權</p>
            </div>
          }
          
          
        </div>
        ) : (
        <div>No connection to the network.</div>
      )}
      {chairpersonAddress.length > 0 && chairpersonAddress.toLowerCase() === walletAddress ?
        <div stlye="border-top: 2px solid #333;">
          <h2>發起人功能:</h2>
          <p><button>關閉投票</button></p>
        </div>
        :
        <div></div>
      }
    </div>
  );
};

export default VoteCon;
