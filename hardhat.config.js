// require("@nomiclabs/hardhat-waffle");

require('dotenv').config();
require("@nomiclabs/hardhat-ethers");
require('@nomiclabs/hardhat-etherscan');


const { API_URL, PRIVATE_KEY } = process.env;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
// task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
//   const accounts = await hre.ethers.getSigners();
//   for (const account of accounts) {
//     console.log(account.address);
//   }
// });

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
// module.exports = {
//   solidity: "0.8.4",
// };

module.exports = {
  solidity: "0.8.4",
  defaultNetwork: "rinkeby",
  networks: {
     hardhat: {},
     rinkeby: {
        url: API_URL,
        accounts: [`0x${PRIVATE_KEY}`]
     }
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: ETHERSCAN_API_KEY
  }
}
