require('dotenv').config();

const API_KEY = process.env.API_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
 
const contract = require("../artifacts/contracts/VoteCon.sol/VoteCon.json");
// console.log(JSON.stringify(contract.abi));
const candidateNames = ['CandidateA', 'CandidateBB', 'Candidate3'];

// Provider
const alchemyProvider = new ethers.providers.AlchemyProvider(network="rinkeby", API_KEY);

// Signer
const signer = new ethers.Wallet(PRIVATE_KEY, alchemyProvider);

// Contract
const voteContract = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, signer)

export async function delegate(address) {
    await voteContract.delegate(address);
}

export async function giveTick(address) {
    await voteContract.giveRightToVote(address);
}

export async function lock(bool) {
    await voteContract.setLock(bool);
}

export async function vote(idx) {
    if (idx < candidateNames.length) {
        await voteContract.vote(idx);
    } else {
        console.log('wrong index of candidate.');
    }
}

export async function getCandidateByIndex(idx) {
    if (idx < candidateNames.length) {
        return await voteContract.proposals(idx);
    } else {
        console.log('wrong index of candidate.');
    }
}

export async function getChairperson() {
    const chairperson = await voteContract.chairperson();
    // console.log("The chairperson is: " + chairperson);
    return chairperson;
}

export async function getWinner() {
    return await voteContract.winnerName();
}

// main().then(e => {
//     console.log('successful. ', e);
// });