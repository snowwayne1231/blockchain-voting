// require("dotenv").config();
const alchemyKey = 'wss://eth-rinkeby.alchemyapi.io/v2/4lgjs3gOnSBOIIxxJzIv3Qix9cnPHrOP';
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);

const contractABI = require("../contract-abi.json");
// address to fix right
const contractAddress = "0xf082A7De4DaEAc89f52d33aEA901024f48cF84d9";
export const candidateNames = ['候選人A', '政客B', '學生C'];

export const VoteContract = new web3.eth.Contract(
    contractABI,
    contractAddress
);

export const getChairperson = async () => {
    const persion = await VoteContract.methods.chairperson().call(); 
    return persion;
};

export const getLock = async() => {
    const lock = await VoteContract.methods.lock().call();
    return lock;
}

export const connectWallet = async () => {
    if (window.ethereum) {
        try {
            const addressArray = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
            const address = addressArray[0];
            const voter = await getMyVoter(address);
            const obj = {
                status: "👆🏽 Vote a candidate.",
                address,
                voter,
            };
            return obj;
        } catch (err) {
            return {
                address: "",
                status: "😥 " + err.message,
                voter: {},
            };
        }
    } else {
        return {
            address: "",
            status: (
                <span>
                <p>
                    {" "}
                    🦊{" "}
                    <a target="_blank" href={`https://metamask.io/download.html`} rel="noreferrer">
                    You must install Metamask, a virtual Ethereum wallet, in your browser.
                    </a>
                </p>
                </span>
            ),
            voter: {},
        };
    }
};

export const getCurrentWalletConnected = async () => {

};

export const getMyVoter = async (address) => {
    const voter = await VoteContract.methods.voters(address).call({from: address}); 
    return voter;
};


export const giveValidateID = async (phonenum, idnum, fromAddress) => {
    console.log('giveValidateID: ', phonenum, idnum);
    const transactionParameters = {
        to: contractAddress, // Required except during contract publications.
        from: fromAddress, // must match user's active address.
        data: VoteContract.methods.giveValidateId(phonenum, idnum).encodeABI(),
    };
    const txObj = await tryTx(transactionParameters);
    // await VoteContract.methods.giveValidateId(phonenum, idnum).call({from: address});
    return txObj;
};

export const validete = async (idnum, code, fromAddress) => {
    let trypass = false;
    console.log('id ', idnum, ' code: ', code, ' fromAddress: ', fromAddress);
    await VoteContract.methods.validate(idnum, code).call({from: fromAddress}).then(res => {
        trypass = true;
    }).catch(err => {
        trypass = false;
        console.log('err: ', err);
    });
    if (trypass) {
        const transactionParameters = {
            to: contractAddress, // Required except during contract publications.
            from: fromAddress, // must match user's active address.
            data: VoteContract.methods.validate(idnum, code).encodeABI(),
        };
        const txObj = await tryTx(transactionParameters);
        return txObj;
    }
    return {};
    // await VoteContract.methods.validate(idnum, code);
}

export const vote = async (idx, fromAddress) => {
    const unit = parseInt(idx, 10);
    if (unit >= 0 && candidateNames[unit]) {
        const transactionParameters = {
            to: contractAddress, // Required except during contract publications.
            from: fromAddress, // must match user's active address.
            data: VoteContract.methods.vote(unit).encodeABI(),
        };
        const txObj = await tryTx(transactionParameters);
        return txObj;
    } else {
        console.log('wrong idx: ', idx);
        return {};
    }
}

export const setLock = async (bool, fromAddress) => {
    const transactionParameters = {
        to: contractAddress, // Required except during contract publications.
        from: fromAddress, // must match user's active address.
        data: VoteContract.methods.setLock(bool).encodeABI(),
    };
    const txObj = await tryTx(transactionParameters);
    return txObj;
}


export const tryTx = async (txparam, method = 'eth_sendTransaction') => {
    //sign the transaction
    try {
        const txHash = await window.ethereum.request({
          method,
          params: [txparam],
        });
        return {
          status: (
            <span>
              ✅{" "}
              <a target="_blank" href={`https://rinkeby.etherscan.io/tx/${txHash}`}>
                View the status of your transaction on Etherscan!
              </a>
            </span>
          ),
          txHash,
        };
    } catch (error) {
        return {
            status: "😥 " + error.message,
            txHash: "",
        };
    }
}

export const getValidateCode = async (id, fromAddress) => {
    const res = await VoteContract.methods.getValidateCode(id).call({from: fromAddress}).catch(err => {
        console.log('err: ', err);
    });
    console.log('getValidateCode res: ', res)
    return res;
}

export const getWinnerName = async (fromAddress) => {
    const idx = await VoteContract.methods.winningProposal().call().catch(err => {
        console.log('err: ', err);
    });
    return candidateNames[idx];
}