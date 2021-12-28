import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import InstitutionManager from "./contracts/InstitutionManager.json";
import {INSTITUTION_CONTRACT} from "./config.js"
import getWeb3 from "./getWeb3";
import  Web3 from 'web3';

import "./App.css";
import "./bootstrap.css";

class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null, institutionFactory:null };



  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      console.log(accounts);
      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address,
      );


      //Get Institution Factory contract
      const institutionFactoryInstance = new web3.eth.Contract(InstitutionManager.abi, INSTITUTION_CONTRACT);
      this.setState({institutionFactoryInstance});

      //Get owner
      const owner = await institutionFactoryInstance.methods.owner().call();
      console.log(accounts.includes(owner));
      this.setState({isOwner:accounts.includes(owner)});

      //Total Revenues Generated
      const balance = await web3.eth.getBalance(institutionFactoryInstance._address);
      this.setState({totalRevenuGenerated:balance})

      //Central Revenue account
      const centralAccountsCount = await institutionFactoryInstance.methods.remitanceAddressIndex().call();
      this.setState({centralAccountsCount});
      console.log(centralAccountsCount);
      this.setState({centralAccounts:[]});
      let currentBalance = 0;
      this.setState({totalRevenuGenerated:0});
      for(let i = 0; i<centralAccountsCount;i++){
        const centralAccount = await institutionFactoryInstance.methods.centralAccounts(i).call();
        const centralAccountBalance = await web3.eth.getBalance(centralAccount) ;
        currentBalance = parseFloat(currentBalance) + parseFloat(centralAccountBalance) / 1000000000000000000;
        this.setState({totalRevenuGenerated:currentBalance});
        // Remittance account status
        const remittanceAddressesStatus = await institutionFactoryInstance.methods.remittanceAddresses(centralAccount).call();
        console.log("Remittance status: ",remittanceAddressesStatus);
        const centralRevenueDetails = {centralAccount, centralAccountBalance, remittanceAddressesStatus};
        console.log(centralRevenueDetails);
        this.setState({
       
          centralAccounts:[...this.state.centralAccounts,centralRevenueDetails]
        });
        console.log("Institution",centralAccount);
      }



      //Total number of created institution
      //institutionIndex
      const institutionIndex = await institutionFactoryInstance.methods.institutionIndex().call();
      this.setState({institutionIndex});
      console.log(institutionIndex);
      this.setState({institutions:[]});
      for(let i = 1; i<=institutionIndex;i++){
        const institution = await institutionFactoryInstance.methods.institutions(i).call();
        const institutionBalance = await web3.eth.getBalance(institution);
        //Institution Contract Details
        const institutionInfo = await institutionFactoryInstance.methods.getInstitution(i).call();
        console.log(institutionInfo);
        const institutionDetails = {institution, institutionBalance, institutionInfo};
        console.log(institutionDetails);
        
        this.setState({
       
          institutions:[...this.state.institutions,institutionDetails]
        });
        console.log("Institutions ",institution);
      }


      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      
      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    // await contract.methods.set(10).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.get().call();
    this.setState({institutionFactory: INSTITUTION_CONTRACT});
    // Update state with the result.
    this.setState({ storageValue: response });
  };


updateRevenueAccount(revenueAccount) {
    this.setState({ loading: true })
    this.state.institutionFactoryInstance.methods.addRemittanceAddresses(revenueAccount).send({ from: this.state.accounts[0]})
    .once('receipt', (receipt) => {
      window.location.reload(false);
      this.setState({ loading: false })
 })}

 updateInstitutionFactoryContract(institutionFactoryContract) {
   try{  this.setState({ loading: true })
   this.state.recordManagerInstance.methods.addInstitutionFactory(institutionFactoryContract).send({ from: this.state.accounts[0]})
   .once('receipt', (receipt) => {
     window.location.reload(false);
     this.setState({institutionFactoryContract});
     this.setState({ loading: false });
 })}
 catch(error){

 }
}

 createNewInstitution(institutionName,contactAddress, additionalInformation, phone, email) { 
    try{
      console.log(institutionName,contactAddress, additionalInformation, phone, email);
      this.state.institutionFactoryInstance
      .methods
      .createInstitution(institutionName, contactAddress, additionalInformation, phone, email).send({ from: this.state.accounts[0]})
      .once('receipt', (receipt) => {
        window.location.reload(false);
      });
    }catch(error){
      console.log(error);
    }
}

handleAccountChange(event) {
  this.setState({selectedAccount: event.target.value});
}

handleInstitutionChange(event) {
  this.setState({selectedInstitution: event.target.value});
}

handleTreasurySelection(event){
  this.setState({selectedTreasurerAccount: event.target.value});
}

