// SPDX-License-Identifier: MIT
pragma solidity ^0.4.17;

contract CampaignFactory {
    address[] public deployedCampaigns;
// calls the Campaign contract that deploys it to the blockchain, it returns the address of the new deployed Campaign, we need to pass in the msg.sender as an argument otherwise the Campaign contract will get the addres of our factoryCampaign.
    function createCampaign(uint minimum)public{
     address newCampaign = new Campaign(minimum,msg.sender);
     deployedCampaigns.push(newCampaign);
    }
    function getDeployedCampaigns() public view returns(address[]){
        return deployedCampaigns;
    }
}
contract Campaign {
    /*
    description - Describes why the request is being created
    value - amount of money that the manager wants to send to the vendor
    recipient - address tat the money will be sent to
    complete - true if the request has already been processed (money sent)*/
    struct Request { // Doesnt create an instance, its a definition (its a new type)
        string description;
        uint value;
        address recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }

    Request[] public requests;
    address public manager;
    uint public minimumContribution;
    mapping(address=>bool) public approvers; // keys dont actualy exist
    uint public approversCount;

    modifier restricted(){
        require(msg.sender == manager, '');
    _;
    }

    constructor(uint minimum,address creator) public {  // Allowing the contract creator to define the minimum contribution
        manager = creator;
        minimumContribution = minimum;
    }

    function contribute() public payable {
        require(msg.value > minimumContribution,'Minimum contribution requirement is not fullfilled'); // if false - it will exit the function

        approvers[msg.sender] = true; // adds a new key to msg.sender adres to the mapping, the key doesnt exist
        approversCount ++;
    }
    function createRequest (string description, uint value, address recipient)
        public restricted
    {
        // if we use storage keyword - newRequest becomes a pointer to the request
        // if we use memory keyword - newRequest is a new variable in temp memory - doesnt poit to the request
       //  require(approvers[msg.sender],'Not contirbuted'); // existance check - checking if has contributed, much better then two for loops

        Request memory newRequest = Request({
            description: description,
            value: value,
            recipient: recipient,
            complete: false,
            approvalCount: 0
            // we do not need to initialize reference types (approvals) - mappings
        });
        requests.push(newRequest);

    // Alternative definition of newRequest -it assumes that you will set them in the right order
    // Request(description,value,recipient,false,0);
    }

    function approveRequest(uint index) public {
        Request storage request = requests[index]; // Using storage - manipulating the copy of the struct that exists in storage

        require(approvers[msg.sender],'Sender is not an approver');
        // checkif the address of this sender has been added to the mapping, if the user has voted on the contract we want to kick the user out.
        require(!request.approvals[msg.sender],'Sendaer has already approved');
        request.approvals[msg.sender] = true; //marking the address as VOTED - So he cant vote again
        request.approvalCount++;
    }

    function finalizeRequest(uint index) public restricted {
        Request storage request = requests[index];
        require(request.approvalCount > (approversCount/2),'You need the approval of at least 50%'); // more then 50% must approve
        require(!request.complete,'Request has already been completed'); // check that the request is not completed

        request.recipient.transfer(request.value); // recipient is address type so it has transfer method.
        request.complete = true;
    }

    function getAllContractInfromation() public view returns (
        uint,uint,uint,uint,address
    ){
        return (
            minimumContribution,
            address(this).balance,
            requests.length,
            approversCount,
            manager
        );
    }
    function getRequestsCount() public view returns (uint) {
        return requests.length;
    }

}