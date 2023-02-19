const { HttpJsonRpcConnector, LotusClient, LotusWalletProvider}  = require("filecoin.js");
const localNode = "http://127.0.0.1:1234/rpc/v0";
const adminAuthToken="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBbGxvdyI6WyJyZWFkIiwid3JpdGUiLCJzaWduIiwiYWRtaW4iXX0.YxnN7SDbYpUsRUcphkJ-3gBm-dnnVvp_MUMXaspAfAk"
const localConnector = new HttpJsonRpcConnector({ url: localNode, token: adminAuthToken });
const lotusClient = new LotusClient(localConnector);
const lotusWallet = new LotusWalletProvider(lotusClient);

async function getDataCID(filepath){
    try {
        const importResult = await lotusClient.client.import({
            Path: filepath,
            IsCAR: false,
        });
        return (importResult.Root['/']);
    }catch(error){
        console.log(error)
    }
}

module.exports  = {getDataCID}