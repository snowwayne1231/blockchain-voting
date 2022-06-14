// require("dotenv").config();
const alchemyKey = 'wss://eth-rinkeby.alchemyapi.io/v2/4lgjs3gOnSBOIIxxJzIv3Qix9cnPHrOP';
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);

const contractABI = require("../contract-abi.json");
const contractAddress = "0x9B86091A62271425A6E95eDCeD9F50a4b2F30E00";
export const candidateNames = ['CandidateA', 'CandidateBB', 'Candidate3'];

export const VoteContract = new web3.eth.Contract(
    contractABI,
    contractAddress
);

export const getChairperson = async () => {
    const persion = await VoteContract.methods.chairperson().call(); 
    return persion;
};

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
    const voter = await VoteContract.methods.voters(address).call(); 
    return voter;
};


export const giveValidateID = async (phonenum, idnum) => {
    console.log('giveValidateID: ', phonenum, idnum);
    await VoteContract.methods.giveValidateId(phonenum, idnum).call();
    return true;
};

export const validete = async (idnum, code) => {
    await VoteContract.methods.validate(idnum, code);
    return true;
}

export const vote = async (idx) => {
    const unit = parseInt(idx, 10);
    if (unit >= 0 && candidateNames[unit]) {
        await VoteContract.methods.vote(unit);
        return true;
    } else {
        console.log('wrong idx: ', idx);
        return false;
    }
    
}

export const setLock = async(bool) => {
    await VoteContract.methods.setLock(bool);
}