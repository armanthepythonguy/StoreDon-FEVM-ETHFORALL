// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import { MinerAPI } from "@zondax/filecoin-solidity/contracts/v0.8/MinerAPI.sol";
import { MinerTypes } from "@zondax/filecoin-solidity/contracts/v0.8/types/MinerTypes.sol";
import { Actor, HyperActor } from "@zondax/filecoin-solidity/contracts/v0.8/utils/Actor.sol";
import { Misc } from "@zondax/filecoin-solidity/contracts/v0.8/utils/Misc.sol";


contract OrderBook{

    uint64 constant DEFAULT_FLAG = 0x00000000;
    uint64 constant METHOD_SEND = 0;

    struct Order {
        string orderId;
        string dataCID;
        address bidder;
        address asker;
        uint256 amountFixed;
        uint256 sizeFixed;
        address oracleAddress;
        uint256 confirmations;
        bool confirmed;
        bool bountyClaimed;
    }

    struct Bid{
        uint256 bidId;
        address bidder;
        uint256 bidAmount;
        uint256 bidSize;
        address oracleAddress;
        string dataCID;
    }

    struct Ask{
        uint256 askId;
        address asker;
        uint256 askAmount;
        uint256 askSize;
    }

    
    mapping (uint256 => Bid) bids;
    mapping (uint256 => Ask) asks;
    mapping (string => Order) orders;
    address owner;
    address[] oracles;
    string[] oraclesIP;
    uint256 bidId = 0;
    uint256 askId = 0;

    modifier onlyOwner(){
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier onlyOracle(){
        uint256 count = 0;
        for(uint256 i=0; i<oracles.length; i++){
            if(msg.sender == oracles[i]){
                count++;
                break;
            }
        }
        require(count==1, "Oracles can only call this function");
        _;
    }

    event NewBidEvent(uint256 bidId, address bidder, uint256 bidAmount, uint256 bidSize);
    event NewAskEvent(uint256 askId, address asker, uint256 askAmount, uint256 askSize);
    event orderCreatedEvent(string orderId, uint256 bidId, address bidder, uint256 askId, address asker, address oracleAddress, string dataCID);

    constructor(address[] memory _oracles, string [] memory _oraclesIP){
        owner = msg.sender;
        oracles = _oracles;
        oraclesIP = _oraclesIP;
    }

    function registerOracle(address _oracle, string memory _oracleIP) external onlyOwner{
        oracles.push(_oracle);
        oraclesIP.push(_oracleIP);
    }

    function addDemoAsks(address _SPAddress, uint _askAmount, uint256 _askSize) external onlyOwner{
        asks[askId] = Ask(askId, _SPAddress, _askAmount, _askSize);
        askId++;
        emit NewAskEvent(askId-1, _SPAddress, _askAmount, _askSize);
    }

    function addBid(address _oracleAddress, uint256 _bidAmount, uint256 _bidSize, string memory _dataCID) external payable{
        require(msg.value >= _bidAmount, "Need more funds");
        bids[bidId] = Bid(bidId, msg.sender, _bidAmount, _bidSize, _oracleAddress, _dataCID);
        bidId++;
        emit NewBidEvent(bidId-1, msg.sender, _bidAmount, _bidSize);
    }

    function addAsk(bytes memory _target, uint256 _askAmount, uint256 _askSize) external{
        require(keccak256(MinerAPI.getOwner(_target).owner) == keccak256(abi.encodePacked(msg.sender)));
        asks[askId] = Ask(askId, msg.sender, _askAmount, _askSize);
        askId++;
        emit NewAskEvent(askId-1, msg.sender, _askAmount, _askSize);
    }

    function proveOrder(string memory _orderId, uint256 _bidId, uint256 _askId, uint256 _amountFixed, uint256 _sizeFixed) external onlyOracle{
        if(orders[_orderId].amountFixed != 0){
            orders[_orderId].confirmations++;
            if(orders[_orderId].confirmations > oracles.length/2 && orders[_orderId].confirmed==false){
                orders[_orderId].confirmed = true;
                emit orderCreatedEvent(_orderId, _bidId, bids[_bidId].bidder, askId, asks[_askId].asker, bids[_bidId].oracleAddress, bids[_bidId].dataCID);
            }
        }else{
            orders[_orderId] = Order(_orderId, bids[_bidId].dataCID, bids[_bidId].bidder, asks[_askId].asker, _amountFixed, _sizeFixed, bids[_bidId].oracleAddress, 1, false, false);
            orders[_orderId].confirmations++;
            if(orders[_orderId].confirmations > oracles.length/2 && orders[_orderId].confirmed==false){
                orders[_orderId].confirmed = true;
                emit orderCreatedEvent(_orderId, _bidId, bids[_bidId].bidder, askId, asks[_askId].asker, bids[_bidId].oracleAddress, bids[_bidId].dataCID);
            }
        }
    }

    function askBounty(string memory _orderId, uint64 _actorId) external{
        require(orders[_orderId].confirmed == true);
        require(orders[_orderId].bountyClaimed == false);
        require(orders[_orderId].asker == msg.sender);
        orders[_orderId].bountyClaimed = true;
        send(_actorId, orders[_orderId].amountFixed);
    }

    function send(uint64 actorID, uint amount) internal {
        bytes memory emptyParams = "";
        delete emptyParams;
        HyperActor.call_actor_id(METHOD_SEND, amount, DEFAULT_FLAG, Misc.NONE_CODEC, emptyParams, actorID);
    }

    function getOracles() external view returns(address[] memory, string[] memory){
        return(oracles, oraclesIP);
    }

}
