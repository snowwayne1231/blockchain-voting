// require("dotenv").config();
const alchemyKey = 'wss://eth-rinkeby.alchemyapi.io/v2/4lgjs3gOnSBOIIxxJzIv3Qix9cnPHrOP';
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);

const contractABI = require("../contract-abi.json");
const contractAddress = "0x4CE7b8d01108a1a00A0ab4d36f39caFdE89e0Eb7";

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
        };
    }
};

export const getCurrentWalletConnected = async () => { 

};

export const getMyVoter = async (address) => {
    const voter = await VoteContract.methods.voters(address).call(); 
    return voter;
};


export const updateMessage = async (message) => {

};