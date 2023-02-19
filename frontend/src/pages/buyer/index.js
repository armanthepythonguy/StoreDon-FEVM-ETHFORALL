// ** React Imports
import { useState, Fragment } from 'react'
import Grid from '@mui/material/Grid'
import BuyerForm from 'src/pages/buyerForm'
import TableCustomized from 'src/views/tables/TableCustomized'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import { styled, useTheme } from '@mui/material/styles'
import MuiCard from '@mui/material/Card'
import MuiFormControlLabel from '@mui/material/FormControlLabel'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'
import TableCustomizedSales from 'src/views/tables/TablesCustomizedSales'
import { useEffect } from 'react'
import axios from 'axios'

// ** Styled Components
const Card = styled(MuiCard)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '28rem' }
}))

const LinkStyled = styled('a')(({ theme }) => ({
  fontSize: '0.875rem',
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

const FormControlLabel = styled(MuiFormControlLabel)(({ theme }) => ({
  marginTop: theme.spacing(1.5),
  marginBottom: theme.spacing(4),
  '& .MuiFormControlLabel-label': {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary
  }
}))

const BuyerPage = () => {
  // ** States
  const [orderData, setOrderData] = useState()
  const [orderDataSales, setOrderDataSales] = useState()

  // ** Hook
  const theme = useTheme()

  const getData = async () => {
    const response = await axios.get(`http://localhost:8000/asks`)
    setOrderData(response.data)
    console.log(response.data)
  }

  const getDataSales = async () => {
    const response = await axios.get(`http://localhost:8000/bids`)
    setOrderDataSales(response.data)
  }

  useEffect(() => {
    getData()
    getDataSales()
  }, [])

  return (
    <div>
      <Grid container spacing={4} padding={6}>
        <Grid item xs={12} md={7}>
          <BuyerForm />
        </Grid>
        <Grid item xs={12} md={5}>
          <TableCustomized orderData={orderData} />
          <TableCustomizedSales orderDataSales={orderDataSales} />
        </Grid>
      </Grid>
    </div>
  )
}
BuyerPage.getLayout = page => <BlankLayout>{page}</BlankLayout>

export default BuyerPage
