const web3 = require('web3');
const names = ['CandidateA', 'CandidateBB', 'Candidate3'];
const votingNames = names.map(name => web3.utils.padLeft(web3.utils.asciiToHex(name), 64));  

module.exports = [
    votingNames
]