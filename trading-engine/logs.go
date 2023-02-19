package main

import (
    "context"
    "fmt"
    "log"
    "math/big"
	"net/http"
	"bytes"
    "strings"
	"time"
	"github.com/joho/godotenv"
	"os"
	"os/exec"
	"crypto/ecdsa" 
    "github.com/ethereum/go-ethereum"
    "github.com/ethereum/go-ethereum/accounts/abi"
    "github.com/ethereum/go-ethereum/common"
    "github.com/ethereum/go-ethereum/crypto"
    "github.com/ethereum/go-ethereum/ethclient"
    OrderBook "OrderBook"
)

type NewAskEventStruct struct{
	AskID *big.Int
	Asker common.Address
	AskAmount *big.Int
	AskSize *big.Int
}

type NewBidEventStruct struct{
	BidID *big.Int
	Bidder common.Address
	BidAmount *big.Int
	BidSize *big.Int
}

type NewOrderEventStruct struct{
	OrderId string
	BidId *big.Int
	Bidder common.Address
	AskId *big.Int
	Asker common.Address
	OracleAddress common.Address
	DataCID string
}

var asks = []common.Address{}
var bids = []common.Address{} 
var lastBlock uint64 = 0 

func queryContract(client *ethclient.Client, contractAddress common.Address){
	latestBlock, err := client.BlockNumber(context.Background())
	if err != nil {
        log.Fatal(err)
    }
	if lastBlock == 0{
		lastBlock = latestBlock - 200
	}
	fmt.Println("Starting block :- ", lastBlock)
	fmt.Println("Ending Block :- ", latestBlock)
    query := ethereum.FilterQuery{
        FromBlock: big.NewInt(int64(lastBlock)),
        ToBlock:   big.NewInt(int64(latestBlock)),
        Addresses: []common.Address{
            contractAddress,
        },
    }
    logs, err := client.FilterLogs(context.Background(), query)
    if err != nil {
        log.Fatal(err)
    }
    contractAbi, err := abi.JSON(strings.NewReader(string(OrderBook.OrderbookABI)))
    if err != nil {
        log.Fatal(err)
    }
	logNewAskSig := []byte("NewAskEvent(uint256,address,uint256,uint256)")
	logNewBidSig := []byte("NewBidEvent(uint256,address,uint256,uint256)")
	logNewOrderSig := []byte("orderCreatedEvent(bytes,uint256,address,uint256,address,address,string)")
	logNewAskSigHash := crypto.Keccak256Hash(logNewAskSig)
	logNewBidSigHash := crypto.Keccak256Hash(logNewBidSig)
	logNewOrderSigHash := crypto.Keccak256Hash(logNewOrderSig)
    for _, vLog := range logs {
		fmt.Printf("Log Block Number: %d\n", vLog.BlockNumber)
		switch vLog.Topics[0].Hex(){

		case logNewAskSigHash.Hex():
			var AskEventVar NewAskEventStruct 
			err := contractAbi.UnpackIntoInterface(&AskEventVar, "NewAskEvent", vLog.Data)
			if err != nil {
				log.Fatal(err)
			}
			check := false
			for i:=0; i<len(asks); i++{
				if asks[i] == AskEventVar.Asker{
					check = true
				}
			}
			if !check{
				asks = append(asks, AskEventVar.Asker)
				fmt.Println("ASK EVENT :----------")
				fmt.Println(AskEventVar.Asker)
				fmt.Println(AskEventVar.AskAmount)
				fmt.Println(AskEventVar.AskSize) 
				posturl := "http://localhost:8000/addask"
				body := []byte(`{
					"id": `+AskEventVar.AskID.String()+`,
					"asker": "`+ AskEventVar.Asker.Hex() +`",
					"amount":`+AskEventVar.AskAmount.String()+`,
					"size":`+AskEventVar.AskSize.String()+
				`}`)
				r, err := http.NewRequest("POST", posturl, bytes.NewBuffer(body))
				if err != nil {
					log.Fatal(err)
				}
				httpclient := &http.Client{}
				res, err := httpclient.Do(r)
				if err != nil {
					panic(err)
				}
				fmt.Println(res)
			}

		
		case logNewBidSigHash.Hex():
			fmt.Println("New Bid Found !!!!")
			fmt.Println(vLog.Data)
			var BidEventVar NewBidEventStruct
			err := contractAbi.UnpackIntoInterface(&BidEventVar, "NewBidEvent", vLog.Data)
			if err != nil {
				log.Fatal(err)
			}
			check := false
			for i:=0; i<len(bids); i++{
				if bids[i] == BidEventVar.Bidder{
					check = true
				}
			}
			if !check{
				bids = append(bids, BidEventVar.Bidder)
				fmt.Println("BID EVENT :----------")
				fmt.Println(BidEventVar.Bidder)
				fmt.Println(BidEventVar.BidAmount)
				fmt.Println(BidEventVar.BidSize)
				posturl := "http://localhost:8000/addbid"
				body := []byte(`{
					"id": `+BidEventVar.BidID.String()+`,
					"bidder": "`+BidEventVar.Bidder.Hex()+`",
					"amount":`+BidEventVar.BidAmount.String()+`,
					"size":`+BidEventVar.BidSize.String()+
				`}`)
				fmt.Println(bytes.NewBuffer(body))
				r, err := http.NewRequest("POST", posturl, bytes.NewBuffer(body))
				if err != nil {
					log.Fatal(err)
				}
				r.Header.Add("Content-Type", "application/json")
				httpclient := &http.Client{}
				res, err := httpclient.Do(r)
				if err != nil {
					panic(err)
				}
				fmt.Println(res)
			}
		
		case logNewOrderSigHash.Hex():
			var OrderEventVar NewOrderEventStruct
			err := contractAbi.UnpackIntoInterface(&OrderEventVar, "orderCreatedEvent", vLog.Data)
			if err != nil {
				log.Fatal(err)
			}
			privateVal := os.Getenv("PRIVATE_KEY")
			privateKey, err := crypto.HexToECDSA(privateVal)
			if err != nil {
				log.Fatal(err)
			}
			publicKey := privateKey.Public()
			publicKeyECDSA, ok := publicKey.(*ecdsa.PublicKey)
			if !ok {
				log.Fatal("Cannot assert type: publicKey is not of type *ecdsa.PublicKey")
			}
			fromAddress := crypto.PubkeyToAddress(*publicKeyECDSA)
			if fromAddress == OrderEventVar.Asker{
				cmd := exec.Command("node", "../storage-providers/storageFile.js", OrderEventVar.DataCID)
				fmt.Println(cmd)
			}
		}

    }
	lastBlock = latestBlock+1
}

func main() {

	err := godotenv.Load(".env")
    if err != nil {
        log.Fatal("Error loading .env file")
    }
	
    client, err := ethclient.Dial("https://api.hyperspace.node.glif.io/rpc/v1")
    if err != nil {
        log.Fatal(err)
    }

	address := os.Getenv("CONTRACT_ADDRESS")
	contractAddress := common.HexToAddress(address)

	for{
		queryContract(client, contractAddress)
		time.Sleep(90*time.Second)
	}
	
}