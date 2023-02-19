// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Icons Imports
import Poll from 'mdi-material-ui/Poll'
import CurrencyUsd from 'mdi-material-ui/CurrencyUsd'
import HelpCircleOutline from 'mdi-material-ui/HelpCircleOutline'
import BriefcaseVariantOutline from 'mdi-material-ui/BriefcaseVariantOutline'

// ** Custom Components Imports
import CardStatisticsVerticalComponent from 'src/@core/components/card-statistics/card-stats-vertical'

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { styled, useTheme } from '@mui/material/styles'
import Web3 from 'web3'
import buyerAbi from '../../src/views/abi/buyer.json'
import MessageSnackbar from '../../src/views/snackbar'
// Styled component for the triangle shaped background image
const TriangleImg = styled('img')({
  right: 0,
  bottom: 0,
  height: 170,
  position: 'absolute'
})

// Styled component for the trophy image
const TrophyImg = styled('img')({
  right: 36,
  bottom: 20,
  height: 98,
  position: 'absolute'
})

import { useEffect, useState } from 'react'

const Dashboard = () => {
  //to store data
  const [data, setData] = useState([])
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [typeSuccess, setTypeSuccess] = useState('')
  const theme = useTheme()
  const imageSrc = theme.palette.mode === 'light' ? 'triangle-light.png' : 'triangle-dark.png'

  const web3 = new Web3(
    Web3.givenProvider ||
    'https://api.hyperspace.node.glif.io/rpc/v1'
  )
  const nftaddress = '0x30ede7289d52412c22b78741e78BB153A4EF6b07'

  const handleClose = () => {
    setOpen(false);
  }

  const addBudget = async () => {
    //to Buy


    // const accounts = await web3.eth.getAccounts()
    //   const nftcontract = await new web3.eth.Contract(buyerAbi, nftaddress);
    //   await web3.eth.sendTransaction({
    //     from: accounts[0],
    //     to: nftaddress,
    //     data: nftcontract.methods.addBid('0xbA46496e7E5A61a7A9DF5e54Ea330aD20C006d00', Number(values), 12, cid).encodeABI(),
    //     gasPrice: 50000000000,
    //     value: Number(values),
    //   })
    //     .then(function (receipt) {
    //       setOpen(true);
    //       setMessage('Bought succesfully');
    //       setTypeSuccess('success')
    //     })
    //     .catch((error) => {
    //       console.log("error")
    //       setOpen(true);
    //       setMessage('Transaction failed. Please try again');
    //       setTypeSuccess('error')
    //     });

  }

  const getData = () => {
    //get marketplace NFT data
    //   const accounts = await web3.eth.getAccounts()
    //   const nftcontract = await new web3.eth.Contract(buyerAbi, nftaddress);
    //   await web3.eth.sendTransaction({
    //     from: accounts[0],
    //     to: nftaddress,
    //     data: nftcontract.methods.addBid('0xbA46496e7E5A61a7A9DF5e54Ea330aD20C006d00', Number(values), 12, cid).encodeABI(),
    //     gasPrice: 50000000000,
    //     value: Number(values),
    //   })
    //     .then(function (receipt) {
    //add data from web3 o display in nft
    //       setData()
    //     })
    //     .catch((error) => {
    //       console.log("error")
    //     });
    // }
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <ApexChartWrapper>
      <Grid container spacing={6}>
        {data && data?.length ? (
          <div>
            {data?.map((menu, index) => (
              <Grid key={index} item xs={12} md={4}>
                <Card sx={{ position: 'relative' }}>
                  <CardContent>
                    <Typography variant='h6'>menu.name 🥳</Typography>
                    <Typography variant='body2' sx={{ letterSpacing: '0.25px' }}>
                      Best seller of the month
                    </Typography>
                    <Typography variant='h5' sx={{ my: 4, color: 'primary.main' }}>
                      $42.8k
                    </Typography>
                    <Button size='small' variant='contained' onClick={e => addBudget(e)}>
                      Buy
                    </Button>
                    <TriangleImg alt='triangle background' src={`/images/misc/${imageSrc}`} />
                    <TrophyImg alt='trophy' src='/images/misc/trophy.png' />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </div>
        ) : null}
      </Grid>
      <MessageSnackbar open={open} autoHideDuration={5000} onClose={handleClose} message={message} severity={typeSuccess} />
    </ApexChartWrapper>
  )
}

export default Dashboard
