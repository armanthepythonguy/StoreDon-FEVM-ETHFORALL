#Oracles

This folder contains important files for the oracle to work efficiently.

We have three files for reading smart contract events in this folder :-
1. AskEvent :- This file helps us to submit asks to the trading engine
2. BidEvent :- This file helps us to submit bids to the trading engine
3. OrderEvent :- This file helps us to transfer data from oracle's lite node to SP using graphsync

More three files are needed to interact with frontend and the lotus lite node:- 
1. index.js :- This file provides endpoints for the frontend to upload data and generates CID which is sent back to frontend.
2. getCid.js :- This file ineracts with the lotus litenode using filecoin.js api and generated data CID.
3. storageFile.js :- This file is called after an order is proved, in order to interact with the SP.

dealFilter.pl :- This file is used in the SP side to filter out the deals from the oracles as they are executed at zero cost and the money transfer happens through the smart contract.
