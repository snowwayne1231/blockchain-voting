# Basic Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, a sample script that deploys that contract, and an example of a task implementation, which simply lists the available accounts.

Try running some of the following tasks:

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
node scripts/sample-script.js
npx hardhat help
```


# For Steps 

## install

```shell
npm init
npm install --save-dev hardhat
npm install dotenv --save
npm install --save-dev @nomiclabs/hardhat-ethers "ethers@^5.0.0"
npm install web3
npm install --save-dev @nomiclabs/hardhat-etherscan
```

## tests
```shell
npx hardhat run scripts/interact.js
```

## deploy
```shell
npx hardhat compile
npx hardhat run scripts/deploy.js --network rinkeby
npx hardhat verify --network rinkeby --constructor-args arguments.js [DEPLOYED_CONTRACT_ADDRESS]
```
will get address to deploy
goto ehterscan get abi to replace abi-json



# reference
* https://hardhat.org/plugins/nomiclabs-hardhat-etherscan#complex-arguments
* https://rinkeby.etherscan.io/address/0x4CE7b8d01108a1a00A0ab4d36f39caFdE89e0Eb7#code
* https://docs.alchemy.com/alchemy/tutorials/hello-world-smart-contract/part-4