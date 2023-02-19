// ** MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { styled, useTheme } from '@mui/material/styles'
import Web3 from 'web3'

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

const Trophy = () => {
  // ** Hook
  const theme = useTheme()
  const imageSrc = theme.palette.mode === 'light' ? 'triangle-light.png' : 'triangle-dark.png'

  const web3 = new Web3(
    Web3.givenProvider ||
      'https://cool-tiniest-gadget.ethereum-goerli.discover.quiknode.pro/246364df7cda3039117bdc419267d7a7f37110f4/'
  )
  const nftaddress = '0x30ede7289d52412c22b78741e78BB153A4EF6b07'

  const addBudget = async () => {
    const accounts = await web3.eth.getAccounts()

    // const nftcontract = await new web3.eth.Contract(clientABI, nftaddress);
    // await web3.eth
    // .sendTransaction({
    //   from: accounts[0],
    //   to: nftaddress,
    //   data: tx.data,
    //   gasPrice: 50000000000,
    // })
    // .then(function (receipt) {
    //   setapprovEn(true);
    //   router.push("/client/dashboard");
    // })
    // .catch((error) => {
    //  console.log("error")
    // });

    // const response = await axios.post(`${NEXT_PUBLIC_BASE_URL}api/v1/collection/${id}`,)
  }

  return (
    <Card sx={{ position: 'relative' }}>
      <CardContent>
        <Typography variant='h6'>Congratulations John! 🥳</Typography>
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
  )
}

export default Trophy
