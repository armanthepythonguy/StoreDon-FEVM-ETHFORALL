const Web3 = require("web3");
const axios = require("axios")
async function getEvents(){
    const web3 = new Web3("wss://wss.hyperspace.node.glif.io/apigw/lotus/rpc/v1")
    var options = {
        address: "0xF3081c324E15Bc109D302f4D2A29533131160DAa",
        topics:[
            '0x97cc68268dcbbd8d53f0ef5540d61904086eb90a195b0ae7605e7440c4c30008'
        ]
    }
    var subscription = web3.eth.subscribe('logs', options, async function(error, result){
        if (!error) console.log('got result');
            else console.log(error);
        }).on("data", async (events) => {
            var newAsk = (await web3.eth.abi.decodeLog([
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
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "askAmount",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "askSize",
                    "type": "uint256"
                }
            ],
            events.data,
            events.topics));
            
            axios.post("http://localhost:8000/addask", {
                "id": Number(newAsk.askId),
                "asker": newAsk.asker,
                "amount":Number(newAsk.askAmount),
                "size":Number(newAsk.askSize)
            })

        })
}

getEvents()