package main

import (
	"context"
	"crypto/ecdsa"
	"fmt"
	"github.com/ethereum/go-ethereum/crypto"
	"log"
	"math/big"
	"github.com/joho/godotenv"
	"os"
	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"
	store "MarketPlace"
)

func main(){
	err := godotenv.Load(".env")
    if err != nil {
        log.Fatal("Error loading .env file")
    }
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
    auth.GasLimit = uint64(4086904)
	auth.GasFeeCap = gasPrice
	auth.GasTipCap = gasPrice

	contractAddress := os.Getenv("CONTRACT_ADDRESS")
	address := common.HexToAddress(contractAddress)
	instance, err := store.NewApi(address, client)
	if err != nil {
		log.Fatal(err)
	}

	tx, err := instance.AddBid(auth, )
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("tx sent: %s", tx.Hash().Hex())
}