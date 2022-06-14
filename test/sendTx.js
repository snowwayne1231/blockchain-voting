require('dotenv').config();
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const myAddress = '0x5DD9c54B5D646806ee7F398e2C71a0E2f21b3220';

async function main() {
    const { API_URL, PRIVATE_KEY } = process.env;
    const web3 = createAlchemyWeb3(API_URL);
    const nonce = await web3.eth.getTransactionCount(myAddress, 'latest');

    const transaction = {
        'to': '0x7aE281224d03BAbB449eA590C65152127b296aC6',
        'value': 100000000000000000, // 0.1 ETH
        'gas': 30000,
        'nonce': nonce,
        // optional data field to send message or execute smart contract
       };
   
       const signedTx = await web3.eth.accounts.signTransaction(transaction, PRIVATE_KEY);
   
       web3.eth.sendSignedTransaction(signedTx.rawTransaction, function(error, hash) {
       if (!error) {
         console.log("🎉 The hash of your transaction is: ", hash, "\n Check Alchemy's Mempool to view the status of your transaction!");
       } else {
         console.log("❗Something went wrong while submitting your transaction:", error)
       }
      });
   
}

main().then(e => {
  console.log(e);
})