// ** MUI Imports
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import { styled } from '@mui/material/styles'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    color: 'red'

    // backgroundColor: theme.palette.common.black
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    color: "red"
  }
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover
  },

  // hide last border
  '&:last-of-type td, &:last-of-type th': {
    border: 0
  },

}))

const createData = (name, calories, fat, carbs, protein) => {
  return { name, calories, fat, carbs, protein }
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9)
]

const TableCustomized = ({ orderData }) => {
  return (
    <>
      {orderData && orderData?.length !== 0 ? (
        <TableContainer component={Paper} sx={{ maxWidth: 600 }}>
          <Table sx={{ maxWidth: 600, color: 'red' }} aria-label='customized table'>
            <TableHead>
              <TableRow align='center'>
                Asks
              </TableRow>
              <TableRow>
                <StyledTableCell>Price</StyledTableCell>
                <StyledTableCell align='right'>Size</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orderData.map(row => (
                <StyledTableRow key={row?.amount}>
                  <StyledTableCell component='th' scope='row'>
                    {row?.amount}
                  </StyledTableCell>
                  <StyledTableCell align='right'>{row?.size}</StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        ''
      )}
    </>
  )
}

export default TableCustomized
