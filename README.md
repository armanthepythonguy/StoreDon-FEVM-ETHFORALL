# StoreDon-FEVM-ETHFORALL

<img width="887" alt="Screenshot 2023-02-19 at 11 23 26 PM" src="https://user-images.githubusercontent.com/66505181/219967509-1ee0ceb1-4e4c-4710-9910-a2fd70108586.png">


Using our product you can store large files in Filecoin in a very decentralized and simple manner. Currently, you can either use products like web3. storage, NFT.storage, LightHouse, or store directly using Lotus. The applications mentioned earlier are not useful when it comes to commercial storage of data although the process is very easy. Using Lotus is not that simple as you need to manually install a Lite node, find miners and interact with them to fix a rate and store data. Now, coming to our application, you can use it for all your storage needs, and it's very easy to use. We are using an Orderbook based mechanism where clients and SPs can fill up their bids and asks. Our order matching engine will generate orders in a decentralized manner using FEVM to verify the orders. Once the orders are verified, oracles will act as lotus lite nodes and send the data to the particular SP to store. The SP can later come to the smart contract and collect the submitted bounty by the client. As implementing Orderbook in solidity is not efficient, we are using oracles to match the orders. Once the orders are matched, the oracles submit it to the FEVM smart contract and if we have more than 51% vote for a particular order from all the oracles, the oracle will pass on the data to the SP, who will create a deal.

Smart Contract Address :- 0xF3081c324E15Bc109D302f4D2A29533131160DAa


There are multiple parts of the project :- 


## Parts of the project

#### smart-contract folder

This particular folder contains the hardhat toolkit using which we developed smart contract

#### trading-engine folder

In this folder, we have the trading engine(order matching) implemenation in Golang along with the other important parts of the project.

#### oracles folder

This folder contains all the lotus related files needed for creating a lite node or a miner in Hyperspace testnet.

#### frontend folder

This folder contains frontend part of the project implemented in NextJS.


You can check the youtube demonstration to know more :- https://youtu.be/Sag1wFHP4wU