remitFunds(amount, remittanceAccount, institution){
  let amountInGWEI = amount * 1000000000000000000;
  let institutionId = this.state.selectedInstitution;
  institutionId++;
  console.log(amount, this.state.selectedAccount, institutionId);
  try{
    this.state.institutionFactoryInstance
    .methods
    .remitFunds(institutionId, amountInGWEI.toString(), remittanceAccount).send({ from: this.state.accounts[0]})
    .once('receipt', (receipt) => {
      window.location.reload(false);
    });
  }catch(error){
    console.log(error);
  }
}

addTreasuryUser(treasuryAccount){
  let institutionId = this.state.selectedTreasurerAccount;
  institutionId++;
  console.log(treasuryAccount, institutionId);
  try{
    this.state.institutionFactoryInstance
    .methods
    .addTreasuryUsers(institutionId, treasuryAccount).send({ from: this.state.accounts[0]})
    .once('receipt', (receipt) => {
      window.location.reload(false);
    });
  }catch(error){
    console.log(error);
  }
}

 constructor(props) {
  super(props);
  
  this.updateRevenueAccount = this.updateRevenueAccount.bind(this);
  this.createNewInstitution = this.createNewInstitution.bind(this);
  this.handleAccountChange = this.handleAccountChange.bind(this);
  this.handleInstitutionChange = this.handleInstitutionChange.bind(this);
  this.remitFunds = this.remitFunds.bind(this);
  this.handleTreasurySelection = this.handleTreasurySelection.bind(this);
  this.addTreasuryUser = this.addTreasuryUser.bind(this);
}

  render() {

    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>IRM Dapp</h1>
        <p>A decentralized Institution Revenue management application.</p>
        <h3>Central Accounts: {this.state.centralAccountsCount}</h3>
        <table className="table table-hover">
        <thead>
          <tr>
            <th scope="col">Account</th>
            <th scope="col">Balance (ETH)</th>
            <th scope="col">Active</th>
          </tr>
        </thead>
        <tbody>
          { this.state.centralAccounts.map((accontDetails, key) => {
                return(
                  
                    <tr className="table-dark" key={key}>
                      <td>{accontDetails.centralAccount}</td>
                      <td>{accontDetails.centralAccountBalance/1000000000000000000}</td>
                      <td><input type="checkbox" 
                      name={accontDetails.centralAccount} 
                      defaultChecked = {accontDetails.remittanceAddressesStatus}
                      /></td>
                    </tr>

                )
              })}
              <tr className="table-light">
                      <th>Total Generated Revenue </th>
                      <th>{this.state.totalRevenuGenerated}</th>
                      <td></td>
                    </tr>
          </tbody>
        </table>
        <br/>
        
        
        {this.state.isOwner ? 
          <div className="container row">
          <div className="col-md-6 col-xl-6 col-sm-12 ">
              <p>Add Central Revenue Address</p>

                <form onSubmit={
                    (event) => {event.preventDefault() //prevent from changing the form 
                        this.updateRevenueAccount(this.revenueAccount.value)
                        }
                    }>
                  <input id="newTask" ref={(input) => this.revenueAccount = input} type="text" className="form-control" placeholder="Enter revenue central contract address..." required />
                  <input type="submit" hidden={true} />
                </form>
          </div>
          <div className="col-md-6 col-xl-6 col-sm-12 ">
          <h3>Add a new Institution</h3>
          <form onSubmit={
                  (event) => {event.preventDefault() //prevent from changing the form 
                      this.createNewInstitution(this.institutionName.value, this.contactAddress.value,
                        this.additionalInformation.value,
                        this.phone.value,
                        this.email.value)
                      }
                  }>
                
               <div className="form-group"> 
               <label className="form-label mt-4"> Name</label>
               <input id="newInstitutionName" ref={(input) => this.institutionName = input} type="text" className="form-control" placeholder="Institution Name..." required />
               </div>
               <div className="form-group"> <label className="form-label mt-4"> Address</label> 
               <input id="newInstitutionAddress" ref={(input) => this.contactAddress = input} type="text" className="form-control" placeholder="Institution Address..." required /></div>
               <div className="form-group"> <label  className="form-label mt-4">Additional information</label>
               <input id="newInstitutionAdditionalInfo" ref={(input) => this.additionalInformation = input} type="text" className="form-control" placeholder="Additional Information..." required /></div>
               <div className="form-group"> <label className="form-label mt-4">Phone</label>
               <input id="newInstitutionPhone" ref={(input) => this.phone = input} type="text" className="form-control" placeholder="Phone..." required /></div>
                <div className="form-group"><label className="form-label mt-4">Email</label>
                <input id="newInstitutionEmail" ref={(input) => this.email = input} type="text" className="form-control" placeholder="Email..." required /></div>
                <br />
                <input type="submit" value="Add Institution" className="btn btn-primary"/>
              </form>
          </div>
        </div>
          :
          <p></p>
        }

        
        <br />


              
        

        {/* <h2>Institution Factory </h2>
        <p>Only owner should be able to see this part</p>
        <h4>Factory address: {this.state.institutionFactory}</h4>
        
        <p>Current Revenue Manager: {this.state.recordManager}</p>
          <div className="col-md-4 container-fluid">
              <form onSubmit={
                  (event) => {event.preventDefault() //prevent from changing the form 
                      this.updateRecordManager(this.recordManager.value)
                      }
                  }>
                <input id="newTask" ref={(input) => this.recordManager = input} type="text" className="form-control" placeholder="Update record manager address..." required />
                <input type="submit" hidden={true} />
              </form>
        </div> */}
        
        <hr />
        <h2>Institutions ({this.state.institutionIndex})</h2>
        <table className="table table-hover">
        <thead>
          <tr>
            <th scope="col">Account</th>
            <th scope="col">Name</th>
            <th scope="col">Address</th>
            <th scope="col">Phone</th>
            <th scope="col">Email</th>
            <th scope="col">Balance</th>
          </tr>
        </thead>
          <tbody>
              { this.state.institutions.map((institutionDetails, key) => {
                return(
                  
                    <tr className="table-dark" key={key}>
                      <td>{institutionDetails.institution}</td>
                      <td>{institutionDetails.institutionInfo[0]}</td>
                      <td>{institutionDetails.institutionInfo[1]}</td>
                      <td>{institutionDetails.institutionInfo[3]}</td>
                      <td>{institutionDetails.institutionInfo[4]}</td>
                      <td>{institutionDetails.institutionBalance}</td>
                    </tr>
                )
              })}
          </tbody>
        </table>
        <div className="container row">
          {this.state.isOwner ?
          <div className="col-md-6 col-xl-6 col-sm-12">
          <hr/>
          <legend>Add Treasury Account</legend>
          <form onSubmit={
                    (event) => {event.preventDefault() //prevent from changing the form 
                        this.addTreasuryUser(this.treasuryAccount.value)
                        }
                    }>

            <div className="form-group">
            <label htmlFor="exampleInputPassword1" className="form-label mt-4">Enter treasury account</label>
              <input id="treasuryAccount" ref={(input) => this.treasuryAccount = input} type="text" className="form-control" placeholder="Treasury account starting with 0x..." required />
            </div>
            <div className="form-group">
              <label className="form-label mt-4">
              Select Institution
              </label>
              <select className="form-select" 
              value={this.state.selectedTreasurerAccount} 
              onChange={this.handleTreasurySelection} ref={(input) => this.institutionAccount = input}
              >
                <option value="default">--- Select Institution to debit---</option>
              
                { this.state.institutions.map((institutionDetails, key) => {
                  return(
                    <option value={key} key={key}>{institutionDetails.institutionInfo[0]}</option>
                  )
                })}
                </select>
            
            </div>
            <br />
            <input type="submit" value="Add Treasury User" className="btn btn-primary"/>
          </form>
          </div>
          :
          <p></p>
          }
          
          <div className="col-md-1 col-xl-1 col-sm-1"></div>
          <div className="col-md-5 col-xl-5 col-sm-12">
          <hr />
          <legend>Remittance</legend>
          <form onSubmit={
                    (event) => {event.preventDefault() //prevent from changing the form 
                        this.remitFunds(this.remittanceAmount.value, this.remittanceAccount.value,
                          this.institutionAccount.value)
                        }
                    }>
            <div className="form-group">
            <label htmlFor="exampleInputPassword1" className="form-label mt-4">
              Select Central Account
              </label>
            
              <select className="form-select"
              value={this.state.selectedAccount} 
              onChange={this.handleAccountChange} 
              ref={(input) => this.remittanceAccount = input}
              >
                <option value="default">--- Select Remittance Account ---</option>
              { this.state.centralAccounts.map((accontDetails, key) => {
                  return(
                    <option value={accontDetails.centralAccount} key={key}>{accontDetails.centralAccount}</option>
                  )
                })}
                </select>
            </div>
            <div className="form-group">
            <label htmlFor="exampleInputPassword1" className="form-label mt-4">Enter remittance account</label>
            <input id="remittanceAmount" ref={(input) => this.remittanceAmount = input} type="number" className="form-control" placeholder="Enter amount in ETH" required />
            </div>
            <div className="form-group">
            <label className="form-label mt-4">
              Select Institution
              </label>
              <select className="form-select" 
              value={this.state.selectedInstitution} 
              onChange={this.handleInstitutionChange} ref={(input) => this.institutionAccount = input}
              >
                <option value="default">--- Select Institution to debit---</option>
              
                { this.state.institutions.map((institutionDetails, key) => {
                  return(
                    <option value={key} key={key}>{institutionDetails.institutionInfo[0]}</option>
                  )
                })}
                </select>
            
            </div>
            <div className="form-group">
              <br/>
            <input type="submit" value="Remit to selected account" className="btn btn-primary" />
            </div>
          </form>
          </div>
          
        </div>

      </div>
    );
  }
}

export default App;
