// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Institution is Ownable {
    string name;
    string contactAddress;
    string additionalInformation;
    string phone;
    string email;
    uint256 registrationNumber;
    uint public availableBalance;

    mapping(address=>bool) public otherOwners;

    //Events
    event InstitutionCreated(address createdBy, bytes message);
    event WithdrawRequest(address sender, uint amount);

    constructor(
        string memory _name,
        string memory _contactAddress,
        string memory _additionalInformation,
        string memory _phone,
        string memory _email,
        uint256 _registrationNumber
    ) public {
        // create institution
        name = _name;
        contactAddress = _contactAddress;
        additionalInformation = _additionalInformation;
        phone = _phone;
        email = _email;
        registrationNumber = _registrationNumber;
        otherOwners[msg.sender]= true;
    }

    function getInstitutionDetails()
        public
        view
        returns (
            string memory,
            string memory,
            string memory,
            string memory,
            string memory,
            uint256
        )
    {
        return (
            name,
            contactAddress,
            additionalInformation,
            phone,
            email,
            registrationNumber
        );
    }

    //collect tax function
    // validate sender
    // validate user input
    // validate user balance
    // send call to withdraw funds
    receive() external payable{
      availableBalance +=msg.value;
    }

    modifier isOwner(){
        require(otherOwners[msg.sender], "Not permitted to proceed");
        _;
    }
    
    function addOwners(address owner) public onlyOwner{
        otherOwners[owner]= true;
    }

    //Method to handle withdrawals of fund to a central remittance account
    function withdraw(uint amount, address fakeAddress) public returns(bool){
        require(availableBalance>= amount, "Insufficient balance.");
        availableBalance-=amount;
        (bool success, ) = payable(fakeAddress).call{value:amount}("");
        require(success, "Withdrawal failed");
        return success;
    }

    
    function deposit() external payable{availableBalance +=msg.value;}
}
