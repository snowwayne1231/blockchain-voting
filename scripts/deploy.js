const web3 = require('web3');

async function main() {
    const VoteCon = await ethers.getContractFactory("VoteCon2");
 
    // Start deployment, returning a promise that resolves to a contract object
    const names = ['CandidateA', 'CandidateBB', 'Candidate3'];
    const voting = await VoteCon.deploy(names.map(name => web3.utils.padLeft(web3.utils.asciiToHex(name), 64)));   
    console.log("Contract deployed to address:", voting.address);
    // 0x4CE7b8d01108a1a00A0ab4d36f39caFdE89e0Eb7
    // 0xcd59d255B0Fd7838AD6e13a17F3bf134C119b3d5
    // 0x9B86091A62271425A6E95eDCeD9F50a4b2F30E00
 }
 
 main()
   .then(() => process.exit(0))
   .catch(error => {
     console.error(error);
     process.exit(1);
   });