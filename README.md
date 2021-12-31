# Address to send NFT certificate 0x19698497422ab2A3AaB139FDEFB76bAfa650CcA5
# blockchain-developer-bootcamp-final-project
Blockchain Developer Bootcamp Final Project

## Internal Revenue Management Decentralized Application.
This projects basically allows a central financial body to accept fund remittances into a list of accounts provided by the institution. The scope is currently limited such that, only the owner can create a new institution from the contract. Each institution has a new contract address generated upon the successful creation and is stored in the `institutionManager` contract storage.

Here's some user stories
- As a user, I want to be able to deploy an institutionManager contract, so that it can manage new institution balance and hold remittances.
- As a user(owner), I want to be able to create a new institution
- As a user(owner), I want to be able to add a treasury user associated to an institution, so that such user can authorise/remit funds to any of the central accounts
- As a user(treasurer), I want to be able to remit funds to a given central account
- As a user(owner), I want to be able to view the create institution, add central account, and treasury forms

## Demo Accounts Used
Owner account: 0x
Owner private key: 

Treasurer account: 0x, 

### Running the application
1. Clone the github repository
2. Go into the directory via terminal using cd `final-project` 
3. run `npm install` command
4. start the frontend with `npm start` and access the frontend on `http:localhost:3000`

The `client` directory contains the frontend part of the project and the deployed contract address is stored in the `config.js` file.
If you run a new deployment of the contract, you should update the config.js file with the appropriate contract address in order for the contract instantiation to work.

### Deploying contract locally.
Ensure to modify the `truffle-config.js` to your local development network and run `truffle compile && truffle deploy` in the terminal

Once, the contract is deployed, update the `config.js` file with the contract address.

### Running unit tests
Run the command `truffle test` in the project directory to test the project.

### Screencast of the project
[Click to watch on Youtube](https://youtu.be/2_moEDs6vG0)