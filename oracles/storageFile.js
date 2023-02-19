const { HttpJsonRpcConnector, LotusClient, LotusWalletProvider}  = require("filecoin.js");
const localNode = "http://127.0.0.1:1234/rpc/v0";
const adminAuthToken="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBbGxvdyI6WyJyZWFkIiwid3JpdGUiLCJzaWduIiwiYWRtaW4iXX0.YxnN7SDbYpUsRUcphkJ-3gBm-dnnVvp_MUMXaspAfAk"
const localConnector = new HttpJsonRpcConnector({ url: localNode, token: adminAuthToken });
const lotusClient = new LotusClient(localConnector);
const lotusWallet = new LotusWalletProvider(lotusClient);

async function storeFile(rootId, minerConfig){
  try {
    const importResult = {
      Root: {
        '/': rootId
      }
    }
    const queryOffer = await lotusClient.client.minerQueryOffer(minerConfig, importResult.Root);
    console.log(queryOffer);
    const isActive = importResult.Root["/"] === queryOffer.Root["/"];
    console.log("Provider is active: ", isActive);
    if(isActive){
        const dealCid = await lotusClient.client.startDeal({
          Data: {
            TransferType: 'graphsync',
            Root: importResult.Root,
          },
          Miner: minerConfig,
          Wallet: await lotusWallet.getDefaultAddress(),
          EpochPrice: "0",
          MinBlocksDuration: 518400,
        });
        console.log("dealCID is ", dealCid);
      }
  } catch (error) {
    console.log(error);
  }
}

module.exports = {storeFile}