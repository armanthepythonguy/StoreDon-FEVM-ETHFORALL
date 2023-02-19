package main

import(
	"github.com/gin-gonic/gin"
	"github.com/gin-contrib/cors"
	"net/http"
	"sort"
	"fmt"
	"context"
	"crypto/ecdsa"
	"github.com/joho/godotenv"
	"os"
	"github.com/ethereum/go-ethereum/crypto"
	"log"
	"math/big"
	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"
	OrderBook "OrderBook"
)

type Bid struct{
	ID int `json:"id"`
	Bidder string `json:"bidder"`
	Amount int `json:"amount"`
	Size int `json:"size"`
}

type Ask struct{
	ID int `json:"id"`
	Asker string `json:"asker"`
	Amount int `json:"amount"`
	Size int `json:"size"`
}

type ByAmountBid []Bid
type ByAmountAsk []Ask

func (a ByAmountBid) Len() int{ return len(a) }
func (a ByAmountBid) Swap(i, j int)      { a[i], a[j] = a[j], a[i] }
func (a ByAmountBid) Less(i, j int) bool { return a[i].Amount < a[j].Amount }
func (a ByAmountAsk) Len() int{ return len(a) }
func (a ByAmountAsk) Swap(i, j int)      { a[i], a[j] = a[j], a[i] }
func (a ByAmountAsk) Less(i, j int) bool { return a[i].Amount < a[j].Amount }

var bids = []Bid{}
var asks = []Ask{}

func orderBids(b Bid){
	bids = append(bids, b)
	sort.Slice(bids, func(i, j int) bool{
		return bids[i].Amount > bids[j].Amount
	})
}

func orderAsks(a Ask){
	asks = append(asks, a)
	sort.Sort(ByAmountAsk(asks))
}

func matchBidOrder(){
	bidLength := len(bids)
	for i:=0; i<bidLength; i++{
		b := bids[i]
		askLength := len(asks)
		for j:=0; j<askLength; j++{
			a := asks[j]
			if b.Amount >= a.Amount{
				if b.Size == a.Size{
					fmt.Println("Order created 00x")
					sendOrder(b.ID, b.Bidder, a.ID, a.Asker, a.Amount, b.Size)
					asks = append(asks[:j], asks[j+1:]...)
					askLength--
					bids = append(bids[:i], bids[i+1:]...)
					bidLength--
					break
				}else if a.Size > b.Size{
					fmt.Println("Order created with greater ask size")
					sendOrder(b.ID, b.Bidder, a.ID, a.Asker, a.Amount, b.Size)
					asks[j].Size = (a.Size - b.Size)
					bids = append(bids[:i], bids[i+1:]...)
					bidLength--
					break
				}
			}else{
				break
			}
			
		}
	}
}

func matchAskOrder(){
	askLength := len(asks)
	for i:=0;i<askLength;i++{
		bidLength := len(bids)
		a:=asks[i]
		for j:=0; j<bidLength; j++{
			b:=bids[j]
			if a.Amount <= b.Amount{
				if b.Size == a.Size{
					fmt.Println("Order created 00x")
					sendOrder(b.ID, b.Bidder, a.ID, a.Asker, a.Amount, b.Size)
					asks = append(asks[:i], asks[i+1:]...)
					askLength--
					bids = append(bids[:j], bids[j+1:]...)
					bidLength--
					break
				}else if a.Size > b.Size{
					fmt.Println("Order created with greater ask size")
					sendOrder(b.ID, b.Bidder, a.ID, a.Asker, a.Amount, b.Size)
					asks[i].Size = (a.Size - b.Size)
					bids = append(bids[:j], bids[j+1:]...)
					j--
					bidLength--
				}
			}else{
				break
			}
		}
	}
}

func getBids(context *gin.Context){
	context.IndentedJSON(http.StatusOK, bids)
}

func getAsks(context *gin.Context){
	context.IndentedJSON(http.StatusOK, asks)
}

func addBid(context *gin.Context){
	var newBid Bid
	if err:= context.BindJSON(&newBid); err!=nil{
		return
	}

	orderBids(newBid)
	matchBidOrder()
	context.IndentedJSON(http.StatusCreated, newBid)
}

func addAsk(context *gin.Context){
	var newAsk Ask
	if err:= context.BindJSON(&newAsk); err!=nil{
		return
	}

	orderAsks(newAsk)
	matchAskOrder()
	context.IndentedJSON(http.StatusCreated, newAsk)
}

func sendOrder(askID int, asker string, bidID int, bidder string, amount int, size int){
	client, err := ethclient.Dial("https://api.hyperspace.node.glif.io/rpc/v1") 
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
	nonce, err := client.PendingNonceAt(context.Background(), fromAddress)
	if err != nil {
		log.Fatal(err)
	}

	gasPrice, err := client.SuggestGasPrice(context.Background())
	if err != nil {
		log.Fatal(err)
	}

	chainId, err := client.ChainID(context.Background())
	if err != nil {
		log.Fatal(err)
	}

	auth, err := bind.NewKeyedTransactorWithChainID(privateKey, chainId)
	auth.Nonce = big.NewInt(int64(nonce))
	auth.Value = big.NewInt(0)
    auth.GasLimit = uint64(50086904)
	auth.GasFeeCap = gasPrice
	auth.GasTipCap = gasPrice

	contractAddress := os.Getenv("CONTRACT_ADDRESS")
	address := common.HexToAddress(contractAddress)
	instance, err := OrderBook.NewOrderbook(address, client)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println(bidID, askID, amount, size)
	orderID := fmt.Sprint(bidder, bidID, asker, askID)
	tx, err := instance.ProveOrder(auth, orderID, big.NewInt(int64(bidID)), big.NewInt(int64(askID)), big.NewInt(int64(amount)), big.NewInt(int64(size)))
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("tx sent: %s", tx.Hash().Hex())
}

func main(){
	err := godotenv.Load(".env")
    if err != nil {
        log.Fatal("Error loading .env file")
    }
	router:=gin.Default()
	router.Use(cors.New(cors.Config{
        AllowOrigins: []string{"*"},
    }))
	router.GET("/bids", getBids)
	router.GET("/asks", getAsks)
	router.POST("/addbid", addBid)
	router.POST("/addask", addAsk)
	router.Run("localhost:8000")
}