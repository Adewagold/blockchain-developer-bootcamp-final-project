// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "./Institution.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract InstitutionManager is Ownable{

    //Index to track the number of registered institution
    uint public institutionIndex = 0;
    
    //Mapping for institutionIndex and associated contract address
    mapping (uint=>address payable) public institutions;

    //Index of the number of remittance addresses created
    uint public remitanceAddressIndex;

    //Mapping to create and enable remittance addresses
    mapping (address=>bool) public remittanceAddresses;

    address[] public centralAccounts;

    uint public treasuryUserIndex;

    mapping (address=>mapping(uint=>bool)) public treasuryUsers;
    
    address public recordManager;

    uint public totalRevenue;

    //Events
    event InsitutionRecordCreated(address indexed createdBy, 
    address indexed institutionAddress, 
    string message);
    event WithdrawRequest(address sender, uint amount);

    event GetInstitution(string name, string contactAddress, string phone, string email, uint registrationNumber);

    //Set the default record manager for the institution factory
    //Only owner can update the record manager;
    function setInstitutionRecordManager(address _recordManager) public onlyOwner{
        recordManager = _recordManager;
    }

    //Modifier to check that record manager is set.
    modifier isRecordManagerSet(){
        require(recordManager!=address(0));
        _;
    }


    function createInstitution(string memory _name,
        string memory _contactAddress,
        string memory _additionalInformation,
        string memory _phone,
        string memory _email) public  onlyOwner returns(address){
            institutionIndex ++;
            //Create a new institutionContract;
            Institution institution = new Institution(_name, _contactAddress, _additionalInformation, _phone, _email, institutionIndex);
            institutions[institutionIndex] = payable(address(institution));
           
            emit InsitutionRecordCreated(msg.sender, address(institution),"Institution created successfully.");
            return address(institution);
        }
    
    
    function getInstitution(uint registrationNumber) public view returns (string memory,
            string memory,
            string memory,
            string memory,
            string memory,
            uint256){

        require(institutions[registrationNumber]!=address(0), "Institution does not exist.");
        
        Institution institution = Institution(institutions[registrationNumber]);
        
        (   string memory _name,
            string memory _contactAddress,
            string memory _additionalInformation,
            string memory _phone,
            string memory _email,
            uint256 _registrationNumber) = institution.getInstitutionDetails();
        return (_name, _contactAddress, _additionalInformation, _phone, _email, _registrationNumber);
    }

    function getInstitutionById(uint registrationNumber) public view returns(address){
        return institutions[registrationNumber];
    }
    

    //Remittance addresses
    function addRemittanceAddresses(address payable _remitanceAddress) public onlyOwner {
        require(!remittanceAddresses[_remitanceAddress], "Address already exist");
        remitanceAddressIndex++;
        centralAccounts.push(_remitanceAddress);
        remittanceAddresses[_remitanceAddress] = true;
    }

    //Disable Remittance addresses
    function disbaleRemittanceAddresses(address payable _remitanceAddress) public onlyOwner {
        require(remittanceAddresses[_remitanceAddress], "Remittance address does not exist");
        remittanceAddresses[_remitanceAddress] = !remittanceAddresses[_remitanceAddress];

    }

    //Can remit into destination addresses
    function addTreasuryUsers(uint _institutionId, address _treasurerAddress) public onlyOwner {
        require(institutions[_institutionId]!=address(0), "Institution address not found!");
        treasuryUserIndex++;
        treasuryUsers[_treasurerAddress][_institutionId] = true;
        
        address institutionAddress = institutions[_institutionId];
        (bool success, ) = institutionAddress.call(abi.encodeWithSignature("addOwners(address)", _treasurerAddress));
        if(!success){
            treasuryUserIndex--;
        }
    }

    /**
    This method is for disabling a treasury user from remitting funds
    @param _institutionId institution id associated with the user
     */
    function disableTreasuryUsers(uint _institutionId, address _treasurerAddress) public onlyOwner{
        require(institutions[_institutionId]!=address(0), "Institution address not found!");
        require(treasuryUsers[_treasurerAddress][_institutionId], "Treasury user does not exist");
        treasuryUsers[_treasurerAddress][_institutionId] = !treasuryUsers[_treasurerAddress][_institutionId];
    }

    /**
    This method allows funds to be withdrawn from an institution account 
    @param _institutionId institution id to debit amount from
    @param amount amount to be debited
    @param remittanceAddress remittance address
     */
    function remitFunds(uint _institutionId, uint amount, address remittanceAddress) public returns(bool) {
        
        //Confirm address
        require(remittanceAddresses[remittanceAddress], "Remittance address not known!");
        // Confirm treasury user
        require(treasuryUsers[msg.sender][_institutionId], "Treasury user does not exist");
        address institutionAddress = institutions[_institutionId];

        require(institutions[_institutionId]!=address(0), "Institution does not exist");
        
        //Initiate request
        Institution institution = Institution(payable(institutionAddress));
        // bool success = institution.withdraw(amount, remittanceAddress, msg.sender);
        bool success = institution.withdraw(amount, remittanceAddress);
        // (bool success, ) = institutionAddress.call(abi.encodeWithSignature("withdraw(uint, address)", amount, remittanceAddress));
        if(success){
            totalRevenue= totalRevenue + amount;
            emit WithdrawRequest(msg.sender, amount);
        }
        return success;

    }

   function deposit() external payable{}
    receive() external payable{}

    /**
    @param amount The amount to be disbursed to a destination account
    @param destinationAccount The beneficiary of the funds;
     */
    function disburse(uint amount, address destinationAccount) public onlyOwner{
        require(totalRevenue>= amount, "Insufficient funds.");
        totalRevenue-=amount;
        (bool success, ) = payable(destinationAccount).call{value:amount}("");
        require(success, "Withdrawal failed");
    }
}