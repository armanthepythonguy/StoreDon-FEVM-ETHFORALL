const Web3 = require("web3");
const axios = require("axios")
async function getEvents(){
    const web3 = new Web3("wss://wss.hyperspace.node.glif.io/apigw/lotus/rpc/v1")
    var options = {
        address: "0xF3081c324E15Bc109D302f4D2A29533131160DAa", 
        topics:[
            '0x993273aba8f3ffa2f322e415e681892c5b94cdf8567fcf1f0ebe13dc28fa655a'
        ]
    }
    var subscription = web3.eth.subscribe('logs', options, async function(error, result){
        if (!error) console.log('got result');
            else console.log(error);
        }).on("data", async (events) => {
            var newBid = (await web3.eth.abi.decodeLog([
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
                    "name": "bidAmount",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "bidSize",
                    "type": "uint256"
                }
            ],
            events.data,
            events.topics));

            axios.post("http://localhost:8000/addbid", {
                "id": Number(newBid.bidId),
                "bidder": newBid.bidder,
                "amount":Number(newBid.bidAmount),
                "size":Number(newBid.bidSize)
            })
            
        })
}

getEvents()