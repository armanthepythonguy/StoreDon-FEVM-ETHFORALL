// ** React Imports
import * as React from 'react'
import { useState, Fragment } from 'react'

// ** Next Imports
import Link from 'next/link'

// ** MUI Components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import Input, { Paper, TableBody, TableCell, TableContainer, TableHead } from '@mui/material'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import { styled, useTheme } from '@mui/material/styles'
import MuiCard from '@mui/material/Card'
import InputAdornment from '@mui/material/InputAdornment'
import MuiFormControlLabel from '@mui/material/FormControlLabel'
import axios from 'axios'
import Web3 from 'web3'
import buyerAbi from '../../views/abi/buyer.json'
import Grid from '@mui/material/Grid'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'
import MessageSnackbar from '../../views/snackbar'

// ** Demo Imports
import FooterIllustrationsV1 from 'src/views/pages/auth/FooterIllustration'
import { Table, TableRow } from 'mdi-material-ui'
import OrderTable from './orderTable'
import BidTable from './bidTable'

// ** Styled Components
const Card = styled(MuiCard)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '28rem' }
}))

const LinkStyled = styled('a')(({ theme }) => ({
  fontSize: '0.875rem',
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

// const MessageSnackbar = dynamic(
//   () => import('../../views/snackbar'),
//   { ssr: false }
// );

const FormControlLabel = styled(MuiFormControlLabel)(({ theme }) => ({
  marginTop: theme.spacing(1.5),
  marginBottom: theme.spacing(4),
  '& .MuiFormControlLabel-label': {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary
  }
}))

const BuyerFormPage = () => {
  // ** States
  const [values, setValues] = useState(0)
  const [budgetErr, setBudgetErr] = useState(false)
  const [imageErr, setImageErr] = useState(false)
  const [cid, setCid] = useState('')
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [typeSuccess, setTypeSuccess] = useState('')

  const theme = useTheme()
  axios.defaults.headers.post['Content-Type'] = 'multipart/form-data'

  const web3 = new Web3(Web3.givenProvider || 'https://api.hyperspace.node.glif.io/rpc/v1')
  const nftaddress = '0xF3081c324E15Bc109D302f4D2A29533131160DAa'

  const handleImageFormateToBase64 = async event => {
    setImageErr(false)
    let imageFile = event.target.files
    const formData = new FormData()
    formData.append('file', imageFile[0])

    const response = await axios.post(`http://localhost:3500/upload`, { file: formData }, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }).catch(() => {
      setOpen(true);
      setMessage('CID not created. Please try again');
      setTypeSuccess('error')
    });

    if (response && response.data) {
      setCid(response.data)
      setOpen(true)
      setMessage('CID created succesfully. Please add budget to buy')
      setTypeSuccess('success')
    } else {
      setOpen(true)
      setMessage('CID not created. Please try again')
      setTypeSuccess('error')
    }
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleOnChange = (event, type) => {
    let updatedFields = {}
    if (event.target.value !== '') {
      setBudgetErr(false)
    }
    updatedFields.budget = event.target.value

    setValues(updatedFields.budget)
  }

  const addData = async () => {
    console.log(values, cid, 'sssssss')
    if (values === 0) {
      setBudgetErr(true)
    }
    if (cid === '') {
      setImageErr(true)
    } else {
      setBudgetErr(false)
      const accounts = await web3.eth.getAccounts()
      const nftcontract = await new web3.eth.Contract(buyerAbi, nftaddress);
      await web3.eth.sendTransaction({
        from: accounts[0],
        to: nftaddress,
        data: nftcontract.methods.addBid('0xbA46496e7E5A61a7A9DF5e54Ea330aD20C006d00', Number(values), 12, cid).encodeABI(),
        value: web3.utils.toWei(values, 'gwei'),
      })
        .then(function (receipt) {
          setCid(response.data)
          setOpen(true)
          setMessage('Bought succesfully')
          setTypeSuccess('success')
        })
        .catch(error => {
          console.log('error')
          setImageErr(true)
          setOpen(true)
          setMessage('Transaction failed. Please try again')
          setTypeSuccess('error')
        })
    }
  }

  return (
    <>
      <Grid container spacing={4} padding={2}>
        <Grid item xs={12} md={6}>
          <Box>
            <Card
              sx={{
                zIndex: 1,
                height: '90vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                maxWidth: '100%'
              }}
            >
              <CardContent sx={{ padding: theme => `${theme.spacing(12, 9, 7)} !important` }}>
                <Box sx={{ mb: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg
                    width={35}
                    height={29}
                    version='1.1'
                    viewBox='0 0 30 23'
                    xmlns='http://www.w3.org/2000/svg'
                    xmlnsXlink='http://www.w3.org/1999/xlink'
                  >
                    <g stroke='none' strokeWidth='1' fill='none' fillRule='evenodd'>
                      <g id='Artboard' transform='translate(-95.000000, -51.000000)'>
                        <g id='logo' transform='translate(95.000000, 50.000000)'>
                          <path
                            id='Combined-Shape'
                            fill={theme.palette.primary.main}
                            d='M30,21.3918362 C30,21.7535219 29.9019196,22.1084381 29.7162004,22.4188007 C29.1490236,23.366632 27.9208668,23.6752135 26.9730355,23.1080366 L26.9730355,23.1080366 L23.714971,21.1584295 C23.1114106,20.7972624 22.7419355,20.1455972 22.7419355,19.4422291 L22.7419355,19.4422291 L22.741,12.7425689 L15,17.1774194 L7.258,12.7425689 L7.25806452,19.4422291 C7.25806452,20.1455972 6.88858935,20.7972624 6.28502902,21.1584295 L3.0269645,23.1080366 C2.07913318,23.6752135 0.850976404,23.366632 0.283799571,22.4188007 C0.0980803893,22.1084381 2.0190442e-15,21.7535219 0,21.3918362 L0,3.58469444 L0.00548573643,3.43543209 L0.00548573643,3.43543209 L0,3.5715689 C3.0881846e-16,2.4669994 0.8954305,1.5715689 2,1.5715689 C2.36889529,1.5715689 2.73060353,1.67359571 3.04512412,1.86636639 L15,9.19354839 L26.9548759,1.86636639 C27.2693965,1.67359571 27.6311047,1.5715689 28,1.5715689 C29.1045695,1.5715689 30,2.4669994 30,3.5715689 L30,3.5715689 Z'
                          />
                          <polygon
                            id='Rectangle'
                            opacity='0.077704'
                            fill={theme.palette.common.black}
                            points='0 8.58870968 7.25806452 12.7505183 7.25806452 16.8305646'
                          />
                          <polygon
                            id='Rectangle'
                            opacity='0.077704'
                            fill={theme.palette.common.black}
                            points='0 8.58870968 7.25806452 12.6445567 7.25806452 15.1370162'
                          />
                          <polygon
                            id='Rectangle'
                            opacity='0.077704'
                            fill={theme.palette.common.black}
                            points='22.7419355 8.58870968 30 12.7417372 30 16.9537453'
                            transform='translate(26.370968, 12.771227) scale(-1, 1) translate(-26.370968, -12.771227) '
                          />
                          <polygon
                            id='Rectangle'
                            opacity='0.077704'
                            fill={theme.palette.common.black}
                            points='22.7419355 8.58870968 30 12.6409734 30 15.2601969'
                            transform='translate(26.370968, 11.924453) scale(-1, 1) translate(-26.370968, -11.924453) '
                          />
                          <path
                            id='Rectangle'
                            fillOpacity='0.15'
                            fill={theme.palette.common.white}
                            d='M3.04512412,1.86636639 L15,9.19354839 L15,9.19354839 L15,17.1774194 L0,8.58649679 L0,3.5715689 C3.0881846e-16,2.4669994 0.8954305,1.5715689 2,1.5715689 C2.36889529,1.5715689 2.73060353,1.67359571 3.04512412,1.86636639 Z'
                          />
                          <path
                            id='Rectangle'
                            fillOpacity='0.35'
                            fill={theme.palette.common.white}
                            transform='translate(22.500000, 8.588710) scale(-1, 1) translate(-22.500000, -8.588710) '
                            d='M18.0451241,1.86636639 L30,9.19354839 L30,9.19354839 L30,17.1774194 L15,8.58649679 L15,3.5715689 C15,2.4669994 15.8954305,1.5715689 17,1.5715689 C17.3688953,1.5715689 17.7306035,1.67359571 18.0451241,1.86636639 Z'
                          />
                        </g>
                      </g>
                    </g>
                  </svg>
                  <Typography
                    variant='h6'
                    sx={{
                      ml: 3,
                      lineHeight: 1,
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      fontSize: '1.5rem !important'
                    }}
                  >
                    {themeConfig.templateName}
                  </Typography>
                </Box>
                <Box sx={{ mb: 6 }}>
                  <Typography variant='h5' sx={{ fontWeight: 600, marginBottom: 1.5 }}>
                    Buy here 🚀
                  </Typography>
                  {/* <Typography variant='body2'>Make your app management easy and fun!</Typography> */}
                </Box>
                <form noValidate autoComplete='off' encType='multipart/form-data'>
                  <TextField
                    name='upload-file'
                    type='file'
                    sx={{ marginBottom: 4 }}
                    onChange={e => handleImageFormateToBase64(e)}
                  />
                  {imageErr ? <span className='text-red'>Please upload file</span> : ''}
                  <TextField
                    fullWidth
                    type='budget'
                    label='Budget'
                    sx={{ marginBottom: 4 }}
                    onChange={e => handleOnChange(e)}
                  />
                  {budgetErr ? <span className='text-red'>Please add budget</span> : ''}
                  <Button
                    fullWidth
                    size='large'
                    type='button'
                    variant='contained'
                    sx={{ marginBottom: 7 }}
                    onClick={addData}
                  >
                    BUY
                  </Button>
                </form>
              </CardContent>
            </Card>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box>
            <Card
              sx={{
                zIndex: 1,
                height: '90vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                maxWidth: '100%'
              }}
            >
              <div>
                <Card
                  sx={{
                    zIndex: 1,
                    height: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Box>
                    <CardContent
                      sx={{
                        m: 8,
                        padding: theme => `${theme.spacing(12, 9, 7)} !important`
                      }}
                    >
                      <Box
                        sx={{
                          mb: 8,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Typography
                          variant='h6'
                          sx={{
                            ml: 3,
                            lineHeight: 1,
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            fontSize: '1.5rem !important'
                          }}
                        >
                          Completed Orders
                        </Typography>
                      </Box>
                      <OrderTable />
                      {/* <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }}>
                        <Box sx={{ mb: 6 }}>
                          {/* <Typography variant='h5' sx={{ fontWeight: 600, marginBottom: 1.5 }}>
                            Order ID
                          </Typography> */}
                      {/* <Typography variant='body2'>Make your app management easy and fun!</Typography> */}
                      {/* </Box> */}
                      {/* <Box sx={{ mb: 6 }}> */}
                      {/* <Typography variant='h5' sx={{ fontWeight: 600, marginBottom: 1.5 }}>
                            Data CID
                          </Typography> */}
                      {/* <Typography variant='body2'>Make your app management easy and fun!</Typography> */}
                      {/* </Box> */}
                      {/* </Box> */}
                    </CardContent>
                    <CardContent
                      sx={{
                        m: 8,
                        padding: theme => `${theme.spacing(12, 9, 7)} !important`
                      }}
                    >
                      <Box
                        sx={{
                          mb: 8,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Typography
                          variant='h6'
                          sx={{
                            ml: 3,
                            lineHeight: 1,
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            fontSize: '1.5rem !important'
                          }}
                        >
                          Recently Added Bid
                        </Typography>
                      </Box>
                      <BidTable />
                      {/* <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }}>
                        <Box sx={{ mb: 6 }}>
                          <Typography variant='h5' sx={{ fontWeight: 600, marginBottom: 1.5 }}>
                            Bid ID
                          </Typography>
                          {/* <Typography variant='body2'>Make your app management easy and fun!</Typography> */}
                      {/* </Box> */}
                      {/* <Box sx={{ mb: 6 }}>
                          <Typography variant='h5' sx={{ fontWeight: 600, marginBottom: 1.5 }}>
                            Data CID
                          </Typography> */}
                      {/* <Typography variant='body2'>Make your app management easy and fun!</Typography> */}
                      {/* </Box>  */}
                      {/* </Box> */}
                    </CardContent>
                  </Box>
                </Card>
              </div>
            </Card>
          </Box>
        </Grid>
      </Grid>
      <MessageSnackbar
        open={open}
        autoHideDuration={5000}
        onClose={handleClose}
        message={message}
        severity={typeSuccess}
      />
    </>
  )
}
BuyerFormPage.getLayout = page => <BlankLayout>{page}</BlankLayout>

export default BuyerFormPage
