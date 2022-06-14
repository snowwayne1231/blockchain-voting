const web3 = require('web3');
const names = ['候選人A', '政客B', '學生C'];
const votingNames = names.map(name => web3.utils.padLeft(web3.utils.asciiToHex(name), 64));  

module.exports = [
    votingNames
]