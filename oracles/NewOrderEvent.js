const Web3 = require("web3");
const storageFile = require("./storageFile")
async function getEvents(){
    const web3 = new Web3("wss://wss.hyperspace.node.glif.io/apigw/lotus/rpc/v1")
    var options = { 
        address: "0xF3081c324E15Bc109D302f4D2A29533131160DAa",
        topics:[
            '0x31d17827d0e36382ddda6fc1c43a33c730a5da990f3a4d80a058df75cbcb068a'
        ]
    }
    var subscription = web3.eth.subscribe('logs', options, async function(error, result){
        if (!error) console.log('got result');
            else console.log(error);
        }).on("data", async (events) => {
            var newOrder = (await web3.eth.abi.decodeLog([
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "orderId",
                    "type": "string"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "bidId",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "bidder",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "askId",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "asker",
                    "type": "address"
                },{
                    "indexed": false,
                    "internalType": "address",
                    "name": "oracleAddress",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "dataCID",
                    "type": "string"
                }
            ],    
            events.data,
            events.topics));
            
            if(newOrder.oracleAddress == "0xbA46496e7E5A61a7A9DF5e54Ea330aD20C006d00"){
                storageFile.storeFile(newOrder.dataCID, "t01129")
            }

        })
}

getEvents()